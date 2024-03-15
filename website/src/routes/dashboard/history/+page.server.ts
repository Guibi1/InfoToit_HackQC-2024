import { messageCategories } from "$lib/consts.js";
import { getXataClient } from "$xata";
import { redirect } from "@sveltejs/kit";
import type { ChartDataset } from "chart.js";

export const load = async ({ locals, url }) => {
    if (!locals.user?.isGov) redirect(302, "/");

    const searchParams = url.searchParams;
    let years = [
        Number.parseInt(searchParams.get("y1") ?? ""),
        Number.parseInt(searchParams.get("y2") ?? ""),
    ].filter((y) => !isNaN(y));

    let categories = searchParams
        .getAll("c")
        .filter((v) => (messageCategories as readonly string[]).includes(v))
        .slice(0, 5);

    if (years.length === 0) {
        years = [2024];
    }
    if (categories.length === 0) {
        categories = ["Plantation d'arbre"];
    }

    const stats = await getXataClient()
        .db.MessagesStats.select(["Year", "Month", "Count", "Category"])
        .filter({
            Year: { $any: years },
            Category: { $any: categories },
        })
        .getAll();
    let nextColor = 0;
    const datasets = stats.reduce<
        Record<string, { colors: string[]; years: Record<number, ChartDataset<"line", number[]>> }>
    >((datasets, val) => {
        if (!(val.Category in datasets)) {
            datasets[val.Category] = { colors: colors[nextColor], years: {} };
            nextColor += 1;
        }
        const dataset = datasets[val.Category];

        if (!(val.Year in dataset.years)) {
            const color = dataset.colors[Object.keys(dataset.years).length];
            dataset.years[val.Year] = {
                label: `${val.Year} - ${val.Category}`,
                fill: "origin",
                lineTension: 0.4,
                backgroundColor: color + "4d",
                borderColor: color,
                pointBorderWidth: 10,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "rgb(0, 0, 0)",
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: Array.from({ length: 12 }).map(() => 0),
            } as ChartDataset<"line", number[]>;
        }

        dataset.years[val.Year].data[val.Month - 1] = val.Count;
        return datasets;
    }, {});

    return {
        years,
        categories,
        stats: Object.values(datasets).flatMap((d) => Object.values(d.years).reverse()),
    };
};

const colors = [
    ["#10b981", "#059669"],
    ["#ef4444", "#b91c1c"],
    ["#60a5fa", "#2563eb"],
    ["#facc15", "#eab308"],
    ["#9333ea", "#6b21a8"],
];
