<template>
  <div class="mx-auto p-4">
    <div v-if="loading" class="text-center text-lg font-semibold">Đang tải dữ liệu...</div>
    <div v-else-if="error" class="text-red-500 text-center text-lg">Lỗi tải dữ liệu!</div>
    <div v-else>
      <!-- Sử dụng optional chaining để tránh lỗi khi chapter là null -->
      <h1 class="text-2xl font-bold mb-4">{{ chapter?.comic_name }} - Chương {{ chapter?.chapter_name }}</h1>
      <div class="flex flex-col items-center">
        <img
            v-for="(image, index) in chapter?.chapter_image"
            :key="index"
            :src="`${domainCDN}/${chapter?.chapter_path}/${image.image_file}`"
            class="w-full max-w-2xl object-cover"
            :alt="`Trang ${image.image_page}`"
        />
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

interface Image {
  image_page: number;
  image_file: string;
}

interface Chapter {
  comic_name: string;
  chapter_name: string;
  chapter_path: string;
  chapter_image: Image[];
}

const chapter = ref<Chapter | null>(null);
const domainCDN = ref('');
const loading = ref(true);
const error = ref(false);

const fetchChapter = async () => {
  try {
    const response = await axios.get("https://sv1.otruyencdn.com/v1/api/chapter/678b044dc705a578a7fadd7c");
    chapter.value = response.data.data.item;
    domainCDN.value = response.data.data.domain_cdn;
  } catch (err) {
    console.error("Lỗi tải dữ liệu:", err);
    error.value = true;
  } finally {
    loading.value = false;
  }
};

onMounted(fetchChapter);
</script>
