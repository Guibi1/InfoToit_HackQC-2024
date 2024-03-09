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

<div class="sticky z-50 m-2 flex justify-between rounded-lg border-2 border-dark bg-pale px-4 py-2">
    <a class="flex items-center gap-2" href="/">
        <strong class="text-xl uppercase">
            Info Toit<small class="text-sm">.ca</small>
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

        {#if !data.loggedIn}
            <a class="btn btn-sm" href="/login">Sign In</a>
        {/if}

        {#if data.avatar}
            <button class="btn btn-flat h-10 w-10 p-0" on:click={() => signOut()}>
                <img src={data.avatar} class="object-cover" alt="your user avatar" />
            </button>
        {/if}
    </div>
</div>

<slot />
