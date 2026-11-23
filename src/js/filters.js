export const matchesSearch = (laptop, query) =>
    `${laptop.name} ${laptop.brand}`.toLowerCase().includes(query.trim().toLowerCase());

export function filterLaptops(laptops, { query, category, maxPrice, minRam }) {

    return laptops.filter(

        (laptop) =>
        matchesSearch(laptop, query) &&
        (category === "all" || laptop.category === category) &&
        (maxPrice === null || laptop.price <= maxPrice) &&
        laptop.ramGB >= minRam

    );
  
}

const SORTERS = {

    "price-asc": (a, b) => a.price - b.price,
    "price-desc": (a, b) => b.price - a.price,
    "battery-asc": (a, b) => a.batteryHours - b.batteryHours,
    "battery-desc": (a, b) => b.batteryHours - a.batteryHours,
    "weight-asc": (a, b) => a.weightKg - b.weightKg,
    "weight-desc": (a, b) => b.weightKg - a.weightKg,

};

export function sortLaptops(laptops, sortKey) {

    const copy = [...laptops];
    const sorter = SORTERS[sortKey];
    return sorter ? copy.sort(sorter) : copy;

}