<script lang="ts">
    import { type AnySourceData } from "mapbox-gl";
    import { getContext, onDestroy } from "svelte";
    import type { MapContext } from "./Map.svelte";
    import longueil from "./alpha.geojson.json";
    import montreal from "./beta.geojson.json";
    import arbres from "./arbres.json";

    //pas utiliser
    export let id: string;
    export let data: AnySourceData;

    const mapContext = getContext<MapContext>("map");
    const map = mapContext.getMap();

    mapContext.getLoaded().subscribe((loaded) => {
        if (map && loaded){
            map.addSource(id,{'type':'geojson','data':longueil});
            map.addLayer({
            id: id,
            type: 'fill',
            source: id,
            paint: {
                
                'fill-color': '#FF0000', // red color for the circles
                'fill-opacity': 0.5 // red color for the circles
            }
            });
        

        } 
        if (map && loaded){
            map.addSource("aaaaa",{'type':'geojson','data':montreal});
            map.addLayer({
            id: "aaaaa",
            type: 'fill',
            source: "aaaaa",
            paint: {
                
                'fill-color': '#FF0000', // red color for the circles
                'fill-opacity': 0.5 // red color for the circles
            }
            });
        

        } 
         if (map && loaded){
            map.addSource("bbbbb",{'type':'geojson','data':arbres});
            map.addLayer({
            id: "bbbbb",
            type: 'circle',
            source: "bbbbb",
            paint: {
                'circle-radius': 6,
                'circle-color': '#FF0000'
            }
            });
        

        } 

    });

    onDestroy(() => map?.getStyle() && map.removeSource(id));
</script>

<slot />
