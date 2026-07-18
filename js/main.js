// Main entry JavaScript module - Add your custom scripts here
import { headerFunction, footerFunction, loadImages  } from './home.js';

headerFunction();
footerFunction();

if (document.getElementById("vegetarian-image")) {
    loadImages();
}

const hamburger = document.getElementById("hamburger");
const navigation = document.getElementById("page-nav");

if (hamburger && navigation) {
    hamburger.addEventListener("click", () => {
        navigation.classList.toggle("show");
    });
}