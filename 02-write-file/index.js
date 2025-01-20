const fs = require('fs');
const readLine = require('readline');

const filePath = './02-write-file/newFile.txt';
const newFile = fs.createWriteStream(filePath, {
  flags: 'a',
});

console.log('\nHello! Enter text to write to file:\n');
console.log('Enter "exit" for exit\n');
console.log('To interrupt, press "Ctrl + c"\n');

function message() {
  console.log('\nIt was completed! Goodbye!');
  newFile.end();
  process.exit();
}

process.stdin.on('data', (data) => {
  const input = data.toString().trim();
  if (input === 'exit') {
    message();
  } else {
    newFile.write(input + '\n', (err) => {
      if (err) {
        console.error('\nError writing to file:', err);
        stdIn.close();
        process.exit();
      }
      console.log('\nThe text is written to the file!\nKeep typing...\n');
    });
  }
});

process.on('SIGINT', () => {
  message();
});
