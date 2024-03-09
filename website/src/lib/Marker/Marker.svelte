<script lang="ts">
    import mapboxgl, { type LngLatLike } from "mapbox-gl";
    import { onDestroy, getContext, setContext } from "svelte";
    import type { MapContext } from "../Map/Map.svelte";

    const { LngLat, Marker } = mapboxgl;

    export let coordinates: LngLatLike;
    const mapKey = Symbol();
    const markerKey = Symbol();

    setContext(markerKey, {
        getMarker: () => marker,
    });

    const mapContext = getContext<MapContext>(mapKey);
    const map = mapContext.getMap();

    const marker = new Marker().setLngLat(coordinates);

    if (map) marker.addTo(map);

    $: marker.setLngLat(coordinates);

    onDestroy(() => {
        marker.remove();
    });
</script>

<slot />
