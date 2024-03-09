<script lang="ts">
    import "../app.postcss";
    import { signIn, signOut } from "@auth/sveltekit/client";
    import { computePosition, autoUpdate, offset, shift, flip, arrow } from "@floating-ui/dom";

    export let data;

    const popupFeatured = {
        event: "click",
        target: "popupFeatured",
        placement: "bottom",
    };
</script>

<div class="sticky z-50 flex justify-between px-4 py-2">
    <a class="flex items-center gap-2" href="/">
        <strong class="text-xl uppercase">
            Info Toit<small class="text-sm">.ca</small>
        </strong>
    </a>

    <div class="flex gap-2">
        <a
            class="btn btn-sm"
            href="https://github.com/Guibi1/InfoToit_HackQC-2024"
            target="_blank"
            rel="noreferrer"
        >
            GitHub
        </a>

        {#if !data.loggedIn}
            <a class="btn btn-sm" href="/login">Sign In</a>
        {:else}
            <a class="btn btn-sm" href="/login">Sign Out</a>
        {/if}

        {#if data.avatar}
            <button class="btn btn-icon h-12 w-12 rounded" on:click={() => signOut()}>
                <img src={data.avatar} class="object-cover" alt="your user avatar" />
            </button>
        {/if}
    </div>
</div>

<slot />
