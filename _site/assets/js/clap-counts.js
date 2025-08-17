const API_BASE = 'https://api.applause-button.com/';

async function getClapCount(url) {
  try {
    const response = await fetch(`${API_BASE}claps?url=${encodeURIComponent(url)}`);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return await response.text();
  } catch (e) {
    console.error('Error fetching clap count for URL', url, ':', e);
    return '0';  // Fallback to '0' on error
  }
}

async function getClapCounts() {
  const elements = document.querySelectorAll('.clap-count, .clap-count-cat');
  console.log('Found clap count elements:', elements.length);  // Log how many spans found

  for (const el of elements) {
    const url = el.getAttribute('data-url');
    console.log('Fetching for URL:', url);  // Now inside the loop, after url is defined

    if (url) {
      const count = await getClapCount(url);
      el.textContent = count;
    } else {
      console.log('No data-url attribute on element:', el);  // Debug missing attributes
    }
  }
}

// Alias for categories/archives (same logic)
const getClapCountsForCats = getClapCounts;

// Call on page load
window.addEventListener('DOMContentLoaded', () => {
  console.log('Clap JS loaded');  // Your original load log
  getClapCounts();
});