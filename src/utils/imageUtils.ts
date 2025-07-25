export const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.src = '/comic-book.jpg'; // Using the default image from public folder
  img.onerror = null; // Prevent infinite loop if the default image also fails to load
};

export const imageErrorDirective = {
  mounted(el: HTMLImageElement) {
    el.addEventListener('error', handleImageError);
  },
  unmounted(el: HTMLImageElement) {
    el.removeEventListener('error', handleImageError);
  }
};
