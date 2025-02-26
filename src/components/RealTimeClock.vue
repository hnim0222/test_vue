<template>
  <div class="clock-container">
    <Weather />
    <div class="analog-clock">
      <div class="hand hour" :style="hourStyle"></div>
      <div class="hand minute" :style="minuteStyle"></div>
      <div class="hand second" :style="secondStyle"></div>
      <div class="center-dot"></div>
    </div>
    <div class="digital-clock">
      <p class="time">{{ currentTime }}</p>
      <p class="date">{{ currentDate }}</p>
      <p class="lunar-date">Âm lịch: {{ lunarDate }}</p>
    </div>
    <Quote />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import Quote from "@/components/Quote.vue";
import Weather from "@/components/Weather.vue";

const currentTime = ref("");
const currentDate = ref("");
const lunarDate = ref("");

const now = ref(new Date());

const updateTime = () => {
  now.value = new Date();
  currentTime.value = now.value.toLocaleTimeString();
  currentDate.value = now.value.toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const lunarFormatter = new Intl.DateTimeFormat("vi-VN-u-ca-chinese", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  lunarDate.value = lunarFormatter.format(now.value);
};

let timer: ReturnType<typeof setInterval> | null = null;

onMounted(() => {
  updateTime();
  timer = setInterval(updateTime, 1000);
});

onBeforeUnmount(() => {
  if (timer) clearInterval(timer);
});

// Đồng hồ kim
const hourStyle = computed(() => ({
  transform: `rotate(${(now.value.getHours() % 12) * 30 + now.value.getMinutes() * 0.5}deg)`,
}));

const minuteStyle = computed(() => ({
  transform: `rotate(${now.value.getMinutes() * 6}deg)`,
}));

const secondStyle = computed(() => ({
  transform: `rotate(${now.value.getSeconds() * 6}deg)`,
}));
</script>

<style scoped>
.clock-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: "Arial", sans-serif;
}

/* Đồng hồ kim */
.analog-clock {
  width: 120px;
  height: 120px;
  border: 3px solid #333;
  border-radius: 50%;
  position: relative;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.hand {
  position: absolute;
  bottom: 50%;
  left: 50%;
  transform-origin: bottom;
  background: black;
  border-radius: 5px;
}

.hour {
  width: 5px;
  height: 30px;
  background: #333;
}

.minute {
  width: 3px;
  height: 40px;
  background: #666;
}

.second {
  width: 2px;
  height: 45px;
  background: red;
}

.center-dot {
  width: 8px;
  height: 8px;
  background: black;
  border-radius: 50%;
  position: absolute;
}

/* Đồng hồ số */
.digital-clock {
  text-align: center;
  margin-top: 10px;
}

.time {
  font-size: 28px;
  font-weight: bold;
  color: #333;
}

.date, .lunar-date {
  font-size: 16px;
  color: #666;
}
</style>
