const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

// files ---------------------------------

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

function findFiles(dirPath, ignorePaths, _arrayOfFiles) {
  let files = fs.readdirSync(dirPath);
  _arrayOfFiles = _arrayOfFiles || [];

  files.forEach(function (file) {
    if (ignorePaths) {
      for (let ignorePath of ignorePaths) {
        if (file.includes(ignorePath)) {
          return;
        }
      }
    }

    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      _arrayOfFiles = findFiles(
        dirPath + "/" + file,
        ignorePaths,
        _arrayOfFiles
      );
    } else {
      _arrayOfFiles.push(path.resolve(dirPath, file));
    }
  });

  return _arrayOfFiles;
}

// do it ---------------------------------

const IGNORE = [
  "node_modules",
  ".idea",
  ".git",
  ".nuxt",
  ".vscode",
  ".githooks",
];

async function go() {
  let filesAll = findFiles("./", IGNORE);
  let filesTsx = filesAll.filter((a) => a.includes(".vue"));

  // ^ нашли интересующие нас файлы

  let readTasks = [];

  let dictFileContent = {};
  for (let filePath of filesTsx) {
    readTasks.push(
      readFileAsync(filePath).then(
        (a) => (dictFileContent[filePath] = a.toString())
      )
    );
  }

  await Promise.all(readTasks);

  // ^ получили файлы

  for (let filePath in dictFileContent) {
    let name = path.basename(filePath);
    if (name === "index.vue") continue;

    name = name.replace(".vue", "");

    let text = dictFileContent[filePath].toString();

    let className = name;

    text = text.replace(/  name: ".*?",/g, `  name: "${className}",`);

    writeFileAsync(filePath, text);
  }
}

go();
