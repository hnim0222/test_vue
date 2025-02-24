<template>
  <div class="tabs-header">
    <div class="tabs">
      <button
          v-for="tab in tabs"
          :key="tab.name"
          :class="['tab', { active: currentTab === tab.name }]"
          @click="changeTab(tab.name)"
      >
        {{ tab.label }}
      </button>
    </div>

    <div class="tab-content">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted} from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();

const tabs = [
  { name: "clock", label: "Clock", path: "/" },
  { name: "comic", label: "Comic", path: "/comic" },
  { name: "film", label: "Film", path: "/film" },
  { name: "ebook", label: "Ebook", path: "/ebook" }
];

const currentTab = computed(() => route.name);

const changeTab = (tab: string) => {
  const selectedTab = tabs.find(t => t.name === tab);
  if (selectedTab) {
    router.push(selectedTab.path);
  }
};

onMounted(() => {
  if (route.path === "/") {
    router.push("/film");
  }
});
</script>

<style scoped>
.tabs-header {
  width: 100%;
  background: linear-gradient(90deg, #2c3e50, #34495e);
  padding: 10px 0;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

.tabs {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.tab {
  padding: 12px 18px;
  font-size: 16px;
  font-weight: 600;
  color: #ecf0f1;
  background-color: transparent;
  border: none;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all 0.3s ease;
}

.tab:hover {
  color: #1abc9c;
}

.tab.active {
  color: #1abc9c;
  border-bottom: 3px solid #1abc9c;
}

.tab-content {
  padding: 20px;
  background-color: #ffffff;
  display: none;
}
</style>