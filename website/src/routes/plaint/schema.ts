import { messageCategories } from "$lib/consts";
import { z } from "zod";



export const schema = z.object({
    title: z.string().min(2),
    category: z.enum(messageCategories).default("Autre - Communications"),
    message: z.string().min(6),
    coordinate: z.object({
        lon: z.number().min(-74.0).max(-73.3),
        lat: z.number().min(45.3308067).max(45.7556),
    }),
});
