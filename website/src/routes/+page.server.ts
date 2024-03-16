import { getXataClient } from "$xata";
import { latLngToCell } from "h3-js";

export const load = async ({ locals, url }) => {
    const locationId = url.searchParams.get("id");
    if (!locationId) return {};

    const house = await getXataClient()
        .db.Addresses.select([
            "id",
            "civic_no_prefix",
            "civic_no",
            "civic_no_suffix",
            "street_type",
            "street_name",
            "street_dir",
            "mail_postal_code",
            "location.longitude",
            "location.latitude",
        ])
        .filter({ location: locationId })
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
        address: `${house.civic_no_prefix}${house.civic_no_prefix ? "-" : ""}${house.civic_no}${house.civic_no_suffix} ${house.street_type.toLowerCase()} ${house.street_name}${house.street_dir ? " " : ""}${house.street_dir}, ${house.mail_postal_code}`,
        houseSaved: !!savedHouse,
    };
};
