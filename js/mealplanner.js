import { handleSearch, setupSearchBar } from "./templates.js";
import { getrecipeData } from "./recipedata.js";

export const plannerState = {
    activeGridDay: null,
    activeGridMeal: null,
    currentRecipeToAdd: null
};

export function mealPlanner() {
    // Select ALL elements with the class 'meal' (all 7 days)
    const meals = document.querySelectorAll(".meal-container");

    meals.forEach(meal => {
        meal.innerHTML = `
            <div class="meal">
                <div class="meal-card" id="breakfast">Breakfast
                <button class="add-btn">
                    ➕ Add Meal
                </button>
                </div>
                
                <div class="meal-card" id="lunch">Lunch
                <button class="add-btn">
                    ➕ Add Meal
                </button>
                </div>
                <div class="meal-card" id="dinner">Dinner
                <button class="add-btn">
                    ➕ Add Meal
                </button>
                </div>
            </div>`;

        // Attach event listeners to the buttons for THIS specific day
        const addButtons = meal.querySelectorAll('.add-btn');
        addButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const card = e.target.closest('.meal-card');
                const dayColumn = e.target.closest('.week-day');

                if (!card || !dayColumn) return;

                plannerState.activeGridDay = dayColumn.querySelector('.day-title').innerText.trim();
                plannerState.activeGridMeal = card.id;

                const dialog = document.getElementById('grid-search-dialog');
                if (dialog) {
                    const results = document.getElementById('grid-search-results');
                    if (results) results.innerHTML = '';
                    const input = document.getElementById('grid-search-query');
                    if (input) input.value = '';
                    dialog.showModal();
                }
            });
        });
    });
}

function resetMeal(e) {
    if (!e || !e.target) return;

    const btn = e.target;
    const card = btn.closest('.meal-card');
    if (!card) return;

    // Reset the card back to its empty state
    const mealMoment = card.id;
    const title = mealMoment.charAt(0).toUpperCase() + mealMoment.slice(1);

    card.innerHTML = `${title}
    <button class="add-btn">
        ➕ Add Meal
    </button>`;

    // Re-attach the search listener
    const newBtn = card.querySelector('.add-btn');
    if (newBtn) {
        newBtn.addEventListener('click', (ev) => {
            const dayColumn = ev.target.closest('.week-day');
            if (dayColumn) {
                plannerState.activeGridDay = dayColumn.querySelector('.day-title').innerText.trim();
                plannerState.activeGridMeal = card.id;
                const dialog = document.getElementById('grid-search-dialog');
                if (dialog) {
                    const results = document.getElementById('grid-search-results');
                    if (results) results.innerHTML = '';
                    dialog.showModal();
                }
            }
        });
    }
}

export function setupSuggestionDialog() {
    // 1. Create dialog HTML and append to body once
    const dialogHTML = `
    <dialog id="suggestion-dialog" class="custom-dialog">
        <h2>Select Day & Meal</h2>
        <form id="suggestion-form" method="dialog" class="dialog-form">
            <div>
                <label for="day">Day</label>
                <select id="day" name="day">
                    <option value="Sunday">Sunday</option>
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                </select>
            </div>
            <div>
                <label for="meal-moment">Meal Moment</label>
                <select id="meal-moment" name="meal-moment">
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                </select>
            </div>
            <div class="dialog-actions">
                <button type="button" class="dialog-cancel-btn" onclick="document.getElementById('suggestion-dialog').close()">Cancel</button>
                <button type="submit" class="add-btn dialog-submit-btn">Add to Plan</button>
            </div>
        </form>
    </dialog>`;

    document.body.insertAdjacentHTML('beforeend', dialogHTML);
    const dialog = document.getElementById('suggestion-dialog');
    const form = document.getElementById('suggestion-form');

    // 2. Listen for 'open-suggestion-dialog' event from templates.js
    document.addEventListener('open-suggestion-dialog', (e) => {
        plannerState.currentRecipeToAdd = e.detail;
        dialog.showModal();
    });

    // 3. Handle Form Submit
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Stop the page from refreshing!

        const day = document.getElementById('day').value;
        const mealMoment = document.getElementById('meal-moment').value;

        if (!plannerState.currentRecipeToAdd) return;

        populateGridCell(day, mealMoment, plannerState.currentRecipeToAdd);
        plannerState.currentRecipeToAdd = null;
        dialog.close(); // Close the modal window!
    });
}

