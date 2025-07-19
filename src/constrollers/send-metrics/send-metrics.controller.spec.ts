import { Test, TestingModule } from "@nestjs/testing";
import { BadRequestException } from "@nestjs/common";
import { PrometheusService } from "../../services/prometheus.service";
import { SendMetricsController } from "./send-metrics.controller";

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

        appController = moduleRef.get<SendMetricsController>(SendMetricsController);
        prometheusService = moduleRef.get<PrometheusService>(PrometheusService);
    });

    describe("sendMetrics", () => {
        it("should call prometheusService.setMetrics with valid metrics", async () => {
            const body = { test: 123 };
            const req: any = { readable: false };
            await appController.sendMetrics(body, req);
            expect(prometheusService.setMetrics).toHaveBeenCalledWith(body);
        });

        it("should throw BadRequestException if body is empty", async () => {
            const body = {};
            const req: any = { readable: false };
            await expect(appController.sendMetrics(body, req)).rejects.toThrow(BadRequestException);
        });

        it("should throw BadRequestException if value is not number or IMetric", async () => {
            const body = { test: "string" } as any;
            const req: any = { readable: false };
            await expect(appController.sendMetrics(body, req)).rejects.toThrow(BadRequestException);
        });

        it("should parse raw body if request.readable is true", async () => {
            const metrics = { test: 42 };
            const req: any = {
                readable: true,
                [Symbol.asyncIterator]: undefined,
                on: jest.fn(),
                once: jest.fn(),
                removeListener: jest.fn(),
                listeners: jest.fn(),
                emit: jest.fn(),
                // mock raw-body
                pipe: jest.fn(),
                resume: jest.fn(),
                setEncoding: jest.fn(),
                read: jest.fn(),
                // simulate raw-body
                _readableState: { ended: true },
                _events: {},
                _eventsCount: 0
            };
            // mock raw-body import
            jest.spyOn(require("raw-body"), "default" in require("raw-body") ? "default" : "default").mockImplementation(async () => Buffer.from(JSON.stringify(metrics)));
            await appController.sendMetrics({}, req);
            expect(prometheusService.setMetrics).toHaveBeenCalledWith(metrics);
        });
    });
});
