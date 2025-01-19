const fs = require('fs').promises;
const readLine = require('readline');

const stdIn = readLine.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const filePath = './02-write-file/newFile.txt';

console.log('\nHello! Enter text to write to file:\n');
console.log('Enter "exit" for exit\n');
console.log('To interrupt, press "Ctrl + c"\n');

async function writeToFile(text) {
  try {
    await fs.appendFile(filePath, text + '\n');
    console.log('\nThe text is written to the file!\nKeep typing...\n');
  } catch (err) {
    console.error('\nError writing to file:', err);
    stdIn.close();
    process.exit();
  }
}

stdIn.on('line', async (input) => {
  if (input === 'exit') {
    process.stdout.write('\nIt was completed! Goodbye!');
    stdIn.close();
    process.exit(1);
  }
  await writeToFile(input);
});

process.on('SIGINT', async () => {
  setImmediate(() => {
    stdIn.close();
    process.stdout.write('\nIt was completed! Goodbye!\n');
    process.exit();
  });
});
