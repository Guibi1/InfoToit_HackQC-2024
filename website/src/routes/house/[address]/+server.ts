import { PUBLIC_MAPBOX_KEY } from "$env/static/public";
import { getXataClient } from "$xata";
import { error, json } from "@sveltejs/kit";

export const POST = async ({ locals, params }) => {
    if (!locals.user) throw error(401);

    const coordinates = await fetch(
        `https://api.mapbox.com/search/geocode/v6/forward?q=${params.address}&access_token=${PUBLIC_MAPBOX_KEY}`
    )
        .then((res) => res.json())
        .then((json) => json.features[0].properties.coordinates);

    const res = await getXataClient().db.SavedHouses.create({
        address: params.address,
        lon: +coordinates.longitude,
        lat: +coordinates.latitude,
        user: locals.user,
    });

    return json({
        success: true,
        id: res.id,
    });
};
