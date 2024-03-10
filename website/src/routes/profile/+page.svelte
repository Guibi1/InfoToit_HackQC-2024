<script lang="ts">
    export let data;
    data.name = "Gabriel Mikus";

    let loading = false;
    let bool = false;
</script>

<main>
    <div class="card">
        <img src={data.avatar} alt="" />
        <h1 class="h1">{data.name}</h1>
        <button
            class="btn"
            on:click={() => {
                bool = true;
            }}>Pleintes</button
        >
    </div>

    {#if (bool = false)}
        <h2 class="h1">Maisons sauvegardées</h2>
        <div class="card m-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {#each data.savedHome as home}
                <div class="card">
                    <h4 class="h1">{home.name}</h4>
                    <img alt="" src={home.img} />
                </div>
                {:else}
                   <h1 class="h1">Aucun résultat</h1>
                   <h1 class="h1">Auc</h1>
            {/each}
        </div>
        {:else}
         <h2 class="h1">Pleintes</h2>
        <div class="card m-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {#each data.savedHome as home}
                <div class="card">
                    <h4 class="h1">{home.name}</h4>
                    <img alt="" src={home.img} />
                </div>
                {:else}
                   <h1 class="h1">Aucun résultat</h1>
                   <h1 class="h1">Auc</h1>
            {/each}
        </div>

    {/if}
    
</main>
