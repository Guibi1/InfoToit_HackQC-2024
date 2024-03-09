<script lang="ts">
    import Map from "$lib/Map/Map.svelte";
    import Marker from "$lib/Marker/Marker.svelte";
    import mapboxgl from "mapbox-gl";
    const { LngLat } = mapboxgl;

    let defaultCoords = new LngLat(-73.709274, 45.531926);
</script>

<div>
    <Map
        accessToken="pk.eyJ1IjoiYmFiYWJvdWlsbGUiLCJhIjoiY2x0ajlpMnU5MHBmNDJpdDl5d3pwYmpoeSJ9.4zGTlsBnc_Nx6MFJjcYSxg"
        options={{ center: defaultCoords, zoom: 10 }}
    >
        <Marker coordinates={defaultCoords} />
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
