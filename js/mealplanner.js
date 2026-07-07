import { handleSearch } from "./templates.js";
function mealPlanner() {
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
            btn.addEventListener('click', addMeal);
        });
    });
}

function addMeal(e) {
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

    // Re-attach listener
    const newBtn = card.querySelector('.add-btn');
    if (newBtn) {
        newBtn.addEventListener('click', addMeal);
    }
}

let currentRecipeToAdd = null;

function setupSuggestionDialog() {
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
        currentRecipeToAdd = e.detail;
        dialog.showModal();
    });

    // 3. Handle Form Submit
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Stop the page from refreshing!

        const day = document.getElementById('day').value;
        const mealMoment = document.getElementById('meal-moment').value;

        if (!currentRecipeToAdd) return;

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
        });

        // Find the correct meal-card inside that day and update it
        if (targetDayElement) {
            const targetMealCard = targetDayElement.querySelector(`#${mealMoment}`);
            if (targetMealCard) {
                targetMealCard.innerHTML = `
                <div class="meal-moment-title">${mealMoment}</div>
                <div class="meal-content-preview">
                    <img src="${currentRecipeToAdd.strMealThumb}" alt="${currentRecipeToAdd.strMeal}">
                </div>
                <div class="meal-footer-preview">
                    <h3 class="recipe-name">${currentRecipeToAdd.strMeal}</h3>
                </div>`;

                // Re-attach listener to the new "Change" button
                const changeBtn = targetMealCard.querySelector('.change-meal-btn');
                if (changeBtn) {
                    changeBtn.addEventListener('click', addMeal);
                }
            }
        }
        currentRecipeToAdd = null;
        dialog.close(); // Close the modal window!
    });
}

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