<script lang="ts">
    import { PUBLIC_GOOGLE_MAPS_KEY } from "$env/static/public";

    export let data;

    let showPlaints = false;

    async function removeHouse(house: (typeof data.savedHomes)[number]) {
        await fetch("/api/house", { method: "POST", body: house.id });
        data.savedHomes.splice(data.savedHomes.indexOf(house));
        data.savedHomes = data.savedHomes;
    }
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
    </div>

    <div class="flex flex-1 flex-col">
        {#if showPlaints}
            <h2 class="h1 mx-2 border-b-2 border-dark">Pleintes</h2>

            {#if data.messages.length}
                <div class="m-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {#each data.messages as pleinte}
                        <div class="card p-4">
                            <h1 class="text-lg font-semibold">{pleinte.title}</h1>
                            <p>{pleinte.message}</p>

                            <p class="my-2 italic">{pleinte.category}</p>

                            <p>
                                Status:
                                <span class="font-semibold">{pleinte.status}</span>
                            </p>
                        </div>
                    {/each}
                </div>
            {:else}
                <div class="flex justify-center">
                    <div class="card p-4">
                        <p class="">Aucun résultat</p>
                    </div>
                </div>
            {/if}
        {:else}
            <h2 class="h1 mx-2 border-b-2 border-dark">Maisons sauvegardées</h2>

            {#if data.savedHomes.length}
                <div class="m-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {#each data.savedHomes as home}
                        <a
                            class="card flex-row gap-2 p-2"
                            href={`/?id=${home.address?.location?.id}`}
                        >
                            <div
                                class="flex h-24 w-24 items-center justify-center overflow-hidden rounded"
                            >
                                {#if home.address?.location?.latitude && home.address.location.longitude}
                                    <img
                                        class="h-full w-full"
                                        src={`https://maps.googleapis.com/maps/api/streetview?size=400x400&location=${home.address.location.latitude},${home.address.location.longitude}&fov=50&pitch=0&key=${PUBLIC_GOOGLE_MAPS_KEY}`}
                                        alt="la maison vue de la rue"
                                    />
                                {/if}
                            </div>

                            <div class="flex flex-col justify-between gap-2">
                                <span class="text-xl">
                                    {`${home.address?.civic_no_prefix}${home.address?.civic_no_prefix ? "-" : ""}${home.address?.civic_no}${home.address?.civic_no_suffix} ${home.address?.street_type.toLowerCase()} ${home.address?.street_name}${home.address?.street_dir ? " " : ""}${home.address?.street_dir}, ${home.address?.mail_postal_code}`}
                                </span>

                                <button class="btn btn-sm" on:click={() => removeHouse(home)}>
                                    Retirer
                                </button>
                            </div>
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
