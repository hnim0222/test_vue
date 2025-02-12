<template>
  <div class="comic-list">
    <div
        v-for="comic in comics"
        :key="comic._id"
        class="comic-item"
        @click="goToListChapter(comic)"
    >
      <img :src="comic.image" :alt="comic.name" class="comic-poster" />
      <h3 class="comic-name">{{ comic.name }}</h3>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const comics = ref([
  {
    _id: '678b044dc705a578a7fadd7c',
    name: 'Thám Tử Conan',
    image: 'https://img.otruyenapi.com/uploads/comics/tham-tu-conan-thumb.jpg',
    slug: 'tham-tu-conan'
  },
  {
    _id: '6593812268e54cf5b5091b43',
    name: 'Cao Võ Hạ Cánh Đến Một Vạn Năm Sau',
    image: 'https://img.otruyenapi.com/uploads/comics/cao-vo-ha-canh-den-mot-van-nam-sau-thumb.jpg',
    slug: 'cao-vo-ha-canh-den-mot-van-nam-sau'
  }
]);

const goToListChapter = (comic: any) => {
  router.push({ path: `/comic/${comic.slug}` });
};
</script>

<style scoped>
.comic-list {
  display: flex;
  flex-wrap: wrap;
}

.comic-item {
  margin: 10px;
  cursor: pointer;
}

.comic-poster {
  width: 150px;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
}

.comic-name {
  margin-top: 10px;
  font-weight: bold;
  text-align: center;
}
</style>
