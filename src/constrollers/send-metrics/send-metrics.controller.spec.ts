import { Test, TestingModule } from "@nestjs/testing";
import { BadRequestException } from "@nestjs/common";
import { PrometheusService } from "../../services/prometheus.service";
import { SendMetricsController } from "./send-metrics.controller";
import rawbody from "raw-body";
import { Request as ExpressRequest } from "express";
jest.mock("raw-body");

describe("SendMetricsController", () => {
    let appController: SendMetricsController;

    let prometheusService: PrometheusService;

    beforeEach(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            controllers: [SendMetricsController],
            providers: [
                {
                    provide: PrometheusService,
                    useValue: { setMetrics: jest.fn() }
                }
            ]
        }).compile();

        appController = moduleRef.get<SendMetricsController>(
            SendMetricsController
        );
        prometheusService = moduleRef.get<PrometheusService>(PrometheusService);
    });

    describe("sendMetrics", () => {
        it("should call prometheusService.setMetrics with valid metrics", async () => {
            const body = { test: 123 };
            const req = { readable: false } as unknown as ExpressRequest;
            await appController.sendMetrics(body, req);
            expect(prometheusService.setMetrics).toHaveBeenCalledWith(body);
        });

        it("should throw BadRequestException if body is empty", async () => {
            const body = {};
            const req = { readable: false } as unknown as ExpressRequest;
            await expect(appController.sendMetrics(body, req)).rejects.toThrow(BadRequestException);
        });

        it("should throw BadRequestException if value is not number or IMetric", async () => {
            const body = { test: "string" } as unknown as Record<string, number>;
            const req = { readable: false } as unknown as ExpressRequest;
            await expect(appController.sendMetrics(body, req)).rejects.toThrow(BadRequestException);
        });

        it("should parse raw body if request.readable is true", async () => {
            const metrics = { test: 42 };
            const req = {
                readable: true,
                on: jest.fn(),
                once: jest.fn(),
                removeListener: jest.fn(),
                listeners: jest.fn(),
                emit: jest.fn(),
                pipe: jest.fn(),
                resume: jest.fn(),
                setEncoding: jest.fn(),
                read: jest.fn(),
                _readableState: { ended: true },
                _events: {},
                _eventsCount: 0
            } as unknown as ExpressRequest;
            (rawbody as jest.Mock).mockResolvedValue(Buffer.from(JSON.stringify(metrics)));
            await appController.sendMetrics({}, req);
            expect(prometheusService.setMetrics).toHaveBeenCalledWith(metrics);
        });
    });
});
