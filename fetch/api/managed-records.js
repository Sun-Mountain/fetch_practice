import fetch from "../util/fetch-fill";
import URI from "urijs";

// records endpoint
window.path = "http://localhost:3000/records";

// Your retrieve function plus any additional functions go here ...

const retrieve = async function (options) {

    var uri = new URI({
        protocol: "http",
        hostname: "localhost:3000",
        path: "/records",
        query: "limit=999"
    })

    try {
        const records = await fetch(uri);
        const jsonRecords = await records.json();

        let result = {}

        const offset = (options.page - 1) * 10;
        const items = jsonRecords.slice(offset, offset + 10);

        items.map(item => {
            if (item.color == "red" || item.color == "yellow" || item.color == "blue") {
                item.isPrimary = true;
            } else {
                item.isPrimary = false;
            }
        })

        const primaryClosed = items.filter(function (item) {
            if (item.disposition === "closed" && item.isPrimary === true) {
                return item;
            }
        });

        if (options.page - 1 === 0 || options.page - 1 === NaN) {
            result.previousPage = null;
        } else {
            result.previousPage = options.page - 1;
        }

        if (options.page === 51) {
            result.nextPage = null;
        } else {
            result.nextPage = options.page + 1;
        }

        result.ids = items.map(item => item.id);
        result.open = items.filter(function (item) {
            return item.disposition === "open";
        });

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