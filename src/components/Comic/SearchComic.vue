<template>
  <div style="padding: 10px;">
    <h1 class="search-title">{{ titlePage }}</h1>
    <p>{{ title }}</p>
    <p>{{ description }}</p>

    <p class="search-result-text">Kết quả tìm kiếm cho "{{ searchKeyword }}"</p>

    <div v-if="searchResults.length > 0" class="search-results">
      <div v-for="comic in searchResults" :key="comic.slug" class="comic-item" @click="goToListChapter(comic)">
        <img :src="comic.image1" :alt="comic.name" class="comic-poster" />
        <h3 class="comic-name">{{ comic.name }}</h3>

        <button
            @click.stop="toggleFavourite(comic)"
            :class="{ 'favourite': isFavourite(comic) }"
            class="favourite-button"
        >
          {{ isFavourite(comic) ? '❤️ Bỏ yêu thích' : '🤍 Thêm vào yêu thích' }}
        </button>
      </div>
    </div>

    <p v-else class="no-results">Không tìm thấy kết quả.</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

const route = useRoute();
const router = useRouter();

const searchKeyword = ref(route.params.searchKeyword as string);
const searchResults = ref<any[]>([]);

const title = ref('');
const description = ref('');
const titlePage = ref('');

const favouriteComics = ref<any[]>([]);

const fetchSearchResults = async () => {
  if (!searchKeyword.value.trim()) return;

  try {
    const response = await axios.get("https://otruyenapi.com/v1/api/tim-kiem", {
      params: { keyword: searchKeyword.value },
    });

    const data = response.data;

    titlePage.value = data.titlePage || "";
    title.value = data.seoOnPage?.titleHead || "";
    description.value = data.seoOnPage?.descriptionHead || "";

    searchResults.value = data.data?.items?.map((comic: any) => ({
      ...comic,
      image: `https://img.otruyenapi.com/uploads/comics/${comic.thumb_url}`
    })) || [];

  } catch (error) {
    console.error("Lỗi khi tải kết quả tìm kiếm:", error);
  }
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

const getFavouriteComics = () => {
  favouriteComics.value = JSON.parse(localStorage.getItem('favouriteComics') || '[]');
};

const toggleFavourite = (comic: any) => {
  let savedFavourites = JSON.parse(localStorage.getItem('favouriteComics') || '[]');

  const index = savedFavourites.findIndex((fave: any) => fave.slug === comic.slug);

  if (index === -1) {
    savedFavourites.push(comic);
  } else {
    savedFavourites.splice(index, 1);
  }

  localStorage.setItem('favouriteComics', JSON.stringify(savedFavourites));

  favouriteComics.value = [...savedFavourites];
};


const isFavourite = (comic: any) => {
  return favouriteComics.value.some((fave: any) => fave.slug === comic.slug);
};

onMounted(() => {
  fetchSearchResults();
  getFavouriteComics();
});

watch(() => route.params.searchKeyword, (newKeyword) => {
  searchKeyword.value = newKeyword as string;
  fetchSearchResults();
});
</script>

<style scoped>
.search-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 10px;
}

.search-result-text {
  font-size: 20px;
  font-weight: 600;
  padding-top: 20px;
}

.search-results {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding: 10px 0;
}

.comic-item {
  width: 150px;
  text-align: center;
  cursor: pointer;
  position: relative;
}

.comic-poster {
  width: 150px;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  transition: transform 0.2s ease-in-out;
}

.comic-poster:hover {
  transform: scale(1.05);
}

.comic-name {
  margin-top: 10px;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.favourite-button {
  margin-top: 5px;
  padding: 5px 10px;
  border: none;
  cursor: pointer;
  font-size: 12px;
  border-radius: 5px;
  transition: background 0.3s ease-in-out;
}

.favourite {
  background: red;
  color: white;
}

.favourite-button:not(.favourite) {
  background: lightgray;
}

.no-results {
  font-size: 1.2rem;
  color: #777;
  margin-top: 20px;
}
</style>
