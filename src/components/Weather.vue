<template>
  <div class="weather-container">
    <h2>🌤️ Dữ liệu thời tiết</h2>
    <button @click="getWeather" class="mt-2" style="display: none">Lấy dữ liệu thời tiết</button>
    <div v-if="loading">⏳ Đang tải...</div>
    <div v-if="error" class="error">❌ {{ error }}</div>
    <div v-if="weatherData">
      <h3>📍 {{ weatherData.location.name }}, {{ weatherData.location.country }}</h3>
      <p>🌡️ Nhiệt độ: {{ weatherData.current.temp_c }}°C</p>
      <p>🌤️ Điều kiện: {{ weatherData.current.condition.text }}</p>
      <p>💧 Độ ẩm: {{ weatherData.current.humidity }}%</p>
      <p>💨 Gió: {{ weatherData.current.wind_kph }} km/h</p>
    </div>

    <!-- Dữ liệu từ Open-Meteo -->
<!--    <div v-if="openMeteoData" class="mt-5">-->
<!--      <h3>🌡️ Dự báo nhiệt độ theo giờ</h3>-->
<!--      <ul>-->
<!--        <li v-for="(temp, index) in openMeteoData.hourly.temperature_2m.slice(0, 24)" :key="index">-->
<!--          🕒 {{ formatDateTime(openMeteoData.hourly.time[index]) }}: {{ temp }}°C-->
<!--        </li>-->
<!--      </ul>-->
<!--    </div>-->
  </div>
</template>

<script setup lang="ts">
import axios from "axios";
import { ref, onMounted } from "vue";

// Type Definitions
interface WeatherAPIResponse {
  location: {
    name: string;
    country: string;
  };
  current: {
    temp_c: number;
    condition: {
      text: string;
    };
    humidity: number;
    wind_kph: number;
  };
}

interface OpenMeteoResponse {
  hourly: {
    temperature_2m: number[];
    time: string[];
  };
}

// Reactive data properties
const city = ref("Hanoi");
const lat = ref(21.0245);
const lon = ref(105.8412);
const weatherData = ref<WeatherAPIResponse | null>(null);
const openMeteoData = ref<OpenMeteoResponse | null>(null);
const error = ref<string | null>(null);
const loading = ref(false);

// Methods
const getWeather = async () => {
  loading.value = true;
  error.value = null;

  try {
    // Lấy dữ liệu từ WeatherAPI
    const weatherApiKey = "da6dc0ae918f48db93931327251102";
    const weatherResponse = await axios.get<WeatherAPIResponse>(
        `https://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&q=${city.value}`
    );
    weatherData.value = weatherResponse.data;

    // Lấy dữ liệu từ Open-Meteo
    const openMeteoResponse = await axios.get<OpenMeteoResponse>(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat.value}&longitude=${lon.value}&hourly=temperature_2m&timezone=Asia%2FBangkok`
    );
    openMeteoData.value = openMeteoResponse.data;
  } catch (err) {
    error.value = "Không thể lấy dữ liệu thời tiết!";
  } finally {
    loading.value = false;
  }
};

// Utility function to format the date-time
const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour12: false,
  });
};

// Fetch weather data on mounted
onMounted(() => {
  getWeather();
});
</script>

<style scoped>
.weather-container {
  max-width: 500px;
  padding: 20px;
  border-radius: 10px;
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
