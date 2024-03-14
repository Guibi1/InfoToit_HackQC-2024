<script context="module" lang="ts">
    import type {
        AnyLayer,
        BackgroundLayer,
        CircleLayer,
        CustomLayerInterface,
        FillExtrusionLayer,
        FillLayer,
        HeatmapLayer,
        HillshadeLayer,
        LineLayer,
        RasterLayer,
        SkyLayer,
        SymbolLayer,
    } from "mapbox-gl";

    type LayerWithoutId<T extends AnyLayer> = Omit<T, "id">;

    type AnyLayerWithoutId =
        | LayerWithoutId<BackgroundLayer>
        | LayerWithoutId<CircleLayer>
        | LayerWithoutId<FillExtrusionLayer>
        | LayerWithoutId<FillLayer>
        | LayerWithoutId<HeatmapLayer>
        | LayerWithoutId<HillshadeLayer>
        | LayerWithoutId<LineLayer>
        | LayerWithoutId<RasterLayer>
        | LayerWithoutId<SymbolLayer>
        | LayerWithoutId<CustomLayerInterface>
        | LayerWithoutId<SkyLayer>;
</script>

<script lang="ts">
    import { getContext, onDestroy } from "svelte";
    import { readable } from "svelte/store";
    import type { MapContext } from "./Map.svelte";
    import type { SourceContext } from "./Source.svelte";

    export let layer: AnyLayerWithoutId;

    let id = readable(Math.random().toString(36).substring(2, 7));

    const mapContext = getContext<MapContext>("map");
    const sourceContext = getContext<SourceContext>("source");

    let map = mapContext.getMap();
    let loaded = mapContext.getLoaded();
    let sourceId = sourceContext.getSourceId();

    $: {
        if (map && $loaded) {
            map.addLayer({
                ...layer,
                id: $id,
                source: $sourceId,
            } as AnyLayer);
        }
    }

    onDestroy(() => map?.getStyle() && map.removeLayer($id));
</script>

<slot />
