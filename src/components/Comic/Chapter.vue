<template>
  <!-- Comic Info Card -->
  <div class="comic-card">
    <div class="comic-header">
      <div class="comic-cover">
        <img :src="thumbnail" :alt="comicName" class="comic-thumbnail" v-img-error />
        <div class="chapter-badge" v-if="selectedChapterName">
          Đang đọc: Ch. {{ selectedChapterName }}
        </div>
      </div>
      <div class="comic-info">
        <h1 class="comic-title">{{ comicName }}</h1>
        <div class="meta-info">
          <div class="meta-item">
            <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span>{{ author }}</span>
          </div>
          <div class="meta-item" v-if="category.length > 0">
            <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
              <line x1="7" y1="7" x2="7.01" y2="7"></line>
            </svg>
            <div class="categories">
              <span v-for="(cat, index) in category" :key="index" class="category-tag">
                {{ cat }}
              </span>
            </div>
          </div>
          <div class="meta-item">
            <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span>{{ totalChapter }} chương</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="comic-description">
      <h3>Nội dung</h3>
      <p class="description-text">{{ content || 'Không có mô tả' }}</p>
    </div>

    <!-- Chapter List Modal -->
    <div v-if="showChapterModal" class="modal-overlay" @click.self="showChapterModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Danh sách Chương</h2>
          <button @click="showChapterModal = false" class="close-btn">&times;</button>
        </div>
        <div class="search-container">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Tìm kiếm chương..."
            class="search-input"
          />
        </div>
        <div class="chapter-list">
          <div 
            v-for="(chapter, index) in filteredChapters"
            :key="index"
            :ref="chapter.chapter_name === selectedChapterName ? 'activeChapter' : undefined"
            @click="goToChapterDetail(chapter.chapter_api_data, chapter.chapter_name)"
            :class="['chapter-item', { 'active': chapter.chapter_name === selectedChapterName }]"
          >
            <span>Chương {{ chapter.chapter_name }}</span>
            <span v-if="chapter.chapter_name === selectedChapterName" class="current-badge">Đang đọc</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Bottom Navigation -->
  <!-- Bottom Navigation -->
  <nav class="bottom-nav" v-if="!loading">
    <button @click="goBack" class="nav-btn" aria-label="Quay lại">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor">
        <path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5 5.5 5.5 0 0 1-5.5 5.5H11"/>
      </svg>
    </button>

    <button
        @click="selectedChapterName ? goToChapterDetail(selectedChapterApi, selectedChapterName) : goToChapterDetail(firstChapter.chapter_api_data, firstChapter.chapter_name)"
        class="nav-btn"
        aria-label="Đọc ngay"
        style="display: flex; flex-direction: row; justify-content: center; align-items: center;"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <polygon points="5 3 19 12 5 21 5 3"/>
      </svg>
      <span v-if="selectedChapterName">{{ selectedChapterName }}</span>
      <span v-else>0</span>
    </button>

    <button class="nav-btn" @click="showChapterModal = true" aria-label="Danh sách chương">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor">
        <path d="M15 12h-5"/><path d="M15 8h-5"/><path d="M19 17V5a2 2 0 0 0-2-2H4"/>
        <path d="M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3"/>
      </svg>
    </button>

    <button class="nav-btn" @click="toggleFavourite(dataForAdd)" aria-label="Yêu thích">
      <svg v-if="isFavourite(comicSlug)" width="24" height="24" fill="red" stroke="currentColor">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
      <svg v-else width="24" height="24" fill="none" stroke="currentColor">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    </button>
  </nav>

</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const searchQuery = ref("");
const router = useRouter();

const goBack = () => router.back();
const goHome = () => router.push('/comic');


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
const dataForAdd = ref<any>({});
const selectedChapterApi = ref('');

const firstChapter = computed(() => chapters.value.length > 0 ? chapters.value[0] : null);
const favouriteComics = ref<any[]>([]);
const activeChapter = ref<HTMLElement[]>([])

