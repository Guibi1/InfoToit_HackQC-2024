import { getXataClient } from "$xata";
import { redirect } from "@sveltejs/kit";

export const load = async ({ locals }) => {
    if (!locals.user?.isGov) redirect(302, "/");

    return {
        messages: await getXataClient()
            .db.Messages.filter({ status: { $isNot: "Terminé" } })
            .getAll(),
    };
};
