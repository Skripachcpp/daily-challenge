<template>
  <div class="listTag" style="text-align: left; max-width: 800px">
    <div v-for="(day, index) in this.days" :key="index">
      <div class="day">
        <span class="day_date">{{ day.date }}</span>
        <span class="day_week">{{ day.week }}</span>
      </div>
      <div
        v-for="(tag, i) in day.tags"
        :key="'tag_' + index + '_' + i"
        class="tag"
        :class="['line', i % 2 != 0 && 'line_even']"
      >
        <div class="day_tag">{{ tag.tag }}</div>
        <div class="day_text">{{ tag.text }}</div>
      </div>
    </div>
    <div class="input_tag">
      <InputTag @input="inputTag" :tags="tags" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { xml2json, json2xml, js2xml } from "xml-js";
import * as fileStorage from "@/utils/fileStorage";
import InputTag from "@/components/InputTag";
import { fileToJson, jsonToFile, xmlNormalize } from "@/utils/mappung";

export default defineComponent({
  name: "ListTag",
  components: {
    InputTag,
  },
  props: ["days"],
  emits: ["input"],
  data() {
    return {
      tags: {
        life: { label: "lf" },
        body: { label: "b" },
        live: { label: "lv" },
      },
    };
  },
  computed: {
    currentDay() {
      return this.days?.[this.days?.length - 1];
    },
  },
  methods: {
    to00(value) {
      if (value > 9) return value.toString();
      if (value <= 0) return "0" + (-value).toString();

      return "0" + value.toString();
    },
    dateDayToText(value) {
      switch (value) {
        case 1:
          return "пн";
        case 2:
          return "вт";
        case 3:
          return "ср";
        case 4:
          return "чт";
        case 5:
          return "пт";
        case 6:
          return "сб";
        case 0:
          return "вс";
      }

      return "";
    },
    async inputTag({ tag, text }) {
      if (!this.days?.length) return;

      let days = this.days;

      let now = new Date();
      let lastDay = days?.[days?.length - 1];

      let date = `${this.to00(now.getDate())}.${this.to00(
        now.getMonth() + 1
      )}.${now.getFullYear()}`;

      if (lastDay.date !== date) {
        let week = this.dateDayToText(now.getDay());
        lastDay = { date, week };
        days.push(lastDay);
      }

      if (!lastDay.tags) lastDay.tags = [];
      lastDay.tags.push({ tag, text });

      fileStorage.saveFile(
        "Download/",
        "daily-challenge.xml",
        await jsonToFile(this.days)
      );
    },
    async readFile() {
      this.fileText = await fileStorage.readFile(
        "Download/",
        "daily-challenge.xml"
      );

      return this.fileText;
    },
    async updateDailyChallengeFlat() {},
    jsonToXml() {},
    saveFile() {},
  },
});
</script>

<style scoped>
.day {
  margin: 4px 0;
  padding: 0 2px;
  background-color: #d5f9ff;

  width: 105px;
  border-radius: 6px;
}

.day_date {
  color: gray;
}

.day_week {
  color: gray;
  margin-left: 5px;
}

.line {
  background-color: #f9f9f9;
  border-radius: 6px;
  padding: 0 4px;
}

.line_even {
  background-color: #f8f8f8;
}

.tag {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
}

.day_tag {
  color: gray;
  margin-right: 12px;
}

.day_text {
  text-align: right;
}

.input_tag {
  display: flex;
  justify-content: flex-end;

  margin-top: 8px;
}
</style>
