<script context="module" lang="ts">
    export interface MarkerContext {
        getMarker: () => Marker;
    }
</script>

<script lang="ts">
    import { IconX, type Icon } from "@tabler/icons-svelte";
    import mapboxgl, { type LngLatLike, type Marker } from "mapbox-gl";
    import { createEventDispatcher, getContext, onMount, setContext } from "svelte";
    import type { MapContext } from "./Map.svelte";
    import PinElement from "./PinElement.svelte";

    export let coordinates: LngLatLike;
    export let icon: Icon["new"] = IconX;
    export let color: string | undefined = undefined;
    export let easeOnAdd:
        | Partial<
              Omit<mapboxgl.EaseToOptions, "padding"> & {
                  padding: Partial<mapboxgl.PaddingOptions>;
              }
          >
        | undefined = undefined;

    const dispatch = createEventDispatcher<Record<"click", MouseEvent>>();
    setContext("marker", { getMarker: () => marker });

    const mapContext = getContext<MapContext>("map");
    const map = mapContext.getMap();

    const el = document.createElement("div");
    new PinElement({ target: el, props: { icon, color } });

    const marker = new mapboxgl.Marker(el, { color }).setLngLat(coordinates);

    $: marker.setLngLat(coordinates);

    onMount(() => {
        const onClick = (e: MouseEvent) => dispatch("click", e);

        if (map) marker.addTo(map);
        if (easeOnAdd) {
            map?.easeTo({
                center: coordinates,
                pitch: 50,
                ...easeOnAdd,
                padding: { top: 0, bottom: 0, left: 0, right: 0, ...easeOnAdd.padding },
            });
        }

        marker.getElement().addEventListener("mousedown", onClick);

        return () => {
            marker.getElement().removeEventListener("mousedown", onClick);
            marker.remove();
        };
    });
</script>

<slot />
