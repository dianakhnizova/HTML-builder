const fs = require('fs');
const readLine = require('readline');

const stdIn = readLine.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const filePath = './02-write-file/newFile.txt';
const newFile = fs.createWriteStream(filePath, {
  flags: 'a',
});

console.log('\nHello! Enter text to write to file:\n');
console.log('Enter "exit" for exit\n');
console.log('To interrupt, press "Ctrl + c"\n');

stdIn.on('line', (input) => {
  if (input === 'exit') {
    console.log('\nIt was completed! Goodbye!');
    stdIn.close();
    process.exit(1);
  }
  newFile.write(input + '\n', (err) => {
    if (err) {
      console.error('\nError writing to file:', err);
      stdIn.close();
      process.exit(1);
    }
    console.log('\nThe text is written to the file!\nKeep typing...');
  });
});

process.on('SIGINT', () => {
  process.stdout.write('\nIt was completed! Goodbye!');
  stdIn.close();
  process.exit();
});
