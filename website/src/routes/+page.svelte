<script lang="ts">
    import { PUBLIC_GOOGLE_MAPS_KEY } from "$env/static/public";
    
    import { onMount } from "svelte";

    import { goto } from "$app/navigation";
    import { page } from "$app/stores";

    const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789abcdefghijklmnopqrstuvwxyz";
    let map: any;
    let mapDiv: Element;

    $: selected = $page.url.searchParams.get("selected");
    

    onMount(async () => {
        const { Loader } = await import("@googlemaps/js-api-loader");
        const { MarkerClusterer } = await import("@googlemaps/markerclusterer");

        const loader = new Loader({
            apiKey: PUBLIC_GOOGLE_MAPS_KEY,
            version: "weekly",
            libraries: ["maps", "marker"],
        });

        function loadGeoJsonString() {
           
            // map.data.addGeoJson(arbres);
        
        }   
         

        const { Map } = await loader.importLibrary("maps");
        const { AdvancedMarkerElement, PinElement } = await loader.importLibrary("marker");

        const markers = locations.map((position , i) => {
            if (!position.lat || !position.lng) return;
            const label = labels[i % labels.length];
            const pinGlyph = new PinElement({
                glyph: label,
                glyphColor: "white",
            });

            const marker = new AdvancedMarkerElement({
                position,
                content: pinGlyph.element,
            });

            marker.addListener("click", () => goto(`?selected=${goto("/")}`));
            return marker;
        });
        // Add a marker clusterer to manage the markers.

        map = new Map(mapDiv, {
            zoom: 14,
            center: { lat: 45.5048442, lng: -73.6184641 },
            mapId: "DEMO_MAP_ID",
            disableDefaultUI: true,
        });
        new MarkerClusterer({ markers, map });

        loadGeoJsonString()
    });


    const locations = [
  { lat: -31.56391, lng: 147.154312 },
  { lat: -33.718234, lng: 150.363181 },
  { lat: -33.727111, lng: 150.371124 },
  { lat: -33.848588, lng: 151.209834 },
  { lat: -33.851702, lng: 151.216968 },
  { lat: -34.671264, lng: 150.863657 },
  { lat: -35.304724, lng: 148.662905 },
  { lat: -36.817685, lng: 175.699196 },
  { lat: -36.828611, lng: 175.790222 },
  { lat: -37.75, lng: 145.116667 },
  { lat: -37.759859, lng: 145.128708 },
  { lat: -37.765015, lng: 145.133858 },
  { lat: -37.770104, lng: 145.143299 },
  { lat: -37.7737, lng: 145.145187 },
  { lat: -37.774785, lng: 145.137978 },
  { lat: -37.819616, lng: 144.968119 },
  { lat: -38.330766, lng: 144.695692 },
  { lat: -39.927193, lng: 175.053218 },
  { lat: -41.330162, lng: 174.865694 },
  { lat: -42.734358, lng: 147.439506 },
  { lat: -42.734358, lng: 147.501315 },
  { lat: -42.735258, lng: 147.438 },
  { lat: -43.999792, lng: 170.463352 },
];



</script>

<main class="container flex flex-1 flex-col  py-8 h-full">
    <div class="grid h-full">
        <div class="rounded-lg h-full" bind:this={mapDiv} />
        
    </div>
</main>
