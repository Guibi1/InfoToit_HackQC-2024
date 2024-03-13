<script lang="ts">
    import oli from "$lib/assets/oli.webp";
    import gab from "$lib/assets/gab.webp";
    import phil from "$lib/assets/phil.webp";
    import laurent from "$lib/assets/laurent.webp";
    import devpost from "$lib/assets/simple-icons--devpost.svg";
    import { IconFlag, IconBrandLinkedin } from "@tabler/icons-svelte";
</script>

<div class="container flex flex-col gap-6">
    <div>
        <h1 class="m-10 text-center text-3xl">Notre but!</h1>

        <p class="mx-auto max-w-screen-md text-center text-lg">
            L'objectif principal de CommuPartage est de stimuler la réutilisation d'objets,
            notamment d'outils, afin de réduire la surconsommation. Parallèlement, l'application
            vise à renforcer la solidarité au sein des communautés en facilitant l'entraide entre
            les membres, favorisant ainsi un échange positif et durable au niveau local.
        </p>
    </div>

    <div>
        <h1 class="m-10 text-center text-3xl">Technologies utilisées</h1>
        <div class="grid grid-cols-5 gap-4 p-5">
            <div class="card bg-primary-foreground">
                <h2 class="mt-4 p-2 text-center">Auth0</h2>
                <img class="aspect-square w-full object-cover p-8" src={devpost} alt="" />
            </div>
            <div class="bg-primary-foreground">
                <h2 class="mt-4 p-2 text-center">SvelteKit</h2>
                <img class="aspect-square w-full object-cover p-8" src={devpost} alt="" />
            </div>
            <div class="bg-primary-foreground">
                <h2 class="mt-4 p-2 text-center">PlanetScale</h2>
                <img class="aspect-square w-full object-cover p-8" src={devpost} alt="" />
            </div>
            <div class="bg-primary-foreground">
                <h2 class="mt-4 p-2 text-center">MediaPipe</h2>
                <img class="aspect-square w-full object-cover p-8" src={devpost} alt="" />
            </div>
            <div class="bg-primary-foreground">
                <img class="aspect-square w-full object-cover p-8" src={devpost} alt="" />
            </div>
        </div>
    </div>
    <h2 class="mt-10 text-center text-3xl">Rencontrez les Devs</h2>

    <div class="mx-auto grid grid-cols-4">
        <div class="card m-4 p-4">
            <img alt="" src={oli} />

            <div class="text">
                <span class="heading">Olivier</span>
                <p class="info">Machine Learning Legend</p>
                <div class="country">
                    <IconFlag></IconFlag>
                    <span>Laval</span>
                </div>
            </div>
            <ul class="soc">
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
            </ul>
        </div>

        <div class="card m-4 p-4">
            <img alt="" src={laurent} />

            <div class="text">
                <span class="heading">Laurent</span>
                <p class="info">FrontEnd Specialist</p>
                <div class="country">
                    <IconFlag></IconFlag>
                    <span>Sherbrooke</span>
                </div>
            </div>
            <ul class="soc">
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
            </ul>
        </div>
        <div class="card m-4 p-4">
            <img alt="" src={gab} />

            <div class="text">
                <span class="heading">Gabriel</span>
                <p class="info">Handsome Handyman</p>
                <div class="country">
                    <IconFlag></IconFlag>
                    <span>Montreal</span>
                </div>
            </div>
            <ul class="soc">
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
            </ul>
        </div>
        <div class="card m-4 p-4">
            <img alt="" src={phil} />

            <div class="text">
                <span class="heading">Philip</span>
                <p class="info">Little Slave</p>
                <div class="country">
                    <IconFlag></IconFlag>
                    <span>Île-Bizzard</span>
                </div>
            </div>
            <ul class="soc">
                <a href="https://devpost.com/philip-soitu">
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
                <a href="https://www.linkedin.com/in/philip-soitu-7a40a3240/">
                    <IconBrandLinkedin></IconBrandLinkedin>
                </a>
            </ul>
        </div>
    </div>
</div>
