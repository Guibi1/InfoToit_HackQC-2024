<script lang="ts">
    import mapboxgl from "mapbox-gl";
    import { createEventDispatcher, getContext, onMount, setContext } from "svelte";
    import type { MapContext } from "./Map.svelte";
    import type { MarkerContext } from "./Marker.svelte";

    let children: Node;

    setContext("popup", { getPopup: () => popup });
    const dispatch = createEventDispatcher();

    const mapContext = getContext<MapContext>("map");
    const markerContext = getContext<MarkerContext>("marker");
    const map = mapContext.getMap();
    const marker = markerContext.getMarker();

    const popup = new mapboxgl.Popup().setLngLat(marker.getLngLat());

    $: children && popup.setDOMContent(children);

    onMount(() => {
        const show = () => map && popup.addTo(map);
        marker.getElement().addEventListener("mousedown", show);

        return () => {
            marker.getElement().removeEventListener("mousedown", show);
            popup.remove();
        };
    });
</script>

<div bind:this={children} class="contents">
    <slot />
</div>
