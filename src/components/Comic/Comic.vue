<template>
  <div class="mx-auto">
    <div v-if="loading" class="text-center text-lg font-semibold">Đang tải dữ liệu...</div>
    <div v-else-if="error" class="text-red-500 text-center text-lg">Lỗi tải dữ liệu!</div>
    <div v-else>
      <h1 class="text-2xl font-bold m-4 uppercase text-orange-500">{{ comicName }} <br> <span class="text-xl text-gray-500">Chapter {{ chapter?.chapter_name }}</span></h1>
      <div class="flex flex-col items-center mb-4">
        <img
            v-for="(image, index) in chapter?.chapter_image"
            :key="index"
            :src="`${domainCDN}/${chapter?.chapter_path}/${image.image_file}`"
            class="w-full object-cover"
            :alt="`Image ${image.image_page}`"
        />
      </div>

      <div @click="showControls = true" class="fixed bottom-4 left-4 right-4">
        <div v-if="showControls" class="flex justify-between items-center bg-white p-1 shadow-lg px-5">
          <button @click="goToPreviousChapter()" class="bg-blue-500 text-white p-2 rounded-lg transition duration-300 ease-in-out" :disabled="isFirstChapter" :class="{
          'bg-blue-500 hover:bg-blue-600': !isFirstChapter,
          'bg-gray-400 cursor-not-allowed': isFirstChapter
  }">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-arrow-left"><circle cx="12" cy="12" r="10"/><path d="M16 12H8"/><path d="m12 8-4 4 4 4"/></svg>
          </button>

          <button @click="goToListChapter" class="bg-blue-500 text-white p-2 rounded-lg transition duration-300 ease-in-out">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list"><path d="M3 12h.01"/><path d="M3 18h.01"/><path d="M3 6h.01"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M8 6h13"/></svg>
          </button>
          <button @click="goToHome" class="bg-blue-500 text-white p-2 rounded-lg transition duration-300 ease-in-out">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-house"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>          </button>

          <select v-model="selectedChapter" @change="goToChapter()" class="p-2 border rounded-lg text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out">
            <option v-for="(ch, index) in listChapters" :key="index" :value="ch.chapter_name">
              Chapter {{ ch.chapter_name }}
            </option>
          </select>

          <button @click="goToNextChapter()" class="bg-blue-500 text-white p-2 rounded-lg transition duration-300 ease-in-out" :disabled="isLastChapter" :class="{
          'bg-blue-500 hover:bg-blue-600': !isLastChapter,
          'bg-gray-400 cursor-not-allowed':  isLastChapter
  }">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-arrow-right"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="m12 16 4-4-4-4"/></svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, onBeforeUnmount, watch} from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const showControls = ref(true);

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
const chapters = ref<Chapter[]>([]);
const domainCDN = ref('');
const loading = ref(true);
const error = ref(false);
const selectedChapter = ref<string>('');
const listChapters = ref<any[]>([]);

const isFirstChapter = ref(false);
const isLastChapter = ref(false);
const currentChapter = ref(router.currentRoute.value.params.chapterName);
let comicName = ref('');


const fetchChapter = async () => {
  try {
    const chapterApi = router.currentRoute.value.query.chapterApi as string;
    if (!chapterApi) {
      throw new Error("Không tìm thấy chapterApi trong query");
    }

    const response = await axios.get(decodeURIComponent(chapterApi));
    chapter.value = response.data.data.item;
    comicName = response.data.data.item.comic_name.split('[')[0].trim();
    domainCDN.value = response.data.data.domain_cdn;
    return response.data;
  } catch (err) {
    console.error("Lỗi tải dữ liệu:", err);
    error.value = true;
  }
};


