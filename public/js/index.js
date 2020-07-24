
import axios from 'axios';




const deleteData = async (id) => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `<%= port %>/api/v1/reviews/${id}`,
    });
    
      showAlert('success', 'Delete JE uspio');
  
  } catch (error) {
    showAlert('error', 'Update nije uspio');
    console.log(error);
  }
};

module.exports = deleteData