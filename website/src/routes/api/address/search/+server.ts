import { POST_CANADA_KEY } from "$env/static/private";
import { getXataClient } from "$xata";
import { json } from "@sveltejs/kit";

export const POST = async ({ request }) => {
    const searchTerms = await request.text();

    const results: PostCanadaItem[] = await fetch(
        `https://ws1.postescanada-canadapost.ca/addresscomplete/interactive/find/v2.10/json.ws?key=${POST_CANADA_KEY}&provider=AddressComplete&package=Interactive&service=Find&version=2.1&SearchTerm=QC ${searchTerms}&LanguagePreference=fr&MaxSuggestions=4&endpoint=json.ws`
    ).then((res) => res.json());

    const addresses = await getXataClient()
        .db.Addresses.select([
            "civic_no",
            "mail_postal_code",
            "location.id",
            "location.longitude",
            "location.latitude",
        ])
        .filter({
            civic_no: {
                $any: results.map((r) => r.Text.match(/\d+/)?.at(0)).filter((r) => !!r) as string[],
            },
            mail_postal_code: {
                $any: results
                    .map((r) =>
                        r.Description.match(/\w\d\w \d\w\d/)
                            ?.at(0)
                            ?.replace(" ", "")
                    )
                    .filter((r) => !!r) as string[],
            },
        })
        .getAll();

    return json(
        results
            .map((r) => ({
                r,
                a: addresses.find(
                    (a) =>
                        r.Text.match(/\d+/)?.at(0) == a.civic_no &&
                        r.Description.match(/\w\d\w \d\w\d/)
                            ?.at(0)
                            ?.replace(" ", "") == a.mail_postal_code
                ),
            }))
            .map(({ r, a }) => ({
                ...r,
                id: a?.location?.id,
                longitude: a?.location?.longitude,
                latitude: a?.location?.latitude,
            }))
    );
};

type PostCanadaItem = {
    Text: string;
    Highlight: string;
    Description: string;
};

export type AddressSearchResult = PostCanadaItem & {
    id: string;
    longitude: number;
    latitude: number;
};
