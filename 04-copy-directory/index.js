const fs = require('fs').promises;
const path = require('path');

const currentDirPath = path.join(__dirname, 'files');
const newDirPath = path.join(__dirname, 'files-copy');

async function syncDirectories() {
  try {
    await fs.mkdir(newDirPath, { recursive: true });

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
