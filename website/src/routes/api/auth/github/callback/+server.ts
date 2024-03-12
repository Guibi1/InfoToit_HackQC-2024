import { github, lucia } from "$lib/auth.js";
import { getXataClient } from "$xata";
import { error, redirect } from "@sveltejs/kit";
import { OAuth2RequestError } from "arctic";

const provider = "github";

export const GET = async ({ locals, cookies, url, fetch }) => {
    const stateCookie = cookies.get("github_oauth_state") ?? null;

    const state = url.searchParams.get("state");
    const code = url.searchParams.get("code");

    if (!state || !stateCookie || !code || stateCookie !== state) {
        error(400);
    }

    const tokens = await github
        .validateAuthorizationCode(code)
        .catch((e) => (e instanceof OAuth2RequestError ? e : null));
    if (!tokens) {
        error(400);
    } else if (tokens instanceof OAuth2RequestError) {
        redirect(302, `/sign-in?${tokens.description}`);
    }

    const githubUserResult: GitHubUserResult = await fetch("https://api.github.com/user", {
        headers: {
            Authorization: `Bearer ${tokens.accessToken}`,
        },
    }).then((res) => res.json());

    if (locals.user) {
        // If the user is connected (he wants to add a connection method)
        await getXataClient().db.OAuth.create({
            user: locals.user,
            provider,
            accountId: `${githubUserResult.id}`,
        });
        redirect(302, "/settings");
    }

    const oauthConnection = await getXataClient()
        .db.OAuth.select(["id", "user.id"])
        .filter({
            provider,
            accountId: `${githubUserResult.id}`,
        })
        .getFirst();

    let userId = "";
    if (oauthConnection?.user) {
        // If the oauth already exists
        userId = oauthConnection.user.id;
    } else {
        const userWithEmail = await getXataClient()
            .db.Users.select(["id"])
            .filter({
                email: githubUserResult.email,
            })
            .getFirst();

        if (userWithEmail) {
            // If it is a new oauth but the user exists
            userId = userWithEmail.id;
        } else {
            // If it is a new user
            const user = await getXataClient().db.Users.create({
                name: githubUserResult.name,
                email: githubUserResult.email,
                avatar: githubUserResult.avatar_url,
            });
            userId = user.id;
        }

        await getXataClient().db.OAuth.create({
            user: userId,
            provider,
            accountId: `${githubUserResult.id}`,
        });
    }

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies.set(sessionCookie.name, sessionCookie.value, {
        path: "/",
        ...sessionCookie.attributes,
    });

    redirect(302, "/");
};

interface GitHubUserResult {
    id: number;
    name: string;
    email: string;
    avatar_url: string;
}
