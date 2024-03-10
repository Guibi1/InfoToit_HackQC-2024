<script lang="ts">
    export let data;

    let loading = false;
</script>

<main class="container mx-auto py-4">
    <div class="card">
        <div class="h-24 w-24 rounded border-2 border-dark">
            <img src={data.avatar} alt="votre avatar" />
        </div>

        <h1 class="h1">{data.name}</h1>
    </div>

    <h2 class="h1">Maisons sauvegardées</h2>

    <div class="m-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {#each data.savedHomes as home}
            <div class="card">{home.address}</div>
        {:else}
            <div>Pas de maisons</div>
        {/each}
    </div>
</main>
