<script lang="ts">
    import Map from "$lib/MapBox/Map.svelte";
    import Marker from "$lib/MapBox/Marker.svelte";
    import Popup from "$lib/MapBox/Popup.svelte";
    import Layer from "$lib/MapBox/Layer.svelte";
    import Source from "$lib/MapBox/Source.svelte";
    export let data;

    import { popup, type PopupOptions } from "$lib/popup";

    let hexScore = [
        {
            color: "rgba(45, 250, 45, 0.4)",
            filter: (h: (typeof data.hex)[number]) => {
                return h.score && h.score > 80;
            },
        },
        {
            color: "rgba(88, 170, 88, 0.4)",
            filter: (h: (typeof data.hex)[number]) => {
                return h.score && h.score <= 80 && h.score > 60;
            },
        },
        {
            color: "rgba(255, 255, 0, 0.4)",
            filter: (h: (typeof data.hex)[number]) => {
                return h.score && h.score <= 60 && h.score > 40;
            },
        },
        {
            color: "rgba(255, 165, 0, 0.4)",
            filter: (h: (typeof data.hex)[number]) => {
                return h.score && h.score <= 40 && h.score > 20;
            },
        },
        {
            color: "rgba(255, 0, 0, 0.4)",
            filter: (h: (typeof data.hex)[number]) => {
                return h.score && h.score <= 20 && h.score >= 0;
            },
        },
    ];
</script>

<main class="relative left-12 flex flex-1">
    <div
        class="card absolute top-12 z-10 flex flex-col items-center gap-4 p-6 text-center md:items-start md:text-start"
    >
        <div>
            <h1 class="h1 mb-0">Bienvenue</h1>
            <span class="text-muted-foreground">Sélectionnez un hexagone pour commencer</span>
        </div>
    </div>
</main>

<div class="absolute inset-0">
    <Map
        options={{
            center: [-73.65, 45.55],
            zoom: 10,
            minZoom: 10,
            maxBounds: [
                [-74, 45.3308067], // Southwest corner: [longitude, latitude]
                [-73.3, 45.7556], // Northeast corner: [longitude, latitude]
            ],
        }}
    >
        <!-- "fill-color": "rgba(61,153,80,0.55)", -->

        {#each hexScore as { color, filter }}
            <Source
                data={{
                    type: "geojson",
                    data: {
                        type: "FeatureCollection",
                        features: data.hex.filter(filter).map((h) => h.hex?.polygon),
                    },
                }}
            >
                <Layer
                    layer={{
                        type: "fill",
                        paint: {
                            "fill-color": color,
                        },
                    }}
                ></Layer>
            </Source>
        {/each}
    </Map>
</div>
