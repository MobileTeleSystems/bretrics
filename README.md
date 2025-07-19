
# Bretrics — Microservice for real-time monitoring of users in browsers via Prometheus.

The microservice contains an API that accepts metrics from the client browser, as well as an exporter for Prometheus metrics.

## Try

To try the microservice features, run the container with the command:

```sh
docker run -it --rm -p 3000:3000 mtsrus/bretrics
```

Now you can check its operation with the command:

```sh
curl -d '{"fcp": 0.5, "cls": 1, "tti": 2}' -H 'Content-Type: application/json' -X POST http://localhost:3000/send-metrics/metrics
```

Now you can see the sent metrics in the exporter at the URL `http://localhost:3000/metrics`.

Send metrics with labels:

```sh
curl -d '{"fcp": {"value": 5, "labels": {"path": "/app", "device_type": "mobile"}}}' -H 'Content-Type: application/json' -X POST http://localhost:3000/send-metrics/metrics
```

## Use

To start the microservice in production, use the command:

```sh
docker run -d --restart always -p 3000:3000 mtsrus/bretrics
```

## Container parameters

- `-e PORT=3000` — the port on which the microservice will be launched, default is 3000.

- `-e BRETRICS_PERCENTILES=[0.01, 0.1, 0.25, 0.5, 0.75, 0.9, 0.99]` — percentiles of Prometheus values,
  default: [0.01, 0.1, 0.25, 0.5, 0.75, 0.9, 0.99].

- `-e BRETRICS_MAXAGESECONDS=600` — how old a bucket can be before it is reset, in seconds, default is 600 seconds.

- `-e BRETRICS_AGEBUCKETS=5` — configures how many buckets will be in the sliding window for the summary, default is 5.

- `-e BRETRICS_PREFIX="bretrics_"` — prefix for web monitoring values,
  default: bretrics_.

- `-e PROM_ELPRECISION=100` — Node.js event loop precision for system metrics, default is 100.

- `-e PROM_PREFIX=""` — prefix for all Prometheus metrics,
  default: empty string.

## Prometheus Metrics

The microservice has built-in Prometheus monitoring and is available at the endpoint `/metrics`.

Block this endpoint on your proxy if you do not need to provide access to metrics from outside your network.

## Components for the Web

To send metrics from the client, you need to write code that will send metrics to the microservice. An [example of such code can be found here](https://web.dev/vitals/).