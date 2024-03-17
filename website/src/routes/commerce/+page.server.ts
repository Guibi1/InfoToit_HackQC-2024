import { getXataClient } from "$xata";
import { error, fail, redirect } from "@sveltejs/kit";
import { gridDisk, latLngToCell } from "h3-js";
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
    default: async ({ locals, request }) => {
        if (!locals.user) throw error(401);
        const form = await superValidate(request, zod(schema));

        if (!form.valid) {
            return fail(400, { form });
        }

        const selectedHex = latLngToCell(form.data.lat, form.data.long, 8);
        const hexes = gridDisk(selectedHex, 2);

        const { records: commerces } = await getXataClient()
            .db.BusinessAnalysis.select(["id", "vacant", "contained"])
            .filter({
                $all: [
                    {
                        "id": { $any: hexes },
                        "contained->missing": { $contains: form.data.type },
                        "vacant": { $isNot: "[]" },
                    },
                ],
            })
            .sort("score", "desc")
            .getPaginated({ pagination: { size: 3 } });

        if (commerces.length > 0) {
            const goodHexes = await getXataClient()
                .db.h3_hexes.select(["polygon"])
                .filter({ id: { $any: commerces.map((c) => c.id) } })
                .getAll();

            return {
                form,
                hexes: goodHexes,
                commerces: commerces.flatMap((c) => c.vacant),
            };
        }

        return { form, commerces: [] };
    },
};
