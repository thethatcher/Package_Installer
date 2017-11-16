
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
			if(rtnArray[i].dependancy == rtnArray[i+1].dependant){
				const temp = rtnArray[i];
				rtnArray[i] = rtnArray[i+1];
				rtnArray[i+1] = temp;
			}
		}
		console.log(rtnArray);
		return rtnArray;
	}
}

module.exports = sortDependencies


function Package(string) {
	const values = string.split(':');
	this.dependant = values[0].trim();
	this.dependancy = values[1].trim();
}