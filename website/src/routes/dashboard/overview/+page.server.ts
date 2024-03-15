import { getXataClient } from "$xata";

export const load = async ({ url }) => {
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
