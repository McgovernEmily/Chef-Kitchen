import { getrecipeData } from "./recipedata.js";

// This function now ACCEPTS the array of recipes and just handles rendering them
function renderRecipeCards(recipesList) {
    const recipeCardsContainer = document.querySelector('.recipe-cards');

    // Clear the container before adding new recipes
    recipeCardsContainer.innerHTML = '';

    // If no recipes are found, show a message
    if (!recipesList || recipesList.length === 0) {
        recipeCardsContainer.innerHTML = '<p>No recipes found.</p>';
        return;
    }

    recipesList.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.classList.add('recipe-card');
        recipeCard.innerHTML = `
        <div class="recipe-container">
            <div class="recipe-image">
                <img src="${recipe.image}" alt="${recipe.title}">
            </div>
            <div class="recipe-content">
                <h3 class="recipe-title">${recipe.title}</h3>
                <p class="recipe-summary">${recipe.summary}</p>
                <div class="recipe-footer">
                    <button class="add-to-cart-button">View Recipe</button>
                </div>
            </div>
        </div>
        `;
        recipeCardsContainer.appendChild(recipeCard);
    });
}

// This function handles getting the data and passing it to the render function
async function handleSearch(query = "") {
    try {
        // getrecipeData returns an object like: { results: [ ...recipes... ], offset: 0, etc }
        const data = await getrecipeData(query);

        // We only want the 'results' array from the Spoonacular response
        const recipes = data.results;

        // Pass that array to our render function
        renderRecipeCards(recipes);
    } catch (error) {
        console.error("Error fetching recipes:", error);
    }
}

// When the page loads, fetch some default recipes
handleSearch();

// Setup event listener for the search input
const searchInput = document.querySelector('.search-bar input');
if (searchInput) {
    searchInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            handleSearch(searchInput.value);
        }
    });
}







