
sortDependencies = {
	makeObjects: (array) =>{
		const objArray = [];
		for (var i = 0; i < array.length; i++) {
			objArray.push(new Package(array[i]));
		}
		return objArray;
	},
	sort: (array)=>{
		let rtnArray = array;
		for (var i = 0; i < rtnArray.length -1; i++) {
			if(rtnArray[i].dependancy == rtnArray[i+1].package){
				const temp = rtnArray[i];
				rtnArray[i] = rtnArray[i+1];
				rtnArray[i+1] = temp;
			}
		}
		return rtnArray;
	},
	sortOnPackage: (array) => {
		return array.sort(comparePackages);
	},
	findIndependantPackages: (array) => {
		//sort the array alphabetically based on array[i].package value. This ensures consistent output order. 
		let alphaSortArray = sortDependencies.sortOnPackage(array); 
		const independantArray = [];
		//searches for any packages that do not have dependencies. These are the starting points for the sort. 
		for (var i = 0; i < alphaSortArray.length; i++) {
			if (alphaSortArray[i].dependancy == "") {
				independantArray.push(alphaSortArray[i]);
				alphaSortArray.splice(i,1);
			} 
		}
		//returns both arrays, as they will both be needed for future reference. 
		return {unsorted: alphaSortArray, sorted: independantArray};
	},
	buildSortedArray: (array) => {
		const temp = sortDependencies.findIndependantPackages(array);
		const sorted = temp.sorted;
		const unsorted = temp.unsorted;
		//for each element in the sorted array (as it grows) check for any packages that depend on sorted[i].package.
		for (var i = 0; i < sorted.length; i++) {
			for (var j = 0; j < unsorted.length; j++) {
				//loop through the unsorted array searching for any packages that depend on sorted[i].package and add them to the sorted array.
				if(sorted[i].package == unsorted[j].dependancy) {
					sorted.push(unsorted[j]); // add the matched package to the sorted array.
					unsorted.splice(j,1); //remove the matched package from the unsorted array
				}
			}
		}
	},
	//this will take in the original array and use all of the above functions to compute the correct order and print it out. 
	printPackagesInOrder: (array)=> {
		let orderedList = "";
		let workingArray = sortDependencies.makeObjects(array);
		workingArray = sortDependencies.sort(workingArray);
		workingArray = sortDependencies.buildSortedArray(workingArray);
		for (var i = 0; i < workingArray.length; i++) {
			orderedList += workingArray[i].package;
			if(i < workingArray.length -2){orderedList += ", ";}
		}
	}

}

module.exports = sortDependencies


function Package(string) {
	const values = string.split(':');
	this.package = values[0].trim();
	this.dependancy = values[1].trim();
}

function comparePackages(a, b) {
	if (a.package < b.package ) {return -1}
	if (a.package > b.package ) {return 1}
	return 0;
}
