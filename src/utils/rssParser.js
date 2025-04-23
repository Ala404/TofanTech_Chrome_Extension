import axios from 'axios';
import { defaultImages } from './feedSources';
import crypto from 'crypto-js';

// Use our local proxy server to avoid CORS issues
const LOCAL_PROXY = 'http://localhost:3000/api/rss?url=';

/**
 * Fetches and parses an RSS feed
 * @param {string} url - The URL of the RSS feed
 * @param {number} limit - The maximum number of items to fetch (optional)
 * @returns {Promise<Array>} - Array of parsed feed items
 */
export async function fetchRssFeed(url, limit = 20) {
  try {
    // Encode the URL for our proxy
    const encodedUrl = encodeURIComponent(url);
    console.log(`Fetching RSS feed from: ${url}`);
    const response = await axios.get(`${LOCAL_PROXY}${encodedUrl}`);
    
    // Parse the XML content
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(response.data, 'text/xml');
    
    // Handle different RSS formats (RSS and Atom)
    const isAtom = xmlDoc.querySelector('feed') !== null;
    
    const items = isAtom 
      ? Array.from(xmlDoc.querySelectorAll('entry'))
      : Array.from(xmlDoc.querySelectorAll('item'));
    
    // Get the feed source title
    const sourceTitle = isAtom
      ? xmlDoc.querySelector('feed > title')?.textContent
      : xmlDoc.querySelector('channel > title')?.textContent;
    
    // Process items (limited by the limit parameter)
    return items.slice(0, limit).map(item => {
      // Common data parsing for both RSS and Atom
      const title = item.querySelector('title')?.textContent || 'No Title';
      
      // Handle different content elements
      const contentElement = item.querySelector('content, content\\:encoded, description');
      const content = contentElement?.textContent || '';
      
      // Handle different date elements and formats
      const dateElement = item.querySelector('pubDate, published, updated');
      const dateStr = dateElement?.textContent || '';
      const pubDate = dateStr ? new Date(dateStr) : new Date();
      
      // Handle links
      const linkElement = isAtom
        ? item.querySelector('link[rel="alternate"]') || item.querySelector('link')
        : item.querySelector('link');
      
      const link = isAtom
        ? linkElement?.getAttribute('href')
        : linkElement?.textContent;
      
      // Try to extract an image from the content
      let imageUrl = extractImageFromContent(content);
      
      // If no image found, use a default based on source category
      if (!imageUrl) {
        const category = guessCategory(sourceTitle, title, content);
        imageUrl = getRandomDefaultImage(category);
      }
      
      // Generate a unique ID for the article
      const id = crypto.MD5(link || title + pubDate.toString()).toString();
      
      // Format the article data
      return {
        id,
        title,
        link,
        content: cleanupContent(content),
        description: extractDescription(content),
        pubDate,
        imageUrl,
        source: {
          title: sourceTitle || 'Unknown Source',
          url
        },
        readTime: calculateReadTime(content)
      };
    });
  } catch (error) {
    console.error(`Error fetching RSS feed from ${url}:`, error);
    return [];
  }
}

/**
 * Attempts to extract an image URL from the content
 * @param {string} content - The HTML content
 * @returns {string|null} - The extracted image URL or null if none found
 */
function extractImageFromContent(content) {
  if (!content) return null;
  
  // Create a temporary element to parse the HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = content;
  
  // Look for images in the content
  const img = tempDiv.querySelector('img');
  if (img && img.src) {
    return img.src;
  }
  
  // Look for image URLs in background styles
  const elemWithBg = tempDiv.querySelector('[style*="background-image"]');
  if (elemWithBg) {
    const style = elemWithBg.getAttribute('style');
    const match = /background-image:\s*url\(['"]?([^'"]*?)['"]?\)/i.exec(style);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
}

/**
 * Extracts a description from the content
 * @param {string} content - The HTML content
 * @returns {string} - The extracted description
 */
function extractDescription(content) {
  if (!content) return '';
  
  // Create a temporary element to parse the HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = content;
  
  // Get text content and limit to 160 characters
  let text = tempDiv.textContent || '';
  text = text.trim().replace(/\s+/g, ' ');
  
  return text.length > 160 ? text.substring(0, 157) + '...' : text;
}

/**
 * Cleans up HTML content for display
 * @param {string} content - The HTML content
 * @returns {string} - The cleaned up content
 */
function cleanupContent(content) {
  if (!content) return '';
  
  // Remove potentially dangerous elements/attributes
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = content;
  
  // Remove script and iframe elements
  const scripts = tempDiv.querySelectorAll('script, iframe');
  scripts.forEach(script => script.remove());
  
  // Remove event handlers and javascript: URLs
  const allElements = tempDiv.querySelectorAll('*');
  allElements.forEach(el => {
    // Remove on* attributes
    Array.from(el.attributes).forEach(attr => {
      if (attr.name.startsWith('on') || (attr.name === 'href' && attr.value.startsWith('javascript:'))) {
        el.removeAttribute(attr.name);
      }
    });
  });
  
  return tempDiv.innerHTML;
}

/**
 * Calculates the estimated reading time for content
 * @param {string} content - The HTML content
 * @returns {number} - The estimated reading time in minutes
 */
function calculateReadTime(content) {
  if (!content) return 1;
  
  // Create a temporary element to parse the HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = content;
  
  // Get text content
  const text = tempDiv.textContent || '';
  
  // Average reading speed: 200 words per minute
  const wordCount = text.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);
  
  // Return at least 1 minute
  return Math.max(1, readingTime);
}

/**
 * Guesses the category of an article based on its content
 * @param {string} sourceTitle - The title of the RSS feed
 * @param {string} articleTitle - The title of the article
 * @param {string} content - The content of the article
 * @returns {string} - The guessed category
 */
function guessCategory(sourceTitle, articleTitle, content) {
  const text = (sourceTitle + ' ' + articleTitle + ' ' + content).toLowerCase();
  
  if (/meme|humor|funny|joke|wtf/i.test(text)) {
    return 'meme';
  }
  
  if (/motivation|inspire|success|mindset|growth|positive/i.test(text)) {
    return 'motivation';
  }
  
  return 'tech';
}

/**
 * Gets a random default image for a category
 * @param {string} category - The category
 * @returns {string} - A random image URL
 */
function getRandomDefaultImage(category) {
  const images = defaultImages[category] || defaultImages.tech;
  const randomIndex = Math.floor(Math.random() * images.length);
  return images[randomIndex];
}
