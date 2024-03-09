<script context="module" lang="ts">
    export interface MapContext {
        getMap: () => mapboxgl.Map | null;
        getLoaded: () => boolean;
    }

    import mapboxgl from "mapbox-gl";
    mapboxgl.accessToken =
        "pk.eyJ1IjoiYmFiYWJvdWlsbGUiLCJhIjoiY2x0ajlpMnU5MHBmNDJpdDl5d3pwYmpoeSJ9.4zGTlsBnc_Nx6MFJjcYSxg";
</script>

<script lang="ts">
    import { createEventDispatcher, onMount, setContext } from "svelte";
    import { getMapEventHandlers } from "./get-map-event-handlers";

    export let options: Omit<mapboxgl.MapboxOptions, "container"> = {};

    let container: HTMLDivElement;
    let map: mapboxgl.Map;
    let loaded = false;

    setContext<MapContext>("map", {
        getMap: () => map,
        getLoaded: () => loaded,
    });

    onMount(() => {
        map = new mapboxgl.Map({
            container,
            style: "mapbox://styles/mapbox/streets-v11",
            ...options,
        });

        const handleLoad = () => (loaded = true);

        const eventHandlers = getMapEventHandlers();
        for (const [event, handler] of Object.entries(eventHandlers)) {
            map.on(event, handler);
        }
        map.on("load", handleLoad);

        return () => {
            for (const [event, handler] of Object.entries(eventHandlers)) {
                map.off(event, handler);
            }
            map.off("load", handleLoad);
            map.remove();
        };
    });
</script>

<svelte:head>
    <link href="https://api.mapbox.com/mapbox-gl-js/v2.6.1/mapbox-gl.css" rel="stylesheet" />
</svelte:head>

<div class="relative" bind:this={container}>
    {#if !loaded}
        <div class="absolute inset-0 z-10 bg-primary-400">loading {loaded}</div>
    {/if}

    {#if map}
        <slot />
    {/if}
</div>

<style>
    div {
        width: 100%;
        height: 100%;
    }
</style>
