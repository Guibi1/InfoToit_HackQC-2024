import { getXataClient } from "$xata";
import { latLngToCell } from "h3-js";

export const load = async ({ locals, url }) => {
    const id = url.searchParams.get("id");
    if (!id) return {};

    const house = await getXataClient()
        .db.Addresses.select([
            "id",
            "civic_no_prefix",
            "civic_no",
            "civic_no_suffix",
            "street_type",
            "street_name",
            "street_dir",
            "location.longitude",
            "location.latitude",
        ])
        .filter({ id })
        .getFirst();

    if (!house || !house.location) return {};

    const hexId = latLngToCell(house.location.latitude, house.location.longitude, 8);

    const houseAnalysis = await getXataClient()
        .db.HouseAnalysis.select(["info"])
        .filter({ id: hexId })
        .getFirst();

    if (!houseAnalysis) return {};

    const savedHouse = locals.user
        ? await getXataClient()
              .db.SavedHouses.select(["id"])
              .filter({ user: locals.user.id, address: house.id })
              .getFirst()
        : false;

    return {
        house,
        houseAnalysis: houseAnalysis.info,
        address: `${house.civic_no_prefix}${house.civic_no_prefix ? "-" : ""}${house.civic_no}${house.civic_no_suffix} ${house.street_type.toLowerCase()} ${house.street_name}${house.street_dir ? " " : ""}${house.street_dir}`,
        houseSaved: !!savedHouse,
    };
};
