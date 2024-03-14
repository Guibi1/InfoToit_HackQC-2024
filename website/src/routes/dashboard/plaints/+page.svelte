<script lang="ts">
    import { messageStatuses } from "$lib/consts";
    export let data;

    async function send(id: string, status: string | undefined) {
        fetch("/api/message", { method: "POST", body: JSON.stringify({ id, status }) });
    }
    let changedStatus:Record<string,string>={};
</script>

<main>
    <table class="mx-auto">
        {#each data.messages as pleinte}
            {#if pleinte.status != "Terminé"}
                <tr class="border-dark border-2">
                    <td class="h1">{pleinte.title}</td>
                    <td class="h1">{pleinte.category}</td>
                    <td>{pleinte.message}</td>
                    <td>
                        <select bind:value={changedStatus[pleinte.id]}>
                            {#each messageStatuses as status}
                                <option value={status}>{status}</option>
                            {/each}
                        </select>
                        <button
                            class="btn"
                            on:click={() => {
                                send(pleinte.id, changedStatus[pleinte.id]);
                            }}>Submit</button
                        >
                    </td>
                </tr>
            {/if}
        {/each}
    </table>
</main>
<!-- {() => {
                        if (pleinte.status) status = pleinte.status;
                    }} -->
