const fs = require('fs').promises;
const path = require('path');

const secretPath = path.join(__dirname, 'secret-folder');

async function readDir() {
  try {
    const files = await fs.readdir(secretPath, { withFileTypes: true });
    for (const file of files) {
      if (file.isFile()) {
        const filePath = path.join(secretPath, file.name);
        const stat = await fs.stat(filePath);
        const fileName = path.basename(file.name, path.extname(file.name));
        const fileExt = path.extname(file.name).slice(1);
        const fileSize = (stat.size / 1024).toFixed(3);

        console.log(`${fileName} - ${fileExt} - ${fileSize}kb`);
      }
    }
  } catch (err) {
    console.error('Error reading folders:', err);
  }
}

readDir();
