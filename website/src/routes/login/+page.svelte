<script lang="ts">
    import { SignIn, SignOut } from "@auth/sveltekit/components";
    import { page } from "$app/stores";
    import GithubIcon from "$lib/assets/brand-github-filled.svelte";
    import DiscordIcon from "$lib/assets/brand-discord-filled.svelte";
    import LinkedInIcon from "$lib/assets/brand-linkedin.svelte";
    import LoginBackground from "$lib/assets/loginbackground.jpg";
</script>

<main class="relative flex items-center justify-center">
    <img alt="" class="absolute inset-0 -z-10 object-cover" src={LoginBackground} />
    <div class="card grid max-w-80 justify-center p-4 pb-6">
        <h2 class="h2">Bienvenue,</h2>
        <h8 class="h8 ml-1 mt-1">connecte toi pour continuer</h8>
        <div class="card mt-6 grid gap-2 p-2">
            <SignIn provider="github" class="btn variant-filled m-1">
                <div slot="submitButton" class="flex gap-2">
                    <span><GithubIcon></GithubIcon></span>
                    <span>Continue avec GitHub</span>
                </div>
            </SignIn>
            <SignIn provider="discord" class="btn variant-filled m-1 ">
                <div slot="submitButton" class="flex gap-2">
                    <span><DiscordIcon></DiscordIcon></span>
                    <span>Continue avec Discord</span>
                </div>
            </SignIn>
            <SignIn provider="linkedin" class="btn variant-filled m-1">
                <div slot="submitButton" class=" flex gap-2">
                    <span><LinkedInIcon></LinkedInIcon></span>
                    <span>Continue avec LinkedIn</span>
                </div>
            </SignIn>
        </div>
    </div>
</main>
