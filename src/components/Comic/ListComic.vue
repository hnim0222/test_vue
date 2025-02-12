<template>
  <div>
    <!-- Danh sách yêu thích -->
    <h2 class="flex text-2xl font-semibold ml-2">
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bookmark-check"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z"/><path d="m9 10 2 2 4-4"/></svg>      Favourite
    </h2>
    <div class="favourite-list">
      <div
          v-for="comic in favouriteComics"
          :key="comic._id"
          class="comic-item"
          @click="goToListChapter(comic)"
      >
        <img :src="comic.image" :alt="comic.name" class="comic-poster" />
        <h3 class="comic-name">{{ comic.name }}</h3>
      </div>
    </div>

    <hr>
    <h2 class="flex text-2xl font-semibold p-2">Danh sách truyện</h2>
    <div class="comic-list">
      <div
          v-for="comic in comics"
          :key="comic._id"
          class="comic-item"
          @click="goToListChapter(comic)"
      >
        <img :src="comic.image" :alt="comic.name" class="comic-poster" />
        <h3 class="comic-name">{{ comic.name }}</h3>

        <!-- Nút yêu thích -->
        <button
            @click.stop="toggleFavourite(comic)"
            :class="{'favourite': isFavourite(comic)}"
            class="favourite-button"
        >
          {{ isFavourite(comic) ? 'Remove from Favourites' : 'Add to Favourites' }}
        </button>
      </div>
    </div>

    <button @click="nextPage" class="next-button" :disabled="loading">
      {{ loading ? "Loading..." : "Next Page" }}
    </button>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue';
import {useRouter} from 'vue-router';

const router = useRouter();
const comics = ref<any[]>([]);
const page = ref(1);
const loading = ref(false);
const favouriteComics = ref<any[]>([]);

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

const isFavourite = (comic: any) => {
  return favouriteComics.value.some((fave: any) => fave._id === comic._id);
};

const goToListChapter = (comic: any) => {
  const savedChapters = JSON.parse(localStorage.getItem('savedChapters') || '[]');
  const savedChapter = savedChapters.find((ch: any) => ch.slug === comic.slug);

  if (savedChapter) {
    router.push({
      name: 'comic-detail',
      params: {
        chapterApi: savedChapter.chapterApi,
        comicSlug: savedChapter.slug,
        chapterName: savedChapter.chapterName
      }
    });
  } else {
    router.push({ path: `/comic/${comic.slug}` });
  }
};


const nextPage = () => {
  page.value++;
  getComics();
};

onMounted(() => {
  getComics();
  getFavouriteComics();
});
</script>

<style scoped>
.favourite-list {
  display: flex;
  overflow-x: auto;
  margin-bottom: 20px;
  padding: 10px 0;
}

.favourite-list .comic-item {
  margin-right: 10px;
  cursor: pointer;
  min-width: 150px;
  text-align: center;
}

.favourite-list .comic-poster {
  width: 150px;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
}

.favourite-list .comic-name {
  margin-top: 10px;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Danh sách comics */
.comic-list {
  display: flex;
  flex-wrap: wrap;
}

.comic-item {
  margin: 10px;
  cursor: pointer;
}

.comic-poster {
  width: 150px;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
}

.comic-name {
  margin-top: 10px;
  font-weight: bold;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 150px;
}

.favourite-button {
  margin-top: 10px;
  padding: 5px;
  font-size: 12px;
  border: none;
  cursor: pointer;
  background-color: #ff9f00;
  color: white;
  border-radius: 5px;
}

.favourite-button:hover {
  background-color: #e68900;
}

.favourite-button.favourite {
  background-color: #007bff;
}

.next-button {
  display: block;
  margin: 20px auto;
  padding: 10px 20px;
  font-size: 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.next-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
