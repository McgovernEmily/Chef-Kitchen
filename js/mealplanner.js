function mealPlanner() {
    // Select ALL elements with the class 'meal' (all 7 days)
    const meals = document.querySelectorAll(".meal-container");

    meals.forEach(meal => {
        meal.innerHTML = `
            <div class="meal">
                <div class="meal-card">Breakfast</div>
                <button class="add-btn">
                    ➕ Add Meal
                </button>
                <div class="meal-card">Lunch</div>
                <button class="add-btn">
                    ➕ Add Meal
                </button>
                <div class="meal-card">Dinner</div>
                <button class="add-btn">
                    ➕ Add Meal
                </button>
            </div>`;

        // Attach event listeners to the buttons for THIS specific day
        const addButtons = meal.querySelectorAll('.add-btn');
        addButtons.forEach(btn => {
            btn.addEventListener('click', addMeal);
        });
    });
}

function addMeal() {
    console.log("Add meal clicked!");
    // Add your add meal logic here
}

function mealFinder() {
    console.log("Meal finder clicked!");
    // Add your meal finder logic here
}

mealPlanner();