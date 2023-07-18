<template>
  <div class="deviceInfo">
    <div>{{ label }}</div>
    <div :class="['text', position != null && (position ? 'on' : 'off')]">
      {{ position == null ? "undefined" : platform ? on : off }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "DeviceInfo",
  components: {},
  props: {
    label: String,
    on: String,
    off: String,
    position: {
      default: null,
      type: Boolean,
    },
  },
});
</script>

<style scoped>
.deviceInfo {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.text {
  padding: 0 4px;
}
.on {
  background-color: green;
}
.off {
  background-color: red;
}
</style>
