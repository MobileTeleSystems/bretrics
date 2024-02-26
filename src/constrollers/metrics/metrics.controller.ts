import { Controller, Response, Get } from "@nestjs/common";
import { Response as EResponse } from "express";
import { PrometheusService } from "./../../services/prometheus.service";

@Controller("metrics")
export class MetricsController {
    public constructor(private readonly prometheusService: PrometheusService) {}

    @Get()
    public async getMetrics(@Response() response: EResponse) {
        const register = this.prometheusService.register;

        return response
            .set("Content-Type", register.contentType)
            .send(await register.metrics());
    }
}
