function GetDebugScore() {

    var chord1 = {
        denominator: 2,
        notes: [
            { n: "B", o: 4 },
            { n: "A", o: 4 },
            { n: "G", o: 4 },
            { n: "F", o: 4 },
            { n: "D", o: 4 }
        ]
    }

    var chord2 = {
        denominator: 4,
        notes: [
            { n: "C", o: 4 },
            { n: "D", o: 4 },
            { n: "E", o: 4 },
            { n: "F", o: 4 },
            { n: "G", o: 4 }
        ]
    }


    var chord3 = {
        denominator: 2,
        notes: [
            {n: "E", o: 3, a: "flat-flat"  },
            {n: "F", o: 3, a: "flat-flat"  }
        ]
    }

    var chord4 = {
        denominator: 2,
        notes: [
            {n: "E", o: 3 , a: "flat-flat"}
        ]
    }

    var chord5 = {
        denominator: 2,
        dotted: 1,
        notes: [
            {n: "E", o: 3, a: "" },
            {n: "F", o: 3, a: "flat-flat" },
            {n: "F", o: 5, a: "" }
        ]
    }

    var chord6 = {
        denominator: 8,
        notes: [
            {n: "C", o: 4 }
        ]
    }

    var chord7 = {
        denominator: 4,
        dotted: 1,
        notes: [
            {n: "E", o: 3, a: "flat-flat"  },
            {n: "F", o: 3, a: "flat-flat"  }
        ]
    }


    var measure1 = {
        clef: "G2",
        timeSig: "4,4",
        keySig: 2,
        endBar: "repeat_b",
        chords: [chord1, { denominator: 2 }]
    }

    var measure2 = {
        keySig: 5,
        clef: "F4",
        startBar: "repeat_f",
        endBar: "end",
        chords: [ chord2, { denominator: 4 }, { denominator: 4 }, { denominator: 4 }, ]
    }

    var measure3 = {
        clef: "F4",
        timeSig: "4,4",
        keySig: 5,
        chords: [{ denominator: 4 }, chord3, { denominator: 4 }]
    }


    var betaDen = 8;
    var betaChords = [];
    for(var a = 0; a < betaDen; a++) {
        //betaChords.push({ denominator: betaDen , notes: [{ n:"G", o: 4 }]});
        betaChords.push(getRandomChord(betaDen));
    }

    var stemChord1 = { 
        denominator: 8,
        notes: [
            { n: "G", o: 4 }
        ]
    }

    var stemChord2 = { 
        denominator: 8,
        //dotted: 1,
        notes: [
            { n: "G", o: 4 }
        ]
    }

    var stemChord3 = { 
        denominator: 32,
        notes: [
            { n: "G", o: 4 }
        ]
    }

    var stemChord4 = { 
        denominator: 1,
        notes: [
            { n: "F", o: 2 }
        ]
    }



    var measure4 = {
        keySig: 1,
        clef: "G2",
        timeSig: "2,2",
        //startBar: "repeat_f",
        endBar: "end",
        //chords: betaChords
        chords: [ 
            stemChord1,//{ denominator: 2 }, 
            stemChord2,//{ denominator: 4, dotted: 2 },
            stemChord3,//{ denominator: betaDen },  
            { denominator: 2 },
            stemChord4,//{ denominator: 16}
            { denominator: 2 }
        ]
    }

    var measure5 = {
        clef: "C3",
        timeSig: "2,2",
        keySig: 5,
        chords: [chord5, chord6, chord7]
    }

    var measure6 = {
        chords: [{ denominator: 2 }, { denominator: 2 }]
    }

    var scorePart1 = {
        measures: [
            measure1,
            measure2
        ]
    }

    var scorePart2 = {
        measures: [
            //measure3,
            measure4
        ]
    }

    var scorePart3 = {
        measures: [
            measure5,
            measure6
        ]
    }

    var newMJson = {
        title: "My Music",
        composer: "compos.in",
        lyricist: "lyrics",
        tempo: [8, 120],
        //scoreParts: [ scorePart1, scorePart2, scorePart3]
        scoreParts: [ scorePart2 ]
    }

    return newMJson;

    function getInt(from, to) {
        return Math.round(Math.random()*(to-from) + from);
    }


    function getRandomChord(myDen) {
        var numberOfNotes = getInt(0,6),
            randDen = myDen;//Math.pow(2, getInt(0,6));
            chord = { denominator: randDen , notes: []};

        for(var i = 0; i < numberOfNotes; i++) {
            var randomNote = String.fromCharCode(65 + getInt(0,6)),
                randomOctave = getInt(2,6);

            chord.notes.push({ n: randomNote, o: randomOctave, a: getRandomAccident() });
        }
        
        return chord;
    }

    function getRandomAccident() {
        //return "DOUBLE_FLAT";
        var value = Math.round(Math.random() * 5),
            acc = "";
        
        switch(value) {

            case 1:
                acc = "natural";
                break;
            
            case 2:
                acc = "sharp";
                break;

            case 3:
                acc = "double-sharp";
                break;

            case 4:
                acc = "flat";
                break;

            case 5:
                acc = "flat-flat";
                break;
        }

        return acc;
    }


}










