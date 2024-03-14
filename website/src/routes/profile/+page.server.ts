import { getXataClient } from "$xata";
import { redirect } from "@sveltejs/kit";

export const load = async ({ locals }) => {
    if (!locals.user) redirect(302, "/");

    const savedHomes = await getXataClient()
        .db.SavedHouses.select(["address", "address.longitude", "address.latitude"])
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
