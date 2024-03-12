import { getXataClient } from "$xata";
import { error, json } from "@sveltejs/kit";

export const POST = async ({ locals, params }) => {
    if (!locals.user) error(401);

    const res = await getXataClient().db.SavedHouses.create({
        address: params.id,
        user: locals.user,
    });

    return json({
        success: true,
        id: res.id,
    });
};
