const fs = require('fs');

exports.ispisi = (text, status) => {
  fs.appendFileSync('message.txt', text + '\n');

  // console.log(typeof(status));
  
  if (status === 1) {
    console.log(text.underline.magenta);
  } else {
    console.log(text.underline.red);
  }
};
