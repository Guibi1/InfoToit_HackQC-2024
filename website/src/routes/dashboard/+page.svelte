<script lang="ts">
    import Map from "$lib/MapBox/Map.svelte";
    import Marker from "$lib/MapBox/Marker.svelte";
    import { Line } from "svelte-chartjs";
    import { mois } from "$lib/consts";

    export let data;

    let selectedCategories: string[] = [];
    let selectedStatuses: string[] = [];

    const datasets = [
        {
            label: "My First dataset",
            fill: "origin",
            lineTension: 0.4,
            backgroundColor: "rgba(225, 204,230, .3)",
            borderColor: "rgb(205, 130, 158)",
            pointBorderWidth: 10,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgb(0, 0, 0)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [65, 59, 80, 81, 56, 55, 40],
        },
        {
            label: "My Second dataset",
            fill: "origin",
            lineTension: 0.4,
            backgroundColor: "rgba(184, 185, 210, .3)",
            borderColor: "rgb(35, 26, 136)",
            borderDash: [],
            borderDashOffset: 0.0,
            pointBorderColor: "rgb(35, 26, 136)",
            pointBackgroundColor: "rgb(255, 255, 255)",
            pointBorderWidth: 10,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgb(0, 0, 0)",
            pointHoverBorderColor: "rgba(220, 220, 220, 1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [28, 48, 40, 19, 86, 27, 90],
        },
    ];

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
    <div class="h-80">
        <Map options={{}}>
            {#each filteredMessages as message}
                {#if message.lat && message.lon}
                    <Marker coordinates={[+message.lon, +message.lat]} />
                {/if}
            {/each}
        </Map>
    </div>

    <Line
        data={{
            labels: mois.slice(0, new Date().getMonth() + 1),
            datasets,
        }}
        options={{ responsive: true }}
    />
</main>
