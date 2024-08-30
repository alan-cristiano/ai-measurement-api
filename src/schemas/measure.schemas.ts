import { z } from "zod";
import { Base64 } from "js-base64";

const measureSchema = z.object({
    measure_uuid: z.string(),
    customer_code: z.string(),
    measure_value: z.number(),
    measure_datetime: z.string().datetime(),
    measure_type: z.preprocess(
        (val) => String(val).toUpperCase(),
        z.enum(["WATER", "GAS"])
    ),
    has_confirmed: z.boolean(),
    image: z.string().refine(Base64.isValid),
    image_url: z.string(),
});

const measureDbSchema = measureSchema
    .omit({
        image: true,
        image_url: true,
    })
    .extend({ measure_datetime: z.date(), measure_type: z.string() });

const createMeasurePayloadSchema = measureSchema.omit({
    measure_uuid: true,
    image_url: true,
    measure_value: true,
    has_confirmed: true,
});

const createMeasureReturnSchema = measureSchema.omit({
    image: true,
    measure_datetime: true,
    measure_type: true,
    customer_code: true,
    has_confirmed: true,
});

const updateMeasurePayloadSchema = measureSchema
    .pick({
        measure_uuid: true,
    })
    .extend({ confirmed_value: z.number() });

const listMeasuresSchema = measureSchema
    .omit({
        customer_code: true,
        measure_value: true,
        image: true,
    })
    .extend({ measure_datetime: z.date() })
    .array();

const listMeasuresReturnSchema = z.object({
    customer_code: z.string(),
    measures: listMeasuresSchema,
});

export {
    measureSchema,
    createMeasurePayloadSchema,
    createMeasureReturnSchema,
    updateMeasurePayloadSchema,
    measureDbSchema,
    listMeasuresSchema,
    listMeasuresReturnSchema,
};
