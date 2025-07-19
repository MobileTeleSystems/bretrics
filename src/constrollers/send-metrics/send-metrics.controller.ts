import {
    BadRequestException,
    Body,
    Request,
    Controller,
    Post
} from "@nestjs/common";
import { Request as ERequest } from "express";
import { PrometheusService } from "./../../services/prometheus.service";
import * as rawbody from "raw-body";
import { IMetric } from "../../models/IMetric.interface";

@Controller("send-metrics")
export class SendMetricsController {
    public constructor(private readonly prometheusService: PrometheusService) {}

    @Post("metrics")
    public async sendMetrics(
        @Body() body: Record<string, number | IMetric>,
        @Request() request: ERequest
    ) {
        let metrics = body;

        // for send beacon methods as plain text
        if (request.readable) {
            const raw = await rawbody(request);
            const text = raw.toString().trim();
            metrics = JSON.parse(text) as Record<string, number | IMetric>;
        }

        const metricNames = Reflect.ownKeys(metrics) as string[];
        // check body is empty
        if (metricNames.length === 0) {
            throw new BadRequestException(
                "Body must have type Record<string, number> and not empty"
            );
        }

        // check correct types of metrics
        for (const metricName of metricNames) {
            const value = Reflect.get(metrics, metricName);

            if (typeof value === "number") {
                // fine
            } else if ("value" in value && typeof value.value === "number") {
                // fine
            } else {
                const strValue = JSON.stringify(value);
                throw new BadRequestException(
                    `Body must have type Record<string, number | IMetric>, but property ${metricName} has type ${strValue}`
                );
            }
        }

        this.prometheusService.setMetrics(metrics);
    }
}
