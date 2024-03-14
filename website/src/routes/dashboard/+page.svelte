<script lang="ts">
    import MapBox from "$lib/MapBox/Map.svelte";
    import Marker from "$lib/MapBox/Marker.svelte";
    import { mois } from "$lib/consts";
    import { Line } from "svelte-chartjs";

    export let data;

    let selectedCategories: string[] = [];
    let selectedStatuses: string[] = [];

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

    <Line
        data={{
            labels: mois,
            datasets: data.stats,
        }}
        options={{ responsive: true }}
    />
</main>