const fetchListChapter = async () => {
  try {
    const slugComic = router.currentRoute.value.params.comicSlug as string;
    const response = await axios.get(`https://otruyenapi.com/v1/api/truyen-tranh/${slugComic}`);
    const data = response.data;

    if (data.data && data.data.item?.chapters?.[0]?.server_data) {
      listChapters.value = data.data.item.chapters[0].server_data;

      const savedChapters = JSON.parse(localStorage.getItem('savedChapters') || '[]');
      const savedChapter = savedChapters.find((ch: any) => ch.slug === slugComic);

      if (savedChapter) {
        selectedChapter.value = savedChapter.chapterName;
      }
    }
    return response.data;
  } catch (err) {
    console.error("Lỗi tải dữ liệu:", err);
    error.value = true;
  }
};

const goToChapter = () => {
  const currentChapter = listChapters.value.find(ch => ch.chapter_name === selectedChapter.value);
  if (currentChapter) {
    const slugComic = router.currentRoute.value.params.comicSlug as string;

    const savedChapters = JSON.parse(localStorage.getItem('savedChapters') || '[]');
    const existingChapterIndex = savedChapters.findIndex((ch: any) => ch.slug === slugComic);
    if (existingChapterIndex >= 0) {
      savedChapters[existingChapterIndex].chapterName = currentChapter.chapter_name;
      savedChapters[existingChapterIndex].chapterApi = currentChapter.chapter_api_data;
    } else {
      savedChapters.push({
        slug: slugComic,
        name: comicName,
        image: `https://img.otruyenapi.com/uploads/comics/${slugComic}.jpg`,
        chapterName: currentChapter.chapter_name,
        chapterApi: currentChapter.chapter_api_data
      });
    }

    router.push({
      name: 'comic-detail',
      params: {
        comicSlug: slugComic,
        chapterName: currentChapter.chapter_name
      },
      query: {
        chapterApi: encodeURIComponent(currentChapter.chapter_api_data)
      }
    }).then(() => {
      localStorage.setItem('savedChapters', JSON.stringify(savedChapters));
      window.location.reload();
    });
  }
};



const goToPreviousChapter = () => {
  const currentIndex = listChapters.value.findIndex(ch => ch.chapter_name === chapter.value?.chapter_name);
  if (currentIndex > 0) {
    const previousChapter = listChapters.value[currentIndex - 1];
    selectedChapter.value = previousChapter.chapter_name;
    const slugComic = router.currentRoute.value.params.comicSlug as string;

    const savedChapters = JSON.parse(localStorage.getItem('savedChapters') || '[]');
    const existingChapterIndex = savedChapters.findIndex((ch: any) => ch.slug === slugComic);
    if (existingChapterIndex >= 0) {
      savedChapters[existingChapterIndex].chapterName = previousChapter.chapter_name;
      savedChapters[existingChapterIndex].chapterApi = previousChapter.chapter_api_data;
    } else {
      savedChapters.push({
        slug: slugComic,
        name: comicName,
        image: `https://img.otruyenapi.com/uploads/comics/${slugComic}.jpg`,
        chapterName: previousChapter.chapter_name,
        chapterApi: previousChapter.chapter_api_data
      });
    }

    router.push({
      name: 'comic-detail',
      params: {
        comicSlug: slugComic,
        chapterName: previousChapter.chapter_name
      },
      query: {
        chapterApi: encodeURIComponent(previousChapter.chapter_api_data)
      }
    }).then(() => {
      localStorage.setItem('savedChapters', JSON.stringify(savedChapters));
      window.location.reload();
    });
  }
};



const goToNextChapter = () => {
  const currentIndex = listChapters.value.findIndex(ch => ch.chapter_name === chapter.value?.chapter_name);
  if (currentIndex >= 0 && currentIndex < listChapters.value.length - 1) {
    const nextChapter = listChapters.value[currentIndex + 1];
    selectedChapter.value = nextChapter.chapter_name;
    const slugComic = router.currentRoute.value.params.comicSlug as string;

    const savedChapters = JSON.parse(localStorage.getItem('savedChapters') || '[]');
    const existingChapterIndex = savedChapters.findIndex((ch: any) => ch.slug === slugComic);
    if (existingChapterIndex >= 0) {
      savedChapters[existingChapterIndex].chapterName = nextChapter.chapter_name;
      savedChapters[existingChapterIndex].chapterApi = nextChapter.chapter_api_data;
    } else {
      savedChapters.push({
        slug: slugComic,
        name: comicName,
        image: `https://img.otruyenapi.com/uploads/comics/${slugComic}.jpg`,
        chapterName: nextChapter.chapter_name,
        chapterApi: nextChapter.chapter_api_data
      });
    }

    router.push({
      name: 'comic-detail',
      params: {
        comicSlug: slugComic,
        chapterName: nextChapter.chapter_name
      },
      query: {
        chapterApi: encodeURIComponent(nextChapter.chapter_api_data)
      }
    }).then(() => {
      localStorage.setItem('savedChapters', JSON.stringify(savedChapters));
      window.location.reload();
    });
  }
};


