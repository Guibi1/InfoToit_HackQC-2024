<script lang="ts">
    import type { AddressSearchResult } from "$api/address/search/+server";
    import { goto } from "$app/navigation";
    import { popup, type PopupOptions } from "$lib/popup";

    const popupSettings: PopupOptions = {
        popupId: "popupAutocomplete",
        placement: "bottom",
    };

    let suggestions: AddressSearchResult[] = [];
    let address = "";
    let selectedAddress: AddressSearchResult | null = null;

    async function onInput() {
        selectedAddress = null;

        if (!address) {
            suggestions = [];
            return;
        }

        suggestions = await fetch("/api/address/search", {
            method: "POST",
            body: address,
        }).then((res) => res.json());
    }

    function onSelect(result: AddressSearchResult) {
        selectedAddress = result;
        address = `${result.full_addr}, ${result.csdname}`;
    }

    function submit() {
        if (selectedAddress) {
            goto(`/house/${selectedAddress.id}`);
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
            bind:value={address}
            use:popup={popupSettings}
            on:input={onInput}
        />

        {selectedAddress}
        <button on:click={submit} class="btn" disabled={!selectedAddress}> Explorer </button>
    </div>

    <div class="card m-2 flex-1">
        <!-- <Map
            options={{
                center: [-73.6128865, 45.5308667],
                interactive: false,
                zoom: 10,
            }}
        >
            {#if selectedAddress?.longitude && selectedAddress?.latitude}
                {#key selectedAddress}
                    <Marker
                        coordinates={[selectedAddress.longitude, selectedAddress.latitude]}
                        zoomOnAdd={15}
                    />
                {/key}
            {/if}
        </Map> -->
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
                    {suggestion.full_addr}
                    <span class="text-sm opacity-60">
                        {suggestion.provider}
                    </span>
                </button>
            </li>
        {:else}
            <li class="autocomplete-item p-2">Aucun résultat</li>
        {/each}
    </ul>
</div>
