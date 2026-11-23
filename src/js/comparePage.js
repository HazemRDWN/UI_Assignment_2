import { fetchLaptops, getLaptopById } from "./api.js";
import { getFavorites } from "./storage.js";
import {
    MIN_COMPARE, getSelectedIds, selectLaptop, deselectLaptop, getBestValues, isBestValue,
} from "./compare.js";
import {
    initPage, formatPrice, formatSpec, SPEC_FIELDS, showError, loadErrorMessage, hideElement,
} from "./ui.js";

initPage();

const messageBox = document.getElementById("compareMessage");
const skeleton = document.getElementById("compareSkeleton");
const emptyMessage = document.getElementById("compareEmpty");
const pickerBox = document.getElementById("comparePickerBox");
const picker = document.getElementById("comparePicker");
const wrapper = document.getElementById("compareWrapper");
const tableHead = document.getElementById("compareHead");
const tableBody = document.getElementById("compareBody");

let allLaptops = [];

function renderPicker(favorites, selectedIds) {

    picker.innerHTML = favorites
        .map(
        (laptop) => `
            <label class="flex cursor-pointer items-center gap-3 rounded-lg border border-line p-3 transition duration-200 hover:border-accent">
            <input type="checkbox" value="${laptop.id}" class="h-5 w-5 rounded border-line text-accent focus:ring-accent" ${selectedIds.includes(laptop.id) ? "checked" : ""}>
            <span class="text-sm">
                <span class="block font-semibold">${laptop.name}</span>
                <span class="text-muted">${formatPrice(laptop.price)}</span>
            </span>
            </label>`
        )
        .join("");

}

function renderTable(selected) {

    if (selected.length < MIN_COMPARE) {

        hideElement(wrapper);
        return;

    }

    const best = getBestValues(selected);

    tableHead.innerHTML = `
        <tr>
        <th scope="col" class="p-4 text-sm text-muted">Specification</th>
        ${selected
            .map(
            (laptop) => `
                <th scope="col" class="p-4 align-bottom">
                <a href="details.html?id=${laptop.id}" class="transition duration-200 hover:text-accent">${laptop.name}</a>
                </th>`
            )
            .join("")}
        </tr>`;

    tableBody.innerHTML = SPEC_FIELDS.map(
        (field) => `
        <tr>
            <th scope="row" class="p-4 font-medium text-muted">${field.label}</th>
            ${selected
            .map(
                (laptop) =>
                `<td class="p-4 ${isBestValue(laptop, field.key, best) ? "best-value" : ""}">${formatSpec(field, laptop)}</td>`
            )
            .join("")}
        </tr>`
    ).join("");

    wrapper.classList.remove("hidden");

}

function render(message = "") {

    const favorites = getFavorites()
        .map((id) => getLaptopById(allLaptops, id))
        .filter(Boolean);
    const selectedIds = getSelectedIds();
    const selected = selectedIds.map((id) => getLaptopById(allLaptops, id)).filter(Boolean);

    emptyMessage.classList.toggle("hidden", favorites.length >= MIN_COMPARE);
    pickerBox.classList.toggle("hidden", favorites.length === 0);
    renderPicker(favorites, selectedIds);
    renderTable(selected);

    const needMore = favorites.length >= MIN_COMPARE && selected.length < MIN_COMPARE;
    messageBox.textContent = message || (needMore ? `Select at least ${MIN_COMPARE} favorites to compare.` : "");
    
}

async function init() {

    try {
        allLaptops = await fetchLaptops();
        hideElement(skeleton);
        render();
    } catch (error) {
        hideElement(skeleton);
        showError(loadErrorMessage(error));
    }

}

picker.addEventListener("change", (event) => {

    const box = event.target;
    if (box.type !== "checkbox") return;
    const id = Number(box.value);

    if (box.checked) {

        const result = selectLaptop(id);
        render(result.ok ? "" : result.message);
        
    } else {

        deselectLaptop(id);
        render();
        
    }

});

init();