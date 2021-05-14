export default function avgFinder(array){
  let length = array.length;
  let happy = 0,
    sad = 0,
    angry = 0,
    nervous = 0,
    bored = 0,
    annoyed = 0;
  for (let i = 0; i < length; i++) {
    switch (array[i].mood) {
      case "Happy":
        happy += 1;
        break;
      case "Sad":
        sad += 1;
        break;
      case "Angry":
        angry += 1;
        break;
      case "Nervous":
        nervous += 1;
        break;
      case "Bored":
        bored += 1;
        break;
      case "Annoyed":
        annoyed += 1;
    }
  }
  return ((happy*5 + bored*4 + annoyed*3 + nervous*2 + angry*1 + sad*0)/length)
}
