import { lucia } from "$lib/auth.js";
import { redirect } from "@sveltejs/kit";

export const load = async ({ locals, cookies }) => {
    if (locals.session) {
        lucia.invalidateSession(locals.session.id);
        cookies.delete(lucia.sessionCookieName, { path: "/" });
    }

    redirect(302, "/");
};
