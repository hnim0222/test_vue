<template>
  <div class="comic-chapter">
    <h1 class="mb-7 font-bold text-2xl">{{ comicName }}</h1>

    <!-- Hiển thị loading khi dữ liệu chưa tải xong -->
    <div v-if="loading">Loading chapters...</div>

    <!-- Hiển thị danh sách chapter -->
    <div v-else>
      <div v-if="chapters.length === 0">No chapters available.</div>

      <div v-for="(chapter, index) in chapters" :key="index" class="chapter-item" @click="goToChapterDetail(chapter.chapter_api_data, chapter.chapter_name)">
        <h3>{{ chapter.chapter_title || `Chapter ${chapter.chapter_name}` }}</h3>
        <p v-if="chapter.chapter_title">Chapter {{ chapter.chapter_name }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { defineProps } from 'vue';
import axios from 'axios';
// import router from "@/router"; // Import Axios
import { useRouter } from 'vue-router';
const router = useRouter();

// Nhận `comicSlug` từ props
const props = defineProps({
  comicSlug: {
    type: String,
    required: true,
  }
});

const chapters = ref<any[]>([]); // Lưu danh sách chapter
const loading = ref(true); // Trạng thái loading
let comicName = ref('');

onMounted(async () => {
  try {
    // Sử dụng Axios để gọi API
    const response = await axios.get(`https://otruyenapi.com/v1/api/truyen-tranh/${props.comicSlug}`);
    const data = response.data;
    comicName.value = data.data.item.name;
    if (data.data && data.data.item?.chapters?.[0]?.server_data) {
      chapters.value = data.data.item.chapters[0].server_data;
    }
  } catch (error) {
    console.error("Error fetching chapters:", error);
  } finally {
    loading.value = false; // Tắt trạng thái loading
  }
});

const goToChapterDetail = (chapterApiData: any, chapterName: string) => {
  router.push({
    name: 'comic-detail',
    params: {
      chapterApi: chapterApiData,
      comicSlug: props.comicSlug,
      chapterName: chapterName
    }
  });
};


</script>

<style scoped>
.comic-chapter {
  padding: 20px;
}

.chapter-item {
  padding: 10px;
  margin-bottom: 8px;
  background-color: #f9f9f9;
  border-radius: 5px;
}

.chapter-item a {
  color: blue;
  text-decoration: underline;
}
</style>