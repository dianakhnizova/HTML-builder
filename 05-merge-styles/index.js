const fs = require('fs').promises;
const path = require('path');

const pathToStyle = path.join(__dirname, 'styles');
const pathToBundle = path.join(__dirname, 'project-dist', 'bundle.css');

async function newCss() {
  try {
    const files = await fs.readdir(pathToStyle);
    const styles = [];
    for (const file of files) {
      const filePath = path.join(pathToStyle, file);
      const extName = path.extname(file);

      if (extName === '.css') {
        const data = await fs.readFile(filePath, 'utf-8');
        styles.push(data);
      }
    }
    await fs.writeFile(pathToBundle, styles.join('\n'));
    console.log('Bundle.css was created successfully!');
  } catch (err) {
    console.error('Error creating bundle.css:', err);
  }
}
newCss();
