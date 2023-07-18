<template>
  <div class="accountingView" style="max-width: 800px">
    <InputTag />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import InputTag from "@/components/InputTag";

export default defineComponent({
  name: "AccountingView",
  components: {
    InputTag,
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {},
});
</script>
