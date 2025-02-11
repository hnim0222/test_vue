<template>
  <div class="clock">
    <p class=time>{{ currentTime }}</p>
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
.clock {
  font-family: 'Share Tech Mono', monospace;
  color: #ffffff;
  text-align: center;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  color: #60c4e4;
  text-shadow: 0 0 20px rgba(10, 175, 230, 1),  0 0 20px rgba(10, 175, 230, 0);
}
  .time {
    letter-spacing: 0.05em;
    font-size: 80px;
    padding: 5px 0;
  }
</style>
