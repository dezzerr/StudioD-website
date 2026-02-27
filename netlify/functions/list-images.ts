import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import ImageKit from 'imagekit';

// Initialize ImageKit
const imagekit = new ImageKit({
  publicKey: process.env.VITE_IMAGEKIT_PUBLIC_KEY || '',
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || '',
  urlEndpoint: process.env.VITE_IMAGEKIT_URL_ENDPOINT || '',
});

export const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ message: 'Method not allowed' }),
    };
  }

  if (!process.env.IMAGEKIT_PRIVATE_KEY) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'ImageKit not configured' }),
    };
  }

  try {
    const folder = event.queryStringParameters?.folder || 'uploads';
    const path = `/studio-d/${folder}`;

    const files = await imagekit.listFiles({
      path,
      limit: 100,
    });

    const results = files.map(file => ({
      url: file.url,
      thumbnailUrl: file.thumbnail,
      fileId: file.fileId,
      name: file.name,
      size: file.size,
      createdAt: file.createdAt,
    }));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(results),
    };
  } catch (error) {
    console.error('List error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: error instanceof Error ? error.message : 'Failed to list images',
      }),
    };
  }
};
