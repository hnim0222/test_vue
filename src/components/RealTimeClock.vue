<template>
  <div class="clock container">
    <p class="text-black text-3xl flex justify-center items-center border border-0.125rem border-black px-4 py-2 w-40 rounded-md">{{ currentTime }}</p>
  </div>
</template>

<script>
export default {
  name: 'RealTimeClock',
  data() {
    return {
      currentTime: '',
      timer: null,
    };
  },
  mounted() {
    this.updateTime();
    // Update the time every second
    this.timer = setInterval(() => {
      this.updateTime();
    }, 1000);
  },
  beforeUnmount() {
    // Clear the interval when the component is destroyed
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  methods: {
    updateTime() {
      const now = new Date();
      this.currentTime = now.toLocaleTimeString(); // Format the time
    },
  },
};
</script>