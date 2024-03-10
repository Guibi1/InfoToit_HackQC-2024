<script context="module" lang="ts">
    import type { AddressAutofillSuggestion } from "@mapbox/search-js-core";
    type AutocompleteOption = {
        address: string;
        description: string;
        mapbox: AddressAutofillSuggestion;
    };
</script>

<script lang="ts">
    import { goto } from "$app/navigation";
    import Map from "$lib/MapBox/Map.svelte";
    import Marker from "$lib/MapBox/Marker.svelte";
    import { popup, type PopupOptions } from "$lib/popup";
    import { writable } from "svelte/store";
    import { PUBLIC_MAPBOX_KEY } from "$env/static/public";
    const mapBoxSearch = import("@mapbox/search-js-core");

    const popupSettings: PopupOptions = {
        popupId: "popupAutocomplete",
        placement: "bottom",
    };

    let suggestions: AutocompleteOption[] = [];
    let address = writable("");
    let selectedAddress: AddressAutofillSuggestion | null = null;
    let coordinates: [number, number] | undefined;

    const onSelect = (option: AutocompleteOption) => {
        selectedAddress = option.mapbox;
        $address = `${selectedAddress.feature_name}, ${selectedAddress.description}`;
        moveToMap(option.mapbox);
    };

    address.subscribe(async (address) => {
        if (!address) {
            selectedAddress = null;
            suggestions = [];
            return;
        }

        if (
            selectedAddress &&
            $address != `${selectedAddress.feature_name}, ${selectedAddress.description}`
        ) {
            selectedAddress = null;
            return;
        }

        const { AddressAutofillCore, SessionToken } = await mapBoxSearch;
        const autofill = new AddressAutofillCore({ accessToken: PUBLIC_MAPBOX_KEY });

        const result = await autofill.suggest(address, { sessionToken: new SessionToken() });
        suggestions = result.suggestions
            .filter((v) => v.accuracy !== "street")
            .map((v) => ({
                address: v.feature_name,
                description: v.description,
                mapbox: v,
            }));
    });

    async function moveToMap(selectedAddress: AddressAutofillSuggestion) {
        const { AddressAutofillCore, SessionToken } = await mapBoxSearch;
        const autofill = new AddressAutofillCore({ accessToken: PUBLIC_MAPBOX_KEY });

        const result = await autofill.retrieve(selectedAddress, {
            sessionToken: new SessionToken(),
        });
        coordinates = result.features[0]?.geometry?.coordinates as [number, number];
    }

    async function submit() {
        if (coordinates && selectedAddress) {
            goto(`/house/${selectedAddress.full_address}`);
        }
    }
</script>

<main
    class="container mx-auto flex flex-1 flex-col justify-center gap-8 py-2 md:flex-row md:gap-16"
>
    <div class="flex flex-col items-center gap-4 p-4 text-center md:items-start md:text-start">
        <div>
            <h1 class="h1 mb-0">Bienvenue</h1>
            <span class="text-muted-foreground">Entrez une adresse pour commencer</span>
        </div>

        <input
            class="input"
            type="search"
            name="address"
            bind:value={$address}
            use:popup={popupSettings}
        />

        <button on:click={submit} class="btn" disabled={!selectedAddress}> Explorer </button>
    </div>

    <div class="card m-2 flex-1">
        <Map
            options={{
                center: [-73.6128865, 45.5308667],
                interactive: false,
                zoom: 10,
            }}
        >
            {#if coordinates}
                {#key coordinates}
                    <Marker {coordinates} zoomOnAdd={15} />
                {/key}
            {/if}
        </Map>
    </div>
</main>

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
                    {suggestion.address}
                    <span class="text-sm opacity-60">
                        {suggestion.description}
                    </span>
                </button>
            </li>
        {:else}
            <li class="autocomplete-item p-2">Aucun résultat</li>
        {/each}
    </ul>
</div>
