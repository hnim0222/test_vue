<script setup lang="ts">
import epub, { Book, Rendition } from "epubjs";
import { ref } from "vue";

const bookNav = ref<{ href: string; label: string }[]>([]);
let book: Book | null = null;
let rendition: Rendition | null = null;

const upload = async (e: Event) => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  try {
    const arrayBuffer = await file.arrayBuffer();
    book = epub(arrayBuffer);

    rendition = book.renderTo("root", {
      width: "100%",
      height: "100%",
      manager: "continuous",
      flow: "scrolled",
      spread: "none",
    });

    await rendition.display();
  } catch (error) {
    console.error("Error loading EPUB file:", error);
  }
};
</script>

<template>
  <div class="flex flex-col items-center space-y-4">
    <label
        for="fileUpload"
        class="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all"
    >
      📥 Chọn file EPUB
    </label>
    <input id="fileUpload" type="file" class="hidden" @change="upload" />

    <div id="root" class="w-full max-w-3xl"></div>
  </div>
</template>

<style scoped>
#root {
  height: 100vh;
}
</style>
