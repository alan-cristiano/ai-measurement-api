import { injectable } from "tsyringe";
import {
    CreateMeasurePayload,
    CreateMeasureReturn,
    IMeasureService,
    ListMeasuresReturn,
    MeasureDb,
    UpdateMeasurePayload,
} from "../interfaces/measure.interfaces";
import { prisma } from "../../prisma/database";
import {
    createMeasureReturnSchema,
    listMeasuresReturnSchema,
} from "../schemas/measure.schemas";
import { model } from "../configs/initializeGoogleAI";
import { AppError } from "../errors/app-error";

@injectable()
class MeasureService implements IMeasureService {
    private prismaModel = prisma.measure;

    private async retrieveMeasureAllData(
        measureUuid: string
    ): Promise<MeasureDb> {
        const measureData = await this.prismaModel.findUnique({
            where: {
                measure_uuid: measureUuid,
            },
        });

        if (!measureData) {
            throw new AppError(
                "Leitura do mês já realizada",
                404,
                "MEASURE_NOT_FOUND"
            );
        }

        return measureData;
    }

    private async retrieveMeasureValue(image: string): Promise<string> {
        const imageData = {
            inlineData: {
                data: image,
                mimeType: "image/jpeg",
            },
        };

        const prompt =
            "Return only the value as an integer, without any additional text or punctuation, as shown in the meter shown in the image. For example, the return should have the following format: Example 1: 50. Example 2: 200. Example 3: 500. If the value cannot be identified, the return must be 0.";

        const generatedContent = await model.generateContent([
            prompt,
            imageData,
        ]);

        return generatedContent.response.text();
    }

    private async monthlyMeasureIsValid(
        measureDatetime: string,
        customerCode: string,
        measureType: string
    ): Promise<void> {
        const readingDate = new Date(measureDatetime);
        const readingMonth = readingDate.getMonth();
        const readingYear = readingDate.getFullYear();
        const searchDateFrom = new Date(
            `${readingYear}-${(0 + String(readingMonth + 1)).slice(-2)}`
        );
        const searchDateTo = new Date(
            `${readingYear}-${(0 + String(readingMonth + 2)).slice(-2)}-01`
        );

        const userReadings = await this.prismaModel.findMany({
            where: {
                customer_code: customerCode,
                measure_datetime: {
                    gte: searchDateFrom,
                    lt: searchDateTo,
                },
            },
        });

        userReadings.map((reading) => {
            if (reading.measure_type === measureType) {
                throw new AppError(
                    "Leitura do mês já realizada",
                    409,
                    "DOUBLE_REPORT"
                );
            }
        });
    }

    private async measureConfirmationIsValid(
        measureData: MeasureDb
    ): Promise<void> {
        if (measureData.has_confirmed === true) {
            throw new AppError(
                "Leitura do mês já realizada",
                409,
                "CONFIRMATION_DUPLICATE"
            );
        }
    }

    private async queryParamIsValid(measureType: string): Promise<void> {
        if (measureType !== "WATER" && measureType !== "GAS") {
            throw new AppError(
                "Tipo de medição não permitida",
                400,
                "INVALID_TYPE"
            );
        }
    }

    public async create(
        payload: CreateMeasurePayload
    ): Promise<CreateMeasureReturn> {
        await this.monthlyMeasureIsValid(
            payload.measure_datetime,
            payload.customer_code,
            payload.measure_type
        );

        const measuredValue = await this.retrieveMeasureValue(payload.image);

        const updatedPayload = {
            customer_code: payload.customer_code,
            measure_type: payload.measure_type,
            measure_datetime: new Date(payload.measure_datetime),
            measure_value: Number(measuredValue),
            image_url: `data:image/jpeg;base64,${payload.image}`,
        };

        const createdMeasure = await this.prismaModel.create({
            data: updatedPayload,
        });
        return createMeasureReturnSchema.parse(createdMeasure);
    }

    public async update(payload: UpdateMeasurePayload): Promise<void> {
        const measureData = await this.retrieveMeasureAllData(
            payload.measure_uuid
        );

        await this.measureConfirmationIsValid(measureData as MeasureDb);

        await this.prismaModel.update({
            where: { measure_uuid: payload.measure_uuid },
            data: {
                measure_value: payload.confirmed_value,
                has_confirmed: true,
            },
        });
    }

    public async list(
        customerCode: string,
        measureType?: "WATER" | "GAS"
    ): Promise<ListMeasuresReturn> {
        if (measureType) {
            await this.queryParamIsValid(measureType);

            const measures = await this.prismaModel.findMany({
                where: {
                    customer_code: customerCode,
                    measure_type: measureType,
                },
            });

            if (measures.length === 0) {
                throw new AppError(
                    "Nenhuma leitura encontrada",
                    404,
                    "MEASURES_NOT_FOUND"
                );
            }

            const data = { customer_code: customerCode, measures: measures };

            return listMeasuresReturnSchema.parse(data);
        }

        const measures = await this.prismaModel.findMany({
            where: {
                customer_code: customerCode,
            },
        });

        if (measures.length === 0) {
            throw new AppError(
                "Nenhuma leitura encontrada",
                404,
                "MEASURES_NOT_FOUND"
            );
        }

        const data = { customer_code: customerCode, measures: measures };

        return listMeasuresReturnSchema.parse(data);
    }
}

export { MeasureService };
