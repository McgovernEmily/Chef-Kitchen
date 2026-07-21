import { getrecipeData, getRecipeById } from "./recipedata.js";
import { footerFunction, headerFunction } from "./home.js";
import { handleSearch, renderRecipeCards, setupSearchBar } from "./templates.js";
import longDescriptions from "./long_descriptions.json";

const DEFAULT_SEARCH = 'chicken';

/* This code snippet handles the display of the recipe details */
export let currentRecipe = null;

export function displayRecipeDetails(recipe) {
    if (!recipe || !recipe.strMeal) {
        showRecipeMessage('Recipe not found', 'Select another recipe or try a new search.');
        return;
    }

    currentRecipe = recipe;

    localStorage.setItem('lastViewedDish', JSON.stringify(recipe));

    const mealImage = document.querySelector('.meal-image');
    if (!mealImage) return; // Prevent errors on pages without this element

    const mealTitle = document.querySelector('.meal-details-header');

    // Remove the animation, force a reflow, and add it back to re-trigger it
    mealImage.style.animation = 'none';
    mealImage.offsetHeight; /* trigger reflow */
    mealImage.style.animation = null;

    mealImage.replaceChildren();
    if (recipe.strMealThumb) {
        const img = document.createElement('img');
        img.src = recipe.strMealThumb;
        img.alt = recipe.strMeal;
        mealImage.appendChild(img);
    }

    mealTitle.replaceChildren();
    const heading = document.createElement('h2');
    heading.textContent = recipe.strMeal;
    mealTitle.appendChild(heading);

    const overviewButton = document.querySelector('.overview-button');
    if (overviewButton) overviewButton.click();
}

function showRecipeMessage(title, message) {
    currentRecipe = null;

    const mealTitle = document.querySelector('.meal-details-header');
    const mealImage = document.querySelector('.meal-image');
    const mealDetailSection = document.querySelector('.meal-detail-section');

    if (mealTitle) {
        mealTitle.replaceChildren();
        const heading = document.createElement('h2');
        heading.textContent = title;
        mealTitle.appendChild(heading);
    }

    if (mealImage) {
        mealImage.replaceChildren();
    }

    if (mealDetailSection) {
        mealDetailSection.replaceChildren();
        const paragraph = document.createElement('p');
        paragraph.textContent = message;
        mealDetailSection.appendChild(paragraph);
    }
}

export function initMealFinder() {
    const overviewButton = document.querySelector('.overview-button');
    const ingredientsButton = document.querySelector('.ingredients-button');
    const reviewsButton = document.querySelector('.reviews-button');
    const mealDetailSection = document.querySelector('.meal-detail-section');

    // If we're not on the mealfinder page, do not run the rest of the initialization
    if (!mealDetailSection) return;

    if (overviewButton) {
        overviewButton.addEventListener('click', () => {
            if (!currentRecipe) return;
            const fallback = currentRecipe.strInstructions ? currentRecipe.strInstructions.substring(0, 750) + '...' : 'No overview available.';
            const longDesc = longDescriptions[currentRecipe.strMeal] ? longDescriptions[currentRecipe.strMeal] : fallback;
            mealDetailSection.innerHTML = `
            <div class="meal-overview-info">
                <p>${longDesc}</p>
            </div>
            `;
        });
    }

    if (ingredientsButton) {
        ingredientsButton.addEventListener('click', () => {
            if (!currentRecipe) return;

            // Build the list of ingredients dynamically
            let ingredientsHTML = '';
            for (let i = 1; i <= 20; i++) {
                const ingredient = currentRecipe[`strIngredient${i}`];
                const measure = currentRecipe[`strMeasure${i}`];

                if (ingredient && ingredient.trim() !== "") {
                    const measureText = measure && measure.trim() !== "" ? `${measure} ` : "";
                    ingredientsHTML += `<li>${measureText}${ingredient}</li>`;
                }
            }

            mealDetailSection.innerHTML = `
            <div class="meal-ingredients-list">
                <ul>
                    <li class="meal-ingredient-title">
                        <h3>Ingredients</h3>
                    </li>
                    <li class="meal-ingredient-list">
                        <ul>
                            ${ingredientsHTML}
                        </ul>
                    </li>
                </ul>
            </div>
            `;
        });
    }

    if (reviewsButton) {
        reviewsButton.addEventListener('click', () => {
            if (!currentRecipe) return;
            mealDetailSection.innerHTML = `
            <div class="meal-reviews-list">
                <ul>
                    <li class="meal-review-title">
                        <h3>Category</h3>
                    </li>
                    <li class="meal-review-content">
                        <p>${currentRecipe.strCategory ? currentRecipe.strCategory : 'N/A'}</p>
                    </li>
                </ul>
                <ul>
                    <li class="meal-review-title">
                        <h3>Area</h3>
                    </li>
                    <li class="meal-review-content">
                        <p>${currentRecipe.strArea ? currentRecipe.strArea : 'N/A'}</p>
                    </li>
                </ul>
                <ul>
                    <li class="meal-ingredient-title">
                        <h3>Instructions</h3>
                    </li>
                    <li class="meal-ingredient-content">
                        <p>${currentRecipe.strInstructions ? currentRecipe.strInstructions : 'No instructions available.'}</p>
                    </li>
                </ul>
            </div>
            `;
        });
    }


    document.addEventListener('view-recipe-details', (event) => {
        displayRecipeDetails(event.detail);
    });

    setupSearchBar({ onViewRecipe: displayRecipeDetails }); // Initialize the search bar listener since it's on this page

    const urlParams = new URLSearchParams(window.location.search);
    const mealId = urlParams.get('id');

    if (mealId) {
        loadRecipeFromUrl(mealId);
    } else {
        handleSearch(DEFAULT_SEARCH, { onViewRecipe: displayRecipeDetails });

        const cachedDish = localStorage.getItem('lastViewedDish');
        if (cachedDish) {
            try {
                const recipe = JSON.parse(cachedDish);
                displayRecipeDetails(recipe);
            } catch (error) {
                console.error('Error parsing cached dish:', error);
            }
        }
    }

    footerFunction();
    headerFunction();
    handleFilterButtonClick();
}

