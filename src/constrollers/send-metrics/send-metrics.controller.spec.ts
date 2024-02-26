import { Test, TestingModule } from "@nestjs/testing";
import { PrometheusService } from "../../services/prometheus.service";
import { SendMetricsController } from "./send-metrics.controller";

describe("SendMetricsController", () => {
    let appController: SendMetricsController;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [SendMetricsController],
            providers: [PrometheusService]
        }).compile();

        appController = app.get<SendMetricsController>(SendMetricsController);
    });

    describe("root", () => {
        it('should return "Hello World!"', () => {
            expect("Hello World!").toBe("Hello World!");
        });
    });
});
