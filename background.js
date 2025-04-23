// Background script for the TofanTech Chrome extension
// Responsible for fetching data in the background and managing alarms

// Initialize alarms for periodic feed updates
chrome.runtime.onInstalled.addListener(() => {
  // Set up an alarm to refresh feeds every 30 minutes
  chrome.alarms.create('refreshFeeds', { periodInMinutes: 30 });
  
  // Initialize default settings if they don't exist
  chrome.storage.local.get(['theme', 'language', 'feeds', 'bookmarks'], (result) => {
    if (!result.theme) {
      chrome.storage.local.set({ theme: 'dark' });
    }
    
    if (!result.language) {
      chrome.storage.local.set({ language: 'en' });
    }
    
    if (!result.feeds) {
      chrome.storage.local.set({ feeds: [] });
    }
    
    if (!result.bookmarks) {
      chrome.storage.local.set({ bookmarks: [] });
    }
  });
});

// Listen for alarm events
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'refreshFeeds') {
    fetchLatestFeeds();
  }
});

// Function to fetch the latest feeds in the background
async function fetchLatestFeeds() {
  try {
    // Perform fetch operations to get latest content
    // This would be implemented with actual RSS feed fetching
    // Store results in chrome.storage.local for the frontend to access
    
    // After fetching, you might want to create a notification
    console.log('Feeds have been updated in the background');
  } catch (error) {
    console.error('Error refreshing feeds:', error);
  }
}

// Listen for messages from the popup/frontend
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getFeeds') {
    fetchLatestFeeds().then(() => {
      sendResponse({ success: true });
    }).catch(error => {
      sendResponse({ success: false, error: error.message });
    });
    return true; // Required for async response
  }
});
