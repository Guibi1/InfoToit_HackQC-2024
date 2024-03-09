<script lang="ts">
    import "../app.postcss";
    import { AppShell, AppBar } from "@skeletonlabs/skeleton";
    import { signIn, signOut } from "@auth/sveltekit/client";
    import { Avatar } from "@skeletonlabs/skeleton";
    import { popup } from "@skeletonlabs/skeleton";
    import type { PopupSettings } from "@skeletonlabs/skeleton";
    import { computePosition, autoUpdate, offset, shift, flip, arrow } from "@floating-ui/dom";

    import { storePopup } from "@skeletonlabs/skeleton";
    storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

    export let data;

    const popupFeatured: PopupSettings = {
        event: "click",
        target: "popupFeatured",
        placement: "bottom",
    };
</script>

<AppShell>
    <svelte:fragment slot="header">
        <AppBar border="border-b border-primary-300-600-token">
            <a slot="lead" class="flex items-center gap-2" href="/">
                <strong class="text-xl uppercase"
                    >Pulse Interview<small class="text-sm">.tech</small></strong
                >
            </a>

            <svelte:fragment slot="trail">
                <a
                    class="variant-ghost-secondary btn btn-sm hidden md:block"
                    href="https://github.com/Guibi1/InfoToit_HackQC-2024"
                    target="_blank"
                    rel="noreferrer"
                >
                    GitHub
                </a>

                {#if !data.loggedIn}
                    <button class="variant-ghost-tertiary btn btn-sm" on:click={() => signIn("a0")}
                        >Sign In with Auth0</button
                    >
                {:else}
                    //
                {/if}

                {#if data.avatar}
                    <button class="btn btn-icon" use:popup={popupFeatured}>
                        <Avatar src={data.avatar} width="w-12" rounded="rounded-full" />
                    </button>
                {/if}
            </svelte:fragment>
        </AppBar>
    </svelte:fragment>

    <slot />
</AppShell>
