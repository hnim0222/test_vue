<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from "axios";

interface Movie {
  poster_url1?: string;
  name: string;
  content: string;
  country: { name: string }[];
  director: string[];
  actor: string[];
}

const router = useRouter();
let poster = ref('');
let content = ref('');
const film = ref<Movie | null>(null);
let filmName = ref('');
let director = ref('');
let country = ref('');
let actor = ref<string[]>([]);
const status = ref('');

const goToEpisode = () => {
  const slug = router.currentRoute.value.params.filmSlug;

  router.push({
    name: 'espisode',
    params: { espisodeSlug: slug },
  });
};

onMounted(async () => {
  const slug = router.currentRoute.value.params.filmSlug;
  try {
    const response = await axios.get(`https://ophim1.com/phim/${slug}`);
    film.value = response.data.movie;
    poster.value = response.data.movie.poster_url;
    filmName.value = response.data.movie.name || 'Unknown Title';
    content.value = response.data.movie.content || '';
    country.value = response.data.movie.country?.[0]?.name || 'Unknown Country';
    director.value = response.data.movie.director?.[0] || 'Unknown Director';
    actor.value = response.data.movie.actor || [];
    status.value = response.data.movie.status;
  } catch (error) {
    console.error('Error fetching film data:', error);
  }
});
</script>

<template>
  <div class="film-container">
    <h1 class="film-title">{{ filmName }}</h1>
    <img :src="poster" alt="Film Poster" class="film-poster" />
    <div class="film-content" v-html="content"></div>
    <p v-if="country" class="film-detail">Xuất xứ: {{ country }}</p>
    <p v-if="director !== ''" class="film-detail">Đạo diễn: {{ director }}</p>
    <p v-if="actor.length > 0" class="film-detail">Diễn viên: {{ actor.join(', ') }}</p>
  </div>
  <div
      class="watch"
      @click="status !== 'trailer' && goToEpisode()"
      :class="{ disabled: status === 'trailer' }"
  >
    Watch now
  </div>
</template>

<style scoped>
.film-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.film-title {
  font-size: 1.5rem;
  color: #333;
  text-align: center;
  margin-bottom: 20px;
  font-weight: 600;
}

.film-poster {
  display: block;
  max-width: 100%;
  height: auto;
  margin: 0 auto 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.film-content {
  font-size: 1rem;
  line-height: 1.5;
  color: #555;
  margin-bottom: 20px;
}

.film-detail {
  font-size: 1.1rem;
  color: #444;
  margin: 5px 0;
}

.film-actors {
  margin-top: 10px;
}

.watch {
  display: inline-block;
  padding: 10px 20px;
  margin-top: 20px;
  margin-left: 20px;
  background-color: #007bff;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
  transition: background-color 0.3s;
}

.watch:hover {
  background-color: #0056b3;
}
</style>