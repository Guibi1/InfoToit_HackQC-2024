import adapter from "@sveltejs/adapter-vercel";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
    extensions: [".svelte"],
    preprocess: [vitePreprocess()],
    vitePlugin: {},
    kit: {
        adapter: adapter(),
        alias: {
            $xata: "src/xata.ts",
        },
    },
};
export default config;
