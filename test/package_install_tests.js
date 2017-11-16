const expect = require("chai").expect;
const sortDependencies = require("../sortDependencies.js");

describe('sortDependencies', ()=>{
	it('should exist', ()=> {
		expect (sortDependencies).to.not.be.undefined;
	});
});

describe('Parse input', ()=>{
	it('should parse the input to an array of objects', ()=>{
		const input = [ "KittenService: CamelCaser", "CamelCaser: " ];
		const actual = sortDependencies.makeObjects(input);
		const expected = [{dependant: "KittenService", dependancy: "CamelCaser" }, 
			{dependant: "CamelCaser", dependancy: ""}];
		expect(actual).to.eql(expected);
	});
});

describe('Sort packageArray', ()=>{
	it('Should sort the packageArray into the correct order', ()=>{
		const actual = sortDependencies.sort(input);
		const expected = [{dependant: "CamelCaser", dependancy: ""}, 
			{dependant: "KittenService", dependancy: "CamelCaser" }]
		expect(actual).to.eql(expected)
	});
});