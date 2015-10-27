







var Lucas = function() {
	//this.nome = "lucas";
}
//console.log([{}]);
console.log([Lucas]);
//console.log([new function(){}]);
//console.log([new Lucas]);
//console.log([Lucas]);
//console.log(Lucas.prototype.constructor.prototype.constructor);


var teste123 = Object.create(Lucas);
//console.log(teste123);


var person = Object.create(null);  
Object.defineProperty(person, 'firstName', {  
  value: "Yehuda",
  writable: true,
  enumerable: true,
  configurable: true
});

Object.defineProperty(person, 'lastName', {  
  value: "Katz",
  writable: true,
  enumerable: true,
  configurable: true
});

person.lastName = "oi";
//console.log(person.lastName);

//console.log([function(){}]);
/*Car = function () {
	var self = this;
	self.type = "Car"
	self.go = function() {
		console.log("Going...");
	};
};

Toyota = function() {};//herdando prototype object
Toyota.prototype = new Car();
Toyota.prototype.constructor = function() {
	var self = this;
	self.type = "Toyota";
	self.go = function() {
		console.log("A Toyota car is going...");
	}
};

Toyota.prototype.isJapaneseCar = true;
var t = new Toyota();
console.log(t instanceof Toyota);
console.log(t instanceof Car)
console.log((new t.constructor()).go());



MeasureElement = function() {
	

	this.MoveX = function(xCoord) {

	}
}*/