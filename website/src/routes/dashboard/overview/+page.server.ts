import { getXataClient } from "$xata";

export const load = async ({ locals }) => {
    const business_hexes = await getXataClient()
        .db.BusinessAnalysis.select(["hex.polygon","score"]).getAll()
        
        
    
    return {
        hex:business_hexes,
    };
};
