<script lang="ts">
    import { invalidateAll } from "$app/navigation";
    import "../app.postcss";

    export let data;

    const popupFeatured = {
        event: "click",
        target: "popupFeatured",
        placement: "bottom",
    };
</script>

<div
    class="sticky inset-2 z-50 m-2 flex justify-between rounded-lg border-2 border-dark bg-pale px-4 py-2"
>
    <a class="flex items-center gap-2" href="/">
        <strong class="text-xl">
            InfoToit<small class="text-sm">.ca</small>
        </strong>
    </a>

    <div class="flex items-center gap-4">
        <a
            class="btn btn-sm"
            href="https://github.com/Guibi1/InfoToit_HackQC-2024"
            target="_blank"
            rel="noreferrer"
        >
            GitHub
        </a>

        {#if !data.user}
            <a class="btn btn-sm" href="/sign-in">Sign In</a>
        {:else}
            <a
                class="btn btn-flat h-10 w-10 p-0"
                href="/sign-out"
                data-sveltekit-preload-data="off"
                on:click={() => invalidateAll()}
            >
                <img src={data.user.avatar} class="object-cover" alt="your user avatar" />
            </a>
        {/if}
    </div>
</div>

<slot />
