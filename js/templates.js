import { getrecipeData } from "./recipedata.js";
import descriptions from "./descriptions.json";

// This function handles getting the data and passing it to the render function
export async function handleSearch(query = "", options = {}) {
    try {
        const data = await getrecipeData(query);

        // We only want the 'meals' array from TheMealDB response
        const recipes = data.meals;

        // Pass that array to our render function
        renderRecipeCards(recipes, options.onViewRecipe);
        renderSuggestions(recipes);
    } catch (error) {
        console.error("Error fetching recipes:", error);
    }
}

/* This code snippet handles the rendering of the recipe cards */

export function renderRecipeCards(recipesList, onViewRecipe) {
    const recipeCardsContainer = document.querySelector('.recipe-cards');

    if (!recipeCardsContainer) return;

    recipeCardsContainer.innerHTML = '';

    if (!recipesList || recipesList.length === 0) {
        recipeCardsContainer.innerHTML = '<p>No recipes found.</p>';
        return;
    }

    recipesList.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.classList.add('recipe-card');

        const title = recipe.strMeal;
        const imageUrl = recipe.strMealThumb;
        const defaultSummary = recipe.strInstructions ? recipe.strInstructions.substring(0, 150) + '...' : 'No summary available.';
        const summary = descriptions[title] ? descriptions[title] : defaultSummary;

        recipeCard.innerHTML = `
        <div class="recipe-container">
            <div class="recipe-image">
                <img src="${imageUrl}" alt="${title}" loading="lazy">
            </div>
            <div class="recipe-content">
                <h3 class="recipe-title">${title}</h3>
                <p class="recipe-summary">${summary}</p>
                <div class="recipe-footer">
                    <button class="add-to-cart-button">View Recipe</button>
                </div>
            </div>
        </div>
        `;

        const viewButton = recipeCard.querySelector('.add-to-cart-button');
        viewButton.addEventListener('click', () => {
            if (typeof onViewRecipe === 'function') {
                onViewRecipe(recipe);
                return;
            }

            document.dispatchEvent(new CustomEvent('view-recipe-details', { detail: recipe }));
        });

        recipeCardsContainer.appendChild(recipeCard);
    });
}


// Setup event listener for the search input
export function setupSearchBar(options = {}) {
    const searchInput = document.querySelector(options.selector || '.search-bar input');
    if (searchInput) {
        searchInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                handleSearch(searchInput.value, { onViewRecipe: options.onViewRecipe });
            }
        });
    }
}


export function renderSuggestions(recipesList) {
    const suggestionCardsContainer = document.querySelector('.recipe-suggestion-cards');

    if (!suggestionCardsContainer) return; // Prevent crash if container doesn't exist on this page

    suggestionCardsContainer.innerHTML = '';

    if (!recipesList || recipesList.length === 0) {
        suggestionCardsContainer.innerHTML = '<p>No recipes found.</p>';
        return;
    }

    recipesList.forEach(recipe => {
        const suggestionCard = document.createElement('div');
        suggestionCard.classList.add('recipe-card');

        const title = recipe.strMeal;
        const imageUrl = recipe.strMealThumb;
        const defaultSummary = recipe.strInstructions ? recipe.strInstructions.substring(0, 150) + '...' : 'No summary available.';
        const summary = descriptions[title] ? descriptions[title] : defaultSummary;

        suggestionCard.innerHTML = `
        <div class="recipe-container">
            <div class="recipe-image">
                <img src="${imageUrl}" alt="${title}" loading="lazy">
            </div>
            <div class="recipe-content">
                <h3 class="recipe-title">${title}</h3>
                <p class="recipe-summary">${summary}</p>
                <div class="recipe-footer">
                    <button class="suggestion-button">Add Suggestion</button>
                </div>
            </div>
        </div>
        `;

        const viewButton = suggestionCard.querySelector('.suggestion-button');
        if (viewButton) {
            viewButton.addEventListener('click', () => {
                const event = new CustomEvent('open-suggestion-dialog', { detail: recipe });
                document.dispatchEvent(event);
            });
        }

        suggestionCardsContainer.appendChild(suggestionCard);
    });
}
