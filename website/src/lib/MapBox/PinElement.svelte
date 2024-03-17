<script lang="ts">
    import { type Icon } from "@tabler/icons-svelte";

    export let icon: Icon["new"];
    export let color: string | undefined;
</script>

<div class="relative flex h-12 w-12 -translate-y-1/2 justify-center text-dark">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {color}>
        <path
            d="M18.4,4.6c3.4,3.4,3.5,9,0.2,12.5l-0.2,0.2l-4.2,4.2c-1.1,1.1-2.9,1.2-4.1,0.1l-0.1-0.1l-4.2-4.2c-3.5-3.5-3.5-9.2,0-12.7 S14.8,1.1,18.4,4.6z"
        />
    </svg>

    <svelte:component this={icon} size={22} class="absolute top-[10px] text-pale" />
</div>
