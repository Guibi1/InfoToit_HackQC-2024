<script lang="ts">
    import GeoJson from "$lib/MapBox/GeoJson.svelte";
    import Map from "$lib/MapBox/Map.svelte";
    import mapboxgl from "mapbox-gl";
    import arbres from "./arbres.json";
    const { LngLat } = mapboxgl;

    let defaultCoords = new LngLat(-73.709274, 45.531926);
</script>

<div>
    <Map options={{ center: defaultCoords, zoom: 10 }}>
        <GeoJson id="helloworld" data={arbres} />
    </Map>
</div>

<style>
    :global(body) {
        height: 100vh;
        width: 100vw;
    }

    div {
        height: 700px;
        width: 90%;
    }
</style>
