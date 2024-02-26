import { Module } from "@nestjs/common";
import { MetricsController } from "./constrollers/metrics/metrics.controller";
import { SendMetricsController } from "./constrollers/send-metrics/send-metrics.controller";
import { JsonLogger } from "./services/json-logger.service";
import { PrometheusService } from "./services/prometheus.service";

@Module({
    imports: [],
    controllers: [MetricsController, SendMetricsController],
    providers: [JsonLogger, PrometheusService]
})
export class AppModule {}
