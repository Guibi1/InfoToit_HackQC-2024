import { getXataClient } from "$xata";

export const load = async ({ url }) => {
    const dataType = url.searchParams.get("type") ?? "service";

    const data_hexes = await getXataClient()
        .db.GouvernementAnalysis.select(["hex.polygon", "score", "hex.id", "recommendation"])
        .filter({ type: dataType })
        .getAll();

    return {
        hex: data_hexes,
        dataType: dataType,
    };
};
