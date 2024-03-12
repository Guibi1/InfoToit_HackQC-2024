import { z } from "zod";

export const categoriesDePlaintes = [
    "Aucune",
    "Nids-de-poule",
    "Problèmes de circulation",
    "Éclairage public défectueux",
    "Collecte de déchets non effectuée",
    "Problèmes d'égouts",
    "Graffiti",
    "Nuisances sonores",
    "Problèmes de stationnement",
    "Dégradations de l'espace public",
    "Travaux non terminés",
    "Problèmes de voirie",
    "Décharges sauvages",
    "Autre",
] as const;

export const schema = z.object({
    title: z.string().min(2),
    category: z.enum(categoriesDePlaintes).default("Aucune"),
    message: z.string().min(6),
    coordinate: z.object({
        lon: z.number().min(-74.0).max(-73.3),
        lat: z.number().min(45.3308067).max(45.7556),
    }),
});
