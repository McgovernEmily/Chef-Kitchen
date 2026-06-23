

/* This code snippet handles the display of the recipe details */
export let currentRecipe = null;

export function displayRecipeDetails(recipe) {

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

const overviewButton = document.querySelector('.overview-button');
const ingredientsButton = document.querySelector('.ingredients-button');
const reviewsButton = document.querySelector('.reviews-button');
const mealDetailSection = document.querySelector('.meal-detail-section');

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
