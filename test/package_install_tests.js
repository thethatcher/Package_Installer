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
		const expected = [{package: "KittenService", dependancy: "CamelCaser" }, 
			{package: "CamelCaser", dependancy: ""}];
		expect(actual).to.eql(expected);
	});
});

describe('Sort packageArray', ()=>{
	describe('Sorting steps', ()=>{
		it('Should return an array sorted reverse alphabetically by package name.', ()=>{
			const input = [
				{package:"1", dependancy:"2"}
				,{package:"4", dependancy:""}
				,{package:"3", dependancy:"4"}
				,{package:"2", dependancy:"3"}
			];
			const expected = [
				{package:"4", dependancy:""}
				,{package:"3", dependancy:"4"}
				,{package:"2", dependancy:"3"}
				,{package:"1", dependancy:"2"}
			];
			const actual = sortDependencies.sortOnPackage(input);
			expect(actual).to.eql(expected);
		});

		it('Should find all the independant packages and return an object with two arrays, sorted and unsorted.', ()=>{
			const input = [
				{package:"1", dependancy:"2"}
				,{package:"4", dependancy:""}
				,{package:"3", dependancy:"4"}
				,{package:"2", dependancy:"3"}
			];
			const expected = {
				unsorted: [
					{package:"3", dependancy:"4"}
					,{package:"2", dependancy:"3"}
					,{package:"1", dependancy:"2"}
				],
				sorted: [{package:"4", dependancy:""}]
			};
			const actual = sortDependencies.findIndependantPackages(input);
			expect(actual).to.eql(expected);
		});

		it("Should add remaining packages to the sorted array in the appropriate order.", ()=> {
			const input = [
				{package:"1", dependancy:"2"}
				,{package:"4", dependancy:""}
				,{package:"3", dependancy:"4"}
				,{package:"2", dependancy:"3"}
			]
			const expected = [
				{package:"4", dependancy:""}
				,{package:"3", dependancy:"4"}
				,{package:"2", dependancy:"3"}
				,{package:"1", dependancy:"2"}
			];
			const actual = sortDependencies.buildSortedArray(input);
		});
	});

	it('Should sort the short packageArray into the correct order', ()=>{
		const input = ["KittenService: CamelCaser", "CamelCaser: "]
		const actual = sortDependencies.printPackagesInOrder(input);
		const expected = "CamelCaser, KittenService"
		expect(actual).to.eql(expected);
	});

	it('Should sort the longer array into the correct order', ()=>{
		const input = [
			"KittenService: ",
			"Leetmeme: Cyberportal",
			"Cyberportal: Ice",
			"CamelCaser: KittenService",
			"Fraudstream: Leetmeme",
			"Ice: "
		]
		const actual = sortDependencies.printPackagesInOrder(input);
		const expected = "Ice, KittenService, Cyberportal, CamelCaser, Leetmeme, Fraudstream"
		expect(actual).to.eql(expected);
	});

	it('Should sort this long array into correct order', ()=>{
		const input = [
			"a: ",
			"b: a",
			"c: b",
			"d: b",
			"f: d",
			"e: d",
			"g: f"
		];
		const expected = "a, b, c, d, e, f, g";
		const actual = sortDependencies.printPackagesInOrder(input);
		expect(actual).to.eql(expected);
	})
});