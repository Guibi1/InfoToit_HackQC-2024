<script lang="ts">
    import type { AddressSearchResult } from "$api/address/search/+server";
    import { goto } from "$app/navigation";
    import Layer from "$lib/MapBox/Layer.svelte";
    import Map from "$lib/MapBox/Map.svelte";
    import Marker from "$lib/MapBox/Marker.svelte";
    import Source from "$lib/MapBox/Source.svelte";
    import { popup, type PopupOptions } from "$lib/popup";
    import {
        IconSchool,
        IconShoppingBag,
        IconLeaf,
        IconBuildingBank,
        IconBike,
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

    let tab = 0;

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
        address = `${result.civic_no} ${result.street_name}${result.street_dir ? " " : ""}${result.street_dir}, ${result.mail_mun_name}, ${result.mail_postal_code}`;
    }

    function submit() {
        if (selectedAddress) {
            goto(`?id=${selectedAddress.location.id}`);
        }
    }
</script>

<div class="flex-1">
    <div
        class={`relative mt-4 flex items-start justify-end transition-[width] duration-300 ${data.house ? "w-[250px]" : "w-1/2"}`}
    >
        <main
            class="card absolute z-10 flex w-[450px] translate-x-1/2 flex-col items-center gap-2 p-4"
        >
            <div class="flex flex-col gap-4 text-center">
                <div>
                    <h1 class="h1 mb-0">Bienvenue</h1>
                    <span class="text-muted-foreground">Entrez une adresse pour commencer</span>
                </div>

                <input
                    class="input"
                    type="search"
                    name="address"
                    bind:value={address}
                    use:popup={popupSettings}
                    on:input={onInput}
                />

                <button on:click={submit} class="btn w-full" disabled={!selectedAddress}>
                    Explorer
                </button>
            </div>

            {#if data.house}
                <div
                    class="mt-2 grid w-full grid-cols-5 gap-0.5 overflow-hidden rounded border-2 border-dark bg-pale"
                >
                    <button
                        class={`flex flex-col items-center p-2 font-semibold ${tab == 0 ? "bg-pale" : "bg-white"}`}
                        on:click={() => (tab = 0)}
                    >
                        <IconBuildingBank /> Services
                    </button>
                    <button
                        class={`flex flex-col items-center p-2 font-semibold ${tab == 1 ? "bg-pale" : "bg-white"}`}
                        on:click={() => (tab = 1)}
                    >
                        <IconBike /> Transit
                    </button>
                    <button
                        class={`flex flex-col items-center p-2 font-semibold ${tab == 2 ? "bg-pale" : "bg-white"}`}
                        on:click={() => (tab = 2)}
                    >
                        <IconSchool /> Écoles
                    </button>
                    <button
                        class={`flex flex-col items-center p-2 font-semibold ${tab == 3 ? "bg-pale" : "bg-white"}`}
                        on:click={() => (tab = 3)}
                    >
                        <IconLeaf /> Nature
                    </button>
                    <button
                        class={`flex flex-col items-center p-2 font-semibold ${tab == 4 ? "bg-pale" : "bg-white"}`}
                        on:click={() => (tab = 4)}
                    >
                        <IconShoppingBag /> Achats
                    </button>
                </div>

                {#if tab == 0}
                    1
                {:else if tab == 1}
                    2
                {:else if tab == 2}
                    3
                {:else if tab == 3}
                    4
                {:else if tab == 4}
                    5
                {/if}
            {/if}
        </main>
    </div>
</div>

<div class="absolute inset-0">
    <Map
        options={{
            center: [-73.6128865, 45.5308667],
            zoom: 10,
        }}
    >
        {#if selectedAddress?.location.longitude && selectedAddress.location.latitude}
            {#key selectedAddress}
                <Marker
                    coordinates={[
                        selectedAddress.location.longitude,
                        selectedAddress.location.latitude,
                    ]}
                    zoomOnAdd={15}
                />
            {/key}
        {/if}

        {#if data.house}
            {#key data.house}
                <Marker
                    coordinates={[data.house.longitude, data.house.latitude]}
                    zoomOnAdd={13.5}
                />
            {/key}
        {/if}

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
                        "fill-color": "rgba(61,153,80,0.4)",
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
                    {suggestion.civic_no}
                    {suggestion.street_type?.toLowerCase()}
                    {suggestion.street_name}
                    {suggestion.street_dir}
                    <span class="text-sm opacity-60">
                        {suggestion.mail_mun_name}
                        {suggestion.mail_postal_code}
                    </span>
                </button>
            </li>
        {:else}
            <li class="autocomplete-item p-2">Aucun résultat</li>
        {/each}
    </ul>
</div>
