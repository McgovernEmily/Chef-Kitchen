import { getrecipeData, getRecipeById } from "./recipedata.js";
import { footerFunction, headerFunction } from "./home.js";


/* This code snippet handles the display of the recipe details */
export let currentRecipe = null;

export async function displayRecipeDetails(recipe) {

    currentRecipe = recipe;

    localStorage.setItem('lastViewedDish', JSON.stringify(recipe));

    const mealImage = document.querySelector('.meal-image');
    const mealTitle = document.querySelector('.meal-details-header');

    mealImage.innerHTML = `
    <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
    `;

    mealTitle.innerHTML = `
    <h2>${recipe.strMeal}</h2>
    `;

    const overviewButton = document.querySelector('.overview-button');
    if (overviewButton) overviewButton.click();
}

export async function initMealFinder() {
    const overviewButton = document.querySelector('.overview-button');
    const ingredientsButton = document.querySelector('.ingredients-button');
    const reviewsButton = document.querySelector('.reviews-button');
    const mealDetailSection = document.querySelector('.meal-detail-section');

    // This is where it finds the URL parameter for the meal ID
    const params = new URLSearchParams(window.location.search);
    const recipeId = params.get("id");

    if (recipeId) {
        try {
            const data = await getRecipeById(recipeId);

            if (data.meals) {
                displayRecipeDetails(data.meals[0]);
            }
        } catch (error) {
            console.error(error);
        }
    } else {
        const cachedDish = localStorage.getItem("lastViewedDish");

        if (cachedDish) {
            try {
                displayRecipeDetails(JSON.parse(cachedDish));
            } catch (error) {
                console.error(error);
            }
        }
    }

    if (overviewButton) {
        overviewButton.addEventListener('click', () => {
            if (!currentRecipe) return;
            mealDetailSection.innerHTML = `
            <div class="meal-overview-info">
                <p>${currentRecipe.strInstructions ? currentRecipe.strInstructions.substring(0, 750) + '...' : 'No overview available.'}</p>
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


    import('./templates.js').then(module => {
        module.setupSearchBar(); // Initialize the search bar listener since it's on this page
        module.handleSearch('chicken');
    });

    const cachedDish = localStorage.getItem('lastViewedDish');
    if (cachedDish) {
        try {
            const recipe = JSON.parse(cachedDish);
            displayRecipeDetails(recipe);
        } catch (error) {
            console.error('Error parsing cached dish:', error);
        }
    }

    footerFunction();
    headerFunction();
    handleFilterButtonClick();
}

function handleFilterButtonClick() {
    const applyFiltersButton = document.querySelector('.apply-filters-button');
    const clearFiltersButton = document.querySelector('.clear-filters-button');

    if (applyFiltersButton) {
        applyFiltersButton.addEventListener('click', async () => {
            // Read values INSIDE the click event so we get the current selections
            const category = document.querySelector('select[name="category"]').value;
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

                        if (category) {
                            const tags = recipe.strTags ? recipe.strTags.toLowerCase() : "";
                            const cat = recipe.strCategory ? recipe.strCategory.toLowerCase() : "";
                            matches = matches && (tags.includes(category.toLowerCase()) || cat.includes(category.toLowerCase()));
                        }

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
                import('./templates.js').then(module => {
                    module.renderRecipeCards(filteredRecipes);
                });
            } catch (error) {
                console.error("Error filtering recipes:", error);
            }
        });
    }

    if (clearFiltersButton) {
        clearFiltersButton.addEventListener('click', () => {
            // Reset dropdowns
            document.querySelector('select[name="category"]').value = "";
            document.querySelector('select[name="meal-type"]').value = "";
            document.querySelector('select[name="country"]').value = "";

            // Re-render default or current search
            const searchInput = document.querySelector('.search-bar input');
            const searchQuery = searchInput ? searchInput.value.trim() : "chicken";

            import('./templates.js').then(module => {
                module.handleSearch(searchQuery || 'chicken');
            });
        });
    }
}





initMealFinder();
