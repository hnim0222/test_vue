<template>
  <div class="comic-chapter">
    <h1 class="comic-title">{{ comicName }}</h1>
    <p>Chapter: {{ totalChapter }}</p>
    <p v-if="selectedChapterName !== ''">Chapter hiện tại: {{ selectedChapterName }}</p>

    <img :src="thumbnail" :alt="comicName" class="comic-thumbnail" style="border-radius: 5px; margin: 20px 0;"/>
    <div style="padding-top: 20px; padding-bottom: 30px; font-size: 18px;">
      <p>Tác giả: {{ author }}</p>
      <p style="margin: 10px 0;">Thể loại: {{ category.join(', ') }}</p>
      <p>Mô tả: {{ content }} </p>
    </div>

    <div v-if="loading">Loading chapters...</div>
    <div v-else class="btn-area">
      <button @click="goToChapterDetail(firstChapter.chapter_api_data, firstChapter.chapter_name)" class="btn-read">
        {{ selectedChapterName ? `Đọc tiếp chap ${selectedChapterName}` : 'Đọc từ đầu' }}
      </button>
      <button class="list-icon" @click="showChapterModal = true"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-logs"><path d="M13 12h8"/><path d="M13 18h8"/><path d="M13 6h8"/><path d="M3 12h1"/><path d="M3 18h1"/><path d="M3 6h1"/><path d="M8 12h1"/><path d="M8 18h1"/><path d="M8 6h1"/></svg></button>
    </div>

    <div v-if="showChapterModal" class="modal-overlay" @click.self="showChapterModal = false">
      <div class="modal-content">
        <h2>Danh sách Chapter</h2>
        <input type="text" v-model="searchQuery" placeholder="Search Chapter..."  class="search-input"/>
        <ul>
          <li v-for="(chapter, index) in filteredChapters"
              ref="chapterRefs"
              :key="index" @click="goToChapterDetail(chapter.chapter_api_data, chapter.chapter_name)"
              :class="{ 'selected-chapter': chapter.chapter_name === selectedChapterName }">
            Chapter {{ chapter.chapter_name }}
          </li>
        </ul>
        <button @click="showChapterModal = false" class="list-icon" style="margin-top: 10px;">Đóng</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const searchQuery = ref("");
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
const author = ref<string[]>([]);
const category = ref([]);
const content = ref('');
const thumbnail = ref('');
const totalChapter = ref(0);
const selectedChapterName = ref<string>('');
const showChapterModal = ref(false);
const chapterRefs = ref<HTMLElement[]>([]);

const firstChapter = computed(() => chapters.value.length > 0 ? chapters.value[0] : null);

const filteredChapters = computed(() => {
  return chapters.value.filter(chapter =>
      chapter.chapter_name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const focusSelectedChapter = () => {
  nextTick(() => {
    const index = filteredChapters.value.findIndex(chapter => chapter.chapter_name === selectedChapterName.value);
    if (index !== -1 && chapterRefs.value[index]) {
      chapterRefs.value[index].scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });
};

watch(filteredChapters, focusSelectedChapter, { immediate: true });

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

button {
  padding: 8px 12px;
  margin: 10px;
  background-color: #1db954;
  color: white;
  border: none;
  cursor: pointer;
}

.selected-chapter {
  background-color: #f0f0f0;
  font-weight: bold;
  color: #007bff;
  padding: 5px;
  border-radius: 5px;
}

button:disabled {
  background-color: #ddd;
  cursor: not-allowed;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 5px;
  width: 80%;
  height: auto;
  max-height: 70%;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.modal-content ul {
  list-style: none;
  padding: 0;
  width: 100%;
  max-height: 60%;
  overflow-y: auto;
}

.modal-content li {
  padding: 10px;
  cursor: pointer;
  border-bottom: 1px solid #ddd;
}

.modal-content li:hover {
  background: #f0f0f0;
}

.btn-read{
  padding: 10px 12px;
  margin: 10px 20px;
  background-color: #1db954;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 10px;
}

.list-icon {
  padding: 8px 12px;
  margin: 10px;
  background-color: #1db954;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 10px;
}

.btn-area{
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}

.search-input{
  width: 100%;
  max-width: 300px;
  padding: 8px;
  margin-bottom: 5px;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin: 20px 10px 10px 10px;
}
</style>
