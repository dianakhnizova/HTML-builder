const fs = require('fs').promises;
const { copyFile } = require('fs');
const path = require('path');

const currentDirPath = path.join(__dirname, 'files');
const newDirPath = path.join(__dirname, 'files-copy');

async function recursiveCopy(srcDir, destDir) {
  try {
    await fs.mkdir(destDir, { recursive: true });
    const files = await fs.readdir(srcDir, { withFileTypes: true });

    for (const file of files) {
      const currentPath = path.join(srcDir, file.name);
      const newPath = path.join(destDir, file.name);

      if (file.isDirectory()) {
        await recursiveCopy(currentPath, newPath);
      } else {
        await fs.copyFile(currentPath, newPath);
      }
    }
  } catch (err) {
    console.error('Error copying directory or file:', err);
  }
}

async function syncDirectories() {
  try {
    const sourceFiles = await fs.readdir(currentDirPath, {
      withFileTypes: true,
    });
    const targetFiles = await fs.readdir(newDirPath, { withFileTypes: true });
    for (const file of targetFiles) {
      const targetPath = path.join(newDirPath, file.name);
      const sourcePath = path.join(currentDirPath, file.name);

      const fileExistsInSource = sourceFiles.find(
        (sourceFile) => sourceFile.name === file.name,
      );

      if (!fileExistsInSource) {
        await fs.rm(targetPath, { recursive: true, force: true });
        console.log(`Deleted ${file.name} from files-copy`);
      }
    }
    for (const file of sourceFiles) {
      const sourcePath = path.join(currentDirPath, file.name);
      const targetPath = path.join(newDirPath, file.name);

      const fileExistsInTarget = targetFiles.find(
        (targetFile) => targetFile.name === file.name,
      );

      if (!fileExistsInTarget) {
        await fs.copyFile(sourcePath, targetPath);
        console.log(`Copied ${file.name} to files-copy`);
      } else {
        const sourceStat = await fs.stat(sourcePath);
        const targetStat = await fs.stat(targetPath);

        if (sourceStat.mtime > targetStat.mtime) {
          await fs.copyFile(sourcePath, targetPath);
          console.log(`Updated ${file.name} in files-copy`);
        }
      }
    }

    console.log('Synchronization completed.');
  } catch (err) {
    console.error('Error during synchronization:', err);
  }
}

syncDirectories();
