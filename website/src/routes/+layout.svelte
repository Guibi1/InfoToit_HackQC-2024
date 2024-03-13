<script lang="ts">
    import { invalidateAll } from "$app/navigation";
    import { popup, type PopupOptions } from "$lib/popup";
    import "../app.postcss";
    import { IconUser, IconSettings, IconLogout } from "@tabler/icons-svelte";
    import {
        CategoryScale,
        Chart as ChartJS,
        Filler,
        Legend,
        LineElement,
        LinearScale,
        PointElement,
        Title,
        Tooltip,
    } from "chart.js";

    ChartJS.register(
        Filler,
        Title,
        Tooltip,
        Legend,
        LineElement,
        LinearScale,
        PointElement,
        CategoryScale
    );

    export let data;

    const popupSettings: PopupOptions = {
        popupId: "popupNavIcon",
        placement: "bottom",
    };
</script>

<div
    class="sticky inset-2 z-50 m-2 flex justify-between rounded-lg border-2 border-dark bg-white px-4 py-2"
>
    <a class="flex items-center gap-2" href="/">
        <strong class="text-xl">
            InfoToit<small class="text-sm">.ca</small>
        </strong>
    </a>

    <div class="flex items-center gap-4">
        <a class="btn btn-sm" href="/search"> Chercher une maison </a>

        {#if !data.user}
            <a class="btn btn-sm" href="/sign-in">Sign In</a>
        {:else}
            <button class="btn btn-flat h-10 w-10 p-0" use:popup={popupSettings}>
                <img src={data.user.avatar} class="object-cover" alt="your user avatar" />
            </button>
        {/if}
    </div>
</div>

<slot />

<footer class="bg-muted p-2">
    <div class="container mx-auto grid grid-cols-2">
        <div class="grid">
            <span class="text-muted-foreground">
                N'hésitez pas à nous contacter sur <a
                    href="https://www.linkedin.com/company/wolfgang-inc/about/"
                    class="text-dark underline">LinkedIn</a
                >
                si vous avez des questions!
            </span>

            <span>
                <a
                    class="text-dark underline"
                    href="https://github.com/Guibi1/InfoToit_HackQC-2024"
                    target="_blank"
                    rel="noreferrer"
                >
                    Code source
                </a> d'Info Toit
            </span>
        </div>

        <div class="grid text-right">
            <a href="/conditions" class="text-dark underline">Conditions d'utilisation</a>
            <span class="text-sm text-muted-foreground">
                © InfoToit 2024. Tout droits réservés.
            </span>
        </div>
    </div>
</footer>

<div class="popup" id={popupSettings.popupId}>
    <div class="popup-arrow" id="arrow" />

    <div class="card flex w-40 flex-col items-stretch py-2">
        <a
            class="flex items-center gap-1 p-1 px-2 transition-colors hover:bg-muted-foreground hover:text-pale"
            href="/profile"
        >
            <IconUser size={16} /> Profil
        </a>

        <a
            class="flex items-center gap-1 p-1 px-2 transition-colors hover:bg-muted-foreground hover:text-pale"
            href="/settings"
        >
            <IconSettings size={16} /> Paramètres
        </a>

        <hr class="hr mx-2 my-1" />

        <a
            class="flex items-center gap-1 p-1 px-2 transition-colors hover:bg-muted-foreground hover:text-pale"
            href="/sign-out"
            data-sveltekit-preload-data="off"
            on:click={() => invalidateAll()}
        >
            <IconLogout size={16} /> Se déconnecter
        </a>
    </div>
</div>
