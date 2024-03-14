import { getXataClient } from "$xata";
import { redirect } from "@sveltejs/kit";

export const load = async ({ locals }) => {
    if (!locals.user?.isGov) redirect(302, "/");

    const messages = await getXataClient().db.Messages.getAll();

    return { messages: messages.toSerializable() };
};
