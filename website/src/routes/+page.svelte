<script lang="ts">
    import GeoJson from "$lib/MapBox/GeoJson.svelte";
    import Marker from "$lib/MapBox/Marker.svelte";
    import Map from "$lib/MapBox/Map.svelte";
    import mapboxgl from "mapbox-gl";
    import montreal from "./alpha.geojson.json";
    const { LngLat } = mapboxgl;

    let defaultCoords = new LngLat(-73.709274, 45.531926);
</script>

<main class="container mx-auto h-full py-4">
    <div class="card h-4/6 overflow-hidden rounded-lg">
        <Map options={{ center: defaultCoords, zoom: 10 }}>
            <Marker coordinates={defaultCoords} />
            <GeoJson id="counties" data={{type:'vector',data:{montreal}}} />
            <GeoJson id="counties" data={{type:'vector',data:{montreal}}} />
        </Map>
    </div>
</main>
