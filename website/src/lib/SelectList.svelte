<script lang="ts" generics="T">
    import { createEventDispatcher } from "svelte";

    export let selected: T[] = [];
    export let choices: readonly T[];
    export let maxSelection = Infinity;

    const dispatch = createEventDispatcher<{ change: T[] }>();

    function onSelect(result: T) {
        const i = selected.indexOf(result);
        if (i >= 0) selected.splice(i, 1);
        else selected.push(result);

        if (selected.length > maxSelection) selected.splice(0, 1);
        selected = selected;
        dispatch("change", selected);
    }
</script>

<ul
    class="flex flex-col gap-1 overflow-y-auto overflow-x-hidden rounded border-2 border-dark bg-white py-2"
    tabindex="-1"
>
    {#each choices as choice}
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
