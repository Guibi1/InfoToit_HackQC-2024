import { redirect } from "@sveltejs/kit";

export const load = async ({ locals }) => {
    const session = await locals.auth();
    if (!session) redirect(302, "/");

    return {
        savedHomes: [
            {
                id: "2657769493634526",
                address: "1 Boulevard Gouin Est, Montreal, Quebec H3L 1A6, Canada",
            },
            {
                id: "8996322444307904",
                address: "1 Rue Saint-Zotique Est, Montreal, Quebec H2S 3C5, Canada",
            },
        ],
    };
};
