<script lang="ts" generics="T extends number | string">
    import { createEventDispatcher } from "svelte";
    import { popup, type PopupOptions } from "$lib/popup";

    export let name: string;
    export let selected: T[] = [];
    export let choices: readonly T[];
    export let maxSelection = Infinity;

    const dispatch = createEventDispatcher<{ change: T[] }>();
    let search = "";
    let searchResults: T[] = [...choices];

    const popupSettings: PopupOptions = {
        popupId: `${name}MultiselectPopup`,
        placement: "bottom",
    };

    async function onInput() {
        searchResults = choices.filter((c) =>
            c.toString().toLowerCase().includes(search.toLowerCase())
        );
    }

    function onSelect(result: T) {
        const i = selected.indexOf(result);
        if (i >= 0) selected.splice(i, 1);
        else selected.push(result);

        if (selected.length > maxSelection) selected.splice(0, 1);
        selected = selected;
        dispatch("change", selected);
    }
</script>

<button class="input w-full" use:popup={popupSettings}>
    <slot />
</button>

<div class="popup" id={popupSettings.popupId}>
    <div class="popup-arrow" id="arrow" />

    <ul
        class="flex max-h-60 w-80 flex-col gap-1 overflow-y-auto overflow-x-hidden rounded border-2 border-dark bg-white py-2"
        tabindex="-1"
    >
        <input
            type="text"
            placeholder="Rechercher"
            class="border-none !ring-0"
            bind:value={search}
            on:input={onInput}
        />

        <hr class="hr" />

        {#each searchResults as choice}
            <li class="contents">
                <button
                    on:click={() => onSelect(choice)}
                    class={`flex items-center gap-2 px-4 py-1 text-start transition-colors hover:bg-pale ${selected.includes(choice) ? "bg-pale" : ""}`}
                    type="button"
                >
                    <input
                        type="checkbox"
                        checked={selected.includes(choice)}
                        class="pointer-events-none"
                    />

                    {choice}
                </button>
            </li>
        {:else}
            <li class="autocomplete-item p-2">Aucun choix</li>
        {/each}
    </ul>
</div>
