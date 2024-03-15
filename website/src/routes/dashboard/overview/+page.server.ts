import { getXataClient } from "$xata";

export const load = async ({ url }) => {
    const dataType = url.searchParams.get("type")?? "service";

    const data_hexes = await getXataClient()
        .db.BusinessAnalysis.select(["hex.polygon", "score"]).filter({type:dataType})
        .getAll();

    

    return {
        hex: data_hexes,
        dataType:dataType,
    };
};
