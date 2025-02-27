<template>
  <iframe allowtransparency="true" scrolling="no" frameborder="no" src="https://w.soundcloud.com/icon/?url=http%3A%2F%2Fsoundcloud.com%2Fminh-t-ng-257111029&color=black_white&size=32" style="width: 32px; height: 32px;"></iframe></template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import axios from 'axios';

const token = ref<string | null>(null);
const query = ref<string>('');
const tracks = ref<{ id: string; name: string; artists: { name: string }[]; uri: string }[]>([]);
const player = ref<any>(null);
const errorMessage = ref<string | null>(null);

type SpotifyToken = {
  access_token?: string;
  expires_in?: number;
};

const login = () => {
  const clientId = '053804b2703345479a70794aa8143970';
  const redirectUri = encodeURIComponent('http://localhost:5173/spotify');
  const scopes = encodeURIComponent('streaming user-read-private user-read-email');
  window.location.href = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${redirectUri}&scope=${scopes}`;
};

const getTokenFromUrl = (): SpotifyToken | null => {
  const hash = window.location.hash.substring(1).split('&').reduce((acc, item) => {
    const parts = item.split('=');
    acc[parts[0] as keyof SpotifyToken] = decodeURIComponent(parts[1]);
    return acc;
  }, {} as SpotifyToken);
  return hash.access_token ? hash : null;
};

const saveToken = (token: SpotifyToken) => {
  const expiryTime = new Date().getTime() + (token.expires_in || 0) * 1000;
  localStorage.setItem('spotify_token', token.access_token!);
  localStorage.setItem('spotify_token_expiry', expiryTime.toString());
};

const loadToken = (): string | null => {
  const token = localStorage.getItem('spotify_token');
  const expiryTime = localStorage.getItem('spotify_token_expiry');
  if (token && expiryTime && new Date().getTime() < parseInt(expiryTime, 10)) {
    return token;
  }
  return null;
};

const search = async () => {
  if (!query.value) return;
  try {
    const { data } = await axios.get(`https://api.spotify.com/v1/search`, {
      headers: { Authorization: `Bearer ${token.value}` },
      params: { q: query.value, type: 'track', limit: 10 }
    });
    tracks.value = data.tracks.items;
  } catch (error) {
    console.error(error);
    errorMessage.value = 'Failed to search for tracks.';
  }
};

const play = async (uri: string) => {
  try {
    const response = await fetch('https://api.spotify.com/v1/me/player/play', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token.value}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uris: [uri] })
    });
    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.error.reason === 'PREMIUM_REQUIRED') {
        errorMessage.value = 'Premium account required to play tracks.';
      } else {
        errorMessage.value = 'Failed to play track.';
      }
    }
  } catch (error) {
    console.error(error);
    errorMessage.value = 'Failed to play track.';
  }
};

onMounted(() => {
  let storedToken = loadToken();
  if (!storedToken) {
    const urlToken = getTokenFromUrl();
    if (urlToken) {
      saveToken(urlToken);
      storedToken = urlToken.access_token!;
      window.history.pushState({}, document.title, window.location.pathname);
    }
  }
  token.value = storedToken;
});
</script>

<style>
.container {
  text-align: center;
  padding: 20px;
  max-width: 700px;
  width: 100%;
}

.login-button, .play-button {
  margin: 10px;
  padding: 10px;
  background: #1DB954;
  color: white;
  border: none;
  cursor: pointer;
}

.search-input {
  margin: 20px;
  padding: 10px;
  width: 300px;
}

.track-list {
  list-style-type: none;
  padding: 0;
}

.track-item {
  margin: 10px 0;
  padding: 10px;
  background: #f1f1f1;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.track-info {
  font-size: 16px;
}

.play-button {
  background: #1DB954;
  color: white;
  border: none;
  cursor: pointer;
  padding: 5px 10px;
}

.error-message {
  color: red;
  margin-top: 20px;
}
</style>