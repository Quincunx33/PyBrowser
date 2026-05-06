import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-memory store for virtual deployments
  const deployments = new Map<string, { content: string; contentType: string }>();

  // API: Register a new virtual deployment
  app.post('/api/v-net/deploy', (req, res) => {
    const { subdomain, content, contentType = 'text/html' } = req.body;
    if (!subdomain || !content) {
      return res.status(400).json({ error: 'Missing subdomain or content' });
    }
    deployments.set(subdomain, { content, contentType });
    console.log(`[V-NET] Registered deployment: ${subdomain}`);
    res.json({ success: true, url: `/v-host/${subdomain}` });
  });

  // API: Kill a deployment
  app.delete('/api/v-net/deploy/:subdomain', (req, res) => {
    const { subdomain } = req.params;
    if (deployments.has(subdomain)) {
      deployments.delete(subdomain);
      console.log(`[V-NET] Terminated deployment: ${subdomain}`);
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Deployment not found' });
    }
  });

  // Virtual Host Handler
  app.get('/v-host/:subdomain', (req, res) => {
    const { subdomain } = req.params;
    const deployment = deployments.get(subdomain);

    if (deployment) {
      // Real traffic logging
      console.log(`[V-NET-LOG] INBOUND: GET /v-host/${subdomain} from ${req.ip}`);
      res.setHeader('Content-Type', deployment.contentType);
      res.send(deployment.content);
    } else {
      res.status(404).send('<h1>404 Not Found</h1><p>Virtual subdomain not registered.</p>');
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[CORTEX-SYSTEM] Server running at http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
