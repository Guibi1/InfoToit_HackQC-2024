import { dev } from "$app/environment";
import { github } from "$lib/auth.js";
import { redirect } from "@sveltejs/kit";
import { generateState } from "arctic";

export const load = async ({ cookies }) => {
    const state = generateState();
    const url = await github.createAuthorizationURL(state, {
        scopes: ["read:user"],
    });

    cookies.set("github_oauth_state", state, {
        httpOnly: true,
        secure: !dev,
        maxAge: 60 * 10, // 10 minutes
        path: "/",
    });

    redirect(302, url.toString());
};
