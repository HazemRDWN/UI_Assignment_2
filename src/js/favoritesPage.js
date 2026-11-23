import { fetchLaptops, getLaptopById } from "./api.js";
import { getFavorites, clearFavorites } from "./storage.js";
import { getTotalPrice, getAveragePrice } from "./stats.js";
import {
    initPage, renderLaptopCard, bindFavoriteButtons, formatPrice, showError, loadErrorMessage, hideElement,
} from "./ui.js";

initPage();

const grid = document.getElementById("favoritesGrid");
const emptyMessage = document.getElementById("emptyMessage");

let allLaptops = [];

function renderFavorites() {

    const saved = getFavorites()
        .map((id) => getLaptopById(allLaptops, id))
        .filter(Boolean);

    grid.innerHTML = saved.map((laptop) => renderLaptopCard(laptop, { removeMode: true })).join("");
    document.getElementById("favCount").textContent = saved.length;
    document.getElementById("favTotal").textContent = saved.length ? formatPrice(getTotalPrice(saved)) : "\u2014";
    document.getElementById("favAverage").textContent = saved.length ? formatPrice(getAveragePrice(saved)) : "\u2014";
    emptyMessage.classList.toggle("hidden", saved.length > 0);
    
}

async function init() {

    try {

        allLaptops = await fetchLaptops();
        renderFavorites();

    } catch (error) {

        grid.innerHTML = "";
        hideElement(emptyMessage);
        showError(loadErrorMessage(error));

    }

}

bindFavoriteButtons(grid, renderFavorites);

document.getElementById("clearFavorites").addEventListener("click", () => {

    if (getFavorites().length === 0) return;

    if (window.confirm("Remove all saved laptops from your favorites?")) {

        clearFavorites();
        renderFavorites();
        
    }

});

init();