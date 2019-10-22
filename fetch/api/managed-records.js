import fetch from "../util/fetch-fill";
import URI from "urijs";

// records endpoint
window.path = "http://localhost:3000/records";

// Your retrieve function plus any additional functions go here ...

const retrieve = async function (options) {

    const colors = (options && options.colors) ? options.colors : null;
    const limit = 10;
    const page = (options && options.page) ? options.page : 1;
    const offset = (page - 1) * 10;

    var uri = new URI(window.path);

    uri.search(`limit=${limit}&offset=${offset}`);

    if (colors) {
        uri.setSearch("color[]", colors);
    }

    try {
        const records = await fetch(uri);
        const items = await records.json();

        let result = {};

        items.map(item => {
            if (item.color == "red" || item.color == "yellow" || item.color == "blue") {
                item.isPrimary = true;
            } else {
                item.isPrimary = false;
            }
        });

        if (items.length === 0) {
            result.previousPage = null;
            result.nextPage = null;
        };

        const primaryClosed = items.filter(function (item) {
            if (item.disposition === "closed" && item.isPrimary === true) {
                return item;
            }
        });

        if (page === 1) {
            result.previousPage = null;
        } else {
            result.previousPage = page - 1;
        };

        if (page >= 50) {
            result.nextPage = null;
        } else {
            result.nextPage = page + 1;
        };

        result.ids = items.map(item => item.id);

        result.open = items.filter(function (item) {
            return item.disposition === "open";
        });

        if (result.ids.length === 0) {
            result.nextPage = null;
        };

        result.closedPrimaryCount = primaryClosed.length;

        return result;
    }
    catch (err) {
        console.log(err);
    };

};

export default retrieve;