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
      <slot :name="currentTab"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const tabs = [
  { name: 'clock', label: 'Clock' },
  { name: 'weather', label: 'Weather' },
  // { name: 'quote', label: 'Quote' },
  { name: 'comic', label: 'Comic' }
];

const currentTab = ref('comic');

const changeTab = (tab: string) => {
  currentTab.value = tab;
};
</script>

<style scoped>
.tabs-header {
  width: 100%;
  background-color: #f7f7f7; /* Background color for the header */

}

.tabs {
  display: flex;
  justify-content: center;
  background-color: #6794c5; /* Set a background for the tabs */
  padding: 10px;
}

.tab {
  padding: 12px 20px;
  cursor: pointer;
  background-color: transparent;
  border: none;
  margin-right: 10px;
  color: white;
  font-weight: bold;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.tab:hover {
  background-color: #0056b3;
}

.tab.active {
  background-color: #0056b3;
  color: white;
}

.tab-content {
  padding-top: 20px;
  background-color: #ffffff;
}
</style>
