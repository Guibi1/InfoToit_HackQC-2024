import { getXataClient } from "$xata";
import { error, fail, redirect } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { schema } from "./schema";

export const load = async ({ locals, depends }) => {
    if (!locals.user) redirect(302, "/");
    depends("plaints");

    const messages = await getXataClient()
        .db.Messages.select(["title", "message", "category", "status", "lon", "lat"])
        .filter({ user: locals.user })
        .getAll();

    return {
        user: locals.user,
        messages: messages.map((m) => m.toSerializable()),
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

        await getXataClient().db.Messages.create({
            title: form.data.title,
            message: form.data.message,
            category: form.data.category,
            lon: form.data.coordinate.lon,
            lat: form.data.coordinate.lat,
            status: "En cours",
            user: locals.user,
        });

        return { form };
    },
};
