const fs = require('fs');

const dir = './needPostImg/'
const fileList = fs.readdirSync(dir);
fileList.forEach(fileName => {
  fs.unlinkSync(dir+fileName);
})