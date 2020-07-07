const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add a course title']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  weeks: {
    type: String,
    required: [true, 'Please add number of weeks']
  },
  tuition: {
    type: Number,
    required: [true, 'Please add a tuition cost']
  },
  minimumSkill: {
    type: String,
    required: [true, 'Please add a minimum skill'],
    enum: ['beginner', 'intermediate', 'advanced']
  },
  scholarshipAvailable: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
  ,
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bootcamp',
    required: true
  }
  ,
  pokus: {
    type: mongoose.Schema.ObjectId,
    ref: 'Review',
    required: false
  }
  // ,
  // user: {
  //   type: mongoose.Schema.ObjectId,
  //   ref: 'User',
  //   required: true
  // }
});

// Static method to get avg of course tuitions
CourseSchema.statics.getAverageCost = async function(bootcampId) {
  console.log('Calculating average cost'.blue);
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId }
    },
    {
      $group: {
        _id: '$bootcamp',
        averageCost: { $avg: '$tuition' }
      }
    }
  ]);

  console.log('obj',obj);
  
  try {
    // odlazi u model Bootcamp
    console.log('hi'.red,this.model('Course'));
    let pokus = await this.model('Course').findById('5f043c249de8cf1dd43d6555')
    console.log('Pokus='.blue,pokus);
    
    await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
      averageCost: Math.ceil(obj[0].averageCost / 10) * 10
    });
  } catch (err) {
    console.error('nene'.red,err.red);
  }
};

// Call getAverageCost after save
CourseSchema.post('save', function() {
  console.log('MIDDlevare='.red,this.bootcamp);
  this.constructor.getAverageCost(this.bootcamp);
});

// Call getAverageCost before remove
CourseSchema.pre('remove', function() {
  this.constructor.getAverageCost(this.bootcamp);
});

module.exports = mongoose.model('Course', CourseSchema);
