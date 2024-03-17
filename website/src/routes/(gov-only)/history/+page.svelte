<script lang="ts">
    import { goto } from "$app/navigation";
    import MultiSelect from "$lib/MultiSelect.svelte";
    import SelectList from "$lib/SelectList.svelte";
    import { messageCategories, mois } from "$lib/consts";
    import { IconArrowLeft } from "@tabler/icons-svelte";
    import { Line } from "svelte-chartjs";

    export let data;

    function onGraphDataChange(years: number[], categories: string[]) {
        const searchParams = new URLSearchParams();
        searchParams.set("y1", "" + years[0]);
        searchParams.set("y2", "" + years[1]);
        for (const c of categories) searchParams.append("c", c);
        goto(`?${searchParams}`);
    }
</script>

<main class="container mx-auto gap-8 p-4">
    <div class="mb-4 flex items-center justify-between gap-4 md:justify-start">
        <h1 class="h1 mb-0">Historique</h1>

        <a href="/dashboard" class="btn btn-sm btn-flat items-center gap-1">
            <IconArrowLeft size={16} /> Revenir
            <span class="hidden sm:inline-block"> au tableau de bord </span>
        </a>
    </div>

    <div class="flex flex-col gap-8 lg:flex-row">
        <div class="flex-1">
            <Line
                data={{
                    labels: mois,
                    datasets: data.stats,
                }}
                options={{ responsive: true }}
            />
        </div>

        <div class="grid w-full gap-4 sm:grid-cols-2 lg:w-80 lg:grid-cols-1">
            <div class="w-full">
                <h2 class="h2">Catégories</h2>

                <MultiSelect
                    name="graphCategories"
                    choices={data.categories.concat(
                        messageCategories.filter((m) => !data.categories.includes(m))
                    )}
                    maxSelection={5}
                    selected={data.categories}
                    on:change={(e) => onGraphDataChange(data.years, e.detail)}
                >
                    Sélectionner les catégories à afficher
                </MultiSelect>
            </div>

            <div class="w-full">
                <h2 class="h2">Années</h2>

                <SelectList
                    choices={[2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024]}
                    maxSelection={2}
                    selected={data.years}
                    on:change={(e) => onGraphDataChange(e.detail, data.categories)}
                >
                    Années
                </SelectList>
            </div>
        </div>
    </div>
</main>
