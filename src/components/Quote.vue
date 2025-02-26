<template>
  <div class="quote-card container">
    <p class="quote">"{{ quote }}"</p>
    <p class="translated-quote">"{{ translatedQuote }}"</p>
    <p class="author" v-if="author">— {{ author }} —</p>

    <div v-if="quoteImage" class="quote-image">
      <img :src="quoteImage" alt="Quote Image" />
    </div>

    <button @click="fetchQuote" style="display: none;">Trích dẫn mới</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

const quote = ref('');
const author = ref('');
const translatedQuote = ref('');
const quoteImage = ref('');

const fetchQuote = async () => {
  try {
    const response = await axios.get('https://api.allorigins.win/get?url=' + encodeURIComponent('https://zenquotes.io/api/random'));
    const data = JSON.parse(response.data.contents)[0];
    quote.value = data.q;
    author.value = data.a;

    await translateQuote(quote.value);
    // await fetchQuoteImage(); // Fetch quote image after fetching quote
  } catch (error) {
    console.error('Error fetching quote:', error);
    quote.value = 'Không thể tải trích dẫn. Vui lòng thử lại!';
    author.value = '';
    translatedQuote.value = '';
    quoteImage.value = '';
  }
};

const fetchQuoteImage = async () => {
  try {
    const response = await axios.get('https://api.allorigins.win/get?url=' + encodeURIComponent('https://zenquotes.io/api/image'));
    const data = JSON.parse(response.data.contents)[0];
    quoteImage.value = data.imageUrl; // Assuming the response contains a field 'imageUrl'
  } catch (error) {
    console.error('Error fetching image:', error);
    quoteImage.value = '';
  }
};

// Translate quote from English to Vietnamese
const translateQuote = async (text: string) => {
  try {
    const response = await axios.get('https://api.mymemory.translated.net/get?q=' + encodeURIComponent(text) + '&langpair=en|vi');
    translatedQuote.value = response.data.responseData.translatedText || 'Không thể dịch trích dẫn.';
  } catch (error) {
    console.error('Translation error:', error);
    translatedQuote.value = 'Không thể dịch trích dẫn.';
  }
};

// Initial quote fetch on mount
onMounted(() => {
  fetchQuote();
});
</script>

<style scoped>
.quote-card {
  max-width: 400px;
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.quote {
  font-size: 1.2rem;
  font-style: italic;
  margin-bottom: 10px;
}

.translated-quote {
  font-size: 1rem;
  color: #007bff;
  margin-bottom: 10px;
}

.author {
  font-size: 1rem;
  font-weight: bold;
  color: #555;
  margin-bottom: 15px;
}

button {
  padding: 10px 20px;
  border: none;
  background: #007bff;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 5px;
}

button:hover {
  background: #0056b3;
}

/* Style for the image container */
.quote-image {
  margin-top: 15px;
}

.quote-image img {
  width: 100%;
  max-width: 350px;
  height: auto;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
</style>
