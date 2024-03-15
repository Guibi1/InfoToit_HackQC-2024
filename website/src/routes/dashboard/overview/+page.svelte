<script lang="ts">
    import Map from "$lib/MapBox/Map.svelte";
    import Marker from "$lib/MapBox/Marker.svelte";
    import Popup from "$lib/MapBox/Popup.svelte";
    import Layer from "$lib/MapBox/Layer.svelte";
    import Source from "$lib/MapBox/Source.svelte";
    import { latLngToCell } from "h3-js";

    export let data;
    
    //Add animation, just needs data and connect coordinates to hex id

   
    let tab = -1;
    let selectedHex = "";

    function onMapClick(e: { detail: mapboxgl.MapMouseEvent }) {
        selectedHex = latLngToCell(e.detail.lngLat.lat, e.detail.lngLat.lng, 8);
    }
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
    <div class="card absolute left-8 top-20 z-10">
        <h1 class="h1 m-4">Suggestion</h1>
        {#each data.hex as hex}
            {#if hex.id == selectedHex}
                <div class=" "><h1 class="h1">{hex.recommendation}</h1></div>
            {/if}
        {/each}
    </div>
</main>

<div class="absolute inset-0">
    <Map
        on:click={onMapClick}
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
                            "fill-outline-color": "rgba(0,0,0,0.4)",
                        },
                    }}
                ></Layer>
            </Source>
        {/each}
    </Map>
</div>
