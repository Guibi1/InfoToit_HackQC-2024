<script lang="ts">
    import { type AnySourceData } from "mapbox-gl";
    import { getContext, onDestroy } from "svelte";
    import type { MapContext } from "./Map.svelte";

    export let id: string;
    export let data: AnySourceData;

    const mapContext = getContext<MapContext>("map");
    const map = mapContext.getMap();

    mapContext.getLoaded().subscribe((loaded) => {
        if (map && loaded) map.addSource(id, data);
    });

    onDestroy(() => map?.getStyle() && map.removeSource(id));
</script>

<slot />
