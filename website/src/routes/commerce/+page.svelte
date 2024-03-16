<script lang="ts">
    import { superForm } from "sveltekit-superforms";
    import { Field, Control } from "formsnap";
    import { zodClient } from "sveltekit-superforms/adapters";
    import type { PageData } from "./$types.js";
    import { schema } from "./schema.js";
    import { businessCategories } from "$lib/consts";
    import SuperDebug from "sveltekit-superforms";
    import SelectList from "$lib/SelectList.svelte";

    export let data: PageData;

    

    let selectedMessage = "";

    const form = superForm(data.form, {
        validators: zodClient(schema),
    });
    const { form: formData, enhance } = form;
</script>

<form method="POST" use:enhance>
    <Field {form} name="type">
        <SelectList
            on:change={() => (selectedMessage = "")}
            maxSelection={1}
            choices={businessCategories}
        >Type d'Entreprise</SelectList>
    </Field>
</form>
