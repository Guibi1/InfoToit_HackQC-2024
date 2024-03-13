import { redirect } from "@sveltejs/kit";

export const load = async ({ locals }) => {
    if (!locals.user?.isGov) redirect(302, "/");
};
