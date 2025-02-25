<template>
  <div>
    <div v-if="loading">Loading...</div>
    <div v-else>
      <div class="movie-list">
        <div v-for="(movie, index) in movies" :key="index" class="movie-card" @click="goToDetail(movie.slug)">
          <img :src="movie.poster_url" :alt="movie.name" class="movie-poster" />
          <h3 class="movie-title">{{ movie.name }}</h3>
        </div>
      </div>

      <!-- Pagination Buttons -->
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

const fetchMoviesData = async () => {
  loading.value = true;
  try {
    const response = await fetch(`https://ophim1.com/danh-sach/phim-moi-cap-nhat?page=${page.value}`);
    const data = await response.json();
    if (data.status && data.items) {
      movies.value = data.items.map((movie: any) => ({
        name: movie.name,
        slug: movie.slug,
        poster_url: 'https://img.ophim.live/uploads/movie/' + movie.poster_url,
      }));
    }
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu phim:", error);
  } finally {
    loading.value = false;
  }
};

const goToDetail = (slug: string) => {
  router.push({
    name: 'film-detail',
    params: { filmSlug: slug }
  });
};

const nextPage = () => {
  page.value++;
};
const prevPage = () => {
  if (page.value > 1) page.value--;
};

watch(page, fetchMoviesData);

onMounted(fetchMoviesData);
</script>

<style scoped>
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
