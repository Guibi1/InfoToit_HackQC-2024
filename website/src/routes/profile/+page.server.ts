import { getXataClient } from "$xata";
import { redirect } from "@sveltejs/kit";

export const load = async ({ locals }) => {
    if (!locals.user) redirect(302, "/");

    const savedHomes = await getXataClient()
        .db.SavedHouses.select([
            "id",
            "address.id",
            "address.civic_no_prefix",
            "address.civic_no",
            "address.civic_no_suffix",
            "address.street_type",
            "address.street_name",
            "address.street_dir",
            "address.mail_postal_code",
            "address.location.longitude",
            "address.location.latitude",
        ])
        .filter({ user: locals.user })
        .getAll();

    const messages = await getXataClient()
        .db.Messages.select(["title", "message", "category", "status", "lon", "lat"])
        .filter({ user: locals.user })
        .getAll();

    return {
        user: locals.user,
        savedHomes: savedHomes,
        messages: messages,
    };
};
