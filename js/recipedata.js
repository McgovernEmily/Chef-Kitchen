const baseURL = "https://api.spoonacular.com";
const apiKey = import.meta.env.VITE_SPOONACULAR_API_KEY;

export async function getrecipeData(searchQuery = "") {
    // 1. Construct the correct URL
    const url = new URL(baseURL + "/recipes/complexSearch");

    // 2. Add our API key as a query parameter (standard for Spoonacular)
    url.searchParams.append("apiKey", apiKey);


    // 3. Add extra info so we get descriptions and scores
    url.searchParams.append("addRecipeInformation", "true");
    url.searchParams.append("number", 10);

    // 4. Add the search term if the user typed one
    if (searchQuery) {
        url.searchParams.append("query", searchQuery);
    }

    const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    };

    // 5. Correctly pass (url, options) to fetch, NOT (url + options)
    const response = await fetch(url, options);

    if (response.ok) {
        const data = await response.json();
        return data; // Spoonacular returns an object like { results: [...] }
    } else {
        const errText = await response.text();
        throw new Error(`API Error ${response.status}: ${response.statusText}. Details: ${errText}`);
    }
}
