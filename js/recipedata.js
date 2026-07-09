const baseURL = "https://www.themealdb.com/api/json/v1/1";

export async function getrecipeData(searchQuery = "") {
    // 1. Construct the correct URL for TheMealDB
    const url = new URL(baseURL + "/search.php");

    // 2. Add the search term if the user typed one, otherwise it defaults to empty which returns some meals
    url.searchParams.append("s", searchQuery);

    const options = {
        method: "GET"
    };

    const response = await fetch(url, options);

    if (response.ok) {
        const data = await response.json();
        return data; // TheMealDB returns an object like { meals: [...] } or { meals: null }
    } else {
        const errText = await response.text();
        throw new Error(`API Error ${response.status}: ${response.statusText}. Details: ${errText}`);
    }
}

export async function getRecipeById(id) {
    const url = new URL(baseURL + "/lookup.php");
    url.searchParams.append("i", id);

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Failed to fetch recipe.");
    }

    return await response.json();
}


