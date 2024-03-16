import { redirect } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { schema } from "./schema";

export const load = async ({ locals }) => {
    if (!locals.user) redirect(302, "/");
    return {
        form: await superValidate(zod(schema)),
    };
};
