<template>
  <div class="comic-chapter">
    <h1 class="mb-7 font-bold text-2xl">{{ comicName }}</h1>

    <!-- Hiển thị loading khi dữ liệu chưa tải xong -->
    <div v-if="loading">Loading chapters...</div>

    <!-- Hiển thị danh sách chapter -->
    <div v-else>
      <div v-if="chapters.length === 0">No chapters available.</div>

      <div
          v-for="(chapter, index) in paginatedChapters"
          :key="index"
          class="chapter-item"
          :class="{'highlight': chapter.chapter_name === selectedChapterName}"
          @click="goToChapterDetail(chapter.chapter_api_data, chapter.chapter_name)"
      >
        <p>Chapter {{ chapter.chapter_name }}</p>
      </div>

      <!-- Phân trang -->
      <div class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1">Previous</button>

        <!-- Danh sách số trang -->
        <span
            v-for="page in visiblePages"
            :key="page"
            @click="changePage(page)"
            :class="{ 'active-page': page === currentPage }"
        >
          {{ page }}
        </span>

        <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();

// Nhận `comicSlug` từ props
const props = defineProps({
  comicSlug: {
    type: String,
    required: true,
  }
});

const chapters = ref<any[]>([]);
const loading = ref(true);
const comicName = ref('');

const selectedChapterName = ref<string>('');

// Phân trang
const currentPage = ref(1);
const chaptersPerPage = 50;

const totalPages = computed(() => Math.ceil(chapters.value.length / chaptersPerPage));

const paginatedChapters = computed(() => {
  const start = (currentPage.value - 1) * chaptersPerPage;
  return chapters.value.slice(start, start + chaptersPerPage);
});

const visiblePages = computed(() => {
  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages.value, start + maxVisible - 1);
  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
});

// Chuyển trang
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};
const changePage = (page: number) => {
  currentPage.value = page;
};

onMounted(async () => {
  try {
    const response = await axios.get(`https://otruyenapi.com/v1/api/truyen-tranh/${props.comicSlug}`);
    const data = response.data;
    comicName.value = data.data.item.name;
    if (data.data && data.data.item?.chapters?.[0]?.server_data) {
      chapters.value = data.data.item.chapters[0].server_data;
    }

    const savedChapters = JSON.parse(localStorage.getItem('savedChapters') || '[]');
    const savedChapter = savedChapters.find((ch: any) => ch.slug === props.comicSlug);
    if (savedChapter) {
      selectedChapterName.value = savedChapter.chapterName;
    }
  } catch (error) {
    console.error("Error fetching chapters:", error);
  } finally {
    loading.value = false;
  }
});

const goToChapterDetail = (chapterApi: any, chapterName: string) => {
  router.push({
    name: 'comic-detail',
    params: {
      chapterApi: chapterApi,
      comicSlug: props.comicSlug,
      chapterName: chapterName
    }
  }).then(() => {
    const savedChapters = JSON.parse(localStorage.getItem('savedChapters') || '[]');
    const existingChapterIndex = savedChapters.findIndex((ch: any) => ch.slug === props.comicSlug);
    if (existingChapterIndex >= 0) {
      savedChapters[existingChapterIndex] = {
        ...savedChapters[existingChapterIndex],
        chapterApi,
        chapterName
      };
    } else {
      savedChapters.push({
        slug: props.comicSlug,
        chapterName,
        chapterApi  // Lưu chapterApiData mới
      });
    }
    localStorage.setItem('savedChapters', JSON.stringify(savedChapters));
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
  cursor: pointer;
  transition: background 0.3s;
}

.chapter-item:hover {
  background-color: #eaeaea;
}

.chapter-item.highlight {
  background-color: #007bff;
  color: #fff;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  gap: 10px;
}

button {
  padding: 8px 12px;
  border: 1px solid #ccc;
  cursor: pointer;
  background-color: #f8f8f8;
}

button:disabled {
  background-color: #ddd;
  cursor: not-allowed;
}

span {
  padding: 5px 10px;
  border-radius: 3px;
  cursor: pointer;
  background: #fff;
  border: 1px solid #ccc;
}

.active-page {
  background: #007bff;
  color: #fff;
  font-weight: bold;
}
</style>
