<script context="module" lang="ts">
    import { PUBLIC_MAPBOX_KEY } from "$env/static/public";
    import mapboxgl from "mapbox-gl";
    mapboxgl.accessToken = PUBLIC_MAPBOX_KEY;

    export interface MapContext {
        getMap: () => mapboxgl.Map | null;
        getLoaded: () => Writable<boolean>;
    }

    const events = ["click", "contextmenu", "mousemove", "mouseout"] as const;
</script>

<script lang="ts">
    import { createEventDispatcher, onMount, setContext } from "svelte";
    import { writable, type Writable } from "svelte/store";

    export let options: Omit<mapboxgl.MapboxOptions, "container"> = {};

    let container: HTMLDivElement;
    let map: mapboxgl.Map;
    let loaded = writable(false);

    let dispatch = createEventDispatcher<Record<(typeof events)[number], mapboxgl.MapMouseEvent>>();
    setContext<MapContext>("map", {
        getMap: () => map,
        getLoaded: () => loaded,
    });

    onMount(() => {
        map = new mapboxgl.Map({
            container,
            style: "mapbox://styles/bababouille1/cltuj887v01rz01p50thz7myg",
            ...options,
        });

        map.once("idle", () => ($loaded = true));

        const eventHandlers = events.map((name) => ({
            event: name,
            handler: (e: mapboxgl.MapMouseEvent) => dispatch(name, e),
        }));
        for (const { event, handler } of eventHandlers) {
            map.on(event, handler);
        }

        return () => {
            for (const { event, handler } of eventHandlers) {
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
