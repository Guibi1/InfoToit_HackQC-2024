<script lang="ts">
    import Map from "$lib/MapBox/Map.svelte";
    import Marker from "$lib/MapBox/Marker.svelte";
    import { popup, type PopupOptions } from "$lib/popup";
    import { writable } from "svelte/store";
    import { PUBLIC_MAPBOX_KEY } from "$env/static/public";
    import { superForm } from "sveltekit-superforms";

    import { Field, Control, Label, Description, FieldErrors, Fieldset, Legend } from "formsnap";
    import { zodClient } from "sveltekit-superforms/adapters";
    import type { PageData } from "./$types.js";
    import { schema, categoriesDePlaintes } from "./schema.js";

    export let data;
    let selectedmessage: (typeof data)["messages"][number];

    const form = superForm(data.form, {
        validators: zodClient(schema),
    });
    const { form: formData, enhance } = form;
</script>

<main class="container mx-auto flex flex-1 gap-16 py-2 lg:gap-16">
    <div class="flex flex-col">
        <h1 class="mb-4 text-4xl underline">Création de pleinte</h1>
        <form method="POST" use:enhance>
            <h1 class="h1 m-2 text-center">Titre</h1>

            <Field {form} name="title">
                <Control let:attrs>
                    <Label></Label>
                    <input {...attrs} bind:value={$formData.title} />
                </Control>
                <Description></Description>
                <FieldErrors />
            </Field>
            <h1 class="h1 m-2 text-center">Coordonnées</h1>
            <div class="flex flex-row gap-1">
                <Field {form} name="coordinate_lon">
                    <Control let:attrs>
                        <Label></Label>
                        <input {...attrs} type="number" bind:value={$formData.coordinate_lon} />
                    </Control>
                    <Description></Description>
                    <FieldErrors />
                </Field>
                <Field {form} name="coordinate_lat">
                    <Control let:attrs>
                        <Label></Label>
                        <input {...attrs} type="number" bind:value={$formData.coordinate_lat} />
                    </Control>
                    <Description></Description>
                    <FieldErrors />
                </Field>
            </div>
            <h1 class="h1 m-2 text-center">Catégorie</h1>

            <Field {form} name="category">
                <Control let:attrs>
                    <Label></Label>
                    <select {...attrs} bind:value={$formData.category}>
                        <option value="Aucune">Aucune</option>
                        <option value="Nids-de-poule">Nids-de-poule</option>
                        <option value="Problèmes de circulation">
                            "Problèmes de circulation",
                        </option>
                        <option value="Éclairage public défectueux"
                            >Éclairage public défectueux</option
                        >
                        <option value="Collecte de déchets non effectuée"
                            >Collecte de déchets non effectuée</option
                        >
                        <option value="Problèmes d'égouts">Problèmes d'égouts</option>
                        <option value="Graffiti">Graffiti</option>
                        <option value="Nuisances sonores">Nuisances sonores</option>
                        <option value="Problèmes de stationnement"
                            >Problèmes de stationnement</option
                        >
                        <option value="Dégradations de l'espace public"
                            >Dégradations de l'espace public</option
                        >
                        <option value="Travaux non terminés">Travaux non terminés</option>
                        <option value="Problèmes de voirie">Problèmes de voirie</option>
                        <option value="Décharges sauvages">Décharges sauvages</option>
                        <option value="Autre">Autre</option>
                    </select>
                </Control>
                <Description></Description>
                <FieldErrors />
            </Field>
            <h1 class="h1 m-2 text-center">Description</h1>

            <Field {form} name="message">
                <Control let:attrs>
                    <Label></Label>
                    <textarea {...attrs} bind:value={$formData.message} />
                </Control>
                <Description></Description>
                <FieldErrors />
            </Field>

            <button class="btn">Envoyer</button>
            <!-- ... -->
        </form>
    </div>

    <div class="card mb-4 max-w-2xl flex-1">
        {#if selectedmessage}
            <div class="card">
                <h2 class="text-lg">{selectedmessage.title}</h2>
                <h2 class="text-lg">{selectedmessage.message}</h2>
                <h2 class="text-lg">{selectedmessage.status}</h2>
            </div>
        {/if}
        <Map
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
            {#each data.messages as message}
                {#if message.lat && message.lon}
                    <Marker coordinates={[+message.lon, +message.lat]} />
                {/if}
            {/each}
        </Map>
    </div>

    {#if selectedmessage}
        <div class="m-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div class="card">
                <h1 class="h1">{selectedmessage.title}</h1>
                <p>{selectedmessage.message}</p>
                <h1 class="h1">Status:</h1>
                <div class="card">{selectedmessage.status}</div>
            </div>
        </div>
    {:else}
        <div class="">
            <div class="card p-2">
                <p class="">Aucun résultat</p>
            </div>
        </div>
    {/if}
</main>
