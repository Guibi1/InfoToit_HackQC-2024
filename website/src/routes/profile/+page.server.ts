import { getXataClient } from "$xata";
import { redirect } from "@sveltejs/kit";

export const load = async ({ locals }) => {
    const session = await locals.auth();
    if (!session?.user?.email) redirect(302, "/");

    const savedHomes = await getXataClient()
        .db.SavedHouses.select(["address", "lon", "lat"])
        .filter({ "user.email": session.user?.email })
        .getAll();

    const messages = await getXataClient()
        .db.Messages.select(["title", "message", "status"])
        .filter({ "user.email": session.user?.email })
        .getAll();

    return {
        savedHomes: savedHomes.map((h) => h.toSerializable()),
        messages: messages.map((m) => m.toSerializable()),
    };
};
