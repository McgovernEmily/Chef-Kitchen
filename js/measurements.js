export function measurement(text){

    if(!text) return null;
    text=text.trim();

    if(text.includes("pinch")){
        return {
            amount:1,
            unit:"pinch"
        };
    }

    const result =
        text.match(/([\d\/.]+)\s*(.*)/);
    if(!result)
        return null;
    let amount=result[1];

    if(amount.includes("/")){
        const parts=amount.split("/");
        amount =
            Number(parts[0]) /
            Number(parts[1]);
    }
    else {
        amount=Number(amount);
    }
    return {
        amount,
        unit:result[2].trim()
    };

}