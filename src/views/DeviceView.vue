<template>
  <div class="deviceView">
    <button @click="readFile">read file</button>
    <button @click="saveFile">save file</button>

    <div>
      <button @click="updateVariableKeys(window)">window</button>
      <button @click="updateVariableKeys(window?.cordova)">
        window.cordova
      </button>

      <button @click="updateVariableKeys(cordova)">cordova</button>
      <button @click="updateVariableKeys(cordova.plugins)">
        cordova.plugins
      </button>

      <button @click="variableKeys = JSON.stringify(cordova.file, null, 2)">
        cordova.file
      </button>

      <pre @click="variableKeys = null" style="text-align: left">{{
        variableKeys
      }}</pre>
    </div>

    <h1>device info</h1>
    <div>
      {{ platformInfo }}
    </div>
    <h1>permissions</h1>
    <h3>External SD card</h3>
    <div>
      <DeviceInfo
        label="External SD card authorized?"
        on="AUTHORIZED"
        off="UNAUTHORIZED"
        :position="externalSdCardAuthorized"
      />
    </div>

    <h1>actions</h1>
    <button
      v-if="externalSdCardAuthorized == false"
      @click="requestExternalSdPermission"
    >
      Request external SD permission
    </button>

    <button v-if="externalSdCardAuthorized" @click="requestExternalSdDetails">
      Show external SD details
    </button>
    <div v-if="externalSdCardDetails">
      <p
        v-for="(detail, index) in externalSdCardDetails"
        :key="index"
        style="text-align: left"
      >
        Path: {{ detail?.path }}<br />
        Writable?: {{ detail?.canWrite }}<br />
        Free space: {{ detail?.freeSpace }}<br />
        Type: {{ detail?.type }}
      </p>

      <div v-if="externalSdCardDetails?.some((detail) => detail.canWrite)">
        <button @click="writeExternalSdFile">Write external SD file</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import DeviceInfo from "@/components/DeviceInfo.vue";
import * as fileStorage from "@/utils/fileStorage";

function log(msg, showAlert) {
  console.log(msg);
  if (showAlert) {
    alert(msg);
  }
}

function handleError(error) {
  let msg = "Error: " + error;
  console.error(msg);
  alert(msg);
}

export default defineComponent({
  name: "DeviceView",
  components: { DeviceInfo },
  data() {
    return {
      variableKeys: {},

      platform: "undefined",
      osVersion: "undefined",

      externalSdCardAuthorized: null,

      externalSdCardDetails: null,

      externalSdCardDirectory: null,
      externalSdCardRootDirectory: null,
    };
  },
  mounted() {
    document.addEventListener("deviceready", this.init, false);
  },
  computed: {
    platformInfo() {
      return `platform: ${this.platform}, osVersion: ${this.osVersion}`;
    },
    window() {
      return window;
    },
    cordova() {
      return cordova;
    },
    JSON() {
      return JSON;
    },
  },
  methods: {
    updateVariableKeys(obj) {
      if (typeof obj === "object") {
        this.variableKeys = Object.keys(obj);
      } else {
        this.variableKeys = JSON.stringify(obj, null, 2);
      }
    },
    async readFile() {
      let text = await fileStorage.readFile("Download", "test_file_5.txt");

      alert("readFile: " + text);
    },
    async saveFile() {
      await fileStorage.saveFile(
        "Download",
        "test_file_5.txt",
        "Тестовый файл 99"
      );

      alert("saveFile");
    },
    async init() {
      this.osVersion = parseFloat(device.version);
      this.platform = device.platform.toLowerCase();
      if (this.platform.match(/win/)) {
        this.platform = "windows";
      }

      cordova.plugins.diagnostic.isExternalStorageAuthorized((enabled) => {
        this.externalSdCardAuthorized = enabled;
      }, handleError);

      // TODO: test
      requestExternalSdDetails();
    },
    requestExternalSdPermission() {
      cordova.plugins.diagnostic.requestExternalStorageAuthorization(
        (status) => {
          log(
            "Successfully requested external storage authorization: authorization was " +
              status
          );
          this.init();
          //checkState();
        },
        handleError
      );
    },
    requestExternalSdDetails() {
      cordova.plugins.diagnostic.getExternalSdCardDetails((details) => {
        log("Successfully retrieved external SD card details");
        this.externalSdCardDetails = details;

        let detail = details.find((a) => a?.canWrite);

        if (detail?.filePath) {
          this.externalSdCardDirectory = detail.filePath;
        }

        this.externalSdCardRootDirectory = details?.[0].filePath;

        if (details?.length > 0) {
          window.scrollTo(0, document.body.scrollHeight);
        } else {
          alert("No external storage found");
        }
      }, handleError);
    },
    writeExternalSdFile() {
      // let targetDir = this.externalSdCardRootDirectory + "/Download";
      let targetDir = this.externalSdCardDirectory;
      let filename = "test.txt";
      let targetFilepath = targetDir + "/" + filename;

      let fail = function (error) {
        handleError(
          `Failed to write file ${targetFilepath}. Error code: ${error.code}`
        );
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
                writer.onwriteend = function (evt) {
                  log("Wrote " + targetFilepath, true);
                };
                writer.write("Hello world");
              }, fail);
            },
            fail
          );
        },
        fail
      );
    },
    // copyToClipboard(text) {
    //   cordova.plugins.clipboard.copy(text);
    //   alert("copy to clipboard \n" + text);
    // },
  },
});
</script>

<style scoped>
.deviceView {
  max-width: 500px;
  margin: auto;
}
</style>
