<script lang="ts">
    import Map from "$lib/MapBox/Map.svelte";
    import Marker from "$lib/MapBox/Marker.svelte";
    import { Control, Description, Field, FieldErrors, Label } from "formsnap";
    import { superForm } from "sveltekit-superforms/client";
    import { categoriesDePlaintes } from "./schema.js";
    import { invalidate } from "$app/navigation";

    export let data;

    const form = superForm(data.form, {
        dataType: "json",
        onResult: () => invalidate("plaints"),
    });
    const { form: formData, enhance } = form;

    let selectedmessage: (typeof data)["messages"][number] | undefined;

    function onMapClick(e: { detail: mapboxgl.MapMouseEvent }) {
        console.log(e.detail.lngLat);
        $formData.coordinate.lon = e.detail.lngLat.lng;
        $formData.coordinate.lat = e.detail.lngLat.lat;
    }

    let showPlaints: boolean = true;
</script>

<main class="container mx-auto flex flex-1 gap-16 py-2 lg:gap-16">
    <div class="ml-6 flex flex-col">
        <h1 class="h1">Création de pleinte</h1>

        <form class="grid gap-2" method="POST" use:enhance>
            <Field {form} name="title">
                <Control let:attrs>
                    <Label class="label">Titre</Label>

                    <input {...attrs} class="input" type="text" bind:value={$formData.title} />
                </Control>
                <Description></Description>
                <FieldErrors />
            </Field>

            <Field {form} name="category">
                <Control let:attrs>
                    <Label>Catégorie</Label>

                    <select {...attrs} class="input" bind:value={$formData.category}>
                        {#each categoriesDePlaintes as category}
                            <option value={category}>{category}</option>
                        {/each}
                    </select>
                </Control>
                <Description></Description>
                <FieldErrors />
            </Field>

            <Field {form} name="message">
                <Control let:attrs>
                    <Label>Description</Label>

                    <textarea {...attrs} class="input max-h-60" bind:value={$formData.message} />
                </Control>
                <Description></Description>
                <FieldErrors />
            </Field>

            <button class="btn mx-auto mt-2">Envoyer</button>
        </form>
    </div>

    <div class="card relative mb-4 max-w-2xl flex-1">
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
            >{#if showPlaints}
                {#each data.messages as message}
                    {#if message.lat && message.lon}
                        <Marker
                            coordinates={[+message.lon, +message.lat]}
                            color="#b40219"
                            title={typeof message.title == "string" ? message.title : ""}
                            message={message}
                        />
                    {/if}
                {/each}
            {/if}
            {#if $formData.coordinate.lon && $formData.coordinate.lat}
                {#key $formData.coordinate}
                    <Marker coordinates={$formData.coordinate} />
                {/key}
            {/if}
        </Map>
    </div>
    <div>
        <button
            class="btn"
            on:click={() => {
                showPlaints = !showPlaints;
            }}
        >
            {showPlaints ? "Désactiver les plaintes" : "Activer les plaintes"}
        </button>
        {#if selectedmessage}
            <div class="card absolute left-4 top-4">
                <h2 class="text-lg">{selectedmessage.title}</h2>
                <h2 class="text-lg">{selectedmessage.message}</h2>
                <h2 class="text-lg">{selectedmessage.status}</h2>
            </div>
        {/if}
    </div>
</main>
