<script lang="ts">
    import mapboxgl, { type LngLatLike } from "mapbox-gl";
    import { getContext, onMount, setContext } from "svelte";
    import type { MapContext } from "./Map.svelte";

    export let zoomOnAdd: number | undefined = undefined;
    export let coordinates: LngLatLike;

    setContext("marker", {
        getMarker: () => marker,
    });

    const mapContext = getContext<MapContext>("map");
    const map = mapContext.getMap();

    const marker = new mapboxgl.Marker().setLngLat(coordinates);

    $: marker.setLngLat(coordinates);

    onMount(() => {
        if (map) marker.addTo(map);
        if (zoomOnAdd) map?.easeTo({ center: coordinates, zoom: zoomOnAdd });
        return () => marker.remove();
    });
</script>

<slot />
