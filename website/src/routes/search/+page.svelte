<script context="module" lang="ts">
    import type { AddressAutofillSuggestion } from "@mapbox/search-js-core";
    type AutocompleteOption = {
        address: string;
        description: string;
        mapbox: AddressAutofillSuggestion;
    };
</script>

<script lang="ts">
    import { writable } from "svelte/store";
    import { popup, type PopupOptions } from "$lib/popup";
    const mapBoxSearch = import("@mapbox/search-js-core");

    const popupSettings: PopupOptions = {
        popupId: "popupAutocomplete",
        placement: "bottom",
    };

    let suggestions: AutocompleteOption[] = [];
    let address = writable("");
    let selectedAddress: AddressAutofillSuggestion | null = null;

    const onSelect = (option: AutocompleteOption) => {
        selectedAddress = option.mapbox;
        $address = `${selectedAddress.feature_name}, ${selectedAddress.description}`;
    };

    address.subscribe(async (address) => {
        if (
            selectedAddress &&
            $address != `${selectedAddress.feature_name}, ${selectedAddress.description}`
        ) {
            selectedAddress = null;
            return;
        }

        if (!address) {
            suggestions = [];
            return;
        }

        const { AddressAutofillCore, SessionToken } = await mapBoxSearch;
        const autofill = new AddressAutofillCore({
            accessToken:
                "pk.eyJ1IjoiYmFiYWJvdWlsbGUiLCJhIjoiY2x0ajlpMnU5MHBmNDJpdDl5d3pwYmpoeSJ9.4zGTlsBnc_Nx6MFJjcYSxg",
        });

        const result = await autofill.suggest(address, { sessionToken: new SessionToken() });
        suggestions = result.suggestions
            .filter((v) => v.accuracy !== "street")
            .map((v) => ({
                address: v.feature_name,
                description: v.description,
                mapbox: v,
            }));
    });

    async function submit() {
        if (!selectedAddress) {
            console.error("Bad address");
            return;
        }

        const { AddressAutofillCore, SessionToken } = await mapBoxSearch;
        const autofill = new AddressAutofillCore({
            accessToken:
                "pk.eyJ1IjoiYmFiYWJvdWlsbGUiLCJhIjoiY2x0ajlpMnU5MHBmNDJpdDl5d3pwYmpoeSJ9.4zGTlsBnc_Nx6MFJjcYSxg",
        });

        const result = await autofill.retrieve(selectedAddress, {
            sessionToken: new SessionToken(),
        });
        console.log("🚀 ~ onChange ~ result:", result, result.features[0].geometry.coordinates[0]);
    }
</script>

<main class="container flex flex-1 items-center justify-center">
    <div class="card gap-2 p-4">
        <h1 class="h1">Bienvenue</h1>

        <input
            class="input"
            type="search"
            name="address"
            bind:value={$address}
            use:popup={popupSettings}
        />

        <button on:click={submit} class="btn mx-auto" disabled={!selectedAddress}>
            Explorer
        </button>
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
