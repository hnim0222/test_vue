<template>
  <h1>{{ filmName }}</h1>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue';
    import { useRouter } from 'vue-router';
    import axios from "axios";

    const router = useRouter();

    const film = ref<any>({});
    let filmName = ref('');
    onMounted(async () => {
      const slug = router.currentRoute.value.params.filmSlug;

      const response = await axios.get(`https://ophim1.com/phim/${slug}`);
      // film.value = response.data;
      filmName.value = response.data.movie.name
    })
</script>