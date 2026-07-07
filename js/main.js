// Main entry JavaScript module - Add your custom scripts here
import { headerFunction, footerFunction  } from './home.js';
import './mealplanner.js';

headerFunction();
footerFunction();

const hamburger = document.getElementById("hamburger");
const navigation = document.getElementById("page-nav");

if (hamburger && navigation) {
    hamburger.addEventListener("click", () => {
        navigation.classList.toggle("show");
    });
}