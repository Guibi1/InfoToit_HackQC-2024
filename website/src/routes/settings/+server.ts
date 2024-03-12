import { lucia } from "$lib/auth.js";
import { getXataClient } from "$xata";
import { error, redirect } from "@sveltejs/kit";

export const PUT = async ({ locals, request }) => {
    if (!locals.user) error(401);

    const provider = await request.text();
    if (!["github", "discord", "linkedin"].includes(provider)) error(400);

    await getXataClient()
        .db.OAuth.select(["id"])
        .filter({ user: locals.user, provider })
        .getAll()
        .then((rows) => rows.map((r) => r.delete()));

    redirect(302, "/");
};

export const DELETE = async ({ locals, cookies }) => {
    if (!locals.user) error(401);

    await lucia.invalidateUserSessions(locals.user.id);
    cookies.delete(lucia.sessionCookieName, { path: "/" });

    await getXataClient()
        .db.OAuth.select(["id"])
        .filter({ user: locals.user })
        .getAll()
        .then((rows) => rows.map((r) => r.delete()));
    await getXataClient().db.Users.delete(locals.user);

    redirect(302, "/");
};
