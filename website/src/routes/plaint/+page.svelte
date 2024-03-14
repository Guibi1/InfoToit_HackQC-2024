<script lang="ts">
    import { invalidate } from "$app/navigation";
    import Map from "$lib/MapBox/Map.svelte";
    import Marker from "$lib/MapBox/Marker.svelte";
    import { messageCategories } from "$lib/consts";
    import { Control, Description, Field, FieldErrors, Label } from "formsnap";
    import { superForm } from "sveltekit-superforms/client";

    export let data;

    let selectedmessage: (typeof data)["messages"][number] | undefined;
    let showOtherPlaints = true;

    const form = superForm(data.form, {
        dataType: "json",
        onResult: () => invalidate("plaints"),
    });
    const { form: formData, enhance } = form;

    function onMapClick(e: { detail: mapboxgl.MapMouseEvent }) {
        console.log(e.detail.lngLat);
        $formData.coordinate.lon = e.detail.lngLat.lng;
        $formData.coordinate.lat = e.detail.lngLat.lat;
    }
</script>

<main class="container mx-auto flex flex-1 gap-16 p-4 lg:gap-16">
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
                        {#each messageCategories as category}
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

    <div class="mb-4 flex flex-1 flex-col gap-4">
        <button class="btn" on:click={() => (showOtherPlaints = !showOtherPlaints)}>
            {showOtherPlaints ? "Cacher les plaintes" : "Montrer les plaintes"}
        </button>

        <div class="card relative flex-1">
            {#if selectedmessage}
                <div class="card absolute right-4 top-4 z-50 w-80">
                    <h2 class="text-lg">{selectedmessage.title}</h2>
                    <h2 class="text-lg">{selectedmessage.message}</h2>
                    <h2 class="text-lg">{selectedmessage.status}</h2>
                </div>
            {/if}

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
                {#if showOtherPlaints}
                    {#each data.messages as message}
                        {#if message.lat && message.lon}
                            <Marker
                                coordinates={[+message.lon, +message.lat]}
                                color="#b40219"
                                on:click={() => (selectedmessage = message)}
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
    </div>
</main>
