import { fetchLaptops } from "./api.js";
import { filterLaptops, sortLaptops } from "./filters.js";
import {
    initPage, renderLaptopCard, bindFavoriteButtons, showError, loadErrorMessage, hideElement,
} from "./ui.js";

initPage();

const grid = document.getElementById("laptopGrid");
const resultCount = document.getElementById("resultCount");
const emptyMessage = document.getElementById("emptyMessage");
const searchInput = document.getElementById("searchInput");
const categorySelect = document.getElementById("categoryFilter");
const maxPriceInput = document.getElementById("maxPriceFilter");
const minRamSelect = document.getElementById("minRamFilter");
const sortSelect = document.getElementById("sortSelect");

let allLaptops = [];

function readCriteria() {
    const maxPriceText = maxPriceInput.value.trim();

    return {

        query: searchInput.value,
        category: categorySelect.value,
        maxPrice: maxPriceText === "" ? null : Number(maxPriceText),
        minRam: Number(minRamSelect.value)

    };

}

function renderResults() {

  const filtered = filterLaptops(allLaptops, readCriteria());
  const visible = sortLaptops(filtered, sortSelect.value);

  grid.innerHTML = visible.map((laptop) => renderLaptopCard(laptop)).join("");
  resultCount.textContent = `Showing ${visible.length} of ${allLaptops.length} laptops`;
  emptyMessage.classList.toggle("hidden", visible.length > 0);

}

function resetFilters() {

    searchInput.value = "";
    categorySelect.value = "all";
    maxPriceInput.value = "";
    minRamSelect.value = "0";
    sortSelect.value = "default";
    renderResults();

}

async function init() {

    try {

        allLaptops = await fetchLaptops();
        renderResults();
        
    } catch (error) {

        grid.innerHTML = "";
        resultCount.textContent = "";
        hideElement(emptyMessage);
        showError(loadErrorMessage(error));

    }

}

[searchInput, categorySelect, maxPriceInput, minRamSelect, sortSelect].forEach((control) =>
    control.addEventListener("input", renderResults)
);

document.getElementById("resetFilters").addEventListener("click", resetFilters);
bindFavoriteButtons(grid, renderResults);

init();