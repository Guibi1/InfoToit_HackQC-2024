<script lang="ts">
    import type { AddressSearchResult } from "$api/address/search/+server";
    import { goto } from "$app/navigation";
    import Layer from "$lib/MapBox/Layer.svelte";
    import Map from "$lib/MapBox/Map.svelte";
    import Marker from "$lib/MapBox/Marker.svelte";
    import Source from "$lib/MapBox/Source.svelte";
    import { popup, type PopupOptions } from "$lib/popup";

    export let data;

    const popupSettings: PopupOptions = {
        popupId: "popupAutocomplete",
        placement: "bottom",
    };

    $: panelLeft = false;

    let suggestions: AddressSearchResult[] = [];
    let address = "";
    let selectedAddress: AddressSearchResult | null = null;
    let searchTimout: number;

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
            goto(`/house/${selectedAddress.id}`);
        }
    }
</script>

<div class="flex-1">
    <div
        class={`relative mt-4 flex items-start justify-end transition-[width] ${panelLeft ? "w-52" : "w-1/2"}`}
    >
        <main
            class="card z-10 flex translate-x-1/2 flex-col items-center gap-4 p-6 text-center md:items-start md:text-start"
        >
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
                        "fill-color": "rgba(61,153,80,0.55)",
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