async function loadRecipeFromUrl(mealId) {
    if (!/^\d+$/.test(mealId)) {
        showRecipeMessage('Recipe not found', `No recipe matches the id "${mealId}". Try searching for a meal instead.`);
        handleSearch(DEFAULT_SEARCH, { onViewRecipe: displayRecipeDetails });
        return;
    }

    try {
        const data = await getRecipeById(mealId);
        const recipe = data.meals?.[0];

        if (recipe?.strMeal) {
            displayRecipeDetails(recipe);
            handleSearch(DEFAULT_SEARCH, { onViewRecipe: displayRecipeDetails });
        } else {
            showRecipeMessage('Recipe not found', `No recipe matches the id "${mealId}". Try searching for a meal instead.`);
            handleSearch(DEFAULT_SEARCH, { onViewRecipe: displayRecipeDetails });
        }
    } catch (error) {
        console.error("Error fetching recipe by ID:", error);
        showRecipeMessage('Recipe not found', 'The recipe could not be loaded. Try searching for a meal instead.');
        handleSearch(DEFAULT_SEARCH, { onViewRecipe: displayRecipeDetails });
    }
}

function handleFilterButtonClick() {
    const applyFiltersButton = document.querySelector('.apply-filters-button');
    const clearFiltersButton = document.querySelector('.clear-filters-button');

    if (applyFiltersButton) {
        applyFiltersButton.addEventListener('click', async () => {
            // Read values INSIDE the click event so we get the current selections
            const mealType = document.querySelector('select[name="meal-type"]').value;
            const country = document.querySelector('select[name="country"]').value;

            const searchInput = document.querySelector('.search-bar input');
            const searchQuery = searchInput ? searchInput.value.trim() : "";

            try {
                // getrecipeData is async, so we must await it
                const data = await getrecipeData(searchQuery);
                let filteredRecipes = data.meals || [];

                if (filteredRecipes.length > 0) {
                    filteredRecipes = filteredRecipes.filter(recipe => {
                        let matches = true;

                        if (mealType) {
                            const cat = recipe.strCategory ? recipe.strCategory.toLowerCase() : "";
                            matches = matches && cat.includes(mealType.toLowerCase());
                        }

                        if (country) {
                            matches = matches && recipe.strArea?.toLowerCase() === country.toLowerCase();
                        }

                        return matches;
                    });
                }

                // Use the template module to render the cards
                renderRecipeCards(filteredRecipes, displayRecipeDetails);
            } catch (error) {
                console.error("Error filtering recipes:", error);
            }
        });
    }

    if (clearFiltersButton) {
        clearFiltersButton.addEventListener('click', () => {
            // Reset dropdowns
            document.querySelector('select[name="meal-type"]').value = "";
            document.querySelector('select[name="country"]').value = "";

            // Re-render default or current search
            const searchInput = document.querySelector('.search-bar input');
            const searchQuery = searchInput ? searchInput.value.trim() : "chicken";

            handleSearch(searchQuery || DEFAULT_SEARCH, { onViewRecipe: displayRecipeDetails });
        });
    }
}





initMealFinder();
