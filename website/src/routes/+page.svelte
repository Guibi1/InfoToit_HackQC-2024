<script lang="ts">
    import Map from "$lib/MapBox/Map.svelte";
    import Marker from "$lib/MapBox/Marker.svelte";
    import mapboxgl from "mapbox-gl";
    const { LngLat } = mapboxgl;

    let defaultCoords = new LngLat(-73.709274, 45.531926);
    let defaultCoords2 = new LngLat(-72.709274, 45.531926);
    let defaultCoords3 = new LngLat(-71.709274, 45.531926);
    let defaultCoords4 = new LngLat(-70.709274, 45.531926);
    let defaultCoords5 = new LngLat(-69.709274, 45.531926);
    let defaultCoords6 = new LngLat(-68.709274, 45.531926);
    let defaultCoords7 = new LngLat(-67.709274, 45.531926);
    let defaultCoords8 = new LngLat(-66.709274, 45.531926);
    let defaultCoords9 = new LngLat(-65.709274, 45.531926);
    let defaultCoords0 = new LngLat(-64.709274, 45.531926);
    
</script>

<div>
    <Map options={{ center: defaultCoords, zoom: 10 }}>
        <Marker coordinates={defaultCoords} />
        <Marker coordinates={defaultCoords2} />
        <Marker coordinates={defaultCoords3} />
        <Marker coordinates={defaultCoords4} />
        <Marker coordinates={defaultCoords5} />
        <Marker coordinates={defaultCoords6} />
        <Marker coordinates={defaultCoords7} />
        <Marker coordinates={defaultCoords8} />
        <Marker coordinates={defaultCoords9} />
        <Marker coordinates={defaultCoords0} />
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
