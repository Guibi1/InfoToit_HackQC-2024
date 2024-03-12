import { getXataClient } from "$xata";
import { error, fail, redirect } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { schema } from "./schema";

export const load = async ({ locals }) => {
    if (!locals.user) redirect(302, "/");

    const messages = await getXataClient()
        .db.Messages.select(["title", "message", "status"])
        .filter({ user: locals.user })
        .getAll();

    return {
        user: locals.user,
        messages: messages.map((m) => m.toSerializable()),
        form: await superValidate(zod(schema)),
    };
};
export const actions = {
    
    default: async ({locals, request }) => {
        if (!locals.user) throw error(401);
        const form = await superValidate(request, zod(schema));

        console.log(form);

        if (!form.valid) {
            // Again, return { form } and things will just work.
            return fail(400, { form });
        }
        
        // TODO: Do something with the validated form.data
        

        const res = await getXataClient().db.Messages.create({
            title: form.data.title,
            message: form.data.message,
            category:form.data.category,
            status: "En cours",
            lon: form.data.coordinate_lon,
            lat: form.data.coordinate_lat,
            user: locals.user,
        });

        console.log(res)

        // Yep, return { form } here too
        return { form };
    },
};
