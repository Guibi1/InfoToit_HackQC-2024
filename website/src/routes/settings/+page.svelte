<script lang="ts">
    import { invalidateAll, invalidate } from "$app/navigation";
    import { page } from "$app/stores";
    import { IconBrandDiscord, IconBrandGithub, IconBrandLinkedin } from "@tabler/icons-svelte";
    import { popup, type PopupOptions } from "$lib/popup";

    export let data;

    const popupSettings: PopupOptions = {
        popupId: "popupDeleteAccount",
        placement: "bottom",
    };

    async function disconnectProvider(provider: string) {
        await fetch($page.url, { method: "PUT", body: provider });
        invalidate("providers");
    }

    async function deleteAccount() {
        await fetch($page.url, { method: "DELETE" });
        invalidateAll();
    }
</script>

<main class="container mx-auto p-4">
    <h1 class="h1">Paramètres</h1>

    <h2 class="h2">Profil</h2>

    <div class="mb-4 flex flex-col gap-4">
        <label class="label">
            Nom
            <input type="text" class="input" value={data.user?.name} />
        </label>

        <label class="label">
            Adresse courriel
            <input type="text" class="input" value={data.user?.email} />
        </label>

        <button class="btn mt-2"> Enregistrer </button>
    </div>

    <hr class="hr my-4" />

    <h2 class="h2">Connections</h2>

    <div class="grid gap-4 px-2 lg:grid-cols-3">
        <div
            class="flex items-center justify-between rounded border-2 border-dark bg-muted p-2 px-4"
        >
            <span class="flex gap-2 font-semibold">
                <IconBrandGithub /> Github
            </span>

            {#if data.providers.includes("github")}
                <button
                    class="btn btn-sm btn-flat btn-destructive"
                    on:click={() => disconnectProvider("github")}
                >
                    Déconnecter
                </button>
            {:else}
                <a href="/api/auth/github" class="btn btn-sm btn-flat"> Ajouter la connection </a>
            {/if}
        </div>

        <div
            class="flex items-center justify-between rounded border-2 border-dark bg-muted p-2 px-4"
        >
            <span class="flex gap-2 font-semibold">
                <IconBrandDiscord /> Discord
            </span>

            {#if data.providers.includes("discord")}
                <button
                    class="btn btn-sm btn-flat btn-destructive"
                    on:click={() => disconnectProvider("discord")}
                >
                    Déconnecter
                </button>
            {:else}
                <a href="/api/auth/discord" class="btn btn-sm btn-flat"> Ajouter la connection </a>
            {/if}
        </div>

        <div
            class="flex items-center justify-between rounded border-2 border-dark bg-muted p-2 px-4"
        >
            <span class="flex gap-2 font-semibold">
                <IconBrandLinkedin /> Linked In
            </span>

            {#if data.providers.includes("linkedin")}
                <button
                    class="btn btn-sm btn-flat btn-destructive"
                    on:click={() => disconnectProvider("linkedin")}
                >
                    Déconnecter
                </button>
            {:else}
                <a href="/api/auth/linkedin" class="btn btn-sm btn-flat"> Ajouter la connection </a>
            {/if}
        </div>
    </div>

    <hr class="hr my-4" />

    <h2 class="h2">Account</h2>

    <button class="btn btn-destructive" use:popup={popupSettings}>Delete your account</button>
</main>

<div class="popup" id={popupSettings.popupId}>
    <div class="popup-arrow" id="arrow" />

    <div class="card flex w-40 flex-col items-stretch gap-2 p-4">
        <button class="btn btn-sm btn-flat">Cancel</button>
        <button class="btn btn-sm btn-flat btn-destructive" on:click={deleteAccount}>Confirm</button
        >
    </div>
</div>
