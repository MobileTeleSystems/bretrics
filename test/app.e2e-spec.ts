/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "./../src/app.module";

describe("AppController (e2e)", () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterEach(async () => {
        await app.close();
        jest.clearAllTimers();
    });

    it("/send-metrics/metrics (POST) + /metrics (GET)", async () => {
        // 1. Отправляем метрику
        const metricName = "test_metric_e2e";
        const metricValue = 42;
        await request(app.getHttpServer())
            .post("/send-metrics/metrics")
            .send({ [metricName]: metricValue })
            .expect(201); // NestJS по умолчанию возвращает 201 для POST

        // 2. Получаем метрики
        const res = await request(app.getHttpServer())
            .get("/metrics")
            .expect(200);

        // 3. Проверяем, что наша метрика есть в ответе
        expect(res.text).toContain(metricName);
    });

    it("/send-metrics/metrics (POST, IMetric) + /metrics (GET)", async () => {
        // 1. Отправляем метрику в формате IMetric (value + labels)
        const metricName = "test_metric_imetric_e2e";
        const metricValue = 123;
        const labels = { path: "/test", device_type: "e2e" };
        const payload = {
            [metricName]: {
                value: metricValue,
                labels
            }
        };
        await request(app.getHttpServer())
            .post("/send-metrics/metrics")
            .send(payload)
            .expect(201);

        // 2. Получаем метрики
        const res = await request(app.getHttpServer())
            .get("/metrics")
            .expect(200);

        // 3. Проверяем, что метрика и лейблы есть в ответе
        expect(res.text).toContain(metricName);
        expect(res.text).toContain('path="/test"');
        expect(res.text).toContain('device_type="e2e"');
    });
});
