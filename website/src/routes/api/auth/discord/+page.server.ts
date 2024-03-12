import { dev } from "$app/environment";
import { discord } from "$lib/auth.js";
import { redirect } from "@sveltejs/kit";
import { generateState } from "arctic";

export const load = async ({ cookies, url: base }) => {
    const state = generateState();
    const url = await discord(base).createAuthorizationURL(state, {
        scopes: ["identify", "email"],
    });

    cookies.set("discord_oauth_state", state, {
        httpOnly: true,
        secure: !dev,
        maxAge: 60 * 10, // 10 minutes
        path: "/",
    });

    redirect(302, url.toString());
};
