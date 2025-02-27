<template>
  <div class="comic-chapter">
    <h1 class="comic-title">{{ comicName }}</h1>
    <p>Chapter: {{ totalChapter }}</p>
    <p v-if="selectedChapterName !== ''">Chapter hiện tại: {{ selectedChapterName }}</p>

    <img :src="thumbnail" :alt="comicName" class="comic-thumbnail"  style="border-radius: 5px; margin: 20px 0;"/>
   <div  style="padding-top: 20px; padding-bottom: 30px; font-size: 18px; height: 200px; overflow: scroll;">
     <p>Tác giả: {{ author }}</p>
     <p style="margin: 10px 0;">Thể loại: {{ category.join(', ') }}</p>
     <p>Mô tả: {{ content }} </p>
   </div>

    <div v-if="loading">Loading chapters...</div>
    <div v-else>
      <div v-if="chapters.length === 0">No chapters available.</div>
      <div
          style="margin-top: 20px;"
          v-for="(chapter, index) in paginatedChapters"
          :key="index"
          class="chapter-item"
          :class="{'highlight': chapter.chapter_name === selectedChapterName}"
          @click="goToChapterDetail(chapter.chapter_api_data, chapter.chapter_name)"
      >
        <p>Chapter {{ chapter.chapter_name }}</p>
      </div>

      <div class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1">Previous</button>

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

const props = defineProps({
  comicSlug: {
    type: String,
    required: true,
  }
});

const chapters = ref<any[]>([]);
const loading = ref(true);
const comicName = ref('');
let author = ref<string[]>([]);
const category = ref([]);
let content = ref('');
const thumbnail = ref('');
const totalChapter = ref(0);

const selectedChapterName = ref<string>('');

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
    author.value = data.data.item.author[0];
    category.value = data.data.item.category.map((cat: any) => cat.name);
    content.value = data.data.seoOnPage.descriptionHead;
    thumbnail.value = `https://img.otruyenapi.com/uploads/comics/${data.data.item.thumb_url}`;
    totalChapter.value = data.data.item.chapters[0].server_data.slice(-1)[0].chapter_name;

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
      comicSlug: props.comicSlug,
      chapterName: chapterName
    },
    query: {
      chapterApi: encodeURIComponent(chapterApi)
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
        chapterApi
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

.comic-title {
  font-size: 22px;
  font-weight: bold;
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
