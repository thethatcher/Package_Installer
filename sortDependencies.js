/********************SORT DEPENDENCIES********************
*An object that is contains all the functions necessary to return the proper output. 
**********************************************************/
sortDependencies = {
	//parses the input into an array of Package objects that are more friendly to work with.
	makeObjects: (array) =>{
		// Declare the array that is going to store the package objects to be returned
		const objArray = [];
		// this for loop checks the array to validate the format, if there is an issue it throws an error
		for (var i = 0; i < array.length; i++) {
			if(!checkFormat(array[i])) {	
					throw new Error("Invalid Input: Incorrect format.");
				}
			// if no error then it pushes the string to the objArray as a new package object
			objArray.push(new Package(array[i]));
		}
		return objArray;
	},

/********************SORT ON PACKAGE**********************
*A function that sorts an array of Package objects into reverse alphabetical order
**********************************************************/ 
	sortOnPackage: (array) => {
		return array.sort(comparePackages);
	},

/****************FIND INDEPENDANT PACKAGES*****************
*A function that locates all the packages in an array of Packages that have no dependencies. 
*Will throw an error if it finds no packages without dependencies. 
**********************************************************/
	findIndependantPackages: (array) => {
		//sort the array reverse alphabetically based on array[i].package value. This ensures consistent output order. 
		let alphaSortArray = sortDependencies.sortOnPackage(array); 
		const independantArray = [];
		//searches for any packages that do not have dependencies. These are the starting points for the sort. 
		for (var i = alphaSortArray.length -1; i >= 0 ; i--) {
			if (alphaSortArray[i].dependency == "") {
				independantArray.push(alphaSortArray[i]);
				alphaSortArray.splice(i,1);
			} 
		}
		//if the independantArray is empty, it means that every package has a dependency, or the input was empty. both are invalid. 
		if(independantArray.length < 1){throw new Error("Invalid Input: Contains a cyclical dependency");}
		//returns both arrays, as they will both be needed for future reference. 
		return {unsorted: alphaSortArray, sorted: independantArray};
	},

/********************BUILD SORTED ARRAY********************
*A function that builds an array of sorted Packages, based on dependencies. 
*Packages at lower indices within the array must be installed before those at later indices. 
**********************************************************/
	buildSortedArray: (array) => {
		const temp = sortDependencies.findIndependantPackages(array);
		const sorted = temp.sorted;
		const unsorted = temp.unsorted;
		//for each element in the sorted array (as it grows) check for any packages that depend on sorted[i].package.
		for (var i = 0; i < sorted.length; i++) {
			//have to use a decrementing for loop as we are removing elements of the array as we go. 
			for (var j = unsorted.length - 1; j >= 0; j--) {
				//loop through the unsorted array searching for any packages that depend on sorted[i].package and add them to the sorted array.
				if(sorted[i].package == unsorted[j].dependency) {
					sorted.push(unsorted[j]); // add the matched package to the sorted array.
					unsorted.splice(j,1); //remove the matched package from the unsorted array
				}
			}
		}
		//if there are any unsorted Package objects remaining then a cycle exists, as there are no independant packages left to start the chain with.
		if(unsorted.length > 0){throw new Error("Invalid Input: Contains a cyclical dependency");}
		return sorted;
	},

/*****************PRINT PACKAGES IN ORDER******************
*A function that puts all the sorting steps together. 
*Takes raw input, and outputs a comma delimited string of sorted packages.  
**********************************************************/ 
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
	this.dependency = values[1].trim();
}

//compare function used to sort package objects on their package attribute in revers alphabetical order. 
//case insensitive. 
function comparePackages(a, b) {
	if (a.package.toUpperCase() > b.package.toUpperCase() ) {return -1}
	if (a.package.toUpperCase() < b.package.toUpperCase() ) {return 1}
	return 0;
}

function checkFormat(string){
	//regex that checks if the string matches format "package: (package2 || )". returns false if it doesn't match.
	return /^[A-Za-z0-9]+: [A-Za-z0-9]*$/.test(string);
}