function populateGridCell(day, mealMoment, recipe) {
    // Find the week-day column that matches the selected day
    const weekDays = document.querySelectorAll('.week-day');
    let targetDayElement = null;
    weekDays.forEach(wd => {
        const titleEl = wd.querySelector('.day-title');
        if (titleEl && titleEl.innerText.trim() === day) {
            targetDayElement = wd;
        }
    });

    if (targetDayElement) {
        const targetMealCard = targetDayElement.querySelector(`#${mealMoment}`);
        if (targetMealCard) {
            targetMealCard.innerHTML = `
            <div class="meal-moment-title">${mealMoment}</div>
            <div class="meal-content-preview">
                <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
            </div>
            <div class="meal-footer-preview">
                <h3 class="recipe-name">${recipe.strMeal}</h3>
                <button class="change-meal-btn">Remove</button>
            </div>`;

            // Attach listener to the new "Change" button so it can reset the card
            const changeBtn = targetMealCard.querySelector('.change-meal-btn');
            if (changeBtn) {
                changeBtn.addEventListener('click', resetMeal);
        // Save the selected recipe
        const mealPlan = JSON.parse(localStorage.getItem("mealPlan")) || {};

        mealPlan[`${day}-${mealMoment}`] = currentRecipeToAdd;

        localStorage.setItem("mealPlan", JSON.stringify(mealPlan));

        // Find the day container
        const weekDays = document.querySelectorAll('.week-day');
        let targetDayElement = null;
        weekDays.forEach(wd => {
            if (wd.querySelector('.day-title').textContent.trim() === day) {
                targetDayElement = wd;
            }
        }
    }
}

function setupGridSearchDialog() {
    const dialogHTML = `
    <dialog id="grid-search-dialog" class="custom-dialog">
        <h2>Find a Meal</h2>
        <div class="dialog-form">
            <div class="grid-search-header">
                <input type="text" id="grid-search-query" placeholder="e.g., Chicken" class="grid-search-input">
                <button type="button" id="grid-search-btn" class="dialog-submit-btn grid-search-btn-style">Search</button>
            </div>
            <div id="grid-search-results">
                <!-- Results go here -->
            </div>
            <div class="dialog-actions grid-search-actions">
                <button type="button" class="dialog-cancel-btn" onclick="document.getElementById('grid-search-dialog').close()">Close</button>
            </div>
        </div>
    </dialog>`;

    document.body.insertAdjacentHTML('beforeend', dialogHTML);
    const dialog = document.getElementById('grid-search-dialog');
    const searchBtn = document.getElementById('grid-search-btn');
    const searchInput = document.getElementById('grid-search-query');
    const resultsContainer = document.getElementById('grid-search-results');

    const performSearch = async () => {
        const query = searchInput.value.trim();
        if (!query) return;

        resultsContainer.innerHTML = '<p>Searching...</p>';
        try {
            const data = await getrecipeData(query);
            const recipes = data.meals;

            if (!recipes || recipes.length === 0) {
                resultsContainer.innerHTML = '<p>No recipes found.</p>';
                return;
            }

            resultsContainer.innerHTML = '';
            recipes.forEach(recipe => {
                const item = document.createElement('div');
                item.className = 'grid-search-item';
                item.innerHTML = `
                    <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
                    <span>${recipe.strMeal}</span>
                    <button class="add-btn">Select</button>
                `;

                item.querySelector('button').addEventListener('click', () => {
                    if (plannerState.activeGridDay && plannerState.activeGridMeal) {
                        populateGridCell(plannerState.activeGridDay, plannerState.activeGridMeal, recipe);
                        dialog.close();
                    }
                });

                resultsContainer.appendChild(item);
            });
        } catch (error) {
            resultsContainer.innerHTML = '<p>Error searching for recipes.</p>';
        }
    };

    searchBtn.addEventListener("click", performSearch);
    searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") performSearch();
    });
}

function setupCleanMealPlan() {
    const cleanBtn = document.getElementById('clean-meal-plan-btn');
    cleanBtn.addEventListener('click', mealPlanner);
}


function PrintMealPlan() {
    const printBtn = document.getElementById('printBtn');
    if (printBtn) {
        printBtn.addEventListener('click', () => {
            window.print();
        });
    }
}

export function initMealPlanner() {
    mealPlanner();
    setupSearchBar();
    handleSearch('chicken');
    setupCleanMealPlan();
    setupSuggestionDialog();
    setupGridSearchDialog();
    PrintMealPlan();
}

initMealPlanner();  
function generateGroceryList() {

    const mealPlan =
        JSON.parse(localStorage.getItem("mealPlan")) || {};

    const groceryItems = [];

    Object.values(mealPlan).forEach(recipe => {

        for(let i = 1; i <= 20; i++){

            const ingredient = recipe[`strIngredient${i}`];
            const measure = recipe[`strMeasure${i}`];

            if(
                ingredient &&
                ingredient.trim() !== ""
            ){
                groceryItems.push({
                    ingredient,
                    measure,
                    meal: recipe.strMeal
                });
            }

        }

    });

    localStorage.setItem(
        "groceryList",
        JSON.stringify(groceryItems)
    );

    window.location.href = "grocerylist.html";
}

mealPlanner();
handleSearch('chicken');
setupSuggestionDialog();

document
    .getElementById("generate-grocery-list-btn")
    .addEventListener("click", generateGroceryList);
