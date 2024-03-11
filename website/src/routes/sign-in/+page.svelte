<script lang="ts">
    import LoginBackground from "$lib/assets/loginbackground.webp";
    import { IconBrandDiscord, IconBrandGithub, IconBrandLinkedin } from "@tabler/icons-svelte";
</script>

<div class="flex flex-1 items-center justify-center overflow-hidden">
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
            <a href="/api/auth/github" class="btn" data-sveltekit-preload-data="off">
                <IconBrandGithub /> Continuer avec GitHub
            </a>

            <a href="/api/auth/discord" class="btn" data-sveltekit-preload-data="off">
                <IconBrandDiscord /> Continuer avec Discord
            </a>

            <a href="/api/auth/linkedin" class="btn" data-sveltekit-preload-data="off">
                <IconBrandLinkedin /> Continuer avec LinkedIn
            </a>
        </div>
    </main>
</div>
