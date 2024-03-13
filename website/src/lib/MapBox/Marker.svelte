<script lang="ts">
    import mapboxgl, { type LngLatLike } from "mapbox-gl";
    import { getContext, onMount, setContext } from "svelte";
    import { createEventDispatcher } from "svelte";

    import type { MapContext } from "./Map.svelte";
    import { popup } from "$lib/popup";
    import type { JSONData } from "@xata.io/client";
    import type { MessagesRecord } from "$xata";

    export let zoomOnAdd: number | undefined = undefined;
    export let coordinates: LngLatLike;
    export let color: string | undefined = undefined;
    export let message: JSONData<MessagesRecord> | undefined = undefined;

    setContext("marker", {
        getMarker: () => marker,
    });
    const dispatch = createEventDispatcher();

    const mapContext = getContext<MapContext>("map");
    const map = mapContext.getMap();

    const marker = new mapboxgl.Marker({ color }).setLngLat(coordinates);

    $: marker.setLngLat(coordinates);

    onMount(() => {
        if (map) {
            marker.addTo(map);
            if (message?.title) {
                let popup = new mapboxgl.Popup()
                    .setLngLat(coordinates)
                    .setHTML(typeof message.title == "string" ? message.title : "");

                marker.getElement().addEventListener("mouseenter", () => {
                    dispatch("markerhover", { detail: marker });
                    popup.addTo(map);
                });
                marker.getElement().addEventListener("mouseleave", () => {
                    popup.remove();
                });
            }
        }

        if (zoomOnAdd) map?.easeTo({ center: coordinates, zoom: zoomOnAdd });
        return () => marker.remove();
    });
</script>

<slot />
