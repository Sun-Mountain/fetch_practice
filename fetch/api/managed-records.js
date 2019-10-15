import fetch from "../util/fetch-fill";
import URI from "urijs";

// records endpoint
window.path = "http://localhost:3000/records";

// Your retrieve function plus any additional functions go here ...

const retrieve = async function (options) {

    try {
        const records = await fetch("http://localhost:3000/records");
        const jsonRecords = await records.json();

        let result = {
            ids: [],
            open: [],
            closedPrimaryCount: [],
            previousPage: null,
            nextPage: null
        }

        if (options && options.page) {
            const offset = (options.page - 1) * 10;
            const items = jsonRecords.slice(offset, offset + 10);
            console.log("items:", items);

            result.previousPage = options.page - 1
            result.nextPage = options.page + 1
        } else {
            result = jsonRecords.slice(0, 9);
            console.log(result);
        }

        // console.log("JSON RESULTS:", jsonRecords);

        return result;
    }
    catch (err) {
        console.log(err);
    }

};

export default retrieve;