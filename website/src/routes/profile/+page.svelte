<script lang="ts">
    import { PUBLIC_GOOGLE_MAPS_KEY } from "$env/static/public";

    export let data;

    let showPlaints = false;
</script>

<main class="container mx-auto flex flex-col gap-8 py-4 md:flex-row">
    <div class="flex flex-col items-center gap-2">
        <div class="mx-2 rounded border-2 border-dark p-4">
            <div class="flex items-center gap-4">
                <div class="h-24 w-24 rounded border-2 border-dark">
                    <img
                        class="h-full w-full object-cover"
                        src={data.user.avatar}
                        alt="votre avatar"
                    />
                </div>
                <div>
                    <p class="h1 mb-0">{data.user.name}</p>
                    <p class="text-muted-foreground">{data.user.email}</p>
                </div>
            </div>
        </div>

        <button class="btn mt-4" on:click={() => (showPlaints = false)}> Maisons </button>
        <button class="btn" on:click={() => (showPlaints = true)}> Pleintes </button>
        <a class="btn" href="/settings"> Paramètres </a>
    </div>

    <div class="flex flex-1 flex-col">
        {#if showPlaints}
            <h2 class="h1 mx-2 border-b-2 border-dark">Pleintes</h2>

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
                    <div class="card p-2">
                        <p class="">Aucun résultat</p>
                    </div>
                </div>
            {/each}
        {:else}
            <h2 class="h1 mx-2 border-b-2 border-dark">Maisons sauvegardées</h2>

            {#if data.savedHomes.length}
                <div class="m-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {#each data.savedHomes as home}
                        <a class="card p-2" href={`/house/${home.address}`}>
                            <img
                                class="h-24 w-24 rounded"
                                src={`https://maps.googleapis.com/maps/api/streetview?size=400x400&location=${home.lat},${home.lon}&fov=50&pitch=0&key=${PUBLIC_GOOGLE_MAPS_KEY}`}
                                alt="la maison vue de la rue"
                            />

                            <span class="text-xl">{home.address}</span>
                        </a>
                    {/each}
                </div>
            {:else}
                <div class="flex justify-center">
                    <div class="card p-2">
                        <p class="">Aucun résultat</p>
                    </div>
                </div>
            {/if}
        {/if}
    </div>
</main>
