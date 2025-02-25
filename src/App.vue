<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';  // Importing useRouter for navigation
import RealTimeClock from './components/RealTimeClock.vue'
import Quote from "./components/Quote.vue"
import Weather from "./components/Weather.vue"
import Tabs from "./components/Tab.vue"
import ListFilm from "@/components/Film/ListFilm.vue";
import Ebook from "@/components/Ebook/Ebook.vue";
import ListComic from "@/components/Comic/ListComic.vue";
import FilmDetail from "@/components/Film/FilmDetail.vue"; // Adjusted component import for comic list

const isVisible = ref(false);

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
        <ListComic />
      </template>
      <template #film>
        <ListFilm />
      </template>
      <template #ebook>
        <Ebook />
      </template>
    </Tabs>

    <router-view v-slot="{ Component }">
        <component :is="Component" />
    </router-view>
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
