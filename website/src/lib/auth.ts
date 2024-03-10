import {
    DISCORD_ID,
    DISCORD_SECRET,
    GITHUB_ID,
    GITHUB_SECRET,
    LINKEDIN_ID,
    LINKEDIN_SECRET,
    SECRET,
} from "$env/static/private";
import { getXataClient } from "$xata";
import { SvelteKitAuth } from "@auth/sveltekit";
import Discord from "@auth/sveltekit/providers/discord";
import GitHub from "@auth/sveltekit/providers/github";
import LinkedIn from "@auth/sveltekit/providers/linkedin";

export const { handle, signIn, signOut } = SvelteKitAuth({
    providers: [
        GitHub({ clientId: GITHUB_ID, clientSecret: GITHUB_SECRET }),
        Discord({ clientId: DISCORD_ID, clientSecret: DISCORD_SECRET }),
        LinkedIn({ clientId: LINKEDIN_ID, clientSecret: LINKEDIN_SECRET }),
    ],
    secret: SECRET,
    callbacks: {
        signIn({ user }) {
            getXataClient()
                .db.Users.select(["id"])
                .filter({ email: user.email })
                .getFirst()
                .then((res) => {
                    if (res) return;
                    getXataClient().db.Users.create({
                        name: user.name ?? "",
                        email: user.email,
                        avatar: user.image,
                    });
                });
            return true;
        },
    },
    pages: {
        signIn: "/../login",
    },
});
