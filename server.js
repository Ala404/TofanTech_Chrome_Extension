const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all requests
app.use(cors());

// Proxy endpoint for RSS feeds
app.get('/api/rss', async (req, res) => {
  try {
    const { url } = req.query;
    
    if (!url) {
      return res.status(400).json({ error: 'URL parameter is required' });
    }
    
    // Decode the URL if it's encoded
    const decodedUrl = decodeURIComponent(url);
    
    console.log(`Fetching RSS from: ${decodedUrl}`);
    
    // Fetch the RSS feed
    const response = await axios.get(decodedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'application/rss+xml, application/xml, text/xml, application/atom+xml, */*'
      },
      timeout: 10000 // 10 seconds timeout
    });
    
    // Return the RSS feed XML content
    res.set('Content-Type', 'application/xml');
    res.send(response.data);
  } catch (error) {
    console.error('Error fetching RSS feed:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch RSS feed', 
      message: error.message,
      url: req.query.url
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`RSS proxy server running on port ${PORT}`);
});