<script context="module" lang="ts">
    const markersData: Record<any, { icon: typeof IconGavel; color: string }> = {
        "Casernes": { icon: IconFireExtinguisher, color: "#dc2626" },
        "Lieux divertissements": { icon: IconMasksTheater, color: "#f43f5e" },
        "Écocentres": { icon: IconRecycle, color: "#713f12" },
        "Lieux culturels": { icon: IconBuildingChurch, color: "#a21caf" },
        "Poste de quartiers": { icon: IconGavel, color: "#075985" },
        "Arrêts d'autobus": { icon: IconBus, color: "#0284c7" },
        "Réseau cyclable": { icon: IconBike, color: "#059669" },
        "Collèges": { icon: IconBackpack, color: "#4d7c0f" },
        "Garderies": { icon: IconHorseToy, color: "#f87171" },
        "Universités": { icon: IconMicroscope, color: "#8b5cf6" },
        "Arbres": { icon: IconTree, color: "#15803d" },
        "Achat alimentaire": { icon: IconCarrot, color: "#4f46e5" },
        "Divertissement": { icon: IconBeer, color: "#d97706" },
        "Restauration": { icon: IconToolsKitchen2, color: "#0d9488" },
        "Services santés": { icon: IconHeartbeat, color: "#db2777" },
    };

    const popupSettings: PopupOptions = {
        popupId: "popupAutocomplete",
        placement: "bottom",
    };
</script>

<script lang="ts">
    import type { AddressSearchResult } from "$api/address/search/+server";
    import { goto } from "$app/navigation";
    import Map from "$lib/MapBox/Map.svelte";
    import Marker from "$lib/MapBox/Marker.svelte";
    import Popup from "$lib/MapBox/Popup.svelte";
    import { popup, type PopupOptions } from "$lib/popup";
    import {
        IconArrowLeft,
        IconBackpack,
        IconBeer,
        IconBike,
        IconBuildingBank,
        IconBuildingChurch,
        IconBus,
        IconCarrot,
        IconCheck,
        IconFireExtinguisher,
        IconGavel,
        IconHeartbeat,
        IconHome,
        IconHorseToy,
        IconLeaf,
        IconLoader2,
        IconMasksTheater,
        IconMicroscope,
        IconRecycle,
        IconSchool,
        IconShoppingBag,
        IconToolsKitchen2,
        IconTree,
        IconX,
    } from "@tabler/icons-svelte";

    export let data;

    let address = "";
    let selectedAddress: AddressSearchResult | null = null;
    let loadingSubmit = false;

    let suggestions: AddressSearchResult[] = [];
    let searchAbort = new AbortController();
    let searchTimout: number;
    let loadingSearch = false;

    let height = 203;
    let tab = 0;

    async function onInput() {
        selectedAddress = null;

        if (address.length < 4) {
            suggestions = [];
            return;
        }

        loadingSearch = true;
        clearTimeout(searchTimout);
        searchTimout = setTimeout(async () => {
            searchAbort.abort();
            searchAbort = new AbortController();
            suggestions = await fetch("/api/address/search", {
                method: "POST",
                body: address,
                signal: searchAbort.signal,
            }).then((res) => res.json());
            loadingSearch = false;
        }, 500) as unknown as number;
    }

    function onSelect(result: AddressSearchResult) {
        selectedAddress = result;
        address = `${result.Text}, ${result.Description}`;
    }

    async function submit() {
        if (selectedAddress) {
            loadingSubmit = true;
            await goto(`?id=${selectedAddress.id}`);
            loadingSubmit = false;
            tab = 0;
            selectedAddress = null;
            address = "";
        }
    }

    async function saveHouse(id: string) {
        await fetch("/api/house", { method: "POST", body: id });
        data.houseSaved = !data.houseSaved;
    }

    if (data.houseAnalysis) tab = 0;
</script>

