<script lang="ts">
    import { invalidate } from "$app/navigation";
    import Map from "$lib/MapBox/Map.svelte";
    import Marker from "$lib/MapBox/Marker.svelte";
    import Popup from "$lib/MapBox/Popup.svelte";
    import MultiSelect from "$lib/MultiSelect.svelte";
    import { messageCategories, messageStatuses } from "$lib/consts";
    import {
        IconExclamationCircle,
        IconMinus,
        IconPencilPlus,
        IconPlus,
        IconSend,
        IconThumbUp,
        IconThumbUpFilled,
    } from "@tabler/icons-svelte";
    import { Control, Description, Field, FieldErrors, Label } from "formsnap";
    import { superForm } from "sveltekit-superforms/client";

    export let data;

    let selectedStatuses: string[] = [];
    let selectedCategories: string[] = [];
    let selectedMessage: (typeof data)["messages"][number] | undefined;

    let showCreateNew = false;
    let height = 616;

    const form = superForm(data.form, {
        dataType: "json",
        onResult: () => invalidate("plaints"),
    });
    const { form: formData, enhance } = form;

    function onMapClick(e: { detail: mapboxgl.MapMouseEvent }) {
        if (showCreateNew) {
            $formData.coordinate.lon = e.detail.lngLat.lng;
            $formData.coordinate.lat = e.detail.lngLat.lat;
        }
    }

    $: filteredMessages = data.messages.filter((m) => {
        if (selectedCategories.length > 0) {
            if (
                selectedCategories.length > 0 &&
                (!m.category || !selectedCategories.includes(m.category))
            ) {
                return false;
            }
            if (selectedStatuses.length > 0 && !selectedStatuses.includes(m.status)) {
                return false;
            }
        }
        if (selectedStatuses.length > 0) {
            if (!m.status || !selectedStatuses.includes(m.status)) {
                return false;
            }
        }
        return true;
    });

    async function send(id: string, status: string | undefined) {
        await fetch("/api/message", { method: "POST", body: JSON.stringify({ id, status }) });
    }

    async function sendLike(message: (typeof data)["messages"][number]) {
        await fetch("/api/message", { method: "PATCH", body: message.id });
        message.likes.count += -message.likes.userLiked * 2 + 1;
        message.likes.userLiked = !message.likes.userLiked;
        data.messages = data.messages;
    }
</script>

