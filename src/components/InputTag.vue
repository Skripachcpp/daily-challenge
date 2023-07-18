<template>
  <div class="ti">
    <input class="ti_text" v-model="text" type="text" placeholder="" />
    <div class="p">
      <div class="tags" v-if="showTagsButtons">
        <div
          v-for="(tag, key, index) in tags"
          :key="key"
          :class="[
            'tag',
            index == 0 && 'tag_left',
            index == 1 && 'tag_top',
            index == 2 && 'tag_right',
          ]"
          @click="emitInput(text, key)"
        >
          <div>{{ tag.label }}</div>
        </div>
      </div>
    </div>
    <button class="ti_button" :disabled="!text" @click="showTagsButtons = true">
      bt
    </button>
  </div>
</template>

<script>
export default {
  name: "InputTag",
  props: {
    tags: {
      type: Object,
      default(rawProps) {
        return {
          life: { label: "lf" },
          body: { label: "b" },
          live: { label: "lv" },
        };
      },
    },
  },
  emits: ["input"],
  data() {
    return {
      showTagsButtons: false,
      text: "",
    };
  },
  methods: {
    emitInput(text, tag) {
      if (!this.text) return;
      this.$emit("input", { text, tag });
      this.text = "";
      this.showTagsButtons = false;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.ti {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
}

.ti_text {
  font-size: 18px;
  width: 100%;
}

.ti_button {
  font-size: 18px;
  margin-left: 6px;
}

.tags {
  position: relative;
  font-size: 18px;
}

.tag {
  background-color: darkslategrey;
  border: 1px solid white;
  color: white;
  border-radius: 50%;

  width: 30px;
  height: 30px;
  border: 1px solid white;
  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;
}

.tag_left {
  animation-duration: 0.25s;
  animation-name: tags_animation;

  position: absolute;
  left: -40px;
  top: -20px;
}

.tag_top {
  animation-duration: 0.25s;
  animation-name: tags_animation;

  position: absolute;
  left: -40px;
  top: -60px;
}

.tag_right {
  animation-duration: 0.25s;
  animation-name: tags_animation;

  position: absolute;
  top: -60px;
  left: 0;
}

@keyframes tags_animation {
  from {
    top: 0px;
    left: 60px;
  }

  to {
  }
}
</style>
