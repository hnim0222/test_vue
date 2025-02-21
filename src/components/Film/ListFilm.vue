<template>
  <div>
    <div v-if="loading">Loading...</div>
    <div v-else>
      <!-- Loop through the list of movies -->
      <div v-for="(movieData, index) in movies" :key="index" class="movie-details">
        <div class="movie-content">
          <!-- Left Side: Poster -->
          <div class="movie-poster">
            <img :src="movieData.movie.poster_url" alt="Movie Poster" />
          </div>

          <!-- Right Side: Movie Information -->
          <div class="movie-info">
            <h2>{{ movieData.movie.name }}</h2>
            <p><strong>Year:</strong> {{ movieData.movie.year }}</p>
            <p><strong>Categories:</strong>
              <span v-for="(category, index) in movieData.movie.category" :key="category.id">
                {{ category.name }}<span v-if="index !== movieData.movie.category.length - 1">, </span>
              </span>
            </p>
            <p><strong>Country:</strong> {{ movieData.movie.country[0].name }}</p>

            <!-- Render description and toggle it -->
            <p v-html="movieData.showFullDescription ? movieData.movie.content : truncatedDescription(movieData.movie.content)"></p>

            <!-- Show/Hide text link -->
            <span v-if="movieData.movie.content.length > 200" @click="toggleDescription(movieData)">
              {{ movieData.showFullDescription ? 'Show Less' : 'Read More' }}
            </span>

            <!-- Link to episode -->
            <a :href="movieData.episode.link_embed" target="_blank">Watch Now</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const movieUrls = [
  "http://ophim1.com/phim/lupin-de-tam-tham-tu-conan",
  "https://ophim1.com/phim/tham-tu-lung-danh-conan-con-ac-mong-den-toi",
  "http://ophim1.com/phim/dich-nhan-kiet-thong-thien-huyen-an",
  "http://ophim1.com/phim/sieu-nhen-tai-xuat-2-nguoi-nhen-sieu-dang-2-su-troi-day-cua-nguoi-dien",
  "https://ophim1.com/phim/dai-uy-marvel",
  "https://ophim1.com/phim/lat-mat-6-tam-ve-dinh-menh"
];

const movies = ref<any[]>([]);
const loading = ref(true);

// Function to fetch movie data from each URL
const fetchMoviesData = async () => {
  const movieDataPromises = movieUrls.map(async (url) => {
    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.status) {
        return {
          movie: data.movie,
          episode: data.episodes[0].server_data[0], // Get the first episode's data
          showFullDescription: false, // Initially, description is truncated
        };
      }
    } catch (error) {
      console.error("Error fetching data for", url, error);
    }
  });

  const result = await Promise.all(movieDataPromises);
  movies.value = result.filter((data) => data !== undefined); // Filter out failed requests
  loading.value = false;
};

// Fetch movie data when the component is mounted
onMounted(() => {
  fetchMoviesData();
});

// Truncate text if it exceeds a certain length
const truncatedDescription = (text: string) => {
  return text.length > 200 ? text.substring(0, 200) + "..." : text;
};

// Toggle the description visibility
const toggleDescription = (movieData: any) => {
  movieData.showFullDescription = !movieData.showFullDescription;
};
</script>

<style scoped>
.movie-details {
  display: flex;
  justify-content: space-between;
  margin: 20px;
}

.movie-content {
  display: flex;
  gap: 20px;
}

.movie-poster img {
  width: 300px; /* Adjust width for the poster */
  height: auto;
  border-radius: 8px;
}

.movie-info {
  flex: 1;
}

.movie-info h2 {
  font-size: 24px;
  margin-bottom: 10px;
}

.movie-info p {
  font-size: 16px;
  line-height: 1.6;
}

.movie-info a {
  display: inline-block;
  margin-top: 10px;
  padding: 10px 15px;
  background-color: #007BFF;
  color: white;
  text-decoration: none;
  border-radius: 5px;
}

.movie-info a:hover {
  background-color: #0056b3;
}

span {
  color: #007BFF;
  cursor: pointer;
  text-decoration: underline;
}

span:hover {
  color: #0056b3;
}
</style>
