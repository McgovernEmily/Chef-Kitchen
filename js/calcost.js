import ingredientPrices from "./price_ingredients_g.json";
import { measurement } from "./measurements.js";
import { convertMeasurement } from "./measurementConverter.js";


export function calculatecost(ingredient, measure) {
    if (!ingredient) {
        return 0;
    }
    const priceData =
        ingredientPrices[ingredient];
    if (!priceData) {
        return 0;
    }
    const parsed =
        measurement(measure);
    if (!parsed) {
        return 0;
    }
    const grams =
        convertMeasurement(
            parsed.amount,
            parsed.unit
        );
    if (!grams) {
        return 0;
    }
    return grams * priceData.price;
}