const goToListChapter = () => {
  router.push({
    name: 'chapter',
    params: {
      comicSlug: router.currentRoute.value.params.comicSlug
    }
  });
};

const goToHome = () => {
  router.push({
    name: 'comic',
  });
};


let lastScrollY = 0

onMounted(async () => {
  try {
    loading.value = true;
    const [listChapterResponse, chapterResponse] = await Promise.all([
      fetchListChapter(),
      fetchChapter(),
    ]);
    window.addEventListener('scroll', handleScroll);
  } catch (err) {
    console.error("Lỗi tải dữ liệu:", err);
    error.value = true;
  } finally {
    loading.value = false;
  }
});

watch([currentChapter, listChapters], () => {
  isFirstChapter.value = currentChapter.value === listChapters.value[0]?.chapter_name;
  isLastChapter.value = currentChapter.value === listChapters.value[listChapters.value.length - 1]?.chapter_name;
});

const handleScroll = () => {
  showControls.value = window.scrollY < lastScrollY;
  lastScrollY = window.scrollY;
};

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>



<style scoped>
.mx-auto {
  margin-left: auto;
  margin-right: auto;
}

.text-center {
  text-align: center;
}
.text-lg {
  font-size: 1.125rem;
}
.font-semibold {
  font-weight: 600;
}
.text-red-500 {
  color: #ef4444;
}

/* Title */
.text-2xl {
  font-size: 1.5rem;
}
.font-bold {
  font-weight: 700;
}
.m-4 {
  margin: 1rem;
}
.uppercase {
  text-transform: uppercase;
}
.text-orange-500 {
  color: #f97316;
}
.text-xl {
  font-size: 1.25rem;
}
.text-gray-500 {
  color: #6b7280;
}

.flex {
  display: flex;
  justify-content: space-between
}
.flex-col {
  flex-direction: column;
}
.items-center {
  align-items: center;
}
.mb-4 {
  margin-bottom: 1rem;
}

.w-full {
  width: 100%;
  max-width: 650px;
}
.object-cover {
  object-fit: cover;
}

.fixed {
  position: fixed;
  bottom: 1rem;
  left: 1rem;
  right: 1rem;
}
.bg-white {
  background-color: white;
}
.p-1 {
  padding: 0.25rem;
}
.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}
.px-5 {
  padding-left: 1.25rem;
  padding-right: 1.25rem;
}

.bg-blue-500 {
  background-color: #3b82f6;
}
.text-white {
  color: white;
}
.p-2 {
  padding: 0.5rem;
}
.rounded-lg {
  border-radius: 0.5rem;
}
.transition {
  transition: all 0.3s ease-in-out;
}
.bg-blue-500:hover {
  background-color: #2563eb;
}
.bg-gray-400 {
  background-color: #9ca3af;
}
.cursor-not-allowed {
  cursor: not-allowed;
}

/* Select */
.p-2 {
  padding: 0.5rem;
}
.border {
  border: 1px solid #d1d5db;
}
.rounded-lg {
  border-radius: 0.5rem;
}
.text-black {
  color: black;
}
.shadow-sm {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}
.focus\:outline-none:focus {
  outline: none;
}
.focus\:ring-2:focus {
  box-shadow: 0 0 0 2px #3b82f6;
}
.focus\:ring-blue-500:focus {
  box-shadow: 0 0 0 2px #3b82f6;
}

/* Comic detail */
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
