<script lang="ts">
    import { IconBrandDiscord, IconBrandGithub, IconBrandLinkedin } from "@tabler/icons-svelte";

    export let data;
</script>

<main class="container mx-auto p-4">
    <h1 class="h1">Paramètres</h1>

    <h2 class="h2">Profil</h2>

    <div class="mb-4 flex flex-col gap-4">
        <label class="label">
            Nom
            <input type="text" class="input" />
        </label>

        <label class="label">
            Adresse courriel
            <input type="text" class="input" />
        </label>

        <button class="btn mt-2"> Enregistrer </button>
    </div>

    <hr class="hr my-4" />

    <h2 class="h2">Connections</h2>

    <div class="flex flex-col gap-2">
        <div
            class="flex items-center justify-between rounded border-2 border-dark bg-muted p-2 px-4"
        >
            <span class="flex gap-2 font-semibold">
                <IconBrandGithub /> Github
            </span>

            {#if data.providers.includes("github")}
                <button class="btn btn-sm"> Déconnecter </button>
            {:else}
                <a href="/api/auth/github" class="btn btn-sm"> Ajouter la connection </a>
            {/if}
        </div>

        <div
            class="flex items-center justify-between rounded border-2 border-dark bg-muted p-2 px-4"
        >
            <span class="flex gap-2 font-semibold">
                <IconBrandDiscord /> Discord
            </span>

            {#if data.providers.includes("discord")}
                <button class="btn btn-sm"> Déconnecter </button>
            {:else}
                <a href="/api/auth/discord" class="btn btn-sm"> Ajouter la connection </a>
            {/if}
        </div>

        <div
            class="flex items-center justify-between rounded border-2 border-dark bg-muted p-2 px-4"
        >
            <span class="flex gap-2 font-semibold">
                <IconBrandLinkedin /> Linked In
            </span>

            {#if data.providers.includes("linkedin")}
                <button class="btn btn-sm"> Déconnecter </button>
            {:else}
                <a href="/api/auth/linkedin" class="btn btn-sm"> Ajouter la connection </a>
            {/if}
        </div>
    </div>

    <hr class="hr my-4" />

    <h2 class="h2">Account</h2>

    <button class="btn">Delete account</button>
</main>
