<script lang="ts">
    export let data;
    let status: string;
</script>

<main>
    <table class="mx-auto">
        {#each data.messages as pleinte}
            <tr class="border-dark border-2">
                <td class="h1">{pleinte.title}</td>
                <td>{pleinte.message}</td>
                <td>
                    <select ></select>
                </td>
            </tr>
        {/each}
    </table>
</main>
{status}

<!-- {() => {
                        if (pleinte.status) status = pleinte.status;
                    }} -->