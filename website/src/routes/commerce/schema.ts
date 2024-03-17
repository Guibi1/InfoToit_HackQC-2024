import { businessCategories } from "$lib/consts";
import { z } from "zod";

export const schema = z.object({
    type: z.enum(businessCategories),
    long: z.number().min(-74.0).max(-73.3),
    lat: z.number().min(45.3308067).max(45.7556),
});
