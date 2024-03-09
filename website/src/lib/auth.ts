import { GITHUB_ID, GITHUB_SECRET, SECRET } from "$env/static/private";
import { DISCORD_ID, DISCORD_SECRET} from "$env/static/private";
import { SvelteKitAuth } from "@auth/sveltekit";
import Discord from "@auth/sveltekit/providers/discord";
import GitHub from "@auth/sveltekit/providers/github";
import LinkedIn from "@auth/sveltekit/providers/linkedin";

export const { handle, signIn, signOut } = SvelteKitAuth({
    providers: [GitHub({ clientId: GITHUB_ID, clientSecret: GITHUB_SECRET }), Discord({clientId:DISCORD_ID,clientSecret:DISCORD_SECRET}), LinkedIn],
    secret: SECRET,
});
