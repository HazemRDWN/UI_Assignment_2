import { isFavorite, toggleFavorite, getTheme, setTheme } from "./storage.js";

export const formatPrice = (value) => `$${value.toLocaleString("en-US")}`;

export const SPEC_FIELDS = [

    { label: "Price", key: "price", format: formatPrice },
    { label: "Brand", key: "brand" },
    { label: "Category", key: "category" },
    { label: "CPU", key: "cpu" },
    { label: "RAM", key: "ramGB", format: (value) => `${value} GB` },
    { label: "Storage", key: "storageGB", format: (value) => `${value} GB` },
    { label: "Battery life", key: "batteryHours", format: (value) => `${value} hours` },
    { label: "Weight", key: "weightKg", format: (value) => `${value} kg` },
    { label: "Screen size", key: "screenInches", format: (value) => `${value} inches` },

];

export const formatSpec = (field, laptop) =>
    field.format ? field.format(laptop[field.key]) : laptop[field.key];

export const showElement = (element) => element.classList.remove("hidden");
export const hideElement = (element) => element.classList.add("hidden");

export function showError(message) {

  const box = document.getElementById("errorBox");
  if (!box) return;
  box.textContent = message;
  showElement(box);

}

export const loadErrorMessage = (error) =>
    `${error.message} Open the site through a local server such as VS Code Live Server.`;

export function renderLaptopCard(laptop, { removeMode = false } = {}) {

    const saved = isFavorite(laptop.id);
    const buttonText = removeMode ? "Remove" : saved ? "Saved" : "Add to favorites";

    return `
        <article class="laptop-card">
        <a href="details.html?id=${laptop.id}" class="block bg-line">
            <img src="${laptop.image}" alt="${laptop.name}" loading="lazy" class="h-44 w-full object-cover">
        </a>
        <div class="flex flex-1 flex-col gap-3 p-4">
            <div>
            <p class="text-sm text-muted">${laptop.brand} &middot; ${laptop.category}</p>
            <h3 class="text-lg font-semibold">
                <a href="details.html?id=${laptop.id}" class="transition duration-200 hover:text-accent">${laptop.name}</a>
            </h3>
            </div>
            <p class="text-2xl font-bold text-accent">${formatPrice(laptop.price)}</p>
            <ul class="space-y-1 text-sm text-muted">
            <li>${laptop.cpu}</li>
            <li>${laptop.ramGB} GB RAM &middot; ${laptop.storageGB} GB storage</li>
            <li>${laptop.batteryHours} h battery &middot; ${laptop.weightKg} kg</li>
            </ul>
            <div class="mt-auto flex gap-2">
            <a href="details.html?id=${laptop.id}" class="btn-action flex-1">Details</a>
            <button type="button" class="btn-action flex-1" data-action="favorite" data-id="${laptop.id}" aria-pressed="${saved && !removeMode}">${buttonText}</button>
            </div>
        </div>
        </article>`;
}

export function bindFavoriteButtons(container, onChange) {

    container.addEventListener("click", (event) => {

        const button = event.target.closest('[data-action="favorite"]');
        if (!button) return;
        toggleFavorite(Number(button.dataset.id));
        onChange();

    });

}

function applyTheme(theme) {

    document.documentElement.dataset.theme = theme;
    const button = document.getElementById("themeToggle");

    if (button) {

        const name = theme === "performance" ? "Performance" : "Battery Saver";
        button.textContent = name;
        button.setAttribute("aria-label", `Switch theme (current: ${name} Mode)`);

    }

}

function initTheme() {

    let theme = getTheme();
    applyTheme(theme);

    const button = document.getElementById("themeToggle");
    if (!button) return;
    button.addEventListener("click", () => {
        theme = theme === "performance" ? "battery" : "performance";
        setTheme(theme);
        applyTheme(theme);
    });
}

function initNav() {

  const button = document.getElementById("navToggle");
  const nav = document.getElementById("mainNav");
  
  if (!button || !nav) return;

  button.addEventListener("click", () => {

    const isHidden = nav.classList.toggle("hidden");
    button.setAttribute("aria-expanded", String(!isHidden));

  });

}

export function initPage() {

    initTheme();
    initNav();
  
}