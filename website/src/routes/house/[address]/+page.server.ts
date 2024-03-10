import { PUBLIC_MAPBOX_KEY } from "$env/static/public";

export const load = async ({ params }) => {
    const coordinates = await fetch(
        `https://api.mapbox.com/search/geocode/v6/forward?q=${params.address}&access_token=${PUBLIC_MAPBOX_KEY}`
    )
        .then((res) => res.json())
        .then((json) => json.features[0].properties.coordinates);

    return {
        address: params.address,
        coords: {
            lon: +coordinates.longitude,
            lat: +coordinates.latitude,
        },
    };
};
