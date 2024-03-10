<script lang="ts">
    import { page } from "$app/stores";

    export let data;

    async function onSave() {
        await fetch($page.url, { method: "POST" });
    }
</script>

{data.address}
{data.coords.lon}
{data.coords.lat}

<button class="btn" on:click={onSave}>Enregistrer</button>
