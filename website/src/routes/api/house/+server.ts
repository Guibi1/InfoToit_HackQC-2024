import { getXataClient } from "$xata";
import { error, json } from "@sveltejs/kit";

export const POST = async ({ locals, request }) => {
    if (!locals.user) throw error(401);
    const houseId = await request.text();

    const row = await getXataClient()
        .db.SavedHouses.filter({
            user: locals.user,
            address: houseId,
        })
        .getFirst();

    if (!row) {
        await getXataClient().db.SavedHouses.create({
            user: locals.user,
            address: houseId,
        });
    } else {
        row.delete([]);
    }

    return json({ success: true });
};
