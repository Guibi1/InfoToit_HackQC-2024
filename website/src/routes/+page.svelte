<script lang="ts">
    import Layer from "$lib/MapBox/Layer.svelte";
    import Map from "$lib/MapBox/Map.svelte";
    import Marker from "$lib/MapBox/Marker.svelte";
    import Source from "$lib/MapBox/Source.svelte";
    import mapboxgl from "mapbox-gl";
    const { LngLat } = mapboxgl;

    let defaultCoords = new LngLat(-73.709274, 45.531926);
</script>

<main class="container mx-auto h-full py-4">
    <div class="card h-4/6 overflow-hidden rounded-lg">
        <Map options={{ center: defaultCoords, zoom: 10 }}>
            <Marker coordinates={defaultCoords} />
            <!-- <Source data={{ type: "geojson", data: montreal }}>
                <Layer
                    layer={{
                        type: "fill",
                        paint: {
                            "fill-color": "#FF0000",
                            "fill-opacity": 0.5,
                        },
                    }}
                />
            </Source> -->
        </Map>
    </div>
</main>
