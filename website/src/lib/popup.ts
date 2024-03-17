import {
    arrow,
    autoUpdate,
    computePosition,
    flip,
    offset,
    shift,
    type Placement,
} from "@floating-ui/dom";
import { onMount } from "svelte";

export type PopupOptions = {
    popupId?: string;
    arrowId?: string;
    placement?: Placement;
};

export function popup(node: HTMLElement, { popupId, arrowId, placement }: PopupOptions) {
    const go = () => {
        const floatingEl = document.querySelector<HTMLElement>(`#${popupId ?? "popup"}`);
        const arrowEl = floatingEl?.querySelector<HTMLElement>(`#${arrowId ?? "arrow"}`);
        if (!floatingEl) {
            throw "Missing popover element";
        }

        document.body.appendChild(floatingEl);

        const hide = () =>
            Object.assign(floatingEl.style, { "opacity": `0%`, "z-index": `-99999` });
        const show = () =>
            Object.assign(floatingEl.style, {
                "opacity": `100%`,
                "z-index": `99999`,
            });

        const updatePosition = () => {
            computePosition(node, floatingEl, {
                placement,
                middleware: [
                    offset(4),
                    flip(),
                    shift({ padding: 12 }),
                    arrowEl ? arrow({ element: arrowEl }) : undefined,
                ],
            }).then(({ x, y, placement, middlewareData }) => {
                Object.assign(floatingEl.style, {
                    left: `${x}px`,
                    top: `${y}px`,
                });

                if (arrowEl && middlewareData.arrow) {
                    const { x, y } = middlewareData.arrow;
                    const staticSide = {
                        top: "bottom",
                        right: "left",
                        bottom: "top",
                        left: "right",
                    }[placement.split("-")[0]] as string;

                    Object.assign(arrowEl.style, {
                        left: x != null ? `${x}px` : "",
                        top: y != null ? `${y}px` : "",
                        bottom: "",
                        right: "",
                        [staticSide]: "-6px",
                    });
                }
            });
        };

        node.addEventListener("focusin", show);
        node.addEventListener("focusout", hide);
        floatingEl.addEventListener("focusin", show);
        floatingEl.addEventListener("focusout", hide);

        const listenToChild = () => {
            for (const button of floatingEl.getElementsByTagName("button"))
                button.addEventListener("click", hide);
        };

        const observer = new MutationObserver(listenToChild);
        observer.observe(floatingEl, { childList: true, subtree: true });
        listenToChild();

        const unmount = autoUpdate(node, floatingEl, updatePosition);

        return () => {
            unmount();

            observer.disconnect();
            for (const button of floatingEl.getElementsByTagName("button"))
                button.removeEventListener("click", hide);
        };
    };

    const floatingEl = document.querySelector<HTMLElement>(`#${popupId ?? "popup"}`);
    if (floatingEl) {
        return {
            destroy: go(),
        };
    }

    setTimeout(go, 50);
    onMount(go);
}
