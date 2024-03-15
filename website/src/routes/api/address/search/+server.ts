import { XataClient, getXataClient, type LocationsRecord } from "$xata";
import { json } from "@sveltejs/kit";
import type { SelectedPick } from "@xata.io/client";

export const POST = async ({ request }) => {
    const searchTerms = await request.text();

    const res = await getXataClient().db.Addresses.search(searchTerms, {
        target: [
            { column: "civic_no", weight: 4 },
            "civic_no_suffix",
            "street_type",
            { column: "street_name", weight: 2 },
            "street_dir",
            "mail_mun_name",
            "mail_postal_code",
        ],
        page: { size: 5 },
    });

    return json(
        await Promise.all(
            res.records.map((r) =>
                getXataClient()
                    .db.Locations.select(["id", "longitude", "latitude"])
                    .filter({ id: r.location!.id })
                    .getFirst()
                    .then((l) => ({ ...r, location: l }))
            )
        )
    );
};

export type AddressSearchResult = Awaited<
    ReturnType<XataClient["db"]["Addresses"]["search"]>
>["records"][number] & {
    location: SelectedPick<LocationsRecord, ("latitude" | "longitude" | "id")[]>;
};