const filteredChapters = computed(() => {
  return chapters.value.filter(chapter =>
      chapter.chapter_name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const getFavouriteComics = () => {
  favouriteComics.value = JSON.parse(localStorage.getItem('favouriteComics') || '[]');
};

const isFavourite = (slug: any) => {
  return favouriteComics.value.some(fave => fave.slug === slug);
};

const focusSelectedChapter = () => {
  nextTick(() => {
    const index = filteredChapters.value.findIndex(chapter => chapter.chapter_name === selectedChapterName.value);
    if (index !== -1 && chapterRefs.value[index]) {
      chapterRefs.value[index].scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });
};

const toggleFavourite = (comic: any) => {
  if (!comic?._id) return;

  const comicToSave = {
    _id: comic._id,
    name: comic.name,
    slug: comic.slug || props.comicSlug,
    image: comic.image || thumbnail.value,
    updatedAt: comic.updatedAt || new Date().toISOString()
  };

  const index = favouriteComics.value.findIndex(fave => fave._id === comic._id);
  if (index === -1) {
    favouriteComics.value.push(comicToSave);
  } else {
    favouriteComics.value.splice(index, 1);
  }
  localStorage.setItem('favouriteComics', JSON.stringify(favouriteComics.value));
};



watch(filteredChapters, focusSelectedChapter, { immediate: true });

onMounted(async () => {
  try {
    const response = await axios.get(`https://otruyenapi.com/v1/api/truyen-tranh/${props.comicSlug}`);
    const data = response.data;
    
    // Safely access data with null checks
    if (data?.data?.item) {
      const item = data.data.item;
      dataForAdd.value = item;

      // Safely set values with fallbacks
      comicName.value = item.name || '';
      author.value = item.author?.[0] || 'Unknown';
      category.value = Array.isArray(item.category) 
        ? item.category.map((cat: any) => cat?.name || '').filter(Boolean)
        : [];
      content.value = data.data.seoOnPage?.descriptionHead || '';
      
      if (item.thumb_url) {
        thumbnail.value = `https://img.otruyenapi.com/uploads/comics/${item.thumb_url}`;
      }

      // Safely access chapters and server_data
      if (item.chapters?.[0]?.server_data) {
        const serverData = item.chapters[0].server_data;
        chapters.value = serverData;
        
        // Set totalChapter if serverData has items
        if (serverData.length > 0) {
          const lastChapter = serverData[serverData.length - 1];
          totalChapter.value = lastChapter.chapter_name || '1';
        }
      }
    }

    const savedChapters = JSON.parse(localStorage.getItem('savedChapters') || '[]');
    const savedChapter = savedChapters.find((ch: any) => ch.slug === props.comicSlug);
    if (savedChapter) {
      selectedChapterName.value = savedChapter.chapterName;
      selectedChapterApi.value = savedChapter.chapterApi;
    }
  } catch (error) {
    console.error("Error fetching chapters:", error);
  } finally {
    loading.value = false;
  }
});

watch(showChapterModal, async (visible) => {
  if (visible) {
    await nextTick()
    const el = activeChapter.value?.[0]
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }
})


onMounted(getFavouriteComics);

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
        name: comicName.value,
        image: thumbnail.value,
        chapterName,
        chapterApi
      });
    }
    localStorage.setItem('savedChapters', JSON.stringify(savedChapters));
  });
};
</script>

<style scoped>
:root {
  --primary: #4a6baf;
  --primary-hover: #3a5a9f;
  --text: #333;
  --text-light: #666;
  --border: #e0e0e0;
  --bg-light: #f8f9fa;
  --radius: 8px;
}

/* Layout */
.top-nav {
  position: sticky;
  top: 0;
  background: white;
  padding: 1rem;
  z-index: 100;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  text-align: center;
}

.top-nav .comic-title {
  margin: 0;
  font-size: 1.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.comic-card {
  max-width: 1200px;
  margin: 0 auto;
  padding-top: 1.5rem;
  background: white;
}

/* Bottom Navigation */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: #ffffff;
  border-top: 1px solid #e0e0e0;
  padding: 0.5rem 0.75rem;
  z-index: 1000;
  box-shadow: 0 -1px 10px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(10px);
}

.nav-btn {
  flex: 1;
  max-width: 80px;
  text-align: center;
  background: none;
  border: none;
  color: #444;
  font-size: 0.7rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 0.5rem;
  border-radius: 10px;
  transition: background 0.2s ease;
}

.nav-btn:hover {
  background: #f3f4f6;
}

.nav-btn svg {
  width: 22px;
  height: 22px;
  stroke: currentColor;
  stroke-width: 2;
  transition: stroke 0.2s;
}

.nav-btn.primary {
  background-color: #4a6baf;
  color: #ffffff;
  border-radius: 10px;
  padding: 8px 12px;
  font-weight: 500;
  max-width: none;
}

.nav-btn.primary:hover {
  background-color: #3a5a9f;
}

