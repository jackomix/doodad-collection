// api for making doodads
class Doodad {
    constructor(info) {
        // the namespace of the doodad, used to make sure different doodads have different seeds
        this.codename = info.codename;
        this.nickname = info.nickname;
        this.author = info.author;
        this.description = info.description;
        this.emoji = info.emoji;
        this.HTML = info.HTML || "";

        this.isObtainable = info.isObtainable;
        this.noHTML = info.noHTML || false;
        this.showInInventory = info.showInInventory || true;

        this.namespace = this.author + "--" + this.codename;
        this.path = "./doodads/" + this.namespace;
        this.cssPrefix = "#doodad_" + this.namespace;

        // these aren't defined in this class, but are set to default values
        this.onLoad = () => {};
        this.onReset = () => {};
        this.onInventoryUpdate = () => {};

        if (!database.doodads) database.doodads = [];

        // append the doodad to the database
        database.doodads.push(this);

        document.addEventListener("inventoryUpdate", e => {
            this.onInventoryUpdate(e.detail);
        });
    }

    // random range function
    random(seed, min, max, dateSeed = date) {
        // if date is not structured as the "date" variable, it will be converted to that format
        if (dateSeed.length !== 10) dateSeed = new Date(dateSeed).toISOString().slice(0, 10);

        // generate hash of full seed, this is what we'll use to generate the "random" number
        const hash = cyrb53(dateSeed + userID + this.namespace + seed);

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

    // returns a random time between starting time and ending time
    // min and max are formatted as "HH:MM:SS" in 24 hour time
    // by default, they are set to 00:00:00 and 23:59:59
    randomTimestamp(seed, min = "00:00:00", max = "23:59:59", dateSeed = date) {
        const minTime = new Date(date + `T${min}`).getTime();
        const maxTime = new Date(date + `T${max}`).getTime();
        const randomTime = this.random(seed, minTime, maxTime, dateSeed);
        return new Date(parseFloat(randomTime));
    }

    // function to load the doodad
    load() {
        if (!this.noHTML) {
            const collection = document.querySelector('.collection');
            const doodadElement = document.createElement('div');

            doodadElement.classList.add('doodad');
            doodadElement.id = "doodad_" + this.namespace;
            doodadElement.innerHTML = this.HTML;

            // Check if doodad is already loaded
            if (document.getElementById(doodadElement.id)) {
                console.error('Doodad "' + this.namespace + '" is already loaded.');
                return;
            }

            collection.appendChild(doodadElement);

            this.element = doodadElement;
        } 

        if (newDay || this.get("_initialized") !== true) this.onReset();
        this.set("_initialized", "true");

        this.onLoad();
    }

    // localStorage functions
    set(name, value) {
        if (typeof value === 'object' || Array.isArray(value)) {
            value = JSON.stringify(value);
        }
        localStorage.setItem("doodad_" + this.namespace + "_" + name, value);
    }
    get(name) {
        let value = localStorage.getItem("doodad_" + this.namespace + "_" + name);
        try {
            value = JSON.parse(value);
        } catch (error) {
            console.error("Error parsing localStorage JSON for doodad " + this.namespace + ", value: " + value);
        }
        return value;
    }

    // shorthand for getting elements, but also limits the scope to the doodad.
    // this actually makes it easier to make doodads, since you don't have to add the doodad name to all html elements
    e(query) {
        return document.querySelector("#doodad_" + this.namespace).querySelector(query);
    }
    eAll(query) {
        return document.querySelector("#doodad_" + this.namespace).querySelectorAll(query);
    }

    doIHide(answer) {
        if (answer) {
            this.element.style.display = "none";
        } else {
            this.element.style.display = "block";
        }
    }

    ready() {
        moduleLoaded(); // this helps the doodad_collection.js script know when all doodads are loaded for async reasons
    }
}

export default Doodad;