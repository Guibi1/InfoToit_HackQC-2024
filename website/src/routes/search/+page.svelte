<script context="module" lang="ts">
    type AutocompleteOption = {
        id: string;
        name: string;
        description: string;
    };
</script>

<script lang="ts">
    import { popup, type PopupSettings } from "@skeletonlabs/skeleton";
    const mapBoxSearch = import("@mapbox/search-js-core");

    const popupSettings: PopupSettings = {
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

<input
    class="autocomplete input"
    type="search"
    name="autocomplete-search"
    bind:value={address}
    placeholder="Search..."
    use:popup={popupSettings}
    on:change={onChange}
/>

<div data-popup={popupSettings.target}>
    <div class="card max-h-48 w-full max-w-sm overflow-y-auto p-4" tabindex="-1">
        <div class="autocomplete" data-testid="autocomplete">
            <nav class="autocomplete-nav">
                <ul class="autocomplete-list list-nav">
                    {#each flavorOptions as address}
                        <li class="autocomplete-item">
                            <button
                                on:click={() => onSelect(address)}
                                class="autocomplete-button flex w-full flex-col"
                                type="button"
                            >
                                {address.name}
                                <span class="text-primary-800-100-token opacity-60">
                                    {address.description}
                                </span>
                            </button>
                        </li>
                    {:else}
                        <li class="autocomplete-item p-2">Aucun résultats</li>
                    {/each}
                </ul>
            </nav>
        </div>
    </div>
</div>
