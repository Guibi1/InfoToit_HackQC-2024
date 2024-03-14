<script lang="ts">
    import {messageStatuses} from "$lib/consts"
    export let data;
    
    
    async function send(id:string,status:string|undefined) {
        fetch("/api/message",{method:"POST",body:JSON.stringify({id,status})})
    }
</script>

<main>
    <table class="mx-auto">
        {#each data.messages as pleinte}
            <tr class="border-dark border-2">
                <td class="h1">{pleinte.title}</td>
                <td class="h1">{pleinte.category}</td>
                <td>{pleinte.message}</td>
                <td>
                    <select>
                        {#if pleinte.status}
                            {#each messageStatuses as status}
                                <option value={status}>{status}</option>
                            {/each}
                        {/if}
                    </select>
                    <button class="btn" on:click={()=>{send(pleinte.id,pleinte.status)}}>Submit</button>
                </td>
            </tr>
        {/each}
    </table>
</main>
<!-- {() => {
                        if (pleinte.status) status = pleinte.status;
                    }} -->
