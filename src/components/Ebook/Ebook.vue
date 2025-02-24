<script setup>
import epub from "epubjs";
import { ref } from "vue";

const bookNav = ref([]);
let book, rendition, displayed;

const upload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const arrayBuffer = await file.arrayBuffer();
  book = epub(arrayBuffer);
  console.log(book)
  rendition = book.renderTo("root", {
    width: "100%",
    height: "100%",
    manager: "continuous",
    flow: "scrolled",
    spread: "none",
  });

  displayed = rendition.display();
};
</script>

<template>
  <input type="file" @change="upload" />
  <div id="root"></div>
</template>

<style scoped>
#root {
  height: 100vh;
}
</style>
