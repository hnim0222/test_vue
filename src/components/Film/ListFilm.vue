<template>
  <div>
    <div v-if="loading">Loading...</div>
    <div v-else>
      <div v-if="watchLaterMovies.length > 0" class="watch-later-container">
        <h2>📌 Danh sách Xem Sau</h2>
        <div class="watch-later-list">
          <div v-for="(movie, index) in watchLaterMovies" :key="index" class="watch-later-card">
            <div @click="goToDetail(movie.slug)">
              <img :src="movie.poster_url" :alt="movie.name" class="watch-later-poster" />
              <h4 class="watch-later-title" >{{ movie.name }}</h4>
            </div>
            <button class="remove-btn" @click="removeFromWatchLater(movie.slug)">❌</button>
          </div>
        </div>
      </div>

      <div class="movie-list">
        <div v-for="(movie, index) in movies" :key="index" class="movie-card">
          <img
              :src="movie.poster_url"
              :alt="movie.name"
              class="movie-poster"
              @click="goToDetail(movie.slug)"
          />
          <div style="display: flex; justify-content: space-between">
            <h3 class="movie-title" @click="goToDetail(movie.slug)" style="margin-right: 10px;">
              {{ movie.name }}
            </h3>
            <button class="watch-later-btn" @click="addToWatchLater(movie)" style="margin-top: 4px;">
              {{ isWatchLater(movie.slug) ? "✅" : "📌" }}
            </button>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div class="pagination">
        <button @click="prevPage" :disabled="page <= 1">Previous</button>
        <span>Page {{ page }}</span>
        <button @click="nextPage">Next</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const movies = ref<any[]>([]);
const loading = ref(true);
const page = ref(1);
const watchLaterMovies = ref<any[]>([]);

const fetchMoviesData = async () => {
  loading.value = true;
  try {
    const response = await fetch(
        `https://ophim1.com/danh-sach/phim-moi-cap-nhat?page=${page.value}`
    );
    const data = await response.json();
    if (data.status && data.items) {
      movies.value = data.items.map((movie: any) => ({
        name: movie.name,
        slug: movie.slug,
        poster_url: "https://img.ophim.live/uploads/movies/" + movie.poster_url,
      }));
      syncWatchLaterMovies();
    }
  } catch (error) {
    console.error("❌ Lỗi khi lấy dữ liệu phim:", error);
  } finally {
    loading.value = false;
  }
};

const syncWatchLaterMovies = () => {
  watchLaterMovies.value = JSON.parse(localStorage.getItem("watchLater") || "[]");
};


const isWatchLater = (slug: string) => {
  return watchLaterMovies.value.some((movie) => movie.slug === slug);
};

const addToWatchLater = (movie: any) => {
  if (!isWatchLater(movie.slug)) {
    watchLaterMovies.value.push({
      slug: movie.slug,
      name: movie.name,
      poster_url: movie.poster_url,
    });
    localStorage.setItem("watchLater", JSON.stringify(watchLaterMovies.value));
  }
};

const removeFromWatchLater = (slug: string) => {
  watchLaterMovies.value = watchLaterMovies.value.filter(movie => movie.slug !== slug);
  localStorage.setItem("watchLater", JSON.stringify(watchLaterMovies.value));
};

const goToDetail = (slug: string) => {
  router.push({
    name: "film-detail",
    params: { filmSlug: slug },
  });
};

const nextPage = () => {
  page.value++;
};
const prevPage = () => {
  if (page.value > 1) page.value--;
};

watch(page, fetchMoviesData);

onMounted(() => {
  fetchMoviesData();
  syncWatchLaterMovies();
});
</script>


<style scoped>
.watch-later-container {
  padding: 20px;
  background: #f8f8f8;
  border-bottom: 2px solid #ddd;
}

.watch-later-container h2 {
  text-align: center;
  margin-bottom: 10px;
}

.watch-later-list {
  display: flex;
  overflow-x: auto;
  gap: 15px;
  padding: 10px;
}

.watch-later-card {
  position: relative;
  flex: 0 0 auto;
  width: 120px;
  text-align: center;
}

.watch-later-poster {
  width: 100%;
  border-radius: 5px;
}

.watch-later-title {
  font-size: 14px;
  margin-top: 5px;
}

.remove-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  background: red;
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  cursor: pointer;
}

/* Danh sách phim chính */
.movie-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  padding: 20px;
}

.movie-card {
  cursor: pointer;
  text-align: center;
  transition: transform 0.2s;
}

.movie-card:hover {
  transform: scale(1.05);
}

.movie-poster {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

.movie-title {
  font-size: 18px;
  margin-top: 10px;
  font-weight: bold;
  cursor: pointer;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
  gap: 10px;
}

.pagination button {
  padding: 10px 15px;
  font-size: 16px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  transition: background 0.3s;
}

.pagination button:disabled {
  background-color: gray;
  cursor: not-allowed;
}

.pagination button:hover:not(:disabled) {
  background-color: #0056b3;
}
</style>