<div class="flex-1">
    <div
        class={`relative mt-4 flex items-start justify-end transition-[width] duration-300 ${data.house ? "w-[250px]" : "w-1/2"}`}
    >
        <div
            class="card absolute z-10 grid w-[450px] translate-x-1/2 overflow-hidden transition-[height]"
            style={`height: ${height}px`}
        >
            <main
                bind:clientHeight={height}
                class="relative flex w-[450px] flex-col items-center gap-2 p-4"
            >
                {#if !data.house}
                    <div class="flex flex-col gap-4 text-center">
                        <div>
                            <h1 class="h1 mb-0">Bienvenue sur InfoToit</h1>
                            <span class="text-muted-foreground">
                                Entrez une adresse pour commencer
                            </span>
                        </div>

                        <input
                            class="input"
                            type="search"
                            name="address"
                            bind:value={address}
                            use:popup={popupSettings}
                            on:input={onInput}
                        />

                        <button
                            on:click={submit}
                            class="btn w-full"
                            disabled={!selectedAddress || loadingSubmit}
                        >
                            {#if loadingSubmit}
                                <IconLoader2 class="animate-spin" />
                            {/if}
                            Explorer
                        </button>
                    </div>
                {:else}
                    <div class="text-center">
                        <h1 class="h1 mb-0">{data.address}</h1>
                        <span class="text-muted-foreground">
                            Découvrez les atouts de cette maison
                        </span>
                    </div>

                    {#if data.user}
                        <button
                            class="btn btn-flat btn-sm"
                            on:click={() => data.house && saveHouse(data.house.id)}
                        >
                            {#if data.houseSaved}
                                Supprimer des enregistrements
                            {:else}
                                Enregistrer pour plus tard
                            {/if}
                        </button>
                    {/if}

                    <div
                        class="mt-2 flex flex-col overflow-hidden rounded border-2 border-dark bg-white"
                    >
                        <div class="grid w-full grid-cols-5 gap-0.5">
                            <button
                                class={`flex flex-col items-center p-2 font-semibold ${tab == 0 ? "bg-white" : "bg-pale"}`}
                                on:click={() => (tab = 0)}
                            >
                                <IconBuildingBank /> Services
                            </button>
                            <button
                                class={`flex flex-col items-center p-2 font-semibold ${tab == 1 ? "bg-white" : "bg-pale"}`}
                                on:click={() => (tab = 1)}
                            >
                                <IconBike /> Transit
                            </button>
                            <button
                                class={`flex flex-col items-center p-2 font-semibold ${tab == 2 ? "bg-white" : "bg-pale"}`}
                                on:click={() => (tab = 2)}
                            >
                                <IconSchool /> Écoles
                            </button>
                            <button
                                class={`flex flex-col items-center p-2 font-semibold ${tab == 3 ? "bg-white" : "bg-pale"}`}
                                on:click={() => (tab = 3)}
                            >
                                <IconLeaf /> Nature
                            </button>
                            <button
                                class={`flex flex-col items-center p-2 font-semibold ${tab == 4 ? "bg-white" : "bg-pale"}`}
                                on:click={() => (tab = 4)}
                            >
                                <IconShoppingBag /> Achats
                            </button>
                        </div>

                        <ul class="flex w-full flex-col gap-1 py-1">
                            {#each data.houseAnalysis[tab] as category}
                                <li class="flex items-center justify-between gap-2 px-4 py-2">
                                    <span
                                        class="flex items-center gap-2 text-start text-lg font-semibold"
                                    >
                                        <svelte:component
                                            this={markersData[category.name].icon}
                                            size={24}
                                        />

                                        {category.name}
                                    </span>

                                    {#if "area_score" in category}
                                        <div class="flex items-center gap-2">
                                            <div class="h-4 w-24 rounded bg-muted">
                                                <div
                                                    class="h-4 w-24 rounded bg-blue-600"
                                                    style={`width: ${category.area_score}%;
                                                        background: ${markersData[category.name].color}`}
                                                />
                                            </div>

                                            <span class="w-8">
                                                {category.area_score.toFixed(0)}%
                                            </span>
                                        </div>
                                    {:else if category.contains}
                                        <div class="flex items-center gap-1">
                                            <IconCheck size={18} /> Accessible
                                        </div>
                                    {:else}
                                        <div class="flex items-center gap-1">
                                            <IconX size={18} /> Pas à proximité
                                        </div>
                                    {/if}
                                </li>
                            {:else}
                                <li class="p-4 text-center">Aucune information</li>
                            {/each}
                        </ul>
                    </div>

                    <a href="/" class="btn btn-flat items-center gap-1">
                        <IconArrowLeft size={16} /> Refaire une recherche
                    </a>
                {/if}
            </main>
        </div>
    </div>
</div>

<div class="absolute inset-0">
    <Map
        options={{
            center: [-73.6128865, 45.5308667],
            zoom: 10,
            maxBounds: [
                [-74, 45.3308067], // Southwest corner: [longitude, latitude]
                [-73.3, 45.7556], // Northeast corner: [longitude, latitude]
            ],
        }}
    >
        {#if selectedAddress?.longitude && selectedAddress.latitude}
            {#key selectedAddress}
                <Marker
                    coordinates={[selectedAddress.longitude, selectedAddress.latitude]}
                    easeOnAdd={{ zoom: 18 }}
                    icon={IconHome}
                    color="#2563eb"
                    animate
                />
            {/key}
        {/if}

        {#if data.house && data.house.location}
            {#key data.house}
                <Marker
                    coordinates={[data.house.location.longitude, data.house.location.latitude]}
                    easeOnAdd={{ padding: { left: 300 }, zoom: 16 }}
                    icon={IconHome}
                    color="#2563eb"
                />
            {/key}
        {/if}

        {#if data.houseAnalysis}
            {#each data.houseAnalysis[tab] as { name, elements }}
                {#each elements ?? [] as point}
                    {#key point}
                        <Marker
                            coordinates={[point.coordinates[1], point.coordinates[0]]}
                            {...markersData[name]}
                            animate
                        >
                            <Popup>
                                <div class="flex flex-col">
                                    <span class="font-semibold">
                                        {point.name}
                                    </span>

                                    {#if point.type}
                                        {point.type}
                                    {/if}
                                </div>
                            </Popup>
                        </Marker>
                    {/key}
                {/each}
            {/each}
        {/if}
    </Map>
</div>

<div class="popup" id={popupSettings.popupId}>
    <div class="popup-arrow" id="arrow" />

    <ul
        class="flex max-h-48 w-80 flex-col gap-1 overflow-y-auto rounded border-2 border-dark bg-white py-2"
        tabindex="-1"
    >
        {#if suggestions.length}
            {#each suggestions as suggestion}
                <li class="contents">
                    <button
                        on:click={() => onSelect(suggestion)}
                        class="flex flex-col px-4 py-1 text-start transition-colors hover:bg-pale"
                        type="button"
                    >
                        {suggestion.Text}
                        <span class="text-sm opacity-60">
                            {suggestion.Description}
                        </span>
                    </button>
                </li>
            {/each}
        {:else if loadingSearch}
            <li class="autocomplete-item flex items-end justify-center gap-2 p-2">
                <IconLoader2 class="animate-spin" />
                Chargement
            </li>
        {:else}
            <li class="autocomplete-item p-2">Aucun résultat</li>
        {/if}
    </ul>
</div>
