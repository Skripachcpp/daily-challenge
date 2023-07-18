let externalSdPermission = null;
let externalSdCardDirectory = null;
let externalSdCardRootDirectory = null;

// private --

function handleError(error) {
  let msg = "Error: " + error;
  console.error(msg);
  alert(msg);
}

async function isExternalStorageAuthorized() {
  return new Promise((resolve, reject) => {
    // isExternalStorageManager().
    window.cordova.plugins.diagnostic.isExternalStorageAuthorized(
      (enabled) => {
        resolve(enabled);
      },
      (error) => {
        handleError(error);
        reject();
      }
    );
  });
}

function requestExternalSdPermission() {
  return new Promise((resolve, reject) => {
    window.cordova.plugins.diagnostic.requestExternalStorageAuthorization(
      (status) => {
        resolve(status);
      },
      (error) => {
        handleError(error);
        reject();
      }
    );
  });
}

async function requestExternalSdDetails() {
  return new Promise((resolve, reject) => {
    window.cordova.plugins.diagnostic.getExternalSdCardDetails(
      (details) => {
        resolve(details);
      },
      (error) => {
        handleError(error);
        reject();
      }
    );
  });
}

async function check() {
  if (!externalSdPermission) {
    externalSdPermission = await isExternalStorageAuthorized();

    if (!externalSdPermission) {
      await requestExternalSdPermission();

      externalSdPermission = await isExternalStorageAuthorized();
    }

    if (externalSdPermission && !externalSdCardDirectory) {
      externalSdCardDirectory = await requestExternalSdDetails();
      externalSdCardRootDirectory = externalSdCardDirectory?.[0]?.filePath;
    }
  }
}

// export --

export async function readFile(path, filename) {
  await check();

  let targetDir = externalSdCardRootDirectory + path;

  return new Promise((resolve, reject) => {
    let targetFilepath = targetDir + "/" + filename;

    let fail = function (error) {
      handleError(
        `Failed to write file ${targetFilepath}. Error code: ${error.code}`
      );
      reject();
    };

    window.resolveLocalFileSystemURL(
      targetDir,
      function (dirEntry) {
        dirEntry.getFile(
          filename,
          {
            create: true,
            exclusive: false,
          },
          function (fileEntry) {
            fileEntry.file(function (file) {
              let reader = new FileReader();

              reader.onloadend = function () {
                resolve(this.result);
              };

              reader.readAsText(file);
            }, fail);
          },
          fail
        );
      },
      fail
    );
  });
}

export async function saveFile(path, filename, text) {
  await check();

  // let targetDir = externalSdCardRootDirectory + path;
  let targetDir = window?.cordova?.file?.externalRootDirectory + path;

  return new Promise((resolve, reject) => {
    let targetFilepath = targetDir + "/" + filename;

    let fail = function (error) {
      handleError(
        `Failed to write file ${targetFilepath}. Error code: ${error.code}`
      );
      reject();
    };

    window.resolveLocalFileSystemURL(
      targetDir,
      function (dirEntry) {
        dirEntry.getFile(
          filename,
          {
            create: true,
            exclusive: false,
          },
          function (fileEntry) {
            fileEntry.createWriter(function (writer) {
              writer.write(text);

              resolve();
            }, fail);
          },
          fail
        );
      },
      fail
    );
  });
}