<div class="relative p-6 px-8">
    <div
        class="card absolute z-10 w-[450px] items-stretch justify-start overflow-hidden transition-[height]"
        style={`height: ${height}px`}
    >
        <main class="flex w-[450px] flex-col items-stretch gap-4 p-4" bind:clientHeight={height}>
            {#if !showCreateNew}
                <div class="text-center">
                    <h1 class="h1 mb-0">Messages citoyens</h1>
                    <p class="text-muted-foreground">Informez votre ville et vos concitoyens</p>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <MultiSelect
                        name="graphStatus"
                        choices={messageStatuses}
                        bind:selected={selectedStatuses}
                        on:change={() => (selectedMessage = undefined)}
                    >
                        Status
                    </MultiSelect>

                    <MultiSelect
                        name="graphCategories"
                        choices={messageCategories}
                        bind:selected={selectedCategories}
                        maxSelection={5}
                        on:change={() => (selectedMessage = undefined)}
                    >
                        Catégories
                    </MultiSelect>
                </div>

                <ul class="h-96 overflow-y-auto rounded border-2 border-dark bg-background py-1">
                    {#each filteredMessages as message}
                        <button class="contents" on:click={() => (selectedMessage = message)}>
                            <li class="flex gap-4 border-b-2 border-pale px-2 py-1 text-start">
                                <div class="flex flex-col items-stretch justify-between gap-1">
                                    <div class="w-52 pl-2">{message.category}</div>

                                    <div class="flex items-center justify-between">
                                        {#if data.user.isGov}
                                            <select
                                                class="input w-min shadow-none"
                                                value={message.status}
                                                on:change={(e) =>
                                                    send(message.id, e.currentTarget.value)}
                                            >
                                                {#each messageStatuses as status}
                                                    <option value={status}>{status}</option>
                                                {/each}
                                            </select>

                                            <button
                                                on:click={() => sendLike(message)}
                                                class="flex items-center gap-1 rounded border-2 border-dark bg-muted px-2 py-1"
                                            >
                                                {message.likes.count}

                                                {#if message.likes.userLiked}
                                                    <IconThumbUpFilled size={16} />
                                                {:else}
                                                    <IconThumbUp size={16} />
                                                {/if}
                                            </button>
                                        {:else}
                                            <div
                                                class="rounded border-2 border-dark bg-muted px-4 py-1"
                                            >
                                                {message.status}
                                            </div>

                                            <button
                                                on:click={() => sendLike(message)}
                                                class="flex items-center gap-1 rounded border-2 border-dark bg-muted px-2 py-1"
                                            >
                                                {message.likes.count}

                                                {#if message.likes.userLiked}
                                                    <IconThumbUpFilled size={16} />
                                                {:else}
                                                    <IconThumbUp size={16} />
                                                {/if}
                                            </button>
                                        {/if}
                                    </div>
                                </div>

                                <div class="flex-1">
                                    <div class="font-semibold">{message.title}</div>
                                    <div>{message.message}</div>
                                </div>
                            </li>
                        </button>
                    {:else}
                        <div class="text-center p-4">Aucun message avec les filtres actuels</div>
                    {/each}
                </ul>

                <button
                    class="btn mt-2 self-center"
                    on:click={() => {
                        $formData.coordinate = { lon: 0, lat: 0 };
                        showCreateNew = true;
                    }}
                >
                    Créer un nouveau message <IconPencilPlus size={20} />
                </button>
            {:else}
                <div class="text-center">
                    <h1 class="h1 mb-0">Créer un message</h1>
                    <h2>Appuyez sur la carte pour positioner votre message</h2>
                </div>

                <form class="flex w-full flex-col gap-1" method="POST" use:enhance>
                    <Field {form} name="category">
                        <Control let:attrs>
                            <Label>Catégorie</Label>

                            <MultiSelect
                                name="signalCategories"
                                choices={messageCategories}
                                maxSelection={1}
                                selected={[$formData.category]}
                                on:change={(c) => ($formData.category = c.detail[0])}
                            >
                                {#if $formData.category}
                                    {$formData.category}
                                {/if}
                            </MultiSelect>
                        </Control>
                        <Description></Description>
                        <FieldErrors />
                    </Field>

                    <Field {form} name="title">
                        <Control let:attrs>
                            <Label class="label">Titre</Label>

                            <input
                                {...attrs}
                                class="input w-full"
                                type="text"
                                bind:value={$formData.title}
                            />
                        </Control>
                        <Description></Description>
                        <FieldErrors />
                    </Field>

                    <Field {form} name="message">
                        <Control let:attrs>
                            <Label>Description</Label>

                            <textarea
                                {...attrs}
                                class="input max-h-60 min-h-32 w-full"
                                bind:value={$formData.message}
                            />
                        </Control>
                        <Description></Description>
                        <FieldErrors />
                    </Field>

                    <div class="mt-2 flex items-center justify-end gap-4">
                        <button
                            class="btn btn-sm btn-flat"
                            on:click={() => (showCreateNew = false)}
                            type="button"
                        >
                            Annuler
                        </button>

                        <button class="btn" disabled={!$formData.coordinate.lat}>
                            Envoyer <IconSend size={20} />
                        </button>
                    </div>
                </form>
            {/if}
        </main>
    </div>

    {#if data.user.isGov}
        <div class="card absolute right-6 z-10 items-stretch justify-center gap-2 p-4 text-center">
            <div class="mb-2 text-center">
                <h1 class="h1 mb-0">Messages citoyens</h1>
                <h2 class="text-muted-foreground">Informez votre ville et vos concitoyens</h2>
            </div>

            <a href="/history" class="btn h-14 self-center">Explorer l'historique des messages</a>
            <a href="/overview" class="btn h-14 self-center">
                Voir les recommendations d'aménagements
            </a>
        </div>
    {/if}
</div>

<div class="absolute inset-0">
    <Map
        options={{
            center: [-73.6128865, 45.5308667],
            zoom: 11,
            maxBounds: [
                [-74, 45.3308067], // Southwest corner: [longitude, latitude]
                [-73.3, 45.7556], // Northeast corner: [longitude, latitude]
            ],
        }}
        on:click={onMapClick}
    >
        {#each filteredMessages as message}
            {#if message.lat && message.lon}
                {#key selectedMessage}
                    <Marker
                        coordinates={[+message.lon, +message.lat]}
                        easeOnAdd={selectedMessage?.id === message.id
                            ? { zoom: 13, pitch: 0 }
                            : undefined}
                        icon={IconExclamationCircle}
                        color={selectedMessage?.id === message.id ? "#6d28d9" : "#0369a1"}
                        animate={selectedMessage?.id === message.id}
                    >
                        {#if !showCreateNew}
                            <Popup>
                                <div class="flex flex-col">
                                    <span class="font-semibold">
                                        {message.title}
                                    </span>
                                    {message.message}
                                </div>
                            </Popup>
                        {/if}
                    </Marker>
                {/key}
            {/if}
        {/each}

        {#if showCreateNew && $formData.coordinate.lon && $formData.coordinate.lat}
            {#key $formData.coordinate}
                <Marker
                    coordinates={$formData.coordinate}
                    icon={IconPlus}
                    color="#ea580c"
                    animate
                />
            {/key}
        {/if}
    </Map>
</div>
