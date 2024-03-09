import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals }) => {
    const user = await locals.auth();
    return {
        loggedIn: !!user,
        email: user?.user?.email,
        avatar: user?.user?.image,
        name: user?.user?.name,
    };
};
