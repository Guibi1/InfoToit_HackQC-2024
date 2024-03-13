<script context="module" lang="ts">
    export interface MarkerContext {
        getMarker: () => Marker;
    }
</script>

<script lang="ts">
    import mapboxgl, { type LngLatLike, type Marker } from "mapbox-gl";
    import { createEventDispatcher, getContext, onMount, setContext } from "svelte";
    import type { MapContext } from "./Map.svelte";

    export let coordinates: LngLatLike;
    export let color: string | undefined = undefined;
    export let zoomOnAdd: number | undefined = undefined;

    const dispatch = createEventDispatcher<Record<"click", MouseEvent>>();
    setContext("marker", { getMarker: () => marker });

    const mapContext = getContext<MapContext>("map");
    const map = mapContext.getMap();

    const marker = new mapboxgl.Marker({ color }).setLngLat(coordinates);

    $: marker.setLngLat(coordinates);

    onMount(() => {
        const onClick = (e: MouseEvent) => dispatch("click", e);

        if (map) marker.addTo(map);
        if (zoomOnAdd) map?.easeTo({ center: coordinates, zoom: zoomOnAdd });

        marker.getElement().addEventListener("mousedown", onClick);

        return () => {
            marker.getElement().removeEventListener("mousedown", onClick);
            marker.remove();
        };
    });
</script>

<slot />
