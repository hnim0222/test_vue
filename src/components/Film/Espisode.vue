<template>
  <video ref="videoPlayer" class="video-js vjs-default-skin" controls preload="auto"></video>

  <div v-if="film.length > 0" class="episode-container">
    <div v-for="(episode, index) in film" :key="index" class="episode-item">
      <button class="button" @click="playEpisode(episode.link_m3u8)">
        Tập {{ episode.name }}
      </button>
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
let player: any = null;

const fetchEpisode = async () => {
  try {
    const slug = router.currentRoute.value.params.espisodeSlug;
    const response = await axios.get(`https://ophim1.com/phim/${slug}`);
    film.value = response.data.episodes[0]?.server_data ?? [];

    // Lấy tập đã lưu trong localStorage
    const savedEpisode = localStorage.getItem(`lastWatched_${slug}`);
    const lastEpisode = savedEpisode || film.value[0]?.link_m3u8;

    if (lastEpisode) {
      playEpisode(lastEpisode);
    }
  } catch (error) {
    console.error("Error fetching episodes:", error);
  }
};

// Phát video khi chọn tập phim
const playEpisode = async (videoUrl: string) => {
  if (!videoUrl) return;

  // Lưu vào localStorage
  const slug = router.currentRoute.value.params.espisodeSlug;
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
}

.video-js {
  margin-top: 20px;
  max-width: 100%;
}
</style>
