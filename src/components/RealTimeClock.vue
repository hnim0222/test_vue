<template>
  <div class="clock container">
    <p class="text-black text-3xl flex justify-center items-center border border-0.125rem border-black px-4 py-2 w-40 rounded-md">{{ currentTime }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

// Define a reactive variable for current time
const currentTime = ref('');

// Function to update the current time
const updateTime = () => {
  const now = new Date();
  currentTime.value = now.toLocaleTimeString(); // Format the time
};

// Set up interval to update time every second
let timer: ReturnType<typeof setInterval> | null = null;

onMounted(() => {
  updateTime(); // Initialize the time on mount
  timer = setInterval(updateTime, 1000); // Update time every second
});

onBeforeUnmount(() => {
  // Clear the interval when the component is unmounted
  if (timer) {
    clearInterval(timer);
  }
});
</script>

<style scoped>
/* Add any styles here */
</style>
