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
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-big-left"><path d="M18 15h-6v4l-7-7 7-7v4h6v6z"/></svg>
      </button>
      <button @click="goHome" class="home-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-house"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
      </button>
    </div>

    <div class="tab-content">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();

const tabs = [
  { name: "clock", label: "Clock", path: "/" },
  { name: "comic", label: "Comic", path: "/comic" },
  { name: "film", label: "Film", path: "/film" },
  // { name: "ebook", label: "Ebook", path: "/ebook" }
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

// onMounted(() => {
//   const savedTab = localStorage.getItem("currentTab");
//   const selectedTab = tabs.find(t => t.name === savedTab);
//   if (selectedTab) {
//     router.push(selectedTab.path);
//   }
// });

const goBack = () => {
  router.back();
};

const goHome = () => {
  router.push("/");
};
</script>

<style scoped>
.tabs-header {
  width: 100%;
  background-color: #9c7676;
}

.tabs {
  display: flex;
  justify-content: center;
  background-color: #c59f9f;
  padding: 10px;
}

.tab {
  padding: 12px 20px;
  cursor: pointer;
  background-color: transparent;
  border: none;
  margin-right: 10px;
  color: #c53838;
  font-weight: bold;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.tab:hover {
  background-color: #3c6fa6;
}

.tab.active {
  background-color: #0056b3;
  color: white;
}

.back-container {
  display: flex;
  justify-content: center;
  padding: 10px;
  background-color: #c59f9f;
}

.back-btn, .home-btn {
  padding: 10px 15px;
  margin: 0 5px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.3s ease;
}

.back-btn {
  background-color: #ff6347;
  color: white;
}

.back-btn:hover {
  background-color: #d43f00;
}

.home-btn {
  background-color: #4caf50;
  color: white;
}

.home-btn:hover {
  background-color: #388e3c;
}

.tab-content {
  padding-top: 20px;
  background-color: #ffffff;
  display: none;
}
</style>
