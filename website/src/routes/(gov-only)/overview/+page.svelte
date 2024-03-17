<script lang="ts">
    import Layer from "$lib/MapBox/Layer.svelte";
    import Map from "$lib/MapBox/Map.svelte";
    import Source from "$lib/MapBox/Source.svelte";
    import { IconArrowLeft } from "@tabler/icons-svelte";
    import { latLngToCell } from "h3-js";

    export let data;

    let selectedHex: (typeof data.hex)[number] | undefined;

    function onMapClick(e: { detail: mapboxgl.MapMouseEvent }) {
        const id = latLngToCell(e.detail.lngLat.lat, e.detail.lngLat.lng, 8);
        selectedHex = data.hex.find((h) => h.id == id);
    }

    const hexScore = [
        {
            color: "#db2777",
            filter: (h: (typeof data.hex)[number]) => h.score === 5,
        },
        {
            color: "#ef4444",
            filter: (h: (typeof data.hex)[number]) => h.score === 4,
        },
        {
            color: "#f97316",
            filter: (h: (typeof data.hex)[number]) => h.score === 3,
        },
        {
            color: "#facc15",
            filter: (h: (typeof data.hex)[number]) => h.score === 2,
        },
        {
            color: "#65a30d",
            filter: (h: (typeof data.hex)[number]) => h.score === 1,
        },
        {
            color: "#a8a29e",
            filter: (h: (typeof data.hex)[number]) => h.score === 0,
        },
    ];
</script>

<main class="relative flex flex-1">
    <div class="card absolute left-8 top-8 z-10 w-96 p-4">
        <h1 class="h1 mb-1">Suggestion</h1>
        <p class="text-muted-foreground">
            Sélectionnez une zone de la carte pour afficher des recommendations.
        </p>

        {#if selectedHex}
            <p class="mt-2">{selectedHex.recommendation}</p>
            <p>Importance: {selectedHex.score}/5</p>
        {/if}

        <a href="/messages" class="btn btn-sm btn-flat mx-auto mt-4 items-center gap-1">
            <IconArrowLeft size={16} /> Revenir
            <span class="hidden sm:inline-block"> au tableau de bord </span>
        </a>
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
                            "fill-opacity": 0.4,
                            "fill-outline-color": "rgba(0,0,0,0.4)",
                        },
                    }}
                ></Layer>
            </Source>
        {/each}
    </Map>
</div>
