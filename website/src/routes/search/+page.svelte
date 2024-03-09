<script context="module" lang="ts">
    type AutocompleteOption = {
        id: string;
        name: string;
        description: string;
    };
</script>

<script lang="ts">
    const mapBoxSearch = import("@mapbox/search-js-core");

    const popupSettings = {
        event: "focus-click",
        target: "popupAutocomplete",
        placement: "bottom",
    };

    let flavorOptions: AutocompleteOption[] = [];
    let address: string = "";

    const onSelect = (option: AutocompleteOption) => {
        address = option.name + ", " + option.description;
    };

    async function onChange() {
        if (!address) flavorOptions = [];

        const { AddressAutofillCore, SessionToken } = await mapBoxSearch;
        const autofill = new AddressAutofillCore({
            accessToken:
                "pk.eyJ1IjoiYmFiYWJvdWlsbGUiLCJhIjoiY2x0ajlpMnU5MHBmNDJpdDl5d3pwYmpoeSJ9.4zGTlsBnc_Nx6MFJjcYSxg",
        });

        const sessionToken = new SessionToken();
        const result = await autofill.suggest(address, { sessionToken });
        console.log("🚀 ~ onChange ~ result:", result);
        flavorOptions = result.suggestions.map((v) => ({
            id: (v as any).id,
            name: v.feature_name,
            description: v.description,
        }));
    }
</script>

<main class="container flex flex-1 items-center justify-center">
    <div class="card gap-2 p-4">
        <h1 class="h1">Bienvenue</h1>

        <input
            class="input"
            type="search"
            name="autocomplete-search"
            bind:value={address}
            placeholder="Search..."
            on:change={onChange}
        />
        <!-- use:popup={popupSettings} -->

        <button class="btn mx-auto"> Explorer </button>

        <div data-popup={popupSettings.target}>
            <ul
                class="border-dark flex max-h-48 w-80 flex-col gap-1 overflow-y-auto rounded border-2 bg-white py-2"
                tabindex="-1"
            >
                {#each flavorOptions as address}
                    <li class="contents">
                        <button
                            on:click={() => onSelect(address)}
                            class="hover:bg-pale flex flex-col items-start px-4 py-1 transition-colors"
                            type="button"
                        >
                            {address.name}
                            <span class="text-sm opacity-60">
                                {address.description}
                            </span>
                        </button>
                    </li>
                {:else}
                    <li class="autocomplete-item p-2">Aucun résultats</li>
                {/each}
            </ul>
        </div>
    </div>
</main>
