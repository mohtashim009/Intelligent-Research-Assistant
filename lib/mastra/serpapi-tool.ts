import { createTool } from '@mastra/core';
import { z } from 'zod';

// Get API key at runtime (not at module load time)
function getSerpApiKey(): string {
  const apiKey = process.env.SERPAPI_KEY || '';

  if (!apiKey) {
    console.error('❌ SERPAPI_KEY not found in environment variables');
    throw new Error('SERPAPI_KEY is required but not set');
  }

  return apiKey;
}

// Helper function to make SerpAPI requests
async function serpApiRequest(params: Record<string, any>) {
  const apiKey = getSerpApiKey(); // Get key at runtime

  const url = new URL('https://serpapi.com/search');
  url.searchParams.append('api_key', apiKey);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, String(value));
    }
  });

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`SerpAPI error: ${response.status} - ${response.statusText}`);
  }

  return response.json();
}

// Helper to format Google Search results
function formatGoogleResults(results: any): string {
  if (!results.organic_results || results.organic_results.length === 0) {
    return 'No results found.';
  }

  let formatted = `# Search Results for: "${results.search_parameters?.q || 'query'}"\n\n`;
  formatted += `Found ${results.organic_results.length} results\n\n`;

  results.organic_results.forEach((result: any, index: number) => {
    formatted += `## ${index + 1}. ${result.title}\n`;
    formatted += `**Source:** ${result.link}\n`;
    if (result.snippet) {
      formatted += `**Summary:** ${result.snippet}\n`;
    }
    if (result.date) {
      formatted += `**Date:** ${result.date}\n`;
    }
    formatted += '\n';
  });

  return formatted;
}

// Google Search Tool
const googleSearchTool = createTool({
  id: 'googleSearch',
  description: 'Search Google for general web results. Use this for broad information gathering and overview research.',
  inputSchema: z.object({
    q: z.string().describe('Search query'),
    num: z.number().optional().describe('Number of results (default: 10)'),
    location: z.string().optional().describe('Location for localized results'),
  }),
  execute: async ({ context }) => {
    console.log('🔍 Using googleSearch...');

    const params = {
      engine: 'google',
      q: context.q,
      num: context.num || 10,
      location: context.location,
    };

    const results = await serpApiRequest(params);
    console.log('✅ googleSearch completed');

    return formatGoogleResults(results);
  },
});

// Helper to format Google Scholar results
function formatScholarResults(results: any): string {
  if (!results.organic_results || results.organic_results.length === 0) {
    return 'No academic results found.';
  }

  let formatted = `# Academic Research Results for: "${results.search_parameters?.q || 'query'}"\n\n`;
  formatted += `Found ${results.organic_results.length} academic papers\n\n`;

  results.organic_results.forEach((result: any, index: number) => {
    formatted += `## ${index + 1}. ${result.title}\n`;
    if (result.publication_info?.summary) {
      formatted += `**Published:** ${result.publication_info.summary}\n`;
    }
    formatted += `**Source:** ${result.link}\n`;
    if (result.snippet) {
      formatted += `**Abstract:** ${result.snippet}\n`;
    }
    if (result.inline_links?.cited_by?.total) {
      formatted += `**Citations:** ${result.inline_links.cited_by.total}\n`;
    }
    formatted += '\n';
  });

  return formatted;
}

// Google Scholar Tool
const googleScholarTool = createTool({
  id: 'googleScholar',
  description: 'Search Google Scholar for academic papers and scholarly articles. Essential for research requiring academic credibility and peer-reviewed sources.',
  inputSchema: z.object({
    q: z.string().describe('Search query'),
    num: z.number().optional().describe('Number of results (default: 10)'),
    as_ylo: z.string().optional().describe('Start year for date range'),
    as_yhi: z.string().optional().describe('End year for date range'),
  }),
  execute: async ({ context }) => {
    console.log('🔍 Using googleScholar...');

    const params = {
      engine: 'google_scholar',
      q: context.q,
      num: context.num || 10,
      as_ylo: context.as_ylo,
      as_yhi: context.as_yhi,
    };

    const results = await serpApiRequest(params);
    console.log('✅ googleScholar completed');

    return formatScholarResults(results);
  },
});

