
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
		let alphaSortArray = array.sort(comparePackages);
		const independantArray = [];
		for (var i = 0; i < alphaSortArray.length; i++) {
			if (alphaSortArray[i].dependancy == "") {
				independantArray.push(alphaSortArray[i]);
				alphaSortArray.splice(i,1);
			} 
		}
		return independantArray;
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