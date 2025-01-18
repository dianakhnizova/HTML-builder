const fs = require('fs');
const path = require('path');

const pathFile = path.join(__dirname, 'text.txt');

const myReadText = fs.createReadStream(pathFile, 'utf-8');

myReadText.on('data', (chunk) => {
  console.log('New data received:\n' + chunk);
});

myReadText.on('error', (err) => {
  console.error('Error reading the file:\n', err);
});
myReadText.on('end', () => {
  console.log('File has been completely read.');
});
