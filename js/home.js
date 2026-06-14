export function headerFunction() {
    document.getElementById("header-container").innerHTML = `
    <header>
        <h1>Chef-Kitchen</h1>
        <p>Find Meals. Plan Smart. Cook Easy</p>

        <section id="nav">
            <nav class="page-nav">
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
    </header>
    `;
}

export function footerFunction() {

    document.getElementById("footer-container").innerHTML = `
    <footer>
        <div class="footer-top">
            <h2>Chef-Kitchen</h2>

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