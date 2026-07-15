export function convertMeasurement(amount, unit) {

    amount = Number(amount);
    if (!amount) return null;
    unit = unit.toLowerCase();

    switch(unit){

        case "kg":
            return amount * 1000;

        case "g":
        case "gram":
        case "grams":
            return amount;

        case "oz":
        case "ounce":
        case "ounces":
            return amount * 28.35;

        case "lb":
        case "lbs":
            return amount * 453.59;

        case "cup":
        case "cups":
            return amount * 240;

        case "tbsp":
        case "tbs":
        case "tablespoon":
        case "tblsp":
            return amount * 15;

        case "tsp":
        case "teaspoon":
        case "teaspoons":
            return amount * 5;

        case "pinch":
            return 0.3;

        default:
            return null;
    }
}