import { getRecipeById } from "./recipedata";

export function headerFunction() {
    document.getElementById("header-container").innerHTML = `
    <header>
        <h1><img src="chef-kitchen-logo.png" alt="Chef-Kitchen Logo" class="main-logo"></h1>
        <p class="tagline">Find Meals. Plan Smart. Cook Easy</p>

        <div class="menu-container">
            <button class="hamburger" id="hamburger">☰</button>
            <section id="nav">
                <nav class="page-nav" id="page-nav">
                    <ul>
                        <li><a href="index.html">Home</a></li>
                        <li><a href="mealplanner.html">Meal Planner</a></li>
                        <li><a href="grocerylist.html">Grocery List</a></li>
                        <li><a href="mealfinder.html">Meal Finder</a></li>
                        <li><a href="contact.html">Contact Us</a></li>
                    </ul>
                </nav>
            </section>
        </div>
    </header>
    `;
}

export function footerFunction() {
    document.getElementById("footer-container").innerHTML = `
    <footer class="modern-footer">
        <div class="footer-container">
            <div class="footer-brand">
                <img src="chef-kitchen-logo.png" alt="Chef-Kitchen Logo" class="footer-logo">
                <p>Your ultimate culinary companion. Find meals, plan your week, and generate grocery lists with ease.</p>
            </div>
            <div class="footer-links-group">
                <h3>Quick Links</h3>
                <ul>
                    <li><a href="index.html">Home</a></li>
                    <li><a href="mealplanner.html">Meal Planner</a></li>
                    <li><a href="mealfinder.html">Meal Finder</a></li>
                </ul>
            </div>
            <div class="footer-links-group">
                <h3>Support</h3>
                <ul>
                    <li><a href="grocerylist.html">Grocery List</a></li>
                    <li><a href="contact.html">Contact Us</a></li>
                    <li><a href="#">FAQ</a></li>
                </ul>
            </div>
            <div class="footer-socials">
                <h3>Connect</h3>
                <div class="social-icons">
                    <a href="https://www.youtube.com" class="social-icon"><img src="youtube.svg" alt="Youtube"></a>
                    <a href="https://www.facebook.com" class="social-icon"><img src="facebook.svg" alt="Facebook"></a>
                    <a href="https://www.instagram.com" class="social-icon"><img src="instagram.svg" alt="Instagram"></a>
                    <a href="https://www.pinterest.com" class="social-icon"><img src="pinterest.svg" alt="Pinterest"></a>
                </div>
            </div>
        </div>
        <div class="footer-bottom">
            <p>© 2026 Chef-Kitchen. All Rights Reserved.</p>
        </div>
    </footer>
    `;
}

async function loadImages() {
    const recipeIds = [
        { id: "52779", imageId: "vegetarian-image" },
        { id: "52956", imageId: "soup-image" },
        { id: "52893", imageId: "dessert-image" },
        { id: "52772", imageId: "quick-easy-image" },
        { id: "52770", imageId: "italian-image" }
    ];

    // Check if we are on the homepage before making API calls
    if (!document.getElementById("vegetarian-image")) return;

    for (const recipe of recipeIds) {
        const data = await getRecipeById(recipe.id);
        if (data.meals) {
            const imgEl = document.getElementById(recipe.imageId);
            if (imgEl) {
                imgEl.src = data.meals[0].strMealThumb;
            }
        }
    }
}

loadImages();