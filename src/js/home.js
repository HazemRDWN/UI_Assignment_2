import { fetchLaptops } from "./api.js";
import { getFavorites } from "./storage.js";
import { getAveragePrice, getLowestPrice } from "./stats.js";
import { initPage, formatPrice, showError, loadErrorMessage } from "./ui.js";

initPage();

async function showStatistics() {

    document.getElementById("statFavorites").textContent = getFavorites().length;

    try {

        const laptops = await fetchLaptops();
        document.getElementById("statCount").textContent = laptops.length;
        document.getElementById("statLowest").textContent = formatPrice(getLowestPrice(laptops));
        document.getElementById("statAverage").textContent = formatPrice(getAveragePrice(laptops));
    
    } catch (error) {

        showError(loadErrorMessage(error));

    }

}

showStatistics();