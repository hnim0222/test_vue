<script setup lang="ts">
import RealTimeClock from './components/RealTimeClock.vue'
import Quote from "./components/Quote.vue"
import Weather from "./components/Weather.vue"
import Tabs from "./components/Tab.vue"
import Comic from "@/components/Comic.vue";
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
        <Comic />
      </template>
    </Tabs>
  </main>
</template>

<style scoped>
</style>
