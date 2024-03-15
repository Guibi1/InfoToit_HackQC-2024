import { getXataClient } from "$xata";
import { latLngToCell } from "h3-js";

export const load = async ({ url }) => {
    const locationId = url.searchParams.get("id");

    const h3_hexes = await getXataClient()
        .db.h3_hexes.select(["polygon"])
        .filter({ resolution: 8 })
        .getAll();

    if (!locationId) return { h3_hexes };

    const house = await getXataClient()
        .db.Locations.select(["id", "longitude", "latitude"])
        .filter({ id: locationId })
        .getFirst();

    if (!house) return { h3_hexes };

    const hexId = latLngToCell(house?.latitude, house?.longitude, 8);

    const houseAnalysis = await getXataClient().db.HouseAnalysis.filter({ id: hexId }).getFirst();

    return {
        h3_hexes,
        house,
        houseAnalysis,
    };
};
