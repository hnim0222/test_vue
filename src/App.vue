<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';  // Importing useRouter for navigation
import RealTimeClock from './components/RealTimeClock.vue'
import Quote from "./components/Quote.vue"
import Weather from "./components/Weather.vue"
import Tabs from "./components/Tab.vue"
import ListComic from "@/components/Comic/ListComic.vue"; // Adjusted component import for comic list

// Define visibility state for scroll to top button
const isVisible = ref(false);

// Function to scroll back to the top of the page
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

const handleScroll = () => {
  isVisible.value = window.scrollY > 100; // Button appears when scrolled more than 100px
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

// Remove event listener when unmounted to avoid memory leaks
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template class="bg-white">
  <main>
    <Tabs>
      <template #clock>
        <RealTimeClock />
      </template>
      <template #weather>
        <Weather />
      </template>
      <template #quote>
        <Quote />
      </template>
      <template #comic>
         <router-view />
      </template>
    </Tabs>

    <!-- Scroll to top button, visible when scrolled down -->
    <button
        v-if="isVisible"
        @click="scrollToTop"
        class="fixed bottom-10 right-4 p-3 text-red-500 rounded-full shadow-lg hover:bg-blue-600 transition-all">
      ↑
    </button>
  </main>
</template>

<style scoped>
button {
  transition: background-color 0.3s ease, transform 0.3s ease; /* Added transform for smooth pop-in effect */
}

button:hover {
  background-color: #3b82f6;
  transform: scale(1.1); /* Slight scale effect on hover */
}
</style>
