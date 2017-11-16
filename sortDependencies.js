
sortDependencies = {
	makeObjects: (array) =>{
		const objArray = [];
		for (var i = 0; i < array.length; i++) {
			objArray.push(new Package(array[i]));
		}
		return objArray;
	}
}

module.exports = sortDependencies


function Package(string) {
	const values = string.split(':');
	this.dependant = values[0].trim();
	this.dependancy = values[1].trim();
}