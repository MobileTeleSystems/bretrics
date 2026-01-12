
# Bretrics

[![Docker](https://img.shields.io/docker/v/mtsrus/bretrics?label=Docker&logo=docker)](https://hub.docker.com/r/mtsrus/bretrics)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![NestJS](https://img.shields.io/badge/NestJS-11.x-E0234E?logo=nestjs)](https://nestjs.com/)
[![Node.js](https://img.shields.io/badge/Node.js-24.x-339933?logo=node.js)](https://nodejs.org/)

> **Real-time browser metrics collection microservice for Prometheus**

Bretrics is a lightweight, high-performance microservice that collects [Web Vitals](https://web.dev/vitals/) and custom metrics from client browsers and exposes them via a Prometheus-compatible endpoint.

## Features

- **Web Vitals Support** — Collect FCP, LCP, CLS, TTI, and custom metrics
- **Custom Labels** — Add dimensions like path, device type, or user segments
- **Prometheus Native** — Built-in `/metrics` endpoint with configurable percentiles
- **Docker Ready** — Production-ready container images
- **High Performance** — Built on NestJS with minimal overhead
- **Configurable** — Flexible environment variable configuration

## Quick Start

### Using Docker

```sh
docker run -it --rm -p 3000:3000 mtsrus/bretrics
```

### Send Test Metrics

```sh
# Simple metrics
curl -X POST http://localhost:3000/send-metrics/metrics \
  -H 'Content-Type: application/json' \
  -d '{"fcp": 0.5, "cls": 1, "tti": 2}'

# Metrics with labels
curl -X POST http://localhost:3000/send-metrics/metrics \
  -H 'Content-Type: application/json' \
  -d '{"fcp": {"value": 5, "labels": {"path": "/app", "device_type": "mobile"}}}'
```

### View Metrics

Open [http://localhost:3000/metrics](http://localhost:3000/metrics) to see Prometheus-formatted metrics.

## Installation

### Production Deployment

```sh
docker run -d \
  --name bretrics \
  --restart always \
  -p 3000:3000 \
  mtsrus/bretrics
```

### Docker Compose

```yaml
services:
  bretrics:
    image: mtsrus/bretrics:latest
    ports:
      - "3000:3000"
    environment:
      - PORT=3000
      - BRETRICS_PREFIX=bretrics_
    restart: always
```

## Configuration

All configuration is done via environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `BRETRICS_PREFIX` | Prefix for web metrics | `bretrics_` |
| `BRETRICS_PERCENTILES` | Summary percentiles array | `[0.01, 0.1, 0.25, 0.5, 0.75, 0.9, 0.99]` |
| `BRETRICS_MAXAGESECONDS` | Bucket reset interval (seconds) | `600` |
| `BRETRICS_AGEBUCKETS` | Sliding window bucket count | `5` |
| `PROM_PREFIX` | Global Prometheus metrics prefix | `""` |
| `PROM_ELPRECISION` | Event loop precision (ms) | `100` |

## API Reference

### POST `/send-metrics/metrics`

Submit browser metrics for collection.

**Request Body:**

```json
{
  "metricName": 123.45,
  "anotherMetric": {
    "value": 67.89,
    "labels": {
      "path": "/dashboard",
      "device_type": "desktop"
    }
  }
}
```

**Response:** `201 Created`

### GET `/metrics`

Prometheus metrics endpoint.

**Response:** Prometheus text format with all collected metrics.

## Client Integration

To send metrics from the browser, integrate with [Web Vitals](https://web.dev/vitals/):

```javascript
import { onCLS, onFCP, onLCP, onTTFB } from 'web-vitals';

function sendMetric(metric) {
  const body = JSON.stringify({
    [metric.name.toLowerCase()]: {
      value: metric.value,
      labels: {
        path: window.location.pathname,
        device_type: /Mobile/.test(navigator.userAgent) ? 'mobile' : 'desktop'
      }
    }
  });

  navigator.sendBeacon('/send-metrics/metrics', body);
}

onCLS(sendMetric);
onFCP(sendMetric);
onLCP(sendMetric);
onTTFB(sendMetric);
```

## Security

> **Important:** The `/metrics` endpoint exposes internal metrics. Block this endpoint on your reverse proxy if external access is not required.

Example nginx configuration:

```nginx
location /metrics {
  allow 10.0.0.0/8;
  deny all;
}
```

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md).

## License

This project is licensed under the [MIT License](LICENSE).