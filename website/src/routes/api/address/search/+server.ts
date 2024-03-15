import { POST_CANADA_KEY } from "$env/static/private";
import { getXataClient } from "$xata";
import { json } from "@sveltejs/kit";

export const POST = async ({ request }) => {
    const searchTerms = await request.text();

    const results: PostCanadaItem[] = await fetch(
        `https://ws1.postescanada-canadapost.ca/addresscomplete/interactive/find/v2.10/json.ws?key=${POST_CANADA_KEY}&provider=AddressComplete&package=Interactive&service=Find&version=2.1&SearchTerm=QC ${searchTerms}&LanguagePreference=fr&MaxSuggestions=4&endpoint=json.ws`
    ).then((res) => res.json());

    const data = await Promise.all(
        results.map((r) =>
            getXataClient()
                .db.Addresses.select(["location.id", "location.longitude", "location.latitude"])
                .filter({
                    civic_no: r.Text.match(/\d+/)?.at(0),
                    mail_postal_code: r.Description.match(/\w\d\w \d\w\d/)
                        ?.at(0)
                        ?.replace(" ", ""),
                })
                .getFirst()
                .then((l) => ({
                    ...r,
                    id: l?.location?.id,
                    longitude: l?.location?.longitude,
                    latitude: l?.location?.latitude,
                }))
        )
    );

    return json(data);
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
