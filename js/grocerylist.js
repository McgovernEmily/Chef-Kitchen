const tbody = document.getElementById("grocery-body");

function loadGroceryList() {

    tbody.innerHTML = "";

    const groceryList =
        JSON.parse(localStorage.getItem("groceryList")) || []

    groceryList.forEach((item, index) => {

        tbody.innerHTML += `
        <tr>
            <td><input type="checkbox"></td>
            <td>${item.ingredient}</td>
            <td>${item.measure}</td>
            <td>${item.meal}</td>
            <td>
                <button class="delete-btn" data-index="${index}">
                    🗑️
                </button>
            </td>
        </tr>
        `;

    });

    document.querySelectorAll(".delete-btn")
        .forEach(btn => {

            btn.addEventListener("click", () => {

                deleteIngredient(btn.dataset.index);

            });

        });

}

const clearBtn = document.getElementById("btn-clear");

    clearBtn.addEventListener("click", () => {
        localStorage.removeItem("groceryList");
        tbody.innerHTML = "";
        loadGroceryList();
});


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

loadGroceryList();