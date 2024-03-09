import type { MapBoxZoomEvent, MapMouseEvent } from "mapbox-gl";

export type MapEventMap = {
    [key in MapMouseEvent["type"] | MapBoxZoomEvent["type"]]: (
        e: MapMouseEvent | MapBoxZoomEvent
    ) => void;
};

export function getMapEventHandlers(): MapEventMap {
    const handlers: MapEventMap = {
        click: (e) => {
            console.log("MAP", "click", e);
        },
        contextmenu: (e) => {
            console.log("MAP", "contextmenu", e);
        },
        dblclick: (e) => {
            console.log("MAP", "dblclick", e);
        },
        mousedown: (e) => {
            console.log("MAP", "mousedown", e);
        },
        mouseenter: (e) => {
            console.log("MAP", "mouseenter", e);
        },
        mouseleave: (e) => {
            console.log("MAP", "mouseleave", e);
        },
        mousemove: (e) => {
            console.log("MAP", "mousemove", e);
        },
        mouseout: (e) => {
            console.log("MAP", "mouseout", e);
        },
        mouseover: (e) => {
            console.log("MAP", "mouseover", e);
        },
        mouseup: (e) => {
            console.log("MAP", "mouseup", e);
        },
        boxzoomcancel: (e) => {
            console.log("MAP", "boxzoomcancel", e);
        },
        boxzoomend: (e) => {
            console.log("MAP", "boxzoomend", e);
        },
        boxzoomstart: (e) => {
            console.log("MAP", "boxzoomstart", e);
        },
    };

    return handlers;
}
