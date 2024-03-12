import { XataClient, getXataClient } from "$xata";
import { json } from "@sveltejs/kit";

export const POST = async ({ request }) => {
    const searchTerms = await request.text();

    const res = await getXataClient().db.Addresses.search(searchTerms, {
        target: ["full_addr", "city", "city_pcs", "postal_code"],
        page: { size: 5 },
    });

    return json(res.records);
};

export type AddressSearchResult = Awaited<
    ReturnType<XataClient["db"]["Addresses"]["search"]>
>["records"][number];
