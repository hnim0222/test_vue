<template>
  <div class="comic-app">
    <!-- Search Bar -->
    <div class="search-container">
      <div class="search-box">
        <input
          v-model="search"
          type="text"
          placeholder="Tìm kiếm truyện..."
          class="search-input"
          @keyup.enter="goToSearchComic"
        />
        <button @click="goToSearchComic" class="search-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search-icon lucide-search"><path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/></svg>
        </button>
      </div>
    </div>

    <!-- Favorites Section -->
    <section v-if="favouriteComics.length > 0" class="section">
      <div class="section-header">
        <h2 class="section-title">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="red" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart-icon lucide-heart"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>          Yêu thích
        </h2>
      </div>
      <div class="comic-grid">
        <div v-for="comic in favouriteComics" :key="'fav-'+comic._id" class="comic-card">
          <div class="comic-poster-container" @click="goToListChapter(comic)">
            <img :src="comic.image" :alt="comic.name" class="comic-poster" />
            <div class="comic-overlay">
              <button class="read-button">Đọc tiếp</button>
            </div>
            <div class="favourite-badge" @click.stop="toggleFavourite(comic)">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eraser-icon lucide-eraser"><path d="M21 21H8a2 2 0 0 1-1.42-.587l-3.994-3.999a2 2 0 0 1 0-2.828l10-10a2 2 0 0 1 2.829 0l5.999 6a2 2 0 0 1 0 2.828L12.834 21"/><path d="m5.082 11.09 8.828 8.828"/></svg>            </div>
          </div>
          <h3 class="comic-title">{{ comic.name }}</h3>
        </div>
      </div>
    </section>

    <!-- Recently Read Section -->
    <section v-if="historyComics.length > 0" class="section">
      <div class="section-header">
        <h2 class="section-title">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-history-icon lucide-history"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>
          Truyện vừa đọc
        </h2>
      </div>
      <div class="comic-grid">
        <div v-for="comic in historyComics" :key="'history-'+comic._id" class="comic-card">
          <div class="comic-poster-container" @click="goToLastRead(comic)">
            <img :src="comic.image" :alt="comic.name" class="comic-poster" />
            <div class="comic-overlay">
              <button class="read-button">Tiếp tục</button>
            </div>
            <div class="chapter-badge">
              {{ comic.chapterName || 'Chương mới' }}
            </div>
            <button class="delete-button" @click.stop="removeFromHistory(comic)" title="Xoá khỏi lịch sử">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eraser-icon lucide-eraser"><path d="M21 21H8a2 2 0 0 1-1.42-.587l-3.994-3.999a2 2 0 0 1 0-2.828l10-10a2 2 0 0 1 2.829 0l5.999 6a2 2 0 0 1 0 2.828L12.834 21"/><path d="m5.082 11.09 8.828 8.828"/></svg>
            </button>
          </div>
          <div class="comic-title-container">
            <h3 class="comic-title">{{ comic.name }}</h3>
          </div>
        </div>
      </div>
    </section>

    <!-- All Comics Section -->
    <section class="section">
      <div class="section-header">
        <h2 class="section-title">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-library-big-icon lucide-library-big"><rect width="8" height="18" x="3" y="3" rx="1"/><path d="M7 3v18"/><path d="M20.4 18.9c.2.5-.1 1.1-.6 1.3l-1.9.7c-.5.2-1.1-.1-1.3-.6L11.1 5.1c-.2-.5.1-1.1.6-1.3l1.9-.7c.5-.2 1.1.1 1.3.6Z"/></svg>
          Danh sách truyện
        </h2>
        <div class="view-options">
          <button class="view-option" :class="{ active: viewMode === 'grid' }" @click="viewMode = 'grid'">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-grid3x3-icon lucide-grid-3x3"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/><path d="M9 3v18"/><path d="M15 3v18"/></svg>
          </button>
          <button class="view-option" :class="{ active: viewMode === 'list' }" @click="viewMode = 'list'">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-rows4-icon lucide-rows-4"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M21 7.5H3"/><path d="M21 12H3"/><path d="M21 16.5H3"/></svg>
          </button>
        </div>
      </div>

      <div :class="['comic-grid', { 'list-view': viewMode === 'list' }]">
        <div v-for="comic in comics" :key="comic._id" @click="goToListChapter(comic)" class="comic-card" :class="{ 'list-item': viewMode === 'list' }">
          <div class="comic-poster-container">
            <img :src="comic.image" :alt="comic.name" class="comic-poster" />
          </div>
          <div class="comic-info">
            <h3 class="comic-title">{{ comic.name }}</h3>
          </div>
        </div>
      </div>

      <div class="load-more">
        <button
          @click="nextPage"
          class="load-more-button"
          :disabled="loading"
        >
          <span v-if="!loading">Xem thêm</span>
          <span v-else class="loading-spinner"></span>
        </button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const comics = ref<any[]>([]);
