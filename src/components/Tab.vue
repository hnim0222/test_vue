<template>
  <div class="tabs-header">
    <div v-if="isValidTab" class="tabs">
      <button
          v-for="tab in tabs"
          :key="tab.name"
          :class="['tab', { active: currentTab === tab.name }]"
          @click="changeTab(tab.name)"
      >
        {{ tab.label }}
      </button>
    </div>

    <div v-else class="back-container">
      <button @click="goBack" class="back-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 15h-6v4l-7-7 7-7v4h6v6z"/></svg>
      </button>
      <button @click="goHome" class="home-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();

const tabs = [
  { name: "clock", label: "Clock", path: "/" },
  { name: "comic", label: "Comic", path: "/comic" },
  { name: "film", label: "Film", path: "/film" },
  // { name: "ebook", label: "Ebook", path: "/ebook" }
  // { name: "spotify", label: "Spotify", path: "/spotify" },
];

const currentTab = computed(() => route.name);
const isValidTab = computed(() => tabs.some(tab => tab.name === route.name));

const changeTab = (tab: string) => {
  const selectedTab = tabs.find(t => t.name === tab);
  if (selectedTab) {
    router.push(selectedTab.path);
    localStorage.setItem("currentTab", selectedTab.name);
  }
};

const goBack = () => router.back();
const goHome = () => router.push("/");
</script>

<style scoped>
/* 🟢 Thanh Tabs */
.tabs-header {
  width: 100%;
  background-color: #ffffff;
}

/* 🌟 Tabs */
.tabs {
  display: flex;
  justify-content: center;
  padding: 12px;
  background: #f8f9fa;
}

.tab {
  padding: 12px 20px;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  background: transparent;
  border: none;
  margin: 0 10px;
  cursor: pointer;
  position: relative;
  transition: color 0.3s ease-in-out;
}

.tab::after {
  content: "";
  position: absolute;
  left: 50%;
  bottom: -5px;
  width: 0;
  height: 3px;
  background: #007bff;
  transition: all 0.3s ease-in-out;
  transform: translateX(-50%);
}

.tab:hover {
  color: #007bff;
}

.tab:hover::after {
  width: 100%;
}

.tab.active {
  color: #007bff;
}

.tab.active::after {
  width: 100%;
}

/* 🔙 Nút Back & Home */
.back-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px;
  background: #f8f9fa;
  gap: 10px;
}

.back-btn,
.home-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #007bff;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: background 0.3s ease-in-out;
}

.back-btn:hover,
.home-btn:hover {
  background: #0056b3;
}

.back-btn svg,
.home-btn svg {
  stroke: white;
}

/* Nội dung tab */
.tab-content {
  padding: 20px;
}
</style>
