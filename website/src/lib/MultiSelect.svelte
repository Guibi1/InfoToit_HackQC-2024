<script lang="ts" generics="T">
    import { createEventDispatcher } from "svelte";
    import { popup, type PopupOptions } from "$lib/popup";

    export let name: string;
    export let selected: T[] = [];
    export let choices: readonly T[];
    export let maxSelection = Infinity;

    const dispatch = createEventDispatcher<{ change: T[] }>();

    const popupSettings: PopupOptions = {
        popupId: `${name}MultiselectPopup`,
        placement: "bottom",
    };

    function onSelect(result: T) {
        const i = selected.indexOf(result);
        if (i >= 0) selected.splice(i, 1);
        else selected.push(result);

        if (selected.length > maxSelection) selected.splice(0, 1);
        selected = selected;
        dispatch("change", selected);
    }
</script>

<button class="input" use:popup={popupSettings}>
    <slot />
    {selected.length}
</button>

<div class="popup" id={popupSettings.popupId}>
    <div class="popup-arrow" id="arrow" />

    <ul
        class="flex max-h-48 w-80 flex-col gap-1 overflow-y-auto rounded border-2 border-dark bg-white py-2"
        tabindex="-1"
    >
        {#each choices as choice}
            <li class="contents">
                <button
                    on:click={() => onSelect(choice)}
                    class="flex flex-col px-4 py-1 text-start transition-colors hover:bg-pale"
                    type="button"
                >
                    {choice}

                    {#if selected.includes(choice)}
                        O
                    {/if}
                </button>
            </li>
        {:else}
            <li class="autocomplete-item p-2">Aucun choix</li>
        {/each}
    </ul>
</div>
