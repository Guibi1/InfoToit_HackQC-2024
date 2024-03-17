import { getXataClient } from "$xata";
import { error, fail, redirect } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { schema } from "./schema";

export const load = async ({ locals }) => {
    if (!locals.user) redirect(302, "/");

    return {
        form: await superValidate(zod(schema)),
    };
};

export const actions = {
    default: async ({ locals, request, fetch }) => {
        if (!locals.user) throw error(401);
        const form = await superValidate(request, zod(schema));

        if (!form.valid) {
            return fail(400, { form });
        }

        const { hexes } = await fetch("https://brebeufapi.vercel.app/api/besthexes", {
            method: "POST",
            headers: { "Content-type": "text/html" },
            body: JSON.stringify(form.data),
        }).then((res) => res.json());

        const polygons = await getXataClient()
            .db.h3_hexes.select(["polygon"])
            .filter({ id: { $any: hexes } })
            .getAll();

        const commerces = await getXataClient()
            .db.BusinessAnalysis.select(["vacant"])
            .filter({ id: { $any: hexes } })
            .getAll();

        return { form, hexes: polygons, commerces: commerces.flatMap((c) => c.vacant) };
    },
};
