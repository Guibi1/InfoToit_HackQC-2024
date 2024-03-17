<script lang="ts">
    import { invalidateAll } from "$app/navigation";
    import Logo from "$lib/assets/Logo.svelte";
    import LogoSimple from "$lib/assets/LogoSimple.svelte";
    import { popup, type PopupOptions } from "$lib/popup";
    import { IconLogout, IconSettings, IconUser } from "@tabler/icons-svelte";
    import {
        CategoryScale,
        Chart as ChartJS,
        Filler,
        Legend,
        LinearScale,
        LineElement,
        PointElement,
        Title,
        Tooltip,
    } from "chart.js";
    import "../app.postcss";

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

<svelte:head>
    <title>Info Toit</title>
</svelte:head>

<div
    class="sticky inset-2 z-50 m-2 flex justify-between rounded-lg border-2 border-dark bg-white px-4 py-2"
>
    <a class="flex items-center gap-2" href="/">
        <LogoSimple size={36} />
    </a>

    <div class="flex items-center gap-4">
        {#if data.user?.isGov}
            <a class="btn btn-sm" href="/dashboard"> Panneau de bord </a>
        {/if}

        <a class="btn btn-sm" href="/messages"> Signaler à ma ville </a>

        <a class="btn btn-sm" href="/"> Chercher une maison </a>

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

<div
    class="absolute inset-0 z-[999999999999] flex animate-[fade_1s_3s_forwards] items-center justify-center overflow-hidden bg-pale"
>
    <Logo size={120} />

    <style>
        @keyframes fade {
            from {
                opacity: 1;
            }
            99% {
                opacity: 0;
            }
            to {
                opacity: 0;
                height: 0px;
            }
        }
    </style>
</div>

<div class="popup" id={popupSettings.popupId}>
    <div class="popup-arrow" id="arrow" />

    <div class="card flex w-40 flex-col items-stretch bg-background py-2">
        <a class="flex items-center gap-1 p-1 px-2 transition-colors hover:bg-pale" href="/profile">
            <IconUser size={16} /> Profil
        </a>

        <a
            class="flex items-center gap-1 p-1 px-2 transition-colors hover:bg-pale"
            href="/settings"
        >
            <IconSettings size={16} /> Paramètres
        </a>

        <hr class="hr mx-2 my-1" />

        <a
            class="flex items-center gap-1 p-1 px-2 transition-colors hover:bg-pale"
            href="/sign-out"
            data-sveltekit-preload-data="off"
            on:click={() => invalidateAll()}
        >
            <IconLogout size={16} /> Se déconnecter
        </a>
    </div>
</div>
