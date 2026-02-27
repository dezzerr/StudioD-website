import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import ImageKit from 'imagekit';

// Initialize ImageKit
const imagekit = new ImageKit({
  publicKey: process.env.VITE_IMAGEKIT_PUBLIC_KEY || '',
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || '',
  urlEndpoint: process.env.VITE_IMAGEKIT_URL_ENDPOINT || '',
});

interface UploadResponse {
  url: string;
  thumbnailUrl: string;
  fileId: string;
  name: string;
  size: number;
}

export const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ message: 'Method not allowed' }),
    };
  }

  // Check if ImageKit is configured
  if (!process.env.IMAGEKIT_PRIVATE_KEY) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'ImageKit not configured' }),
    };
  }

  try {
    // Parse multipart form data
    const boundary = event.headers['content-type']?.split('boundary=')[1];
    if (!boundary || !event.body) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'Invalid request' }),
      };
    }

    // Decode base64 body
    const bodyBuffer = Buffer.from(event.body, 'base64');
    
    // Parse multipart data (simplified)
    const parts = parseMultipart(bodyBuffer, boundary);
    const filePart = parts.find(p => p.filename);
    
    if (!filePart || !filePart.data) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'No file provided' }),
      };
    }

    // Get folder from form data
    const folderPart = parts.find(p => p.name === 'folder');
    const folder = folderPart?.data?.toString() || 'uploads';

    // Get filename
    const fileNamePart = parts.find(p => p.name === 'fileName');
    const fileName = fileNamePart?.data?.toString() || filePart.filename || 'image.jpg';

    // Upload to ImageKit
    const uploadResponse = await imagekit.upload({
      file: filePart.data,
      fileName: sanitizeFileName(fileName),
      folder: `/finue-studio/${folder}`,
      useUniqueFileName: true,
      tags: ['portfolio', folder],
    });

    const response: UploadResponse = {
      url: uploadResponse.url,
      thumbnailUrl: uploadResponse.thumbnailUrl,
      fileId: uploadResponse.fileId,
      name: uploadResponse.name,
      size: uploadResponse.size,
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.error('Upload error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: error instanceof Error ? error.message : 'Upload failed',
      }),
    };
  }
};

// Simple multipart parser
interface MultipartPart {
  name?: string;
  filename?: string;
  contentType?: string;
  data?: Buffer;
}

function parseMultipart(buffer: Buffer, boundary: string): MultipartPart[] {
  const parts: MultipartPart[] = [];
  const boundaryBuffer = Buffer.from(`--${boundary}`);
  
  let start = buffer.indexOf(boundaryBuffer);
  
  while (start !== -1) {
    const end = buffer.indexOf(boundaryBuffer, start + boundaryBuffer.length);
    const part = buffer.slice(start + boundaryBuffer.length, end !== -1 ? end : undefined);
    
    // Parse headers
    const headerEnd = part.indexOf('\r\n\r\n');
    if (headerEnd !== -1) {
      const headers = part.slice(0, headerEnd).toString();
      const data = part.slice(headerEnd + 4, part.length - 2); // Remove trailing \r\n
      
      const nameMatch = headers.match(/name="([^"]+)"/);
      const filenameMatch = headers.match(/filename="([^"]+)"/);
      const contentTypeMatch = headers.match(/Content-Type: ([^\r\n]+)/);
      
      parts.push({
        name: nameMatch?.[1],
        filename: filenameMatch?.[1],
        contentType: contentTypeMatch?.[1],
        data: data.length > 0 ? data : undefined,
      });
    }
    
    start = end;
  }
  
  return parts;
}

function sanitizeFileName(fileName: string): string {
  // Remove special characters and spaces
  return fileName
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
