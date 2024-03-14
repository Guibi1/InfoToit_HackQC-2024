import { getXataClient } from "$xata";

export const load = async ({ locals }) => {
    const h3_hexes = await getXataClient()
        .db.h3_hexes.select(["polygon"])
        .filter({ resolution: 8 })
        .getAll();

    return {
        user: locals.user,
        h3_hexes: h3_hexes,
    };
};
