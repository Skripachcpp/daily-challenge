import * as androidFileStorage from "./androidFileStorage";
import * as browserFileStorage from "./browserFileStorage";

// -- state

let initing = false;

let osVersion = null;
let platform = null;

let fileStorage = null;

// -- private api

async function check() {
  if (initing) return;

  return new Promise((resolve, reject) => {
    if (!osVersion) {
      let version = window?.device?.version;
      if (version) osVersion = parseFloat(version);
    }

    if (!platform) {
      platform = window?.device?.platform.toLowerCase();
      if (platform?.match(/win/)) {
        platform = "windows";
      }
    }

    // init fileStorage (di)
    if (platform == "android") {
      fileStorage = androidFileStorage;
    } else {
      fileStorage = browserFileStorage;
    }

    initing = true;
    resolve();
  });
}

// -- export api

export async function readFile(path, filename) {
  await check();
  return fileStorage.readFile(path, filename);
}

export async function saveFile(path, filename, text) {
  await check();
  return fileStorage.saveFile(path, filename, text);
}

// -- code when import

// document.addEventListener(
//   "deviceready",
//   () => {
//     check();
//   },
//   false
// );