const page = ref(1);
const loading = ref(false);
const favouriteComics = ref<any[]>([]);
const search = ref("");
const viewMode = ref<'grid' | 'list'>('grid');
const historyComics = ref<any[]>([]);

const getComics = async () => {
  if (loading.value) return;
  loading.value = true;

  try {
    const response = await fetch(`https://otruyenapi.com/v1/api/danh-sach/dang-phat-hanh?page=${page.value}`);
    const data = await response.json();

    if (data.data?.items) {
      comics.value.push(
          ...data.data.items.map((comic: any) => ({
            ...comic,
            image: `https://img.otruyenapi.com/uploads/comics/${comic.thumb_url}`
          }))
      );
    }
  } catch (error) {
    console.error('Error fetching comics:', error);
  } finally {
    loading.value = false;
  }
};

const getFavouriteComics = () => {
  favouriteComics.value = JSON.parse(localStorage.getItem('favouriteComics') || '[]');
};

const toggleFavourite = (comic: any) => {
  const savedFavourites = JSON.parse(localStorage.getItem('favouriteComics') || '[]');
  const index = savedFavourites.findIndex((fave: any) => fave._id === comic._id);

  if (index === -1) {
    savedFavourites.push(comic);
  } else {
    savedFavourites.splice(index, 1);
  }

  localStorage.setItem('favouriteComics', JSON.stringify(savedFavourites));
  getFavouriteComics();
};

const getHistoryComics = () => {
  const savedChapters = JSON.parse(localStorage.getItem('savedChapters') || '[]');
  console.log('Saved chapters:', savedChapters);
  
  // Get unique comics by slug, keeping the most recent entry for each comic
  const uniqueComics = [];
  const seen = new Set();
  
  // Process in reverse to get the most recent chapters first
  const reversedChapters = [...savedChapters].reverse();
  
  for (const chapter of reversedChapters) {
    if (!chapter.slug) continue; // Skip invalid entries
    
    if (!seen.has(chapter.slug)) {
      seen.add(chapter.slug);
      
      // Use existing image if available, otherwise try to construct from thumb_url
      const image = chapter.image || 
                   (chapter.thumb_url ? `https://img.otruyenapi.com/uploads/comics/${chapter.thumb_url}` : 'default.jpg');
      
      uniqueComics.push({
        ...chapter,
        image: image,
        name: chapter.name || 'Không có tiêu đề',
        chapterName: chapter.chapterName || 'Chương mới nhất'
      });
    }
    
    // Stop if we have enough comics
    if (uniqueComics.length >= 5) break;
  }
  
  console.log('Processed history comics:', uniqueComics);
  historyComics.value = uniqueComics;
};

const isFavourite = (comic: any) => {
  return favouriteComics.value.some((fave: any) => fave._id === comic._id);
};

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.src = '/comic-book.jpg'; // Using the default image from public folder
  img.onerror = null; // Prevent infinite loop if the default image also fails to load
};

const goToListChapter = (comic: any) => {
  const savedChapters = JSON.parse(localStorage.getItem('savedChapters') || '[]');
  const savedChapter = savedChapters.find((ch: any) => ch.slug === comic.slug);

  if (savedChapter) {
    router.push({
      name: 'comic-detail',
      params: {
        comicSlug: savedChapter.slug,
        chapterName: savedChapter.chapterName
      },
      query: {
        chapterApi: savedChapter.chapterApi
      }
    });
  } else {
    router.push({ path: `/comic/${comic.slug}` });
  }
};

const goToSearchComic = () => {
  if (!search.value.trim()) return;
  router.push({
    name: 'comic-search',
    params: { searchKeyword: search.value }
  });
};

const goToLastRead = (comic: any) => {
  router.push({
    name: 'comic-detail',
    params: {
      comicSlug: comic.slug,
      chapterName: comic.chapterName || '1'
    },
    query: {
      chapterApi: comic.chapterApi
    }
  });
};

const nextPage = () => {
  page.value += 1;
  getComics();
};

const removeFromHistory = (comic: any) => {
  if (!comic?.slug) return;
  
  if (confirm(`Bạn có chắc muốn xoá "${comic.name}" khỏi lịch sử đọc?`)) {
    const savedChapters = JSON.parse(localStorage.getItem('savedChapters') || '[]');
    
    // Filter out all entries with the same slug
    const updatedChapters = savedChapters.filter((ch: any) => ch.slug !== comic.slug);
    
    // Save back to localStorage
    localStorage.setItem('savedChapters', JSON.stringify(updatedChapters));
    
    // Update the UI
    historyComics.value = historyComics.value.filter(c => c.slug !== comic.slug);
  }
};

