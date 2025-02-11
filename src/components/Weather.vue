<template>
  <div class="weather-container">
    <h2>🌤️ Dữ liệu thời tiết</h2>

    <!-- Nút lấy dữ liệu thời tiết -->
    <button @click="getWeather" class="mt-2 hidden">Lấy dữ liệu thời tiết</button>

    <!-- Hiển thị trạng thái tải -->
    <div v-if="loading">⏳ Đang tải...</div>

    <!-- Hiển thị lỗi nếu có -->
    <div v-if="error" class="error">❌ {{ error }}</div>

    <!-- Dữ liệu từ WeatherAPI -->
    <div v-if="weatherData">
      <h3>📍 {{ weatherData.location.name }}, {{ weatherData.location.country }}</h3>
      <p>🌡️ Nhiệt độ: {{ weatherData.current.temp_c }}°C</p>
      <p>🌤️ Điều kiện: {{ weatherData.current.condition.text }}</p>
      <p>💧 Độ ẩm: {{ weatherData.current.humidity }}%</p>
      <p>💨 Gió: {{ weatherData.current.wind_kph }} km/h</p>
    </div>

    <!-- Dữ liệu từ Open-Meteo -->
    <div v-if="openMeteoData" class="mt-5">
      <h3>🌡️ Dự báo nhiệt độ theo giờ</h3>
      <ul>
        <li v-for="(temp, index) in openMeteoData.hourly.temperature_2m.slice(0, 24)" :key="index">
          🕒 {{ formatDateTime(openMeteoData.hourly.time[index]) }}: {{ temp }}°C
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      city: "Hanoi",
      lat: 21.0245,
      lon: 105.8412,
      weatherData: null,
      openMeteoData: null,
      error: null,
      loading: false,
    };
  },
  methods: {
    async getWeather() {
      this.loading = true;
      this.error = null;

      try {
        // Lấy dữ liệu từ WeatherAPI
        const weatherApiKey = "da6dc0ae918f48db93931327251102";
        const weatherResponse = await axios.get(
            `https://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&q=${this.city}`
        );

        this.weatherData = weatherResponse.data;

        // Lấy dữ liệu từ Open-Meteo
        const openMeteoResponse = await axios.get(
            `https://api.open-meteo.com/v1/forecast?latitude=${this.lat}&longitude=${this.lon}&hourly=temperature_2m&timezone=Asia%2FBangkok`
        );
        this.openMeteoData = openMeteoResponse.data;
      } catch (err) {
        this.error = "Không thể lấy dữ liệu thời tiết!";
      } finally {
        this.loading = false;
      }
    },
    formatDateTime(dateString) {
      const date = new Date(dateString);
      return date.toLocaleString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour12: false,
      });
    },
  },
  mounted() {
    this.getWeather();
  }
};
</script>

<style scoped>
.weather-container {
  max-width: 500px;
  margin: 40px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

button {
  background: #007bff;
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  border-radius: 5px;
  margin-bottom: 10px;
}

button:hover {
  background: #0056b3;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  padding: 5px 0;
}

.error {
  color: red;
  font-weight: bold;
}
</style>
