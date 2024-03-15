<script lang="ts">
    import type { AddressSearchResult } from "$api/address/search/+server";
    import { goto } from "$app/navigation";
    import Layer from "$lib/MapBox/Layer.svelte";
    import Map from "$lib/MapBox/Map.svelte";
    import Marker from "$lib/MapBox/Marker.svelte";
    import Popup from "$lib/MapBox/Popup.svelte";
    import Source from "$lib/MapBox/Source.svelte";
    import { popup, type PopupOptions } from "$lib/popup";
    import {
        IconBike,
        IconBuildingBank,
        IconCheck,
        IconLeaf,
        IconSchool,
        IconShoppingBag,
        IconX,
        IconLoader2,
        IconArrowLeft,
    } from "@tabler/icons-svelte";

    export let data;

    const popupSettings: PopupOptions = {
        popupId: "popupAutocomplete",
        placement: "bottom",
    };

    let suggestions: AddressSearchResult[] = [];
    let address = "";
    let selectedAddress: AddressSearchResult | null = null;
    let searchTimout: number;
    let height = 210;
    let loading = false;

    let tab = 0;
    let pointsToShow: { name: string; coordinates: [number, number]; type: string }[] = [];

    async function onInput() {
        selectedAddress = null;

        if (address.length < 4) {
            suggestions = [];
            return;
        }

        clearTimeout(searchTimout);
        searchTimout = setTimeout(
            () =>
                fetch("/api/address/search", {
                    method: "POST",
                    body: address,
                })
                    .then((res) => res.json())
                    .then((s) => (suggestions = s)),
            400
        ) as unknown as number;
    }

    function onSelect(result: AddressSearchResult) {
        selectedAddress = result;
        console.log("🚀 ~ onSelect ~ selectedAddress:", selectedAddress);
        address = `${result.Text}, ${result.Description}`;
    }

    async function submit() {
        if (selectedAddress) {
            loading = true;
            await goto(`?id=${selectedAddress.id}`);
            loading = false;
            setTab(0);
        }
    }

    async function saveHouse(id: string) {
        await fetch("/api/house", { method: "POST", body: id });
        data.houseSaved = !data.houseSaved;
    }

    function setTab(newTab: number) {
        tab = newTab;
        pointsToShow =
            data.houseAnalysis[tab].flatMap((c: { elements: [] }) => c.elements ?? []) ?? [];
    }

    if (data.houseAnalysis) setTab(0);
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
                            <h1 class="h1 mb-0">Bienvenue</h1>
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
                            disabled={!selectedAddress || loading}
                        >
                            {#if loading}
                                <IconLoader2 class="animate-spin" />
                            {/if}
                            Explorer
                        </button>
                    </div>
                {:else}
                    <div class="text-center">
                        <h1 class="h1 mb-0">{data.address}</h1>
                        <span class="text-muted-foreground">
                            Découvrez les services à proximité
                        </span>
                    </div>

                    <a class="absolute left-4 top-4 rounded-full bg-pale p-1" href="/">
                        <IconArrowLeft />
                    </a>

                    <div
                        class="mt-2 grid w-full grid-cols-5 gap-0.5 overflow-hidden rounded border-2 border-dark bg-pale"
                    >
                        <button
                            class={`flex flex-col items-center p-2 font-semibold ${tab == 0 ? "bg-pale" : "bg-white"}`}
                            on:click={() => setTab(0)}
                        >
                            <IconBuildingBank /> Services
                        </button>
                        <button
                            class={`flex flex-col items-center p-2 font-semibold ${tab == 1 ? "bg-pale" : "bg-white"}`}
                            on:click={() => setTab(1)}
                        >
                            <IconBike /> Transit
                        </button>
                        <button
                            class={`flex flex-col items-center p-2 font-semibold ${tab == 2 ? "bg-pale" : "bg-white"}`}
                            on:click={() => setTab(2)}
                        >
                            <IconSchool /> Écoles
                        </button>
                        <button
                            class={`flex flex-col items-center p-2 font-semibold ${tab == 3 ? "bg-pale" : "bg-white"}`}
                            on:click={() => setTab(3)}
                        >
                            <IconLeaf /> Nature
                        </button>
                        <button
                            class={`flex flex-col items-center p-2 font-semibold ${tab == 4 ? "bg-pale" : "bg-white"}`}
                            on:click={() => setTab(4)}
                        >
                            <IconShoppingBag /> Achats
                        </button>
                    </div>

                    <h2 class="h2 mb-0 mt-2">Cette maison comparée à Montréal</h2>
                    <ul
                        class="flex w-full flex-col gap-1 overflow-x-hidden rounded border-2 border-dark bg-background py-1"
                    >
                        {#each data.houseAnalysis[tab] as category}
                            <li class="flex items-center justify-between gap-2 px-4 py-1">
                                <span class="text-start text-lg font-semibold">
                                    {category.name}
                                </span>

                                {#if "area_score" in category}
                                    <div class="flex items-center gap-2">
                                        <div class="h-4 w-24 rounded bg-muted">
                                            <div
                                                class="h-4 w-24 rounded bg-blue-600"
                                                style={`width: ${category.area_score}%`}
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

                    {#if data.user}
                        <button
                            class="btn btn-flat"
                            on:click={() => data.house && saveHouse(data.house.id)}
                        >
                            {#if data.houseSaved}
                                Supprimer des enregistrements
                            {:else}
                                Enregistrer pour plus tard
                            {/if}
                        </button>
                    {/if}
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
        }}
    >
        {#if selectedAddress?.longitude && selectedAddress.latitude}
            {#key selectedAddress}
                <Marker
                    coordinates={[selectedAddress.longitude, selectedAddress.latitude]}
                    zoomOnAdd={15}
                />
            {/key}
        {/if}

        {#if data.house && data.house.location}
            {#key data.house}
                <Marker
                    coordinates={[data.house.location.longitude, data.house.location.latitude]}
                    color="#b40219"
                    zoomOnAdd={13.5}
                />
            {/key}
        {/if}

        {#each pointsToShow as point}
            {#key point}
                <Marker coordinates={[point.coordinates[1], point.coordinates[0]]}>
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

        <Source
            data={{
                type: "geojson",
                data: { type: "FeatureCollection", features: data.h3_hexes.map((h) => h.polygon) },
            }}
        >
            <Layer
                layer={{
                    type: "fill",
                    layout: {
                        visibility: "visible",
                    },
                    source: {
                        type: "vector",
                        url: "mapbox://mapbox.3o7ubwm8",
                    },
                    paint: {
                        "fill-color": "rgba(71,153,80,0.4)",
                        "fill-outline-color": "rgba(0,0,0,0.2)",
                    },
                }}
            />
        </Source>
    </Map>
</div>

<div class="popup" id={popupSettings.popupId}>
    <div class="popup-arrow" id="arrow" />

    <ul
        class="flex max-h-48 w-80 flex-col gap-1 overflow-y-auto rounded border-2 border-dark bg-white py-2"
        tabindex="-1"
    >
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
        {:else}
            <li class="autocomplete-item p-2">Aucun résultat</li>
        {/each}
    </ul>
</div>
