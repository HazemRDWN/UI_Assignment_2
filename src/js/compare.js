import { getFavorites, addFavorite, getCompareIds, setCompareIds } from "./storage.js";

export const MIN_COMPARE = 2;
export const MAX_COMPARE = 4;

const BEST_RULES = {

    price: "min",
    weightKg: "min",
    ramGB: "max",
    storageGB: "max",
    batteryHours: "max",

};

export const getSelectedIds = () => {

    const favorites = getFavorites();
    return getCompareIds().filter((id) => favorites.includes(id));

};

export function selectLaptop(id) {

    const ids = getSelectedIds();
    
    if (ids.includes(id)) return { ok: true, message: "" };

    if (ids.length >= MAX_COMPARE) {

        return { ok: false, message: `You can compare up to ${MAX_COMPARE} laptops. Uncheck one first.` };
    
    }

    setCompareIds([...ids, id]);

    return { ok: true, message: "" };

}

export const deselectLaptop = (id) => setCompareIds(getSelectedIds().filter((pickedId) => pickedId !== id));

export function addToCompare(id) {

    if (getSelectedIds().includes(id)) {

        return { ok: true, message: "This laptop is already in your comparison." };
    
    }
    
    const result = selectLaptop(id);

    if (!result.ok) return result;

    addFavorite(id);

    return { ok: true, message: "Added to your favorites and your comparison." };

}

export function getBestValues(laptops) {

    const best = {};

    Object.entries(BEST_RULES).forEach(([key, rule]) => {

        best[key] = laptops
        .map((laptop) => laptop[key])
        .reduce((winner, value) => (rule === "min" ? Math.min(winner, value) : Math.max(winner, value)));
    
    });
    
    return best;
  
}

export const isBestValue = (laptop, key, best) => key in best && laptop[key] === best[key];