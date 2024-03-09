<script lang="ts">
    import mapboxgl, { type AnySourceData } from "mapbox-gl";
    import { getContext, onMount, setContext } from "svelte";
    import type { MapContext } from "./Map.svelte";

    export let id: string;
    export let data: AnySourceData;

    const mapContext = getContext<MapContext>("map");
    const map = mapContext.getMap();

    onMount(() => {
        if (map) map.addSource(id, data);
        return () => map?.removeSource(id);
    });
</script>

<slot />