// Helper to format Google News results
function formatNewsResults(results: any): string {
  if (!results.news_results || results.news_results.length === 0) {
    return 'No news results found.';
  }

  let formatted = `# News Results for: "${results.search_parameters?.q || 'query'}"\n\n`;
  formatted += `Found ${results.news_results.length} news articles\n\n`;

  results.news_results.forEach((result: any, index: number) => {
    formatted += `## ${index + 1}. ${result.title}\n`;
    formatted += `**Source:** ${result.source?.name || 'Unknown'}\n`;
    formatted += `**Link:** ${result.link}\n`;
    if (result.snippet) {
      formatted += `**Summary:** ${result.snippet}\n`;
    }
    if (result.date) {
      formatted += `**Date:** ${result.date}\n`;
    }
    formatted += '\n';
  });

  return formatted;
}

// Google News Tool
const googleNewsTool = createTool({
  id: 'googleNews',
  description: 'Search Google News for recent news articles and current events. Use for up-to-date information and recent developments.',
  inputSchema: z.object({
    q: z.string().describe('Search query'),
    num: z.number().optional().describe('Number of results (default: 10)'),
    gl: z.string().optional().describe('Country code (e.g., "us", "uk")'),
  }),
  execute: async ({ context }) => {
    console.log('🔍 Using googleNews...');

    const params = {
      engine: 'google_news',
      q: context.q,
      num: context.num || 10,
      gl: context.gl,
    };

    const results = await serpApiRequest(params);
    console.log('✅ googleNews completed');

    return formatNewsResults(results);
  },
});

// Google Shopping Tool
const googleShoppingTool = createTool({
  id: 'googleShopping',
  description: 'Search Google Shopping for product information, prices, and reviews.',
  inputSchema: z.object({
    q: z.string().describe('Product search query'),
    num: z.number().optional().describe('Number of results (default: 10)'),
    location: z.string().optional().describe('Location for localized results'),
  }),
  execute: async ({ context }) => {
    console.log('Using google_shopping');

    const params = {
      engine: 'google_shopping',
      q: context.q,
      num: context.num || 10,
      location: context.location,
    };

    const results = await serpApiRequest(params);
    console.log('Obtained results:', results);

    return JSON.stringify(results, null, 2);
  },
});

// YouTube Search Tool
const youtubeSearchTool = createTool({
  id: 'youtubeSearch',
  description: 'Search YouTube for videos, tutorials, and educational content.',
  inputSchema: z.object({
    search_query: z.string().describe('YouTube search query'),
  }),
  execute: async ({ context }) => {
    console.log('Using youtube');

    const params = {
      engine: 'youtube',
      search_query: context.search_query,
    };

    const results = await serpApiRequest(params);
    console.log('Obtained results:', results);

    return JSON.stringify(results, null, 2);
  },
});

// Google Maps Tool
const googleMapsTool = createTool({
  id: 'googleMaps',
  description: 'Search Google Maps for local businesses, places, and location information.',
  inputSchema: z.object({
    q: z.string().describe('Search query (e.g., "restaurants near me")'),
    ll: z.string().optional().describe('Latitude,longitude for location-based search'),
  }),
  execute: async ({ context }) => {
    console.log('Using google_maps');

    const params = {
      engine: 'google_maps',
      q: context.q,
      ll: context.ll,
      type: 'search',
    };

    const results = await serpApiRequest(params);
    console.log('Obtained results:', results);

    return JSON.stringify(results, null, 2);
  },
});