.nav-btn.primary svg {
  stroke: white;
  fill: white;
}

.nav-label {
  font-size: 0.65rem;
  font-weight: 500;
}


/* Make sure content isn't hidden behind the bottom nav */
.main-content {
  padding-bottom: 4rem;
}

/* Navigation Buttons */
.nav-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  color: white;
  border: none;
  border-radius: var(--radius);
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.2s;
}

.nav-text {
  display: none;
}

/* Comic Header */
.comic-header {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.comic-cover {
  max-width: 300px;
  margin: 0 auto;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.comic-thumbnail {
  width: 100%;
  height: auto;
  display: block;
}

.chapter-badge {
  background: rgba(0,0,0,0.7);
  color: white;
  padding: 0.5rem;
  text-align: center;
  font-size: 0.9rem;
}

.comic-info {
  text-align: center;
}

.comic-title {
  font-size: 1.75rem;
  margin: 0 0 1rem;
  color: var(--text);
}

.meta-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin: 1.5rem 0;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-light);
  justify-content: center;
  flex-wrap: wrap;
}

.meta-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.categories {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
}

.category-tag {
  background: var(--bg-light);
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.85rem;
}

/* Action Buttons */
.action-buttons {
  margin: 2rem 0;
  background-color: #3b82f6;
}

.button-row {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  flex-wrap: wrap;
}

.button-row .btn-primary {
  flex: 1;
  min-width: 200px;
}

.button-row .btn-icon {
  width: 48px;
  height: 48px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius);
}

.btn-primary {
  background: var(--primary);
  color: white;
  border: none;
  border-radius: var(--radius);
  padding: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  text-align: center;
}

.btn-primary:hover {
  background: var(--primary-hover);
}

.button-group {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn-icon {
  background: var(--bg-light);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 0.75rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-icon:hover {
  background: #e9ecef;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: var(--radius);
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border);}

.modal-header h2 {
  margin: 0;
  font-size: 1.25rem;
  color: var(--text);
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-light);
  padding: 0.25rem;
  line-height: 1;
}

.close-btn:hover {
  color: var(--text);
}

.search-input {
  width: 100%;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  font-size: 1rem;
  transition: border-color 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 2px rgba(74, 107, 175, 0.2);
}

.chapter-list {
  padding: 1rem 0;
  overflow-y: auto;
  flex-grow: 1;
}

.chapter-item {
  padding: 0.75rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: background 0.2s;
  border-left: 3px solid transparent;
}

.chapter-item:hover {
  background: var(--bg-light);
}

.chapter-item.active {
  background: rgba(74, 107, 175, 0.1);
  border-left-color: var(--primary);
  font-weight: 500;
}

.current-badge {
  background: var(--primary);
  color: white;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  font-weight: 500;
}

/* Comic Description */
.comic-description {
  background: var(--bg-light);
  border-radius: var(--radius);
  padding: 1.5rem;
  margin: 1.5rem 0;
}

.comic-description h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: var(--text);
  font-size: 1.25rem;
}

.description-text {
  margin: 0;
  line-height: 1.6;
  color: var(--text-light);
}

/* Responsive Design */
@media (min-width: 768px) {
  .comic-header {
    flex-direction: row;
    align-items: flex-start;
    text-align: left;
  }
  
  .comic-cover {
    margin: 0;
    flex: 0 0 250px;
  }
  
  .comic-info {
    text-align: left;
    padding-left: 2rem;
  }
  
  .meta-item {
    justify-content: flex-start;
  }
  
  .categories {
    justify-content: flex-start;
  }
  
  .action-buttons {
    flex-direction: row;
    align-items: center;
  }
  
  .button-group {
    margin-left: auto;
  }
  
  .nav-text {
    display: inline;
  }
}

/* Loading State */
.loading-state {
  text-align: center;
  padding: 2rem;
  color: var(--text-light);
}

/* Remove old styles */
.comic-chapter {
  padding: 20px;
}


button {
  padding: 8px 12px;
  margin: 10px;
  background-color: #007bff;
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
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 10px;
}

.list-icon {
  padding: 8px 12px;
  margin: 10px;
  background-color: #007bff;
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
  border: 1px solid #ddd;
  border-radius: 5px;
  margin: 20px 10px 10px 10px;
}
.bottom-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.3s ease-in-out;
}

.nav-btn:hover {
  background-color: #0056b3;
}

.nav-btn svg {
  stroke: white;
}


</style>
