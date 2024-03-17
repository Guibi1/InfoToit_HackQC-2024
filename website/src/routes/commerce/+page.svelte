<script lang="ts">
    import { superForm } from "sveltekit-superforms";
    import { Control, Field, Label } from "formsnap";
    import { zodClient } from "sveltekit-superforms/adapters";
    import type { PageData } from "./$types.js";
    import { schema } from "./schema.js";
    import { businessCategories } from "$lib/consts";
    import MultiSelect from "$lib/MultiSelect.svelte";
    import Map from "$lib/MapBox/Map.svelte";
    import Marker from "$lib/MapBox/Marker.svelte";
    import Layer from "$lib/MapBox/Layer.svelte";
    import Source from "$lib/MapBox/Source.svelte";

    export let data: PageData;
    export let form;

    let selectedMessage = "";

    const superform = superForm(data.form, {
        dataType: "json",
    });
    const { form: formData, enhance } = superform;

    function onMapClick(e: { detail: mapboxgl.MapMouseEvent }) {
        $formData.long = e.detail.lngLat.lng;
        $formData.lat = e.detail.lngLat.lat;
    }
</script>

<main class="z-10 mx-auto flex flex-col">
    <div class=" card mx-auto flex flex-col gap-1">
        <h1 class="h1 m-2">Rechercherce d'emplacement pour votre commerce</h1>
        <form class="m-6" method="POST" use:enhance>
            <Field form={superform} name="type">
                <Control let:attrs>
                    <Label class="label">Type d'entreprise</Label>
                    <MultiSelect
                        name="Entreprise"
                        choices={businessCategories}
                        maxSelection={1}
                        selected={[$formData.type]}
                        on:change={(c) => ($formData.type = c.detail[0])}
                    >
                        {$formData.type}
                    </MultiSelect>
                </Control>
            </Field>
            <button class="btn">Rechercher</button>
        </form>
    </div>
</main>

<div class="absolute inset-0 z-0">
    <Map
        on:click={onMapClick}
        options={{
            center: [-73.6128865, 45.5308667],
            interactive: true,
            zoom: 10,
            minZoom: 10,
            maxBounds: [
                [-74, 45.3308067], // Southwest corner: [longitude, latitude]
                [-73.3, 45.7556], // Northeast corner: [longitude, latitude]
            ],
        }}
    >
        {#if form?.hexes}
            <Source
                data={{
                    type: "geojson",
                    data: {
                        type: "FeatureCollection",
                        features: form.hexes.map((h) => h.polygon),
                    },
                }}
            >
                <Layer
                    layer={{
                        type: "fill",
                        paint: {
                            "fill-color": "rgba(71,153,80,0.4)",
                            "fill-outline-color": "rgba(0,0,0,0.2)",
                        },
                    }}
                />
            </Source>
        {/if}

        {#if $formData.long && $formData.lat}
            {#key $formData.lat && $formData.long}
                <Marker coordinates={[$formData.long, $formData.lat]} />
            {/key}
        {/if}
    </Map>
</div>
