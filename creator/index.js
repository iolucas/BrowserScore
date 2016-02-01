// C C# D D# E F F# G G# A  A# B
// 0 1  2 3  4 5 6  7 8  9 10 11

<<<<<<< HEAD
var musicScales = new function() {

	this.cromatica = [0,1,2,3,4,5,6,7,8,9,10,11];

	this.maior = [0,2,4,5,7,9,11];

	this.menorNat = [0,2,3,5,7,8,10];
	this.menorHarm = [0,2,3,5,7,8,11];
	this.menorMel = [0,2,3,5,7,9,11];

	this.cigana = [0,2,3,6,7,8,11];

	this.penta = [0,3,5,7,10];
	this.pentaBlue = [0,3,5,6,7,10];

	this.inteiro = [0,2,4,6,8,10];

	this.jonio = generate(0);
	this.dorico = generate(2);
	this.frigio = generate(4);
	this.lidio = generate(5);
	this.mixolidio = generate(7);
	this.eolio = generate(9);
	this.locrio = generate(11);

	function generate(offset) {
		var root = [0,2,4,5,7,9,11];

		for(var i = 0; i < offset/2; i++)
			root.push(root.shift());

		for(var n = 0; n < root.length; n++) {
			root[n] -= offset;

			if(root[n] < 0)
				root[n] += 12;
		}

		return root;
	}
}

var notes = ['C','C#/Db','D','D#/Eb','E','F','F#/Gb','G','G#/Ab','A','A#/Bb','B'];

/*var cromatica = [0,1,2,3,4,5,6,7,8,9,10,11];

var maior = [0,2,4,5,7,9,11];

var menorNat = [0,2,3,5,7,8,10];
var menorHarm = [0,2,3,5,7,8,11];
var menorMel = [0,2,3,5,7,9,11];

var cigana = [0,2,3,6,7,8,11];

var penta = [0,3,5,7,10];
var pentaBlue = [0,3,5,6,7,10];

var inteiro = [0,2,4,6,8,10];*/

// C D E F G A  B
// 1 3 5 6 8 10 12

/*var greekModes = new function() {

	this.jonio = generate(0);
	this.dorico = generate(2);
	this.frigio = generate(4);
	this.lidio = generate(5);
	this.mixolidio = generate(7);
	this.eolio = generate(9);
	this.locrio = generate(11);

	function generate(offset) {
		var root = [0,2,4,5,7,9,11];

		for(var i = 0; i < offset/2; i++)
			root.push(root.shift());

		for(var n = 0; n < root.length; n++) {
			root[n] -= offset;

			if(root[n] < 0)
				root[n] += 12;
		}

		return root;
	}
}*/

	

function genHarmField(scale, grade) {

	grade = grade || 0;

	for(var i = 0; i < scale.length; i++) {

		var n1 = scale.cGet(i);
		var n2 = scale.cGet(i + 2);
		var n3 = scale.cGet(i + 4);

		console.log(notes.cGet(n1 + grade) + ' ' + 
			notes.cGet(n2 + grade) + ' ' + 
			notes.cGet(n3 + grade));
	}

}

function getScale(scale, grade) {
	grade = grade || 0;

	var scaleStr = "";

	for(var i = 0; i < scale.length; i++) {
		scaleStr += notes.cGet(scale[i] + grade) + " ";
	}	

	console.log(scaleStr);
}

function getCavacoScale(scale, grade) {
	grade = grade || 0;

	var strings = [2,12,8,2];

	var scaleStr = "";

	for(var n = 0; n < scale.length; n++) {
		var fNote = scale[n] - strings[0] + grade;

		if(fNote < 0)
			fNote += 12;

		scaleStr += fNote + " ";
	}

	console.log(scaleStr);
}

Array.prototype.cGet = function(index) {
	if(index < 0)
		return this.cGet(this.length - index);	

	if(index < this.length)
		return this[index];

	return this.cGet(index - this.length);
}

//genHarmField(menor);

getScale(musicScales.cigana,9);

//getCavacoScale(pentaBlue, 7);
=======
var notes = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];

var cromatica = [1,2,3,4,5,6,7,8,9,10,11,12];
var maior = [1,3,5,6,8,10,12];
var menor = [1,3,4,6,8,10,11];
var menorHarm = [1,3,4,6,8,10,12];

var penta = [1,4,6,8,11];

function genHarmField(scale, grade) {
	if(!grade)
		grade = 0;

	for(ind in scale) {

		var index = parseInt(ind);
		var n1 = scale[getCircIndex(index,scale.length)] - 1;
		var n2 = scale[getCircIndex(index + 2,scale.length)] - 1;
		var n3 = scale[getCircIndex(index + 4,scale.length)] - 1;

		console.log(notes[getCircIndex(n1 + grade,notes.length)] + ' ' + 
			notes[getCircIndex(n2 + grade,notes.length)] + ' ' + 
			notes[getCircIndex(n3 + grade,notes.length)]);
	}

}

genHarmField(penta,0);


function getCircIndex(ind, length) {
	if(ind < length)
		return ind;
	else
		return getCircIndex(ind - length, length);
}
>>>>>>> b8609b2290ae672024402d6ffe1899f093443093
