<script lang="ts">
    import Layer from "$lib/MapBox/Layer.svelte";
    import Map from "$lib/MapBox/Map.svelte";
    import Marker from "$lib/MapBox/Marker.svelte";
    import Popup from "$lib/MapBox/Popup.svelte";
    import Source from "$lib/MapBox/Source.svelte";
    import MultiSelect from "$lib/MultiSelect.svelte";
    import { businessCategories } from "$lib/consts";
    import { IconBuildingStore, IconLoader2, IconPlus } from "@tabler/icons-svelte";
    import { Control, Field, Label } from "formsnap";
    import { superForm } from "sveltekit-superforms";

    export let data;
    export let form;

    const superform = superForm(data.form, {
        dataType: "json",
    });
    const { form: formData, enhance, submitting } = superform;

    function onMapClick(e: { detail: mapboxgl.MapMouseEvent }) {
        $formData.long = e.detail.lngLat.lng;
        $formData.lat = e.detail.lngLat.lat;
    }
</script>

<main class="card z-10 m-8 flex w-[400px] flex-col gap-2 p-4 text-center">
    <h1 class="h1">Rechercherce d'emplacements optimaux pour votre commerce</h1>

    <p class="px-6">Appuyez sur la carte pour positioner la région que vous désirez</p>

    <form class="flex w-full flex-col items-stretch gap-1 text-start" method="POST" use:enhance>
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

        <button class="btn mx-auto mt-4" disabled={$submitting || !$formData.long}>
            {#if $submitting}
                <IconLoader2 class="animate-spin" />
            {/if}
            Rechercher
        </button>
    </form>
</main>

<div class="absolute inset-0">
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
                            "fill-color": "#16a34a",
                            "fill-opacity": 0.4,
                            "fill-outline-color": "#44403c",
                        },
                    }}
                />
            </Source>
        {/if}

        {#if $formData.long && $formData.lat}
            {#key $formData.lat + $formData.long}
                <Marker
                    coordinates={[$formData.long, $formData.lat]}
                    icon={IconPlus}
                    color="#ea580c"
                    easeOnAdd={{ pitch: 0, zoom: 13 }}
                    animate
                />
            {/key}
        {/if}

        {#each form?.commerces ?? [] as commerce}
            <Marker
                coordinates={[commerce.lng, commerce.lat]}
                icon={IconBuildingStore}
                color="#e11d48"
                animate
            >
                {#if commerce.type}
                    <Popup>
                        <h1 class="text-sm font-semibold">{commerce.address}</h1>
                        <h2 class="text-xs text-muted-foreground">{commerce.postal_code}</h2>

                        <p>{commerce.type}</p>
                    </Popup>
                {/if}
            </Marker>
        {/each}
    </Map>
</div>
