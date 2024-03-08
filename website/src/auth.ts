import { GITHUB_ID, GITHUB_SECRET, SECRET } from "$env/static/private";
import { SvelteKitAuth } from "@auth/sveltekit";
import GitHub from "@auth/sveltekit/providers/github";
import Google from "@auth/sveltekit/providers/google";
import LinkedIn from "@auth/sveltekit/providers/linkedin";

export const { handle, signIn, signOut } = SvelteKitAuth({
    providers: [GitHub({ clientId: GITHUB_ID, clientSecret: GITHUB_SECRET }), Google, LinkedIn],
    secret: SECRET,
});
