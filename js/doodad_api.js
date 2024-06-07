// api for making doodads
class Doodad {
    constructor(info) {
        this._codename = info.codename;
        this._nickname = info.nickname;
        this._author = info.author;
        this._description = info.description;
        this._emoji = info.emoji;

        // these aren't defined in this class, but are set to default values
        this._HTML = ``;
        this._onLoad = () => {};
        this._onReset = () => {};

        // the namespace of the doodad, used to make sure different doodads have different seeds
        this._namespace = this._author + "-" + this._codename;

        if (!database.doodads) database.doodads = [];

        // append the doodad to the database
        database.doodads.push(this);
    }

    // random range function
    random(seed, min, max) {
        // generate hash of full seed, this is what we'll use to generate the "random" number
        const hash = cyrb53(date + userID + this._namespace + seed);

        // Move the first digit to the end of the decimal
        let hashString = hash.toString();
        hashString = hashString.slice(1) + hashString.slice(0, 1);

        // Convert the hash to a decimal value between 0 and 1
        const decimal = parseFloat("0." + hashString);

        // Calculate the random number within the given range with decimals
        const randomNumber = (decimal - 0) * (max - min) / (1 - 0) + min;

        // Cut the decimals to match the maximum number of decimals in min or max
        const decimalPlaces = Math.max(countDecimals(min), countDecimals(max));
        return randomNumber.toFixed(decimalPlaces);
    }

    // function to load the doodad
    load() {
        const collection = document.querySelector('.collection');
        const doodadElement = document.createElement('div');

        doodadElement.classList.add('doodad');
        doodadElement.id = "doodad_" + this._namespace;
        doodadElement.innerHTML = this.HTML;

        collection.appendChild(doodadElement);

        if (newDay || this.get("_initialized") !== "true") this.onReset();
        this.set("_initialized", "true");

        this.onLoad();
    }

    // localStorage functions
    set(name, value) {
        localStorage.setItem("doodad_" + this._namespace + "_" + name, value);
    }

    get(name) {
        return localStorage.getItem("doodad_" + this._namespace + "_" + name);
    }

    // shorthand for getting elements, but also limits the scope to the doodad.
    // this actually makes it easier to make doodads, since you don't have to add the doodad name to all html elements
    e(query) {
        return document.querySelector("#doodad_" + this._namespace).querySelector(query);
    }
}