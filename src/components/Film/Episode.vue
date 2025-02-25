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

const fetchEpisode = async () => {
  try {
    const slug = router.currentRoute.value.params.episodeSlug;
    const response = await axios.get(`https://ophim1.com/phim/${slug}`);
    film.value = response.data.episodes[0]?.server_data ?? [];

    const savedEpisode = localStorage.getItem(`lastWatched_${slug}`);
    const lastEpisode = savedEpisode || film.value[0]?.link_m3u8;

    if (lastEpisode) {
      await playEpisode(lastEpisode);
    }
  } catch (error) {
    console.error("Error fetching episodes:", error);
  }
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

const playEpisode = async (videoUrl: string) => {
  if (!videoUrl) return;

  currentEpisode.value = videoUrl;

  // Lưu vào localStorage
  const slug = router.currentRoute.value.params.episodeSlug;
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

    player.on("play", async () => {
      if (window.innerWidth < 768) {
        const videoElement = videoPlayer.value as HTMLVideoElement;
        if (videoElement.requestFullscreen) {
          await videoElement.requestFullscreen();
        } else if ("webkitRequestFullscreen" in videoElement) {
          await (videoElement as any).webkitRequestFullscreen();
        } else {
          console.warn("Fullscreen API không được hỗ trợ trên trình duyệt này.");
        }
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
</style>
