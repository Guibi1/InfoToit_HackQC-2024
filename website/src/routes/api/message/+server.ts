import { getXataClient } from "$xata";
import { error, json } from "@sveltejs/kit";

import { messageStatuses } from "$lib/consts";
import { z } from "zod";

const schema = z.object({
    id: z.string(),
    status: z.enum(messageStatuses),
});

export const POST = async ({ locals, request }) => {
    if (!locals.user?.isGov) error(401);

    const parse = schema.safeParse(await request.json());
    
    if (!parse.success) error(400);
    console.log(parse.data)
    const r=await getXataClient().db.Messages.update({
        id: parse.data.id,
        status: parse.data.status,
    });

    console.log(r)

    return json({});
};
