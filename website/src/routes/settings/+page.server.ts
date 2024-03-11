import { getXataClient } from "$xata";
import { redirect } from "@sveltejs/kit";

export const load = async ({ locals }) => {
    if (!locals.user) redirect(302, "/");
    const rows = await getXataClient()
        .db.OAuth.select(["provider"])
        .filter({ "user.id": locals.user.id })
        .getAll();

    return {
        providers: rows.map((r) => r.provider),
    };
};
