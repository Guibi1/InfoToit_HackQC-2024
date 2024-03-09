import type { MapBoxZoomEvent, MapMouseEvent } from "mapbox-gl";

export type MapEventMap = {
    [key in MapMouseEvent["type"] | MapBoxZoomEvent["type"]]: {
        handler: (e: MapMouseEvent | MapBoxZoomEvent) => void;
    };
};

export function getMapEventHandlers(
    dispatch: (eventName: string, payload: unknown) => void
): MapEventMap {
    const handlers: MapEventMap = {
        click: {
            handler: (e) => dispatch("click", e),
        },
        contextmenu: {
            handler: (e) => dispatch("contextmenu", e),
        },
        dblclick: {
            handler: (e) => dispatch("dblclick", e),
        },
        mousedown: {
            handler: (e) => dispatch("mousedown", e),
        },
        mouseenter: {
            handler: (e) => dispatch("mouseenter", e),
        },
        mouseleave: {
            handler: (e) => dispatch("mouseleave", e),
        },
        mousemove: {
            handler: (e) => dispatch("mousemove", e),
        },
        mouseout: {
            handler: (e) => dispatch("mouseout", e),
        },
        mouseover: {
            handler: (e) => dispatch("mouseover", e),
        },
        mouseup: {
            handler: (e) => dispatch("mouseup", e),
        },
        boxzoomcancel: {
            handler: (e) => dispatch("boxzoomcancel", e),
        },
        boxzoomend: {
            handler: (e) => dispatch("boxzoomend", e),
        },
        boxzoomstart: {
            handler: (e) => dispatch("boxzoomstart", e),
        },
    };

    return handlers;
}
