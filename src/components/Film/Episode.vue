<template>
  <video ref="videoPlayer" class="video-js vjs-default-skin" controls preload="auto"></video>

  <div v-if="film.length > 0" class="episode-container">
    <div v-for="(episode, index) in film" :key="index" class="episode-item">
      <button
          class="button"
          :class="{ active: episode.link_m3u8 === currentEpisode }"
          @click="playEpisode(episode.link_m3u8)"
      >
        Tập {{ episode.name }}
      </button>
    </div>
  </div>

  <div>
      <p style="padding: 20px 20px 10px 10px ; font-size: 20px; font-weight: 600;">List Watch Later</p>
      <div v-if="watchLaterMovies.length > 0" class="list-watch-later">
        <div v-for="(movie, index) in watchLaterMovies" :key="index" class="watch-later-item" @click="goToDetail(movie.slug)">
          <img :src="movie.poster_url" alt="Film Poster" class="film-poster" />
            {{ movie.name }}
        </div>
      </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

const router = useRouter();
const film = ref<any[]>([]);
const videoPlayer = ref<HTMLVideoElement | null>(null);
const currentEpisode = ref<string>("");
let player: any = null;

interface Movie {
  slug: string;
  name: string;
  poster_url: string;
}

const watchLaterMovies = ref<Movie[]>([]);

const fetchEpisode = async () => {
  try {
    const slug = router.currentRoute.value.params.episodeSlug as string;
    const response = await axios.get(`https://ophim1.com/phim/${slug}`);
    film.value = response.data.episodes[0]?.server_data ?? [];

    const savedEpisode = localStorage.getItem(`lastWatched_${slug}`);
    const lastEpisode = savedEpisode || film.value[0]?.link_m3u8;
    syncWatchLaterMovies();

    if (lastEpisode) {
      await playEpisode(lastEpisode);
    }
  } catch (error) {
    console.error("Error fetching episodes:", error);
  }
};

const goToDetail = (slug: string) => {
  router.push({
    name: "film-detail",
    params: { filmSlug: slug },
  });
};

const lockOrientation = async (orientation: "landscape" | "portrait") => {
  if ("orientation" in screen && (screen.orientation as any).lock) {
    try {
      await (screen.orientation as any).lock(orientation);
    } catch (error) {
      console.error("Không thể xoay màn hình:", error);
    }
  }
};

const unlockOrientation = () => {
  if ("orientation" in screen) {
    screen.orientation.unlock();
  }
};

const syncWatchLaterMovies = () => {
  const currentSlug = router.currentRoute.value.params.episodeSlug as string;

  try {
    const savedMovies = JSON.parse(localStorage.getItem("watchLater") || "[]") as Movie[];
    watchLaterMovies.value = savedMovies.filter((movie) => movie.slug !== currentSlug);
  } catch (error) {
    console.error("Lỗi khi đọc watchLater từ localStorage:", error);
    watchLaterMovies.value = [];
  }
};

const playEpisode = async (videoUrl: string) => {
  if (!videoUrl) return;

  currentEpisode.value = videoUrl;

  const slug = router.currentRoute.value.params.episodeSlug as string;
  localStorage.setItem(`lastWatched_${slug}`, videoUrl);

  await nextTick();

  if (player) {
    player.src({ src: videoUrl, type: "application/x-mpegURL" });
    player.play();
  } else if (videoPlayer.value) {
    player = videojs(videoPlayer.value, {
      autoplay: true,
      controls: true,
      fluid: true,
      sources: [{ src: videoUrl, type: "application/x-mpegURL" }],
    });

    player.on("fullscreenchange", () => {
      if (document.fullscreenElement) {
        lockOrientation("landscape");
      } else {
        unlockOrientation();
      }
    });
  }
};

onMounted(fetchEpisode);
</script>

<style scoped>
.episode-container {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  padding: 10px 0;
  gap: 10px;
  scrollbar-width: thin;
  scrollbar-color: #007bff transparent;
}

.episode-container::-webkit-scrollbar {
  height: 6px;
}

.episode-container::-webkit-scrollbar-thumb {
  background: #007bff;
  border-radius: 10px;
}

.episode-container::-webkit-scrollbar-track {
  background: transparent;
}

.episode-item {
  flex: 0 0 auto;
}

.button {
  height: 35px;
  width: 80px;
  border-radius: 5px;
  border: none;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  text-align: center;
  white-space: nowrap;
  transition: background 0.3s ease-in-out;
}

.button:hover {
  background-color: #0056b3;
}

.button.active {
  background-color: #ff6600;
}
.watch-later-item{
  display: flex;
  justify-content: start;
  padding: 10px;
  background-color: #f8f8f8;
  border-bottom: 2px solid #ddd;
  border-radius: 5px;
  margin: 10px;
}

.film-poster{
  width: 50px;
  height: 70px;
  object-fit: cover;
  margin-right: 12px;
  border-radius: 5px;
}
</style>
