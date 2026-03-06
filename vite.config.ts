import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig, loadEnv } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'
import type { IncomingHttpHeaders } from 'node:http'
import type { Handler, HandlerContext, HandlerEvent } from '@netlify/functions'

const DEV_FUNCTION_LOADERS: Record<string, () => Promise<{ handler: Handler }>> = {
  'gallery-feed': () => import('./netlify/functions/gallery-feed') as Promise<{ handler: Handler }>,
  'list-images': () => import('./netlify/functions/list-images') as Promise<{ handler: Handler }>,
};

const normalizeHeaders = (headers: IncomingHttpHeaders): Record<string, string> => {
  return Object.fromEntries(
    Object.entries(headers)
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return [key, value.join(',')];
        }

        return [key, value || ''];
      })
      .filter(([, value]) => Boolean(value))
  );
};

const netlifyFunctionsDevPlugin = () => ({
  name: 'netlify-functions-dev',
  apply: 'serve' as const,
  configureServer(server: {
    middlewares: {
      use: (
        callback: (
          req: { url?: string; method?: string; headers: IncomingHttpHeaders },
          res: { statusCode: number; setHeader: (name: string, value: string) => void; end: (body: string) => void },
          next: () => void
        ) => Promise<void>
      ) => void;
    };
    config: { logger: { error: (message: string) => void } };
  }) {
    server.middlewares.use(async (req, res, next) => {
      const requestUrl = req.url ? new URL(req.url, 'http://localhost') : null;
      if (!requestUrl || !requestUrl.pathname.startsWith('/.netlify/functions/')) {
        next();
        return;
      }

      const functionName = requestUrl.pathname.replace('/.netlify/functions/', '');
      const loadHandler = DEV_FUNCTION_LOADERS[functionName];
      if (!loadHandler) {
        next();
        return;
      }

      try {
        const module = await loadHandler();
        const handler = module?.handler;
        if (!handler) {
          next();
          return;
        }

        const event: HandlerEvent = {
          rawUrl: requestUrl.toString(),
          rawQuery: requestUrl.searchParams.toString(),
          path: requestUrl.pathname,
          httpMethod: req.method || 'GET',
          headers: normalizeHeaders(req.headers),
          multiValueHeaders: {},
          queryStringParameters: Object.fromEntries(requestUrl.searchParams.entries()),
          multiValueQueryStringParameters: {},
          body: '',
          isBase64Encoded: false,
        };

        const result = await handler(
          event,
          {} as HandlerContext
        );

        if (!result) {
          res.statusCode = 204;
          res.end('');
          return;
        }

        res.statusCode = result.statusCode || 200;

        const responseHeaders = result.headers;
        if (responseHeaders instanceof Headers) {
          responseHeaders.forEach((value, name) => {
            res.setHeader(name, value);
          });
        } else if (responseHeaders && typeof responseHeaders === 'object') {
          Object.entries(responseHeaders as Record<string, unknown>).forEach(([name, value]) => {
            if (typeof value === 'string') {
              res.setHeader(name, value);
            }
          });
        }

        res.end(result.body || '');
      } catch (error) {
        server.config.logger.error(
          `Failed to run local function '${functionName}': ${error instanceof Error ? error.message : 'Unknown error'}`
        );

        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: `Failed to run local function '${functionName}'` }));
      }
    });
  },
});

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  process.env.VITE_IMAGEKIT_URL_ENDPOINT = process.env.VITE_IMAGEKIT_URL_ENDPOINT || env.VITE_IMAGEKIT_URL_ENDPOINT;
  process.env.VITE_IMAGEKIT_PUBLIC_KEY = process.env.VITE_IMAGEKIT_PUBLIC_KEY || env.VITE_IMAGEKIT_PUBLIC_KEY;
  process.env.IMAGEKIT_PRIVATE_KEY = process.env.IMAGEKIT_PRIVATE_KEY || env.IMAGEKIT_PRIVATE_KEY;

  return {
    base: './',
    plugins: [netlifyFunctionsDevPlugin(), inspectAttr(), react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
