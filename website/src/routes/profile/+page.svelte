<script lang="ts">
    export let data;
    data.name="Gabriel Mikus"
    
    let loading = false;
</script>

<main>
    <div class="card">
        <img src={data.avatar} alt="" />
        <h1 class="h1">{data.name}</h1>
    </div>
     <h2 class="h1">Maisons sauvegardées</h2>
    <div class="card m-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {#each data.savedHome as home}
        <div class=""></div>
        {/each}
    </div>
</main>
