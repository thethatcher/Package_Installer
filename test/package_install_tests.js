const expect = require("chai").expect;
const sortDependencies = require("../sortDependencies.js");

describe('sortDependencies', ()=>{
	it('should exist', ()=> {
		expect (sortDependencies).to.not.be.undefined;
	});
});

describe('Sort packageArray', ()=>{
	describe('Sorting steps', ()=>{
		it('should parse the input to an array of objects', ()=>{
			const input = [ "KittenService: CamelCaser", "CamelCaser: " ];
			const actual = sortDependencies.makeObjects(input);
			const expected = [{package: "KittenService", dependancy: "CamelCaser" }, 
				{package: "CamelCaser", dependancy: ""}];
			expect(actual).to.eql(expected);
		});

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

	describe("Basic input sorting tests", () => {		
		it("Should sort the array of no dependancy packages alphabetically.", () => {
			const input = ["Node: ", "mysql: ", "Yarn: ", "Harvey: ", "Steven: ", "Cynthia: "];
			const expected = "Cynthia, Harvey, mysql, Node, Steven, Yarn";
			const actual = sortDependencies.printPackagesInOrder(input);
			expect(actual).to.eql(expected);
		});

		it("Should sort the two single branch chains.", ()=> {
			const input = ["Anthony: ", "Calvin: Anthony", "Karen: ", "Ryan: Karen", "Linus: Ryan"];
			const expected = "Anthony, Karen, Calvin, Ryan, Linus";
			const actual = sortDependencies.printPackagesInOrder(input);
			expect(actual).to.eql(expected);
		});

		it('Should sort the short packageArray into the correct order', ()=>{
			const input = ["KittenService: CamelCaser", "CamelCaser: "]
			const actual = sortDependencies.printPackagesInOrder(input);
			const expected = "CamelCaser, KittenService"
			expect(actual).to.eql(expected);
		});

		it('Should sort the two simple chains', ()=>{
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

		it('Should sort this branched chain.', ()=>{
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
		});
	});

	describe("Invalid input tests", ()=> {
		it("Should reject the simple cycle input", ()=> {
			const input = ["Mallory: Ryan", "Ryan: Mallory"];
			expect(function(){sortDependencies.printPackagesInOrder(input)}).to.throw("Invalid Input");
		});

		it("Should reject the simple cycle input, that also contains a simple valid chain.", ()=> {
			const input = ["Mallory: Ryan", "Ryan: Mallory", "Stephanie: Kristine", "Kristine: "];
			expect(function(){sortDependencies.printPackagesInOrder(input)}).to.throw("Invalid Input");
		});

	});

	describe("Complex input sorting tests", ()=> {
		it("Should sort the single 6 branch chain.", ()=> {
			const input = [
				"q: o",
				"e: d",
				"f: d",
				"c: a",
				"o: a",
				"d: b",
				"p: o",
				"b: a",
				"g: c",
				"a: ",
				"h: c",
				"i: h",
				"n: l",
				"j: h",
				"k: a",
				"l: k",
				"m: l"
			];
			const expected = "a, b, c, k, o, d, g, h, l, p, q, e, f, i, j, m, n";
			const actual = sortDependencies.printPackagesInOrder(input);
			expect(actual).to.eql(expected); 
		});

		it("Should sort this array of two branched chains with 26 total packages.", () =>{
			const input = [
				"a: ", 
				"c: a",
				"f: c",
				"e: c",
				"g: c",
				"h: c",
				"l: e",
				"m: f",
				"n: g",
				"o: h",
				"s: m",
				"t: m",
				"u: n",
				"v: o",
				"w: o",
				"x: o",
				"b: ",
				"d: b",
				"i: d",
				"j: d",
				"k: d",
				"p: i",
				"q: j",
				"r: j",
				"y: q",
				"z: y"
			];
			const expected = "a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z";
			const actual = sortDependencies.printPackagesInOrder(input);
			expect(actual).to.eql(expected);
		});

		it("Should sort the 4 chains of varying length and complexity.", ()=> {
			const input = [
				"p: i",
				"u: p",
				"k: g",
				"f: b",
				"o: h",
				"e: a",
				"h: e",
				"i: e",
				"b: ",
				"j: g",
				"c: ",
				"v: t",
				"a: ", 
				"n: h",
				"z: y",
				"g: d",
				"l: g",
				"m: g",
				"q: j",
				"r: j",
				"s: j",
				"t: k",
				"w: v",
				"d: ",
				"x: v",
				"y: x"
			];
			const expected = "a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z";
			const actual = sortDependencies.printPackagesInOrder(input);
			expect(actual).to.eql(expected);
		});

	});
});