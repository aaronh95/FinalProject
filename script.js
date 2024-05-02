await WebMidi.enable();
const audCtx = new (AudioContext || webkit.AudioContext)();
let myInput = WebMidi.inputs[0];
let myOutput = WebMidi.outputs[0];

//gather elements

let dropIns = document.getElementById("dropdown-ins");
let dropOuts = document.getElementById("dropdown-outs");
let slider1 = document.getElementById("slide1")
// let slider2 = document.getElementById("slide2")
let delaySlider = document.getElementById("delayTime")
let feedSlider = document.getElementById("Feedback")

//Update Slider

slider1.addEventListener("change", function(){
     document.getElementById("harmony1amt").innerText=`${slider1.value} semitones`
})
delaySlider.addEventListener("change", function (){
  document.getElementById("delayTimeAmt").innerText=`${delaySlider.value} ms`
})
// slider2.addEventListener("change", function(){
//     document.getElementById("harmony2amt").innerText=`${slider2.value}`
// })
//input & output dropdown

WebMidi.inputs.forEach(function (input, num){
    dropIns.innerHTML += `<option value=${num}>${input.name}</option>`
})
WebMidi.outputs.forEach(function (output, num) {
    dropOuts.innerHTML += `<option value=${num}>${output.name}</option>`;
  });
//delay create
  const delay = audCtx.createDelay()
const feedback = audCtx.createGain();

delay.connect(feedback)
feedback.connect(delay)

delay.delayTime.setValueAtTime(delaySlider.value, audCtx.currentTime)
feedback.gain.setValueAtTime(feedSlider.value, audCtx.currentTime)
  //change event listener

  dropIns.addEventListener("change", function (){
    if(myInput.hasListener("noteon")){
        myInput.removeListener("noteon");
    }
    if(myInput.hasListener("noteoff")){
        myInput.removeListener("noteoff");
    }
    myInput=WebMidi.inputs[dropIns.value]
    console.log(dropIns.value)

  const octave = function (midiInput){
    let pitch = midiInput.note.number ;
   let octavevalue = midiInput.note.number + parseInt(slider1.value);
   let velocity = midiInput.note.rawAttack

  let rootOut= new Note (pitch, {rawAttack: velocity});
   let octOut= new Note (octavevalue, {rawAttack: velocity});
   return(rootOut, octOut)
   console.log(rootOut.value)
  
 };


 


 myInput.addListener("noteon", function(someMIDI){
  // myOutput.sendNoteOn(octave(someMIDI.note.number));
  // console.log("poop")
  console.log(someMIDI.note.number)
  myOutput.sendNoteOn(octave(someMIDI))
});

myInput.addListener("noteoff", function (someMIDI){
  myOutput.sendNoteOff(octave(someMIDI))
  console.log(someMIDI.note.identifier)
});

  });


  document.getElementById("doublerCheck").addEventListener("change", function(midiInput){
    if (this.checked){
      console.log("oh?")
      myInput.addListener("noteon", function(someMIDI){
        // myOutput.sendNoteOn(octave(someMIDI.note.number));
        // console.log("poop")
        console.log(someMIDI.note.number)
        myOutput.sendNoteOn(someMIDI.note, {time:WebMidi.time+35})
      });
      
      myInput.addListener("noteoff", function (someMIDI){
        myOutput.sendNoteOff(someMIDI.note, {time:WebMidi.time + 35})
        console.log(someMIDI.note.identifier)
      });
      
    
    console.log(`can't wait for this to actually work!!`)
    } else{
      console.log ("oh, bummer")
    }})
  // document.getElementById("doublerCheck").addEventListener("change", function(){
  //   if (this.checked){
  //     const doublerfunct = function(midiInput){
  //       let pitch= midiInput.note.number
  //       let velocity = rawAttack
  //       let doubleNote = new Note (pitch, {rawAttack:velocity})
  //       webMidi.output.playNote(doubleNote, {time: webMidi.time + 1000})

  //     }
  //   console.log ("yipeee")
  // } else {
  //   console.log ("bummer")
  // }});
  console.log(myInput.note)
console.log ("yippee this works")


dropOuts.addEventListener("change", function (){
  myOutput = WebMidi.outputs[dropOuts.value].channels[0]
})




  
  