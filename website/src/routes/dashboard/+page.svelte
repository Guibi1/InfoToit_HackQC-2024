<script lang="ts">
    import { Line } from "svelte-chartjs";
    import { mois } from "./data";

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
</script>

<main class="container mx-auto p-4">
    <Line
        data={{
            labels: mois.slice(0, new Date().getMonth() + 1),
            datasets,
        }}
        options={{ responsive: true }}
    />
</main>
