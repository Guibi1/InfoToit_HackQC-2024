import { getXataClient } from "$xata";
import { redirect } from "@sveltejs/kit";

export const load = async ({ locals, url }) => {
    if (!locals.user?.isGov) redirect(302, "/");

    const dataType = url.searchParams.get("type") ?? "service";

    const data_hexes = await getXataClient()
        .db.GouvernementAnalysis.select([
            "hex.polygon",
            "score",
            "typeneeded",
            "hex.id",
            "recommendation",
        ])
        .getAll();

    return {
        hex: data_hexes,
        dataType: dataType,
    };
};
