
sortDependencies = {
	//parses the input into an array of Package objects that are more friendly 
	makeObjects: (array) =>{
		const objArray = [];
		for (var i = 0; i < array.length; i++) {
			objArray.push(new Package(array[i]));
		}
		return objArray;
	},
	//used to test the sort comparison. 
	sortOnPackage: (array) => {
		return array.sort(comparePackages);
	},

	findIndependantPackages: (array) => {
		//sort the array alphabetically based on array[i].package value. This ensures consistent output order. 
		let alphaSortArray = sortDependencies.sortOnPackage(array); 
		const independantArray = [];
		//searches for any packages that do not have dependencies. These are the starting points for the sort. 
		for (var i = alphaSortArray.length -1; i >= 0 ; i--) {
			if (alphaSortArray[i].dependancy == "") {
				independantArray.push(alphaSortArray[i]);
				alphaSortArray.splice(i,1);
			} 
		}
		//if the independantArray is empty, it means that every package has a dependancy, or the input was empty. both are invalid. 
		if(independantArray.length < 1){throw new Error("Invalid Input");}
		//returns both arrays, as they will both be needed for future reference. 
		return {unsorted: alphaSortArray, sorted: independantArray};
	},

	buildSortedArray: (array) => {
		const temp = sortDependencies.findIndependantPackages(array);
		const sorted = temp.sorted;
		const unsorted = temp.unsorted;
		//for each element in the sorted array (as it grows) check for any packages that depend on sorted[i].package.
		for (var i = 0; i < sorted.length; i++) {
			//have to use a decrementing for loop as we are removing elements of the array as we go. 
			for (var j = unsorted.length - 1; j >= 0; j--) {
				//loop through the unsorted array searching for any packages that depend on sorted[i].package and add them to the sorted array.
				if(sorted[i].package == unsorted[j].dependancy) {
					sorted.push(unsorted[j]); // add the matched package to the sorted array.
					unsorted.splice(j,1); //remove the matched package from the unsorted array
				}
			}
		}
		if(unsorted.length > 0){throw new Error("Invalid Input");}
		return sorted;
	},
	//this will take in the original array and use all of the above functions to compute the correct order and print it out. 
	printPackagesInOrder: (array)=> {
		let orderedList = "";
		let workingArray = sortDependencies.makeObjects(array);
		//Sorts Alphabetically to ensure a consistent and predictable return value.
		workingArray = sortDependencies.sortOnPackage(workingArray);
		//sorts the array into the correct order.
		workingArray = sortDependencies.buildSortedArray(workingArray);
		//loops through the sorted array and builds the orderedList string.
		for (var i = 0; i < workingArray.length; i++) {
			orderedList += workingArray[i].package;
			if(i <= workingArray.length -2){orderedList += ", ";}
		}
		return orderedList;
	}


}

module.exports = sortDependencies

//constructor used to make Package objects. 
function Package(string) {
	const values = string.split(':');
	this.package = values[0].trim();
	this.dependancy = values[1].trim();
}

//compare function used to sort package objects on their package attribute in revers alphabetical order. 
//case insensitive. 
function comparePackages(a, b) {
	if (a.package.toUpperCase() > b.package.toUpperCase() ) {return -1}
	if (a.package.toUpperCase() < b.package.toUpperCase() ) {return 1}
	return 0;
}