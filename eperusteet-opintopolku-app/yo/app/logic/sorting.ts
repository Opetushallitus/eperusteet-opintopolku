namespace Sorting {
    export const getSortableOptions = (connectWith = "") => ({
        axis: "y",
        connectWith: connectWith,
        handle: ".sortable-item-handle",
        cursor: "move",
        delay: 100,
        tolerance: "pointer",
        placeholder: "sortable-item-placeholder",
        start: (e, ui) => {
            ui.placeholder.height(ui.item.height());
        }
    });
}
