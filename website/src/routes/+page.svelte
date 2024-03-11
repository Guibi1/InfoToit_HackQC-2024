<script lang="ts">
    import Layer from "$lib/MapBox/Layer.svelte";
    import Map from "$lib/MapBox/Map.svelte";
    import Marker from "$lib/MapBox/Marker.svelte";
    import Source from "$lib/MapBox/Source.svelte";
    import mapboxgl from "mapbox-gl";
    import "@splidejs/svelte-splide/css";
    import { IconMathGreater } from "@tabler/icons-svelte";
    //PARK https//source.unsplash.com/8oAZllGPRSo
    //BIKE https//source.unsplash.com/V4Y1z8Eebq0
    //RESTAURANT STREET SIDE https//source.unsplash.com/KMVypJ9_IM8
    //NEIGBORHOOD https//source.unsplash.com/pjrPSQLElq8
    //POLICE CARS https//source.unsplash.com/ckzGwPUgJrQ
    //HOUSEFIRE https//source.unsplash.com/3GWLv30smng
    //BUSINESS https//source.unsplash.com/1N49Cn7P0Fg
    //SCHOOL https//source.unsplash.com/zFSo6bnZJTw

    import { Splide, SplideSlide, SplideTrack } from "@splidejs/svelte-splide";

    const { LngLat } = mapboxgl;

    let defaultCoords = new LngLat(-73.709274, 45.531926);
</script>

<main class="container mx-auto flex-1 py-4">
    <h1 class="h1">Bienvenue sur InfoToit,</h1>
    <h2 class="h2">
        La platforme multi-fonctionelle qui promouvoit le développement d'une société consciente
    </h2>
    <a href="/search" class="btn">Goto search</a>
    <a href="/profile" class="btn">Goto profile</a>

    <Splide
        hasTrack={false}
        aria-label="My Favorite Images"
        options={{
            rewind: true,
            width: 800,
            gap: "1rem",
            type: "loop",
            perPage: 1,
            autoplay: true,
        }}
    >
        <SplideTrack class="img-slider">
            <SplideSlide>
                <a href="#target-1"
                    ><img
                        src="https://source.unsplash.com/pjrPSQLElq8"
                        class="object-cover"
                        alt="Neighborhood"
                    />
                </a>
            </SplideSlide>
            <SplideSlide>
                <a href="#target-2">
                    <img
                        src="https://source.unsplash.com/1N49Cn7P0Fg"
                        class="object-cover"
                        alt="Business"
                    />
                </a>
            </SplideSlide>
            <SplideSlide>
                <a href="#target-3">
                    <img
                        src="https://source.unsplash.com/KMVypJ9_IM8"
                        class="object-cover"
                        alt="Restaurant"
                    />
                </a>
            </SplideSlide>
            <SplideSlide>
                <a href="#target-4">
                    <img
                        src="https://source.unsplash.com/zFSo6bnZJTw"
                        class="object-cover"
                        alt="School"
                    />
                </a>
            </SplideSlide>
            <SplideSlide>
                <a href="#target-5">
                    <img
                        src="https://source.unsplash.com/3GWLv30smng"
                        class="object-cover"
                        alt="House Fire"
                    />
                </a>
            </SplideSlide>
            <SplideSlide>
                <a href="#target-6">
                    <img
                        src="https://source.unsplash.com/ckzGwPUgJrQ"
                        class="object-cover"
                        alt="Police"
                    />
                </a>
            </SplideSlide>
            <SplideSlide>
                <a href="#target-7">
                    <img
                        src="https://source.unsplash.com/8oAZllGPRSo"
                        class="object-cover"
                        alt="Park"
                    />
                </a>
            </SplideSlide>
            <SplideSlide>
                <a href="#target-8">
                    <img
                        src="https://source.unsplash.com/V4Y1z8Eebq0"
                        class="object-cover"
                        alt="Bike"
                    />
                </a>
            </SplideSlide>
        </SplideTrack>

        <div class="splide__progress h-4">
            <div class="splide__progress__bar" />
        </div>

        <div class="splide__arrows">
            <button class="splide__arrow splide__arrow--prev"><IconMathGreater /></button>
            <button class="splide__arrow splide__arrow--next"><IconMathGreater /></button>
        </div>
    </Splide>

    <div>
        <h1 id="target-1" class="h1">Intertitre 1</h1>
        <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Numquam necessitatibus
            mollitia iste pariatur. Quo consequatur neque dolor quisquam possimus consequuntur,
            cumque ducimus sint? Officiis totam voluptates veritatis delectus exercitationem
            molestiae?
        </p>
    </div>

    <div>
        <h1 id="target-2" class="h1">Intertitre 2</h1>
        <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Numquam necessitatibus
            mollitia iste pariatur. Quo consequatur neque dolor quisquam possimus consequuntur,
            cumque ducimus sint? Officiis totam voluptates veritatis delectus exercitationem
            molestiae?
        </p>
    </div>

    <div>
        <h1 id="target-3" class="h1">Intertitre 3</h1>
        <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Numquam necessitatibus
            mollitia iste pariatur. Quo consequatur neque dolor quisquam possimus consequuntur,
            cumque ducimus sint? Officiis totam voluptates veritatis delectus exercitationem
            molestiae?
        </p>
    </div>
    <div>
        <h1 id="target-4" class="h1">Intertitre 2</h1>
        <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Numquam necessitatibus
            mollitia iste pariatur. Quo consequatur neque dolor quisquam possimus consequuntur,
            cumque ducimus sint? Officiis totam voluptates veritatis delectus exercitationem
            molestiae?
        </p>
    </div>
    <div>
        <h1 id="target-5" class="h1">Intertitre 2</h1>
        <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Numquam necessitatibus
            mollitia iste pariatur. Quo consequatur neque dolor quisquam possimus consequuntur,
            cumque ducimus sint? Officiis totam voluptates veritatis delectus exercitationem
            molestiae?
        </p>
    </div>
    <div>
        <h1 id="target-6" class="h1">Intertitre 2</h1>
        <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Numquam necessitatibus
            mollitia iste pariatur. Quo consequatur neque dolor quisquam possimus consequuntur,
            cumque ducimus sint? Officiis totam voluptates veritatis delectus exercitationem
            molestiae?
        </p>
    </div>
    <div>
        <h1 id="target-7" class="h1">Intertitre 2</h1>
        <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Numquam necessitatibus
            mollitia iste pariatur. Quo consequatur neque dolor quisquam possimus consequuntur,
            cumque ducimus sint? Officiis totam voluptates veritatis delectus exercitationem
            molestiae?
        </p>
    </div>
    <div>
        <h1 id="target-8" class="h1">Intertitre 2</h1>
        <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Numquam necessitatibus
            mollitia iste pariatur. Quo consequatur neque dolor quisquam possimus consequuntur,
            cumque ducimus sint? Officiis totam voluptates veritatis delectus exercitationem
            molestiae?
        </p>
    </div>
</main>

<footer class="justify-items-center">
    <hr class="hr">

    <div class="mx-auto grid grid-cols-2">
        <div>
            <h1 class="h1 underline">Nous Contacter</h1>

            <p>
                N'hésite pas à nous contacter sur <a
                    href="https://www.linkedin.com/company/wolfgang-inc/about/"
                    class="underline">LinkedIn</a
                > si tu as des questions sur les fonctionnalités de InfoToit ou tout autre information!
            </p>
        </div>
        <div>
            <a href="/conditions" class="h1 underline">Conditions d'utilisation</a>
        </div>
    </div>
    <div class="mx-auto">
        <p>© InfoToit 2024.Tout droits réservés.</p>
    </div>
</footer>
