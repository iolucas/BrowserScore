// C C# D D# E F F# G G# A  A# B
// 1 2  3 4  5 6 7  8 9  10 11 12

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