// Google Jobs Tool
const googleJobsTool = createTool({
  id: 'googleJobs',
  description: 'Search Google Jobs for job listings and employment opportunities.',
  inputSchema: z.object({
    q: z.string().describe('Job search query'),
    location: z.string().optional().describe('Location for job search'),
  }),
  execute: async ({ context }) => {
    console.log('Using google_jobs');

    const params = {
      engine: 'google_jobs',
      q: context.q,
      location: context.location,
    };

    const results = await serpApiRequest(params);
    console.log('Obtained results:', results);

    return JSON.stringify(results, null, 2);
  },
});

// Google Images Tool
const googleImagesTool = createTool({
  id: 'googleImages',
  description: 'Search Google Images for visual content and image research.',
  inputSchema: z.object({
    q: z.string().describe('Image search query'),
    num: z.number().optional().describe('Number of results (default: 10)'),
  }),
  execute: async ({ context }) => {
    console.log('Using google_images');

    const params = {
      engine: 'google_images',
      q: context.q,
      num: context.num || 10,
    };

    const results = await serpApiRequest(params);
    console.log('Obtained results:', results);

    return JSON.stringify(results, null, 2);
  },
});

// Bing Search Tool
const bingSearchTool = createTool({
  id: 'bingSearch',
  description: 'Search Bing for web results. Use for cross-verification with Google results.',
  inputSchema: z.object({
    q: z.string().describe('Search query'),
    count: z.number().optional().describe('Number of results (default: 10)'),
  }),
  execute: async ({ context }) => {
    console.log('Using bing');

    const params = {
      engine: 'bing',
      q: context.q,
      count: context.count || 10,
    };

    const results = await serpApiRequest(params);
    console.log('Obtained results:', results);

    return JSON.stringify(results, null, 2);
  },
});

// DuckDuckGo Search Tool
const duckduckgoSearchTool = createTool({
  id: 'duckduckgoSearch',
  description: 'Search DuckDuckGo for privacy-focused web results.',
  inputSchema: z.object({
    q: z.string().describe('Search query'),
  }),
  execute: async ({ context }) => {
    console.log('Using duckduckgo');

    const params = {
      engine: 'duckduckgo',
      q: context.q,
    };

    const results = await serpApiRequest(params);
    console.log('Obtained results:', results);

    return JSON.stringify(results, null, 2);
  },
});

// Baidu Search Tool
const baiduSearchTool = createTool({
  id: 'baiduSearch',
  description: 'Search Baidu for Chinese language content and China-specific information.',
  inputSchema: z.object({
    q: z.string().describe('Search query'),
  }),
  execute: async ({ context }) => {
    console.log('Using baidu');

    const params = {
      engine: 'baidu',
      q: context.q,
    };

    const results = await serpApiRequest(params);
    console.log('Obtained results:', results);

    return JSON.stringify(results, null, 2);
  },
});

// Yandex Search Tool
const yandexSearchTool = createTool({
  id: 'yandexSearch',
  description: 'Search Yandex for Russian language content and Russia-specific information.',
  inputSchema: z.object({
    text: z.string().describe('Search query'),
  }),
  execute: async ({ context }) => {
    console.log('Using yandex');

    const params = {
      engine: 'yandex',
      text: context.text,
    };

    const results = await serpApiRequest(params);
    console.log('Obtained results:', results);

    return JSON.stringify(results, null, 2);
  },
});

// Export all tools as an object
export const serpApiTools = {
  googleSearch: googleSearchTool,
  googleScholar: googleScholarTool,
  googleNews: googleNewsTool,
  googleShopping: googleShoppingTool,
  youtubeSearch: youtubeSearchTool,
  googleMaps: googleMapsTool,
  googleJobs: googleJobsTool,
  googleImages: googleImagesTool,
  bingSearch: bingSearchTool,
  duckduckgoSearch: duckduckgoSearchTool,
  baiduSearch: baiduSearchTool,
  yandexSearch: yandexSearchTool,
};
