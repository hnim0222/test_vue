<template>
  <div class="mx-auto p-4">
    <div v-if="loading" class="text-center text-lg font-semibold">Đang tải dữ liệu...</div>
    <div v-else-if="error" class="text-red-500 text-center text-lg">Lỗi tải dữ liệu!</div>
    <div v-else>
      <h1 class="text-2xl font-bold mb-4">{{ chapter?.comic_name }} - Chương {{ chapter?.chapter_name }}</h1>
      <div class="flex flex-col items-center mb-4">
        <img
            v-for="(image, index) in chapter?.chapter_image"
            :key="index"
            :src="`${domainCDN}/${chapter?.chapter_path}/${image.image_file}`"
            class="w-full object-cover"
            :alt="`Trang ${image.image_page}`"
        />
      </div>

      <div class="fixed bottom-4 left-4 right-4 flex justify-between bg-white">
        <button @click="goToPreviousChapter" class="bg-blue-500 text-white p-2 rounded">Chương trước</button>
        <select v-model="selectedChapter" @change="goToChapter" class="p-2 border rounded text-black">
          <option v-for="(ch, index) in listChapters" :key="index" :value="ch.chapter_name">
            Chapter {{ ch.chapter_name }}
          </option>
        </select>
        <button @click="goToNextChapter" class="bg-blue-500 text-white p-2 rounded">Chương sau</button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
const router = useRouter();

interface Image {
  image_page: number;
  image_file: string;
}

interface Chapter {
  comic_name: string;
  chapter_name: string;
  chapter_path: string;
  chapter_image: Image[];
  chapter_api: string;
}

const chapter = ref<Chapter | null>(null);
const chapters = ref<Chapter[]>([]);  // List of chapters
const domainCDN = ref('');
const loading = ref(true);
const error = ref(false);
const selectedChapter = ref<string>('');
const listChapters = ref<any[]>([]);


const fetchChapter = async () => {
  try {
    const chapterApi = router.currentRoute.value.params.chapterApi as string;
    const response = await axios.get(chapterApi);
    chapter.value = response.data.data.item;
    domainCDN.value = response.data.data.domain_cdn;
    chapters.value = response.data.data.item.chapters;
  } catch (err) {
    console.error("Lỗi tải dữ liệu:", err);
    error.value = true;
  } finally {
    loading.value = false;
  }
};

const fetchListChapter = async () => {
  try {
    const slugComic = router.currentRoute.value.params.comicSlug as string;

    const response = await axios.get(`https://otruyenapi.com/v1/api/truyen-tranh/${slugComic}`);
    const data = response.data;

    if (data.data && data.data.item?.chapters?.[0]?.server_data) {
      listChapters.value = data.data.item.chapters[0].server_data;

      const currentChapterName = router.currentRoute.value.params.chapterName as string;
      const currentChapter = listChapters.value.find(ch => ch.chapter_name === currentChapterName);
      if (currentChapter) {
        selectedChapter.value = currentChapter.chapter_name;
      }
    }
  } catch (err) {
    console.error("Lỗi tải dữ liệu:", err);
    error.value = true;
  } finally {
    loading.value = false;
  }
};


const goToChapter = () => {
  const currentChapter = listChapters.value.find(ch => ch.chapter_name === selectedChapter.value);
  if (currentChapter) {
    router.push({ name: 'comic-detail', params: { chapterApi: currentChapter.chapter_api_data, comicSlug: router.currentRoute.value.params.comicSlug, chapterName: currentChapter.chapter_name } }).then(() => {
      window.location.reload();
    });
  }
};



const goToPreviousChapter = () => {
  if (chapters.value && chapters.value.length > 0) {
    const currentIndex = chapters.value.findIndex(ch => ch.chapter_api === chapter.value?.chapter_api);
    if (currentIndex > 0) {
      const previousChapter = chapters.value[currentIndex - 1];
      selectedChapter.value = previousChapter.chapter_name;
      router.push({ name: 'comic-detail', params: { chapterApi: previousChapter.chapter_api, comicSlug: router.currentRoute.value.params.comicSlug } });
    }
  }
};

const goToNextChapter = () => {
  if (chapters.value && chapters.value.length > 0) {
    const currentIndex = chapters.value.findIndex(ch => ch.chapter_api === chapter.value?.chapter_api);
    if (currentIndex < chapters.value.length - 1) {
      const nextChapter = chapters.value[currentIndex + 1];
      selectedChapter.value = nextChapter.chapter_name;
      router.push({ name: 'comic-detail', params: { chapterApi: nextChapter.chapter_api, comicSlug: router.currentRoute.value.params.comicSlug } });
    }
  }
};





onMounted(() => {
  fetchChapter();
  fetchListChapter();
});
</script>

<style scoped>
.comic-detail {
  text-align: center;
}

.comic-poster {
  width: 200px;
  height: 300px;
  object-fit: cover;
}

.comic-name {
  margin-top: 20px;
  font-weight: bold;
  font-size: 24px;
}

.fixed {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
}
</style>
