<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import TheWelcome from './components/TheWelcome.vue'
import RealTimeClock from './components/RealTimeClock.vue'
import Quote from "./components/Quote.vue"
import Weather from "@/components/Weather.vue"
import Tabs from "./components/Tab.vue"
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
    </Tabs>
  </main>
</template>

<style scoped>
</style>
