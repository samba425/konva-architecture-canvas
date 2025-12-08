import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/{*splat}', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Middleware to filter out malformed URIs (e.g., CSS gradients being interpreted as URLs)
 */
app.use((req, res, next) => {
  try {
    // Try to decode the URL to catch malformed URIs early
    decodeURIComponent(req.url);
    
    // Additional check for gradient-like patterns that shouldn't be URLs
    if (req.url.match(/\/\d+%[,)]/)) {
      // This looks like a CSS gradient percentage being interpreted as a URL
      res.status(400).end();
      return;
    }
    
    next();
  } catch (err) {
    // If URL is malformed (e.g., contains unescaped % characters from CSS gradients)
    // Silently reject without logging to avoid console spam
    res.status(400).end();
  }
});

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch((err) => {
      // Handle URI errors gracefully
      if (err instanceof URIError) {
        console.log(`⚠️ URI Error caught: ${req.url}`);
        res.status(400).end();
      } else {
        next(err);
      }
    });
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
