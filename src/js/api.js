const DATA_URL = "data/laptops.json";

export async function fetchLaptops() {

  try {

    const response = await fetch(DATA_URL);

    if (!response.ok) {

      throw new Error(`the server answered with status ${response.status}`);

    }

    return await response.json();
    
  } catch (error) {
    
    throw new Error(`Could not load ${DATA_URL} (${error.message}).`);
  }

}

export const getLaptopById = (laptops, id) => laptops.find((laptop) => laptop.id === id);
