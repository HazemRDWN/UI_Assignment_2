export const getTotalPrice = (laptops) =>
    laptops.reduce((total, laptop) => total + laptop.price, 0);

export const getAveragePrice = (laptops) =>
    laptops.length === 0 ? 0 : Math.round(getTotalPrice(laptops) / laptops.length);

export const getLowestPrice = (laptops) =>
    laptops.reduce((lowest, laptop) => Math.min(lowest, laptop.price), Infinity);