onMounted(() => {
  getComics();
  getFavouriteComics();
  getHistoryComics();
});
</script>

<style scoped>
/* Base Styles */
:root {
  --primary-color: #4a6cf7;
  --secondary-color: #6c757d;
  --background-color: #f8f9fa;
  --card-bg: #ffffff;
  --text-color: #333333;
  --text-muted: #6c757d;
  --border-radius: 8px;
  --box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  --transition: all 0.3s ease;
  --min-tap-target: 44px; /* Minimum touch target size for better touch interaction */
}

.comic-app {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: var(--text-color);
}

/* Search Bar */
.search-container {
  margin: 1.5rem 0;
  padding: 0 0.5rem;
}

.search-box {
  display: flex;
  max-width: 600px;
  margin: 0 auto;
  box-shadow: 0 0 0 3px rgba(74, 108, 247, 0.2);
  border-radius: 30px;
  overflow: hidden;
  transition: var(--transition);
}

.search-input {
  flex: 1;
  padding: 0.8rem 1.2rem;
  border: none;
  font-size: 1rem;
  outline: none;
  background-color: white;
}

.search-button {
  padding: 0 1.5rem;
  background-color: #3a5bd9;
  color: white;
  border: none;
  cursor: pointer;
  transition: var(--transition);
}

/* Sections */
.section {
  margin: 2.5rem 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.2rem;
  padding: 0 0.5rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-color);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.section-title i {
  color: var(--primary-color);
}

/* View Options */
.view-options {
  display: flex;
  gap: 0.5rem;
  background: #f1f3f5;
  padding: 0.25rem;
  border-radius: 6px;
}

.view-option {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 4px;
  color: var(--text-muted);
  cursor: pointer;
  transition: var(--transition);
}

.view-option.active {
  background: white;
  color: var(--primary-color);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* Comic Grid */
.comic-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 1.5rem;
  padding: 0.5rem;
}

.comic-card {
  background: var(--card-bg);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: var(--box-shadow);
  transition: var(--transition);
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.comic-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.comic-poster-container {
  position: relative;
  padding-top: 140%;
  overflow: hidden;
  background: #f5f5f5;
  border-radius: 8px;
}

.comic-poster {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: var(--transition);
  border-radius: 8px;
}

.comic-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: var(--transition);
  gap: 0.5rem;
  padding: 1rem;
}

.comic-card:hover .comic-overlay {
  opacity: 1;
}

.read-button {
  padding: 0.5rem 1rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  white-space: nowrap;
}

.read-button:hover {
  background: #3a5bd9;
  transform: translateY(-2px);
}

/* Delete button for history items */
.delete-button {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition);
  opacity: 1;
  transform: scale(0.8);
  z-index: 2;
}

.favourite-button {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  border-radius: 20%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  transition: all 0.2s ease;
  z-index: 2;
  opacity: 0.9;
}

.favourite-button.is-favourite {
  color: #ff4757;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

@media (hover: hover) {
  .favourite-button:hover {
    transform: scale(1.1);
    background: rgba(255, 255, 255, 0.2);
  }
  
  .favourite-button.is-favourite:hover {
    background: rgba(255, 255, 255, 0.95);
  }
}

.favourite-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ff4757;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  z-index: 2;
}

.chapter-badge {
  position: absolute;
  bottom: 0.5rem;
  left: 0.5rem;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  z-index: 2;
}

.comic-info {
  padding: 0.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}



.comic-title {
  font-size: 0.95rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.3;
  min-height: 2.6em;
  padding: 2px;
}

.comic-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  color: var(--text-muted);
}

.comic-update {
  font-size: 0.75rem;
  color: #28a745;
  font-weight: 500;
}

.comic-rating {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #ffc107;
  font-weight: 600;
}

/* List View */
.comic-grid.list-view {
  grid-template-columns: 1fr;
  gap: 1rem;
}

.comic-card.list-item {
  flex-direction: row;
  height: auto;
  max-height: 150px;
  overflow: hidden;
}

.comic-card.list-item .comic-poster-container {
  width: 100px;
  padding-top: 0;
  height: 150px;
  flex-shrink: 0;
  border-radius: 8px;
}

.comic-card.list-item .comic-info {
  padding: 1rem;
}

.comic-card.list-item .comic-title {
  -webkit-line-clamp: 2;
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.comic-card.list-item .comic-meta {
  margin-top: auto;
}

/* Load More Button */
.load-more {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

.load-more-button {
  padding: 0.75rem 2rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 150px;
  justify-content: center;
}

.load-more-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

</style>
