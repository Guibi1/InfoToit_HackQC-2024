<script lang="ts">
    import { PUBLIC_GOOGLE_MAPS_KEY } from "$env/static/public";
    export let data;

    
    
    let loading = false;
    let bool = false;
</script>

<main class="container mx-auto py-4">
    <div class="card">
        <div class="border-dark h-24 w-24 rounded border-2">
            <img src={data.avatar} alt="votre avatar" />
        </div>

        <h1 class="h1">{data.name}</h1>
        <button
            class="btn"
            on:click={() => {
                if (bool == false) {
                    bool = true;
                } else {
                    bool = false;
                }
            }}>{bool === false ? "Pleintes" : "Maisons"}</button
        >
    </div>

    {#if bool == false}
        <h2 class="h1 ml-2 mt-4">Maisons sauvegardées</h2>
        <div class="card m-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {#each data.savedHomes as home}
                <div class="card">
                    <h4 class="h1">{home.address}</h4>
                    <img
                        alt=""
                        src={`https://maps.googleapis.com/maps/api/streetview?size=400x400&location=${home.lat},${home.lon}&fov=50&pitch=0&key=${PUBLIC_GOOGLE_MAPS_KEY}`}

                    />
                </div>
            {:else}
                <h1 class="h1">Aucun résultat</h1>
            {/each}
        </div>
    {:else}
        <h2 class="h1 ml-2 mt-4">Pleintes</h2>

        {#each data.messages as pleinte}
            <div class="m-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div class="card">
                    <h1 class="h1">{pleinte.title}</h1>
                    <p>{pleinte.message}</p>
                    <h1 class="h1">Status:</h1>
                    <div class="card">{pleinte.status}</div>
                </div>
            </div>
        {:else}
            <div class="flex justify-center">
                <div class="card">
                    <h1 class="h1 mb-0 m-1">Aucun résultat</h1>
                </div>
            </div>
        {/each}
    {/if}
</main>
