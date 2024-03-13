import { dev } from "$app/environment";
import {
    DISCORD_ID,
    DISCORD_SECRET,
    GITHUB_ID,
    GITHUB_SECRET,
    LINKEDIN_ID,
    LINKEDIN_SECRET,
} from "$env/static/private";
import { Discord, GitHub, LinkedIn } from "arctic";
import { Lucia } from "lucia";
import { XataAdapter } from "./xataAdapter";

const adapter = new XataAdapter();

export const lucia = new Lucia(adapter, {
    sessionCookie: {
        attributes: {
            secure: !dev,
        },
    },
    getUserAttributes: (db) => ({
        name: db.name,
        email: db.email,
        avatar: db.avatar,
        isGov: db.isGov,
    }),
});

export const github = new GitHub(GITHUB_ID, GITHUB_SECRET);
export const discord = (base: URL) =>
    new Discord(DISCORD_ID, DISCORD_SECRET, new URL("/api/auth/discord/callback", base).toString());
export const linkedin = (base: URL) =>
    new LinkedIn(
        LINKEDIN_ID,
        LINKEDIN_SECRET,
        new URL("/api/auth/linkedin/callback", base).toString()
    );

declare module "lucia" {
    interface Register {
        Lucia: typeof lucia;
        DatabaseUserAttributes: DatabaseUserAttributes;
    }
}

interface DatabaseUserAttributes {
    name: string;
    email: string;
    avatar: string;
    isGov: boolean;
}
