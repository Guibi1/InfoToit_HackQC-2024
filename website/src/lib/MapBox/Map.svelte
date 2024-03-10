<script context="module" lang="ts">
    export interface MapContext {
        getMap: () => mapboxgl.Map | null;
        getLoaded: () => Writable<boolean>;
    }

    import mapboxgl from "mapbox-gl";
    mapboxgl.accessToken =
        "pk.eyJ1IjoiYmFiYWJvdWlsbGUiLCJhIjoiY2x0ajlpMnU5MHBmNDJpdDl5d3pwYmpoeSJ9.4zGTlsBnc_Nx6MFJjcYSxg";
</script>

<script lang="ts">
    import { onMount, setContext } from "svelte";
    import { getMapEventHandlers } from "./get-map-event-handlers";
    import { writable, type Writable } from "svelte/store";

    export let options: Omit<mapboxgl.MapboxOptions, "container"> = {};

    let container: HTMLDivElement;
    let map: mapboxgl.Map;
    let loaded = writable(false);

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

        map.once("idle", () => ($loaded = true));

        const eventHandlers = getMapEventHandlers();
        for (const [event, handler] of Object.entries(eventHandlers)) {
            map.on(event, handler);
        }

        return () => {
            for (const [event, handler] of Object.entries(eventHandlers)) {
                map.off(event, handler);
            }
            map.remove();
        };
    });
</script>

<svelte:head>
    <link href="https://api.mapbox.com/mapbox-gl-js/v2.6.1/mapbox-gl.css" rel="stylesheet" />
</svelte:head>

<div class="relative" bind:this={container}>
    {#if !loaded}
        <div class="bg-primary-400 absolute inset-0 z-10">loading {loaded}</div>
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
