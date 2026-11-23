import { fetchLaptops, getLaptopById } from "./api.js";
import { isFavorite, toggleFavorite } from "./storage.js";
import { addToCompare } from "./compare.js";
import {
    initPage, formatPrice, formatSpec, SPEC_FIELDS, showError, loadErrorMessage, showElement, hideElement,
} from "./ui.js";

initPage();

const skeleton = document.getElementById("detailsSkeleton");
const content = document.getElementById("detailsContent");
const favoriteBtn = document.getElementById("favoriteBtn");
const compareBtn = document.getElementById("compareBtn");
const message = document.getElementById("detailMessage");

const params = new URLSearchParams(window.location.search);
const laptopId = Number(params.get("id"));

function renderDetails(laptop) {

    document.title = `${laptop.name} | Student Laptop Finder`;
    document.getElementById("detailImageBox").innerHTML =
        `<img src="${laptop.image}" alt="${laptop.name}" class="h-72 w-full object-cover sm:h-96">`;
    document.getElementById("detailBrand").textContent = laptop.brand;
    document.getElementById("detailName").textContent = laptop.name;
    document.getElementById("detailPrice").textContent = formatPrice(laptop.price);
    document.getElementById("detailDescription").innerHTML =
        `<p>${laptop.description}</p>`;

    document.getElementById("specsBody").innerHTML = SPEC_FIELDS.map(
        (field) => `
        <tr>
            <th scope="row" class="py-2 pr-4 font-medium text-muted">${field.label}</th>
            <td class="py-2 font-semibold">${formatSpec(field, laptop)}</td>
        </tr>`
    ).join("");

    syncFavoriteButton(laptop);

    favoriteBtn.addEventListener("click", () => {
        toggleFavorite(laptop.id);
        message.textContent = "";
        syncFavoriteButton(laptop);
    });

    compareBtn.addEventListener("click", () => {
        message.textContent = addToCompare(laptop.id).message;
        syncFavoriteButton(laptop);
    });

}

function syncFavoriteButton(laptop) {

    const saved = isFavorite(laptop.id);
    favoriteBtn.setAttribute("aria-pressed", String(saved));
    favoriteBtn.textContent = saved ? "Saved (click to remove)" : "Add to favorites";

}

async function init() {

    try {
        const laptops = await fetchLaptops();
        const laptop = getLaptopById(laptops, laptopId);
        hideElement(skeleton);

        if (!laptop) {
        showError("We could not find that laptop. Go back to the catalogue and choose one from the list.");
        return;
        }
        renderDetails(laptop);
        showElement(content);
    } catch (error) {
        hideElement(skeleton);
        showError(loadErrorMessage(error));
    }
    
}

init();