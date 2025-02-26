<script setup lang="ts">
import { openDB } from "idb";
import ePub from "epubjs";
import { onMounted, ref } from "vue";

const book = ref<ePub.Book | null>(null);
const rendition = ref<ePub.Rendition | null>(null);
const booksList = ref<{ key: string; name: string; cover: string | null }[]>([]);
const isReaderOpen = ref(false);

const DB_NAME = "epubLibrary";
const STORE_NAME = "books";

const getDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });
};

const saveToIndexedDB = async (file: File) => {
  try {
    const db = await getDB();
    const arrayBuffer = await file.arrayBuffer();
    const bookKey = `book_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    await db.put(STORE_NAME, arrayBuffer, bookKey);

    const tempBook = ePub(arrayBuffer);
    const metadata = await tempBook.loaded.metadata;
    const cover = (await tempBook.coverUrl()) ?? null;

    booksList.value.push({
      key: bookKey,
      name: metadata.title || file.name,
      cover: cover,
    });
    console.log("Saved book with key:", bookKey);
  } catch (error) {
    console.error("Error saving book:", error);
  }
};

const loadBook = async (bookKey: string) => {
  try {
    const db = await getDB();
    const arrayBuffer = await db.get(STORE_NAME, bookKey);
    if (!arrayBuffer) {
      console.error(`No book found with key: ${bookKey}`);
      return;
    }

    if (rendition.value) {
      rendition.value.destroy();
    }

    book.value = ePub(arrayBuffer);
    rendition.value = book.value.renderTo("root", {
      width: "100%",
      height: "100%",
      manager: "continuous",
      flow: "scrolled",
      spread: "none",
    });

    rendition.value?.hooks.content.register((contents: { iframe: HTMLIFrameElement }) => {
      const iframe = contents.iframe;
      if (iframe) {
        iframe.setAttribute("sandbox", "allow-scripts allow-same-origin");
      }
    });

    const rootElement = document.getElementById("root");
    if (rootElement) {
      rootElement.style.display = "block";
      isReaderOpen.value = true;
    }

    await rendition.value.display();
    console.log("Book loaded successfully:", bookKey);
  } catch (error) {
    console.error("Error loading book:", error);
  }
};

const closeBook = () => {
  if (rendition.value) {
    rendition.value.destroy();
  }
  const rootElement = document.getElementById("root");
  if (rootElement) {
    rootElement.style.display = "none";
  }
  isReaderOpen.value = false;
};

const loadBooksList = async () => {
  try {
    const db = await getDB();
    const allKeys = await db.getAllKeys(STORE_NAME);

    booksList.value = await Promise.all(
        allKeys.map(async (key) => {
          const arrayBuffer = await db.get(STORE_NAME, key);
          const tempBook = ePub(arrayBuffer);
          const metadata = await tempBook.loaded.metadata;
          const cover = (await tempBook.coverUrl()) ?? null;

          return {
            key: key as string,
            name: metadata.title || "Unknown Title",
            cover: cover,
          };
        })
    );
    console.log("Loaded books:", booksList.value.length);
  } catch (error) {
    console.error("Error loading books list:", error);
  }
};

const deleteBook = async (bookKey: string) => {
  try {
    const db = await getDB();
    await db.delete(STORE_NAME, bookKey);
    booksList.value = booksList.value.filter((book) => book.key !== bookKey);
    console.log(`Deleted book: ${bookKey}`);
  } catch (error) {
    console.error("Error deleting book:", error);
  }
};

const upload = async (e: Event) => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  await saveToIndexedDB(file);
};

const showBackButton = ref(false);

const handleScroll = () => {
  const container = document.getElementById("root");
  if (container) {
    showBackButton.value = container.scrollTop > 50;
  }
};

onMounted(async () => {
  await loadBooksList();

  const rootElement = document.getElementById("root");
  if (rootElement) {
    rootElement.addEventListener("scroll", handleScroll);
  }
});
</script>

<template>
  <div class="app-container">
    <div id="root" class="reader">
      <button class="back-btn" @click="closeBook">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-x"
        >
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </button>
    </div>
    <div class="list-container" v-if="!isReaderOpen">
      <div class="books-list">
        <div v-for="item in booksList" :key="item.key" class="book-item">
          <div @click="loadBook(item.key)" class="book-info">
            <img
                v-if="item.cover"
                :src="item.cover"
                alt="Book cover"
                class="book-cover"
            />
            <div v-else class="no-cover">No Cover</div>
            <span class="book-title">{{ item.name }}</span>
          </div>
          <button class="delete-btn" @click.stop="deleteBook(item.key)">❌</button>
        </div>
      </div>
      <label for="fileUpload" class="upload-btn">📥</label>
      <input id="fileUpload" type="file" class="hidden" @change="upload" />
    </div>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  height: calc(100vh - 88px);
  width: 100%;
}

.reader {
  flex: 1;
  max-width: 768px;
  margin: 0 auto;
  display: none;
}

.close-btn {
  margin: 5px;
  padding: 5px;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
}

.close-btn:hover {
  background-color: #dc2626;
}

.list-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 800px;
}

.books-list {
  padding: 16px;
}

.book-item {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  cursor: pointer;
  padding: 8px;
  background: white;
  border-radius: 5px;
  border: 1px solid black;
}

.book-item:hover {
  background: #e5e5e5;
}

.book-cover {
  width: 50px;
  height: 70px;
  object-fit: cover;
  margin-right: 12px;
}

.no-cover {
  width: 50px;
  height: 70px;
  background: #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  font-size: 12px;
  color: #666;
}

.book-title {
  font-size: 14px;
  flex: 1;
  max-width: 70%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.hidden {
  display: none;
}

.upload-btn {
  position: fixed;
  bottom: 10px;
  right: 10px;
  margin: 16px;
  cursor: pointer;
  background-color: #3b82f6;
  color: white;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 9999px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  font-size: 14px;
  transition: background-color 0.2s ease;
  text-align: center;
}

.upload-btn:hover {
  background-color: #2563eb;
}

.book-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
  background: white;
  border-radius: 5px;
  border: 1px solid black;
  margin-bottom: 16px;
  cursor: pointer;
}

.book-item:hover {
  background: #e5e5e5;
}

.book-info {
  display: flex;
  align-items: center;
  flex-grow: 1;
}

.delete-btn {
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.delete-btn:hover {
  background-color: #dc2626;
}

.back-btn {
  position: fixed;
  top: 10px;
  left: 10px;
  color: white;
  font-size: 14px;
  cursor: pointer;
  z-index: 1000;
  transition: background-color 0.2s ease;
}

.back-btn:hover {
  background-color: #2563eb;
}
</style>