const express = require('express');
const client = require('prom-client');

const app = express();

// Create a Registry to register the metrics
const register = new client.Registry();

// Add default metrics to the registry (like CPU, memory usage, etc.)
client.collectDefaultMetrics({ register });

// Create custom metric (example: HTTP request duration)
const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code']
});

register.registerMetric(httpRequestDuration);

// Middleware to measure request duration
app.use((req, res, next) => {
  const end = httpRequestDuration.startTimer();
  res.on('finish', () => {
    end({ method: req.method, route: req.path, status_code: res.statusCode });
  });
  next();
});

// Metrics route for Prometheus to scrape
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// Sample endpoint
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Start server
app.listen(3000, '0.0.0.0', () => console.log('App is running on port 3000'));

