const tbody = document.getElementById("grocery-body");
const totalSummary = document.getElementById("total-summary");


function loadGroceryList() {


    tbody.innerHTML = "";

    const groceryList =
        JSON.parse(localStorage.getItem("groceryList")) || []

    let totalMeals = groceryList.map(item => item.meal).filter((value, index, self) => 
        self.indexOf(value) === index).length;
    let totalIngredients = 0


    groceryList.forEach((item, index) => {

        tbody.innerHTML += `
        <tr>
            <td><input type="checkbox" aria-label="Mark ${item.ingredient} as purchased"></td>
            <td>${item.ingredient}</td>
            <td>${item.measure}</td>
            <td>${item.meal}</td>
            <td>
                <button class="delete-btn" data-index="${index}" aria-label="Delete ${item.ingredient} from grocery list">
                    🗑️
                </button>
            </td>
        </tr>
        `;

        totalIngredients += 1;
    });

    document.querySelectorAll(".delete-btn")
        .forEach(btn => {

            btn.addEventListener("click", () => {

                deleteIngredient(btn.dataset.index);

            });

        });

    totalSummary.innerHTML = `
        <h2>Grocery List Summary</h2>
        <p>Total Meals: ${totalMeals}</p>
        <p>Total Ingredients: ${totalIngredients}</p>
        <h3>Meals</h3>
        <ul>
            ${[...new Set(groceryList.map(item => item.meal))]
                .map(meal => `<li>${meal}</li>`).join("")}
        </ul>
    `;

}

const clearBtn = document.getElementById("btn-clear");

if (clearBtn) {
    clearBtn.addEventListener("click", () => {

        localStorage.removeItem("groceryList");
        localStorage.removeItem("mealPlan");

        loadGroceryList();

    });
}


function deleteIngredient(index) {

    const groceryList =
        JSON.parse(localStorage.getItem("groceryList")) || [];

    groceryList.splice(index, 1);

    localStorage.setItem(
        "groceryList",
        JSON.stringify(groceryList)
    );

    loadGroceryList();
}

function countingItems(){

}

loadGroceryList();
