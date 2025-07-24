<template>
  <header class="tabs-header">
    <!-- Logo or title -->
    <div class="logo">hnim</div>

    <!-- Desktop menu -->
    <nav class="nav-buttons desktop-only">
      <button @click="goToComics">Comics</button>
      <button @click="goToFilms">Films</button>
      <button @click="goHome">Home</button>
    </nav>

    <!-- Hamburger -->
    <button class="hamburger-btn mobile-only" @click="toggleMenu">
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24">
        <path d="M3 6h18M3 12h18M3 18h18" />
      </svg>
    </button>

    <!-- Mobile dropdown menu -->
    <transition name="slide-fade">
      <nav v-if="menuOpen" class="nav-buttons mobile-dropdown">
        <button @click="goToComics">Comics</button>
        <button @click="goToFilms">Films</button>
        <button @click="goHome">Home</button>
      </nav>
    </transition>
  </header>
</template>


<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const menuOpen = ref(false);

const goHome = () => {
  menuOpen.value = false;
  router.push('/');
};

const goToComics = () => {
  menuOpen.value = false;
  router.push('/comic');
};

const goToFilms = () => {
  menuOpen.value = false;
  router.push('/film');
};

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};
</script>

<style scoped>
.tabs-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
  background-color: #ffffff;
  border-bottom: 1px solid #e0e0e0;
  position: relative;
  z-index: 10;
}

/* Logo */
.logo {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

/* Common nav button styles */
.nav-buttons {
  display: flex;
  gap: 12px;
}

.nav-buttons button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 18px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.nav-buttons button:hover {
  background-color: #0056b3;
}

/* Desktop only */
.desktop-only {
  display: flex;
}

.mobile-only {
  display: none;
}

/* Mobile dropdown menu */
.mobile-dropdown {
  flex-direction: column;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  width: 100%;
  background: white;
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.1);
  padding: 12px 0;
  border-top: 1px solid #eee;
}

.mobile-dropdown button {
  border-radius: 0;
  width: 100%;
  text-align: left;
  padding: 12px 20px;
  background: none;
  color: #333;
  font-size: 16px;
}

.mobile-dropdown button:hover {
  background-color: #f2f2f2;
}

/* Hamburger button */
.hamburger-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
}

/* Responsive */
@media (max-width: 768px) {
  .desktop-only {
    display: none;
  }

  .mobile-only {
    display: block;
  }
}

/* Animation */
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.2s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>



