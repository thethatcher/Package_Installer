var sortDependencies = require("./sortDependencies.js");

const input = ["Mallory: Ryan", "Ryan: Mallory", "Stephanie: Kristine", "Kristine: "];

console.log(sortDependencies.printPackagesInOrder(input));