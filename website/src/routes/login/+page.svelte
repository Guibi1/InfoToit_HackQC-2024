<script lang="ts">
    import { SignIn, SignOut } from "@auth/sveltekit/components";
    import { page } from "$app/stores";
    import LoginBackground from "$lib/assets/loginbackground.webp";
    import { IconBrandDiscord, IconBrandGithub, IconBrandLinkedin } from "@tabler/icons-svelte";
</script>

<div class="flex h-full items-center justify-center overflow-hidden">
    <div class="absolute inset-0 -z-20 overflow-hidden">
        <img
            alt="Un marché ouvert"
            class="h-full w-full scale-105 object-cover blur-sm brightness-[80%]"
            src={LoginBackground}
        />
    </div>

    <main class="card max-w-80 gap-6 p-6">
        <div>
            <h1 class="h1 mb-0">Bienvenue</h1>
            <span class="font-semibold text-muted-foreground">connecte toi pour continuer</span>
        </div>

        <div class="grid gap-2">
            <SignIn provider="github">
                <div slot="submitButton" class="btn">
                    <IconBrandGithub /> Continuer avec GitHub
                </div>
            </SignIn>

            <SignIn provider="discord">
                <div slot="submitButton" class="btn">
                    <IconBrandDiscord /> Continuer avec Discord
                </div>
            </SignIn>

            <SignIn provider="linkedin">
                <div slot="submitButton" class="btn">
                    <IconBrandLinkedin /> Continuer avec LinkedIn
                </div>
            </SignIn>
        </div>
    </main>
</div>
