<script context="module" lang="ts">
    export interface MapContext {
        getMap: () => mapboxgl.Map | null;
        getLoaded: () => Writable<boolean>;
    }
</script>

<script lang="ts">
    import mapboxgl from "mapbox-gl";
    import { onMount, createEventDispatcher, setContext } from "svelte";
    import { type Writable, writable } from "svelte/store";
    import { getMapEventHandlers } from "./get-map-event-handlers";
    import type { Redirect_1 } from "@sveltejs/kit";

    const { Marker, LngLat } = mapboxgl;

    export let accessToken: string;
    export let options: Omit<mapboxgl.MapboxOptions, "container"> = {};
    export let baseApiUrl = undefined;
    export let container: HTMLElement | string | undefined = undefined;
    export let boxSelect: any = undefined;
    let marker: mapboxgl.Marker | null = null;
    let lngLat: mapboxgl.LngLat | null = null;

    // Props intended for binding
    export let map: mapboxgl.Map | null = null;
    export let styleLoaded = false;
    export let loaded: boolean = false;

    const mapKey = Symbol();
    mapboxgl.accessToken = accessToken;

    if (baseApiUrl) {
        mapboxgl.baseApiUrl = baseApiUrl;
    }

    const loadedStore = writable(false);

    setContext<MapContext>(mapKey, {
        getMap: () => map,
        getLoaded: () => loadedStore,
    });

    const dispatch = createEventDispatcher();

    onMount(() => {
        if (boxSelect) {
            if (options.boxZoom) {
                console.warn("Cannot enable both boxZoom and boxSelect. Disabling boxZoom");
            }
            options.boxZoom = false;
        }

        if (container) {
            map = new mapboxgl.Map({
                container,
                style: "mapbox://styles/mapbox/streets-v11",
                ...options,
            });
        }

        function handleData(event: Event) {
            if (map) {
                styleLoaded = map.isStyleLoaded();
            }

            dispatch("data", event);
        }

        function handleLoad(event: Event) {
            loaded = true;
            $loadedStore = true;
            dispatch("load", event);
        }

        const eventHandlers = getMapEventHandlers(dispatch);

        for (const [event, { handler }] of Object.entries(eventHandlers)) {
            map?.on(event, handler);
        }

        map?.on("load", handleLoad);
        map?.on("data", handleData);

        return () => {
            for (const [event, { handler }] of Object.entries(eventHandlers)) {
                map?.off(event, handler);
            }

            map?.off("load", handleLoad);
            map?.off("data", handleData);

            map?.remove();
        };
    });
</script>

<svelte:head
    ><link
        href="https://api.mapbox.com/mapbox-gl-js/v2.6.1/mapbox-gl.css"
        rel="stylesheet"
    /></svelte:head
>

<div bind:this={container}>
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
