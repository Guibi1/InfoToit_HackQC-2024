import { redirect } from "@sveltejs/kit";

export const load = async ({ params }) => {
    if (!params.coords.match(/^-?\d+\.\d+,-?\d+\.\d+$/)) redirect(302, "/");
    const coords = { lon: +params.coords.split(",")[0], lat: +params.coords.split(",")[1] };

    return { coords };
};
