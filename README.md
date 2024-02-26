# Bretrics - Microservice for realtime monitoring of users in browsers by prometheus.

The microservice contains an API that accepts metrics from the client browser, as well as an exporter for Prometheus metrics..

## Try

To try the microservice features, run the container with the command:

```sh
docker run -it --rm -p 3000:3000 mtsrus/bretrics
```

Now you can check the work with the command:

```sh
curl -d '{"fcp": 0.5, "cls": 1, "tti": 2}' -H 'Content-Type: application/json' -X POST http://localhost:3000/send-metrics/metrics
```

Now you can see sended metrics in the exporter by url `http://localhost:3000/metrics`.

Send metrics with labels:

```sh
curl -d '{"fcp": {"value": 5, "labels": {"path": "/app", "type": "mobile"}}}' -H 'Content-Type: application/json' -X POST http://localhost:3000/send-metrics/metrics
```

## Use

To start the microservice in production, use the command:

```sh
docker run -d --restart always -p 3000:3000 mtsrus/bretrics
```

## Container parameters

- `-e PORT=3000` - the port on which the microservice will be launched, default 3000.

- `-e BRETRICS_PERCENTILES=[0.01, 0.1, 0.25, 0.5, 0.75, 0.9, 0.99]` - percentiles of prometheus values,
    default [0.01, 0.1, 0.25, 0.5, 0.75, 0.9, 0.99].

- `-e BRETRICS_MAXAGESECONDS=600` - will tell how old a bucket can be before it is reset, in seconds, default 600 seconds.

- `-e BRETRICS_AGEBUCKETS=5` - configures how many buckets we will have in our sliding window for the summary, default 5.

- `-e BRETRICS_PREFIX="webmon_"` - prefix of web monitoring values,
    default webmon_.

- `-e PROM_ELPRECISION=100` - nodejs event loop precision for system metrics, default 100.

- `-e PROM_PREFIX=""` - prefix for all prometheus metrics,
    default empty string.

## Metrics Prometheus

The microservice has built-in Prometheus monitoring and is located on the endpoint `/metrics`.

Block this endpoint on the proxy if you do not need to provide access to metrics from outside your network.

## Components for web

To send metrics from the client, you need to write code that will send metrics to the microservice. An [example of such code can be found here](https://web.dev/vitals/).