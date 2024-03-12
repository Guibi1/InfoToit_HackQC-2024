import { getXataClient } from "$xata";
import { redirect } from "@sveltejs/kit";

export const load = async ({ locals }) => {
    if (!locals.user) redirect(302, "/");

    const savedHomes = await getXataClient()
        .db.SavedHouses.select(["address", "lon", "lat"])
        .filter({ user: locals.user })
        .getAll();

    const messages = await getXataClient()
        .db.Messages.select(["title", "message", "category", "status", "lon", "lat"])
        .filter({ user: locals.user })
        .getAll();

    return {
        user: locals.user,
        savedHomes: savedHomes.map((h) => h.toSerializable()),
        messages: messages.map((m) => m.toSerializable()),
    };
};
