import { messageStatuses } from "$lib/consts";
import { getXataClient } from "$xata";
import { error, json } from "@sveltejs/kit";
import { z } from "zod";

const schema = z.object({
    id: z.string(),
    status: z.enum(messageStatuses),
});

export const POST = async ({ locals, request }) => {
    if (!locals.user?.isGov) error(401);

    const parse = schema.safeParse(await request.json());
    if (!parse.success) error(400);

    await getXataClient().db.Messages.update({
        id: parse.data.id,
        status: parse.data.status,
    });

    return json({ success: true });
};
