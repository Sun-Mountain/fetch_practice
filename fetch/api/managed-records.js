import fetch from "../util/fetch-fill";
import URI from "urijs";

// records endpoint
window.path = "http://localhost:3000/records";

// Your retrieve function plus any additional functions go here ...

const retrieve = async function (options) {
    const colors = options.colors;
    const limit = 10;
    const page = options.page ? options.page : 1;
    const offset = (page - 1) * 10;

    var uri = new URI({
        protocol: "http",
        hostname: "localhost:3000",
        path: "/records",
        query: `limit=${limit}&offset=${offset}&`
    })

    if (colors) {
        uri.setSearch("color", colors);
    }

    try {
        const records = await fetch(uri);
        const items = await records.json();

        console.log(items);

        let result = {};

        items.map(item => {
            if (item.color == "red" || item.color == "yellow" || item.color == "blue") {
                item.isPrimary = true;
            } else {
                item.isPrimary = false;
            }
        });

        if (colors) {
            items.filter(function (item) {
                colors.indexOf(item.color);
            })
        }

        if (items.length === 0) {
            result.previousPage = null;
            result.nextPage = null;
        }

        const primaryClosed = items.filter(function (item) {
            if (item.disposition === "closed" && item.isPrimary === true) {
                return item;
            }
        });

        if (page === 1 || page - 1 === NaN) {
            result.previousPage = null;
        } else {
            result.previousPage = page - 1;
        }

        if (page === 50) {
            result.nextPage = null;
        } else {
            result.nextPage = page + 1;
        }

        result.ids = items.map(item => item.id);

        result.open = items.filter(function (item) {
            return item.disposition === "open";
        });

        if (result.ids.length === 0) {
            result.nextPage = null;
        }

        result.closedPrimaryCount = primaryClosed.length;

        console.log("result:", result);

        // console.log("JSON RESULTS:", jsonRecords);

        return result;
    }
    catch (err) {
        console.log(err);
    }

};

export default retrieve;