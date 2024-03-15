<script lang="ts">
    import { goto } from "$app/navigation";
    import MapBox from "$lib/MapBox/Map.svelte";
    import Marker from "$lib/MapBox/Marker.svelte";
    import MultiSelect from "$lib/MultiSelect.svelte";
    import { messageCategories, mois } from "$lib/consts";

    export let data;

    let selectedYears: number[] = [2023, 2022];
    let selectedStatuses: string[] = [];
    let selectedCategories: string[] = [];

    $: filteredMessages = data.messages.filter((m) => {
        if (selectedCategories.length > 0) {
            if (typeof m.category !== "string" || !selectedCategories.includes(m.category)) {
                return false;
            }
        }
        if (selectedStatuses.length > 0) {
            if (!m.status || !selectedStatuses.includes(m.status)) {
                return false;
            }
        }
        return true;
    });

    function onGraphDataChange() {
        const searchParams = new URLSearchParams();
        searchParams.set("y1", "" + selectedYears[0]);
        searchParams.set("y2", "" + selectedYears[1]);
        for (const c of selectedCategories) searchParams.append("c", c);
        goto(`?${searchParams}`);
    }
</script>

<main class="container mx-auto p-4">
    <div class="card h-80 overflow-hidden">
        <MapBox
            options={{
                center: [-73.6128865, 45.5308667],
                zoom: 10,
            }}
        >
            {#each filteredMessages as message}
                {#if message.lat && message.lon}
                    <Marker coordinates={[+message.lon, +message.lat]} />
                {/if}
            {/each}
        </MapBox>
    </div>

    <div>
        <MultiSelect
            name="graphYears"
            choices={[2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023]}
            bind:selected={selectedYears}
            maxSelection={2}
            on:change={onGraphDataChange}
        >
            Années
        </MultiSelect>

        <MultiSelect
            name="graphCategories"
            choices={messageCategories}
            bind:selected={selectedCategories}
            maxSelection={5}
            on:change={onGraphDataChange}
        >
            Catégories
        </MultiSelect>
    </div>

    <a href="/dashboard/history" class="btn">Voir l'historique</a>
    <a href="/dashboard/plaints" class="btn">Voir les pleintes</a>
</main>
