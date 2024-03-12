import { getXataClient } from "$xata";
import { redirect } from "@sveltejs/kit";

export const load = async ({ params }) => {
    const address = await getXataClient()
        .db.Addresses.select(["full_addr", "csdname", "longitude", "latitude"])
        .filter({ id: params.id })
        .getFirst();
    if (!address) redirect(302, "/");

    return {
        address: address.full_addr!,
        city: address.csdname!,
        coords: {
            lon: address.longitude!,
            lat: address.latitude!,
        },
    };
};
