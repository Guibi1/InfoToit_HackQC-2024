import { PUBLIC_MAPBOX_KEY } from "$env/static/public";
import { getXataClient } from "$xata";
import { fail, json } from "@sveltejs/kit";

export const POST = async ({ locals, params }) => {
    const session = await locals.auth();
    if (!session) throw fail(401);

    const coordinates = await fetch(
        `https://api.mapbox.com/search/geocode/v6/forward?q=${params.address}&access_token=${PUBLIC_MAPBOX_KEY}`
    )
        .then((res) => res.json())
        .then((json) => json.features[0].properties.coordinates);

    const user = await getXataClient()
        .db.Users.select(["id"])
        .filter({ email: session?.user?.email })
        .getFirstOrThrow();

    const res = await getXataClient().db.SavedHouses.create({
        address: params.address,
        lon: +coordinates.longitude,
        lat: +coordinates.latitude,
        user: user,
    });

    return json({
        success: true,
        id: res.id,
    });
};
