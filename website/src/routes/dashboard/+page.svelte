<script lang="ts">
    import { goto } from "$app/navigation";
    import MapBox from "$lib/MapBox/Map.svelte";
    import Marker from "$lib/MapBox/Marker.svelte";
    import Popup from "$lib/MapBox/Popup.svelte";
    import MultiSelect from "$lib/MultiSelect.svelte";
    import { messageCategories, messageStatuses } from "$lib/consts";

    export let data;

    let selectedStatuses: string[] = [];
    let selectedCategories: string[] = [];

    let selectedMessage = "";

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
        fetch("/api/message", { method: "POST", body: JSON.stringify({ id, status }) });
    }
</script>

<div class="relative p-6 px-8">
    <main class="card absolute z-10 flex w-[450px] flex-col items-stretch gap-2 p-4">
        <h1 class="h1">Pleintes citoyennes</h1>

        <div class="grid grid-cols-2 gap-4">
            <MultiSelect
                name="graphStatus"
                choices={messageStatuses}
                bind:selected={selectedStatuses}
                on:change={() => (selectedMessage = "")}
            >
                Status
            </MultiSelect>

            <MultiSelect
                name="graphCategories"
                choices={messageCategories}
                bind:selected={selectedCategories}
                maxSelection={5}
                on:change={() => (selectedMessage = "")}
            >
                Catégories
            </MultiSelect>
        </div>

        <ul class="h-96 overflow-y-auto rounded border-2 border-dark bg-background">
            {#each filteredMessages as message}
                <button class="contents" on:click={() => (selectedMessage = message.id)}>
                    <li class="flex gap-4 border border-dark px-2 py-1 text-start">
                        <div class="flex flex-col justify-between gap-1">
                            <div class="w-52 pl-2">{message.category}</div>
                            <select
                                class="input w-52 shadow-none"
                                value={message.status}
                                on:change={(e) => send(message.id, e.currentTarget.value)}
                            >
                                {#each messageStatuses as status}
                                    <option value={status}>{status}</option>
                                {/each}
                            </select>
                        </div>

                        <div class="flex-1">
                            <div class="font-semibold">{message.title}</div>
                            <div>{message.message}</div>
                        </div>
                    </li>
                </button>
            {:else}
                <div class="text-center p-4">Aucun résultat</div>
            {/each}
        </ul>

        <a href="/dashboard/history" class="btn mt-2 self-center">Voir l'historique</a>
        <a href="/dashboard/overview" class="btn mt-2 self-center">Voir les recommendations</a>
    </main>
</div>

<div class="absolute inset-0">
    <MapBox
        options={{
            center: [-73.6128865, 45.5308667],
            zoom: 11,
            maxBounds: [
                [-74, 45.3308067], // Southwest corner: [longitude, latitude]
                [-73.3, 45.7556], // Northeast corner: [longitude, latitude]
            ],
        }}
    >
        {#each filteredMessages as message}
            {#if message.lat && message.lon}
                {#key selectedMessage}
                    <Marker
                        coordinates={[+message.lon, +message.lat]}
                        easeOnAdd={selectedMessage == message.id ? { zoom: 13 } : undefined}
                    >
                        <Popup>
                            <div class="flex flex-col">
                                <span class="font-semibold">
                                    {message.title}
                                </span>
                                {message.message}
                            </div>
                        </Popup>
                    </Marker>
                {/key}
            {/if}
        {/each}
    </MapBox>
</div>
