<script lang="ts">
    import Layer from "$lib/MapBox/Layer.svelte";
    import Map from "$lib/MapBox/Map.svelte";
    import Marker from "$lib/MapBox/Marker.svelte";
    import Source from "$lib/MapBox/Source.svelte";
    import mapboxgl from "mapbox-gl";
    const { LngLat } = mapboxgl;

    let defaultCoords = new LngLat(-73.709274, 45.531926);
</script>

<main class="container mx-auto flex-1 py-4">
    <a href="/search" class="btn">Goto search</a>
    <a href="/profile" class="btn">Goto profile</a>
</main>
