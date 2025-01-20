const fs = require('fs');
const path = require('path');

(async () => {
  const projectDistDir = path.join(__dirname, 'project-dist');
  const templatePath = path.join(__dirname, 'template.html');
  const componentsDir = path.join(__dirname, 'components');
  const stylesDir = path.join(__dirname, 'styles');
  const assetsDir = path.join(__dirname, 'assets');

  await fs.promises.mkdir(projectDistDir, { recursive: true });

  let template = await fs.promises.readFile(templatePath, 'utf-8');
  const matches = template.match(/{{\w+}}/g) || [];
  for (const match of matches) {
    const componentName = match.slice(2, -2);
    const componentPath = path.join(componentsDir, `${componentName}.html`);

    try {
      const componentContent = await fs.promises.readFile(
        componentPath,
        'utf-8',
      );
      template = template.replace(match, componentContent);
    } catch (err) {
      console.error(`Could not find component: ${componentName}`);
    }
  }
  await fs.promises.writeFile(
    path.join(projectDistDir, 'index.html'),
    template,
  );

  const cssFiles = (await fs.promises.readdir(stylesDir)).filter((file) =>
    file.endsWith('.css'),
  );
  const stylesContent = await Promise.all(
    cssFiles.map((file) =>
      fs.promises.readFile(path.join(stylesDir, file), 'utf-8'),
    ),
  );
  await fs.promises.writeFile(
    path.join(projectDistDir, 'style.css'),
    stylesContent.join('\n'),
  );

  const copyAssets = async (src, dest) => {
    const items = await fs.promises.readdir(src, { withFileTypes: true });
    await Promise.all(
      items.map((item) => {
        const srcPath = path.join(src, item.name);
        const destPath = path.join(dest, item.name);
        return item.isDirectory()
          ? fs.promises
              .mkdir(destPath, { recursive: true })
              .then(() => copyAssets(srcPath, destPath))
          : fs.promises.copyFile(srcPath, destPath);
      }),
    );
  };

  await copyAssets(assetsDir, path.join(projectDistDir, 'assets'));

  console.log('Build completed!');
})();
