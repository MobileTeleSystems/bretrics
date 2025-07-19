import { Test, TestingModule } from "@nestjs/testing";
import { MetricsController } from "./metrics.controller";
import { Response } from "express";
import { PrometheusService } from "../../services/prometheus.service";

describe("MetricsController", () => {
    let appController: MetricsController;

    let prometheusService: PrometheusService;
    let mockRegister: any;

    beforeEach(async () => {
        mockRegister = {
            contentType: "text/plain; version=0.0.4; charset=utf-8",
            metrics: jest.fn()
                .mockResolvedValue(`# HELP process_cpu_user_seconds_total
            # TYPE process_cpu_user_seconds_total counter
            process_cpu_user_seconds_total 1\n# HELP process_cpu_system_seconds_total\n# TYPE process_cpu_system_seconds_total counter\nprocess_cpu_system_seconds_total 2\n# HELP process_resident_memory_bytes\n# TYPE process_resident_memory_bytes gauge\nprocess_resident_memory_bytes 3\n# HELP nodejs_heap_size_total_bytes\n# TYPE nodejs_heap_size_total_bytes gauge\nnodejs_heap_size_total_bytes 4\n# HELP nodejs_heap_size_used_bytes\n# TYPE nodejs_heap_size_used_bytes gauge\nnodejs_heap_size_used_bytes 5`)
        };
        prometheusService = { register: mockRegister } as any;

        const app: TestingModule = await Test.createTestingModule({
            controllers: [MetricsController],
            providers: [
                { provide: PrometheusService, useValue: prometheusService }
            ]
        }).compile();

        appController = app.get<MetricsController>(MetricsController);
    });

    describe("getMetrics", () => {
        it("should return metrics with correct content type and response", async () => {
            const mockSet = jest.fn().mockReturnThis();
            const mockSend = jest.fn().mockReturnThis();
            const mockResponse = {
                set: mockSet,
                send: mockSend
            } as unknown as Response;

            const result = await appController.getMetrics(mockResponse);

            // Check that response methods are called correctly
            expect(mockSet).toHaveBeenCalledTimes(1);
            expect(mockSet).toHaveBeenCalledWith(
                "Content-Type",
                expect.stringContaining("text/plain")
            );

            expect(mockSend).toHaveBeenCalledTimes(1);

            // Check that result contains Prometheus metrics
            expect(mockSend).toHaveBeenCalledWith(
                expect.stringContaining("# HELP")
            );
            expect(mockSend).toHaveBeenCalledWith(
                expect.stringContaining("# TYPE")
            );

            // Check that metrics contain CPU and RAM consumption values
            expect(mockSend).toHaveBeenCalledWith(
                expect.stringContaining("process_cpu_user_seconds_total")
            );
            expect(mockSend).toHaveBeenCalledWith(
                expect.stringContaining("process_cpu_system_seconds_total")
            );
            expect(mockSend).toHaveBeenCalledWith(
                expect.stringContaining("process_resident_memory_bytes")
            );
            expect(mockSend).toHaveBeenCalledWith(
                expect.stringContaining("nodejs_heap_size_total_bytes")
            );
            expect(mockSend).toHaveBeenCalledWith(
                expect.stringContaining("nodejs_heap_size_used_bytes")
            );

            // Check method result
            expect(result).toBe(mockResponse);
        });
    });
});
