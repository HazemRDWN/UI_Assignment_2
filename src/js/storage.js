const FAVORITES_KEY = "laptopFinder.favorites";
const COMPARE_KEY = "laptopFinder.compare";
const THEME_KEY = "laptopFinder.theme";

const load = (key, fallback) => {

    try {

        const text = localStorage.getItem(key);

        return text === null ? fallback : JSON.parse(text);

    } catch (error) {

        return fallback;

    }

};

const save = (key, value) => {

    try {

        localStorage.setItem(key, JSON.stringify(value));

    } catch (error) {

        console.error("Could not save to localStorage:", error);

    }

};

const loadList = (key) => {

    const list = load(key, []);
    return Array.isArray(list) ? list : [];

};

export const getFavorites = () => loadList(FAVORITES_KEY);
export const isFavorite = (id) => getFavorites().includes(id);

export function addFavorite(id) {

    const favorites = getFavorites();
    
    if (!favorites.includes(id)) {

        save(FAVORITES_KEY, [...favorites, id]);
        
    }

}

export function removeFavorite(id) {

    save(FAVORITES_KEY, getFavorites().filter((favoriteId) => favoriteId !== id));
    save(COMPARE_KEY, getCompareIds().filter((compareId) => compareId !== id));

}

export function toggleFavorite(id) {

    if (isFavorite(id)) {

        removeFavorite(id);
        return false;

    }

    addFavorite(id);
    return true;

}

export function clearFavorites() {

    save(FAVORITES_KEY, []);
    save(COMPARE_KEY, []);

}

export const getCompareIds = () => loadList(COMPARE_KEY);
export const setCompareIds = (ids) => save(COMPARE_KEY, ids);

export function getTheme() {

    return load(THEME_KEY, "battery") === "performance" ? "performance" : "battery";

}

export const setTheme = (theme) => save(THEME_KEY, theme);