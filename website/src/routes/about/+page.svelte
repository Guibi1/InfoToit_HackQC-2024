<script lang="ts">
    import gab from "$lib/assets/gab.webp";
    import laurent from "$lib/assets/laurent.webp";
    import oli from "$lib/assets/oli.webp";
    import { IconBrandLinkedin, IconFlag } from "@tabler/icons-svelte";
</script>

<div class="container mx-auto flex flex-col gap-6 px-2 py-4">
    <section>
        <h1 class="h1 text-center">Notre but!</h1>

        <p class="mx-auto max-w-screen-md text-center text-lg">
            L'objectif principal de InfoToit est d'aider les citoyens du Québec à trouver leur
            maison de rêve malgré le marché immobilier actuel.
        </p>
    </section>

    <section>
        <h1 class="h1 text-center">Rencontrez les Devs</h1>

        <div class="mx-auto grid md:grid-cols-3 md:px-16">
            <div class="card m-4 items-center gap-2 p-4">
                <img
                    class="mx-auto max-h-96 rounded border-2 border-dark"
                    alt="olivier"
                    src={oli}
                />

                <div class="text-center">
                    <span class="text-2xl font-semibold">Olivier</span>
                    <p class="info">Machine Learning Legend</p>
                </div>

                <div class="flex items-center gap-1">
                    <IconFlag /> Laval
                </div>

                <div class="flex w-full items-center justify-center gap-6">
                    <a href="https://devpost.com/olivier520100">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="1em"
                            height="1em"
                            viewBox="0 0 24 24"
                            ><path
                                fill="black"
                                d="M6.002 1.61L0 12.004L6.002 22.39h11.996L24 12.004L17.998 1.61zm1.593 4.084h3.947c3.605 0 6.276 1.695 6.276 6.31c0 4.436-3.21 6.302-6.456 6.302H7.595zm2.517 2.449v7.714h1.241c2.646 0 3.862-1.55 3.862-3.861c.009-2.569-1.096-3.853-3.767-3.853Z"
                            /></svg
                        >
                    </a>
                    <a href="https://www.linkedin.com/in/olivier-saint-vincent/">
                        <IconBrandLinkedin></IconBrandLinkedin>
                    </a>
                </div>
            </div>

            <div class="card m-4 items-center gap-2 p-4">
                <img
                    class="mx-auto max-h-96 rounded border-2 border-dark"
                    alt="laurent"
                    src={laurent}
                />

                <div class="text-center">
                    <span class="text-2xl font-semibold">Laurent</span>
                    <p class="info">FrontEnd Specialist</p>
                </div>

                <div class="flex items-center gap-1">
                    <IconFlag /> Sherbrooke
                </div>

                <div class="flex w-full items-center justify-center gap-6">
                    <a href="https://devpost.com/Guibi1">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="1em"
                            height="1em"
                            viewBox="0 0 24 24"
                            ><path
                                fill="black"
                                d="M6.002 1.61L0 12.004L6.002 22.39h11.996L24 12.004L17.998 1.61zm1.593 4.084h3.947c3.605 0 6.276 1.695 6.276 6.31c0 4.436-3.21 6.302-6.456 6.302H7.595zm2.517 2.449v7.714h1.241c2.646 0 3.862-1.55 3.862-3.861c.009-2.569-1.096-3.853-3.767-3.853Z"
                            /></svg
                        >
                    </a>

                    <a href="https://www.linkedin.com/in/guibi/">
                        <IconBrandLinkedin></IconBrandLinkedin>
                    </a>
                </div>
            </div>

            <div class="card m-4 items-center gap-2 p-4">
                <img
                    class="mx-auto max-h-96 rounded border-2 border-dark"
                    alt="gabriel"
                    src={gab}
                />

                <div class="text-center">
                    <span class="text-2xl font-semibold">Gabriel</span>
                    <p class="info">Handsome Handyman</p>
                </div>

                <div class="flex items-center gap-1">
                    <IconFlag /> Montreal
                </div>

                <div class="flex w-full items-center justify-center gap-6">
                    <a href="https://devpost.com/gabriel-mikus11">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="1em"
                            height="1em"
                            viewBox="0 0 24 24"
                            ><path
                                fill="black"
                                d="M6.002 1.61L0 12.004L6.002 22.39h11.996L24 12.004L17.998 1.61zm1.593 4.084h3.947c3.605 0 6.276 1.695 6.276 6.31c0 4.436-3.21 6.302-6.456 6.302H7.595zm2.517 2.449v7.714h1.241c2.646 0 3.862-1.55 3.862-3.861c.009-2.569-1.096-3.853-3.767-3.853Z"
                            /></svg
                        >
                    </a>
                    <a href="https://www.linkedin.com/in/gabriel-mikus-728a2326b/">
                        <IconBrandLinkedin></IconBrandLinkedin>
                    </a>
                </div>
            </div>
        </div>
    </section>
</div>
