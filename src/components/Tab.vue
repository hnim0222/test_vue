<template>
  <div class="tabs-header">
<!--    <div class="back-container">-->
<!--      <button @click="goBack" class="back-btn">-->
<!--        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 15h-6v4l-7-7 7-7v4h6v6z"/></svg>-->
<!--      </button>-->
<!--      <button @click="goHome" class="home-btn">-->
<!--        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>-->
<!--      </button>-->
<!--    </div>-->
  </div>
</template>


<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const goBack = () => router.back();
const goHome = () => router.push("/comic");
</script>


<style scoped>
.tabs-header {
  width: 100%;
  background-color: #ffffff;
}

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
</style>

