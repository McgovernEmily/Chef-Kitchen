import { getRecipeById } from "./recipedata";

export function headerFunction() {
    document.getElementById("header-container").innerHTML = `
    <header>
        <h1><img src="chef-kitchen-logo.png" alt="Chef-Kitchen Logo" class="main-logo"></h1>
        <p>Find Meals. Plan Smart. Cook Easy</p>

        <div class="menu-container">
            <button class="hamburger" id="hamburger">☰</button>
            <section id="nav">
                <nav class="page-nav" id="page-nav">
                    <ul>
                        <li>
                            <a href="index.html">Home</a>
                        </li>

                        <li>
                            <a href="mealplanner.html">Meal Planner</a>
                        </li>

                        <li>
                            <a href="grocerylist.html">Grocery List</a>

                        </li>

                        <li>
                            <a href="mealfinder.html">Meal Finder</a>
                        </li>

                        <li>
                            <a href="contact.html">Contact Us</a>

                        </li>
                    </ul>
                </nav>
            </section>
        </div>
    </header>
    `;
}

export function footerFunction() {

    document.getElementById("footer-container").innerHTML = `
    <footer>
        <div class="footer-top">
            <h1><img src="chef-kitchen-logo.png" alt="Chef-Kitchen Logo" class="main-logo"></h1>

            <div class="footer-links">
                <a href="#">X</a>
                <a href="#">Facebook</a>
                <a href="#">Instagram</a>
                <a href="#">Pinterest</a>
            </div>
        </div>

        <div class="footer-bottom">
            © 2026 Chef-Kitchen. All Rights Reserved.
        </div>
    </footer>
    `

}

async function loadImages() {
    const recipeIds = [
        {id:"52779", imageId: "vegetarian-image"}, 
        {id:"52956", imageId: "soup-image"}, 
        {id:"52893", imageId: "dessert-image"}, 
        {id:"52772", imageId: "quick-easy-image"}, 
        {id:"52770", imageId: "italian-image"}
    ];

    for (const recipe of recipeIds) {
        const data = await getRecipeById(recipe.id);
        if (data.meals){
            document.getElementById(recipe.imageId).src = data.meals[0].strMealThumb;
        }
    }

}

loadImages();