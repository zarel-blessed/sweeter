/**
 * @function verifyFields
 * @description Verify that all provided fields are not null or undefined.
 * @param {...any} fields - The fields to be verified.
 * @returns {boolean} - True if all fields are not null or undefined, otherwise false.
 */
const verifyFields = (...fields) => {
    // Iterate through each field and check if it is null or undefined
    fields.forEach((field) => {
        if (field === null || field === undefined) return false;
    });

    // Return true if all fields pass the verification, otherwise false
    return true;
};

// Export the utility function for use in other files
module.exports = verifyFields;
