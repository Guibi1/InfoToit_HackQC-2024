<script context="module" lang="ts">
    export interface SourceContext {
        getSourceId: () => Readable<string>;
    }
</script>

<script lang="ts">
    import type { AnySourceData } from "mapbox-gl";
    import { getContext, onDestroy, setContext } from "svelte";
    import { readable, type Readable } from "svelte/store";
    import type { MapContext } from "./Map.svelte";

    export let data: AnySourceData;

    let id = readable(Math.random().toString(36).substring(2, 7));
    setContext<SourceContext>("source", { getSourceId: () => id });

    const mapContext = getContext<MapContext>("map");

    let map = mapContext.getMap();
    let loaded = mapContext.getLoaded();

    $: {
        if (map && $loaded) {
            map.addSource($id, data);
        }
    }

    onDestroy(() => map?.getStyle() && map.removeSource($id));
</script>

<slot />
