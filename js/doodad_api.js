// api for making doodads

function doodad(doodad_name) {
    // the name of the doodad, used to make sure different doodads have different seeds
    this.name = doodad_name;

    // random range function
    this.random = function(seed, min, max) {
        // generate hash of full seed, this is what we'll use to generate the "random" number
        hash = cyrb53(date + userID + this.name + seed);

        // Move the first digit to the end of the decimal
        hash = hash.toString();
        hash = hash.slice(1) + hash.slice(0, 1);

        // Convert the hash to a decimal value between 0 and 1
        var decimal = parseFloat("0." + hash);

        // Calculate the random number within the given range with decimals
        var randomNumber = (decimal - 0) * (max - min) / (1 - 0) + min;

        // Cut the decimals to match the maximum number of decimals in min or max
        var decimalPlaces = Math.max(countDecimals(min), countDecimals(max));
        randomNumber = randomNumber.toFixed(decimalPlaces);

        return randomNumber;
    }

    // localStorage functions
    this.set = function(name, value) {
        localStorage.setItem("doodad_" + doodad_name + "_" + name, value);
    }
    this.get = function(name) {
        return localStorage.getItem("doodad_" + doodad_name + "_" + name);
    }

    // generates the html for the doodad
    this.generateHTML = function(html) {
        var collection = document.querySelector('.collection');
        var doodadElement = document.createElement('div');

        doodadElement.classList.add('doodad');
        doodadElement.id = "doodad_" + this.name;
        doodadElement.innerHTML = html;

        collection.appendChild(doodadElement);
    }

    // shorthand for getting elements, but also limits the scope to the doodad.
    // this actually makes it easier to make doodads, since you don't have to add the doodad name to all html elements
    this.e = function(query) {
        return document.querySelector("#doodad_" + this.name).querySelector(query);
    }
    this.eID = function(id) {
        return document.querySelector("#doodad_" + this.name).querySelector("#" + id);
    }
    this.eClass = function(className) {
        return document.querySelector("#doodad_" + this.name).querySelector("." + className);
    }

    // returns true if it's a new day, or doodad is ran for the first time
    this.doWeReset = newDay || this.get("_initialized") !== "true";
    
    this.set("_initialized", "true");
}