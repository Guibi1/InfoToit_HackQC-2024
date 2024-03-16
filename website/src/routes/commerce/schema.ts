import { z } from "zod";
import { businessCategories } from "$lib/consts";



export const schema = z.object({
    type: z.enum(businessCategories),
    coordinate: z.object({
        lon: z.number().min(-74.0).max(-73.3),
        lat: z.number().min(45.3308067).max(45.7556),
    }),
});
