
//create infixFunction object
//with + - * / as the name 
//pass two arguments to create the equation
const infixToFunction = {
    "+": (x, y) => x + y,
    "-": (x, y) => x - y,
    "*": (x, y) => x * y,
    "/": (x, y) => x / y,
  }

  //1. create a fuction called infixEval with str and regex parameter
  //2. use replace method on str to serch regex, and replace it with _match arg1, operator, arg2
  //3. call infixToFunction object which has + - * / represent every equation
  //4. use parseFloat to convert arg1 and arg2 to float
  //5. the _match arg1 operator arg2 is actually the parameter of infixToFunction
  const infixEval = (str, regex) => str.replace(regex, (_match, arg1, operator, arg2) => infixToFunction[operator](parseFloat(arg1), parseFloat(arg2)));
  //1. create a function called highPrecedence to find is there any high precedence in str
  //   if it exists, called itself until there is no high precedence
  //2. pass a str as the parameter
  //3. create a regex which represts multiple number with "." and * / operator and multiple number with "."
  //4. create a str2 assign it to infixEval with str and regex as parameters
  //5. return the str assigned by str2 if str2 is true or assigned by highPrecedence itself with str2 
  const highPrecedence = str => {
    const regex = /([\d.]+)([*\/])([\d.]+)/;
    const str2 = infixEval(str, regex);
    return str === str2 ? str : highPrecedence(str2);
  }

  //const isEven determine whether a num is even
  const isEven = num => num % 2 === 0;
  //cosnt sum use reduce method to calculate the sum
  const sum = nums => nums.reduce((acc, el) => acc + el, 0);
  //const average remember you have a sum method
  const average = nums => sum(nums) / nums.length;
  //const a median function
  //const a sorted use slice and sort method to sort the array
  //const a length to get the sorted array length
  //const middle to get the middle index
  //return determin whether the length is even use isEven method
  //if it's true, return the middle and middle + 1 average
  //if it is false, return sorted method with Math.ceil(middle)
  const median = nums => {
    const sorted = nums.slice().sort((a, b) => a - b);
    const length = sorted.length;
    const middle = length / 2 - 1;
    return isEven(length)
      ? average([sorted[middle], sorted[middle + 1]])
      : sorted[Math.ceil(middle)];
  }
  //const a spreadsheetFunctions object
  //it has 13 functions
  // sum, average, median, even, someeven, everyeven, firsttwo, has2, increment
  //random [x, y], range, nodupes, ""
  const spreadsheetFunctions = {
    
    sum,
    average,
    median,
    even: nums => nums.filter(isEven),
    someeven: nums => nums.some(isEven),
    everyeven: nums => nums.every(isEven),
    firsttwo: nums => nums.slice(0, 2),
    lasttwo: nums => nums.slice(-2),
    has2: nums => nums.includes(2),
    increment: nums => nums.map(num => num + 1),
    random: ([x, y]) => Math.floor(Math.random() * y + x),
    range: nums => range(...nums),
    nodupes: nums => [...new Set(nums).values()],
    "": num => num,
  }

  //1. create a applyFunction with str as parameter
  //2. create a variable and assign it with highPrecedence function and pass it with str
  //3. const a variable called infix, and create a regex to indentify the + - equation
  //4. create a variable called functionCall assign it with a regex 
  //   the first part of regex is to identify letters digits which occur zero or more times
  //   the second part of regex is to identify digits "." and "," which occur zero or more times
  //   the third part of regex is to identify "?" "!" "." "*" "\" and "(" 
  //   the global parameter for this regex is case-insencitive
  //5. const a toNumberList take a args as a parameter and split args by ",", then trans every elment into float number
  //6. const apply take fn and args, add spreadsheetFunctions into this function
  //   this object take a lowercase key and use toNumberList transsited args as the key's value
  //7. return strs which is already a new string created by infixEval
  //   first replace based on functionCall regex, and a call back function
  //   second the call back function will check wether it exists a fn,
  //   if is exists return the apply funciton, if not return match
  const applyFunction = str => {
    const noHigh = highPrecedence(str);
    const infix = /([\d.]+)([+-])([\d.]+)/;
    const str2 = infixEval(noHigh, infix);
    const functionCall = /([a-z0-9]*)\(([0-9., ]*)\)(?!.*\()/i;
    const toNumberList = args => args.split(",").map(parseFloat);
    const apply = (fn, args) => spreadsheetFunctions[fn.toLowerCase()](toNumberList(args));
    return str2.replace(functionCall, (match, fn, args) => spreadsheetFunctions.hasOwnProperty(fn.toLowerCase()) ? apply(fn, args) : match);
  }
  //range function
  //1. create a new Array, the Array's length is (end - start + 1)
  //2. use fill method to fill the Array with value of start
  //3. use map method to add a index for every element
  const range = (start, end) => Array(end - start + 1).fill(start).map((element, index) => element + index);
  //charRange function
  //1. use range function to create a new Array. charCodeAt method return unicode of character in a string
  //   use the index. string ABC.charCode(0) is 65  ABC.charCode(1) is 66  ABC.charCode(2) is 67
  //2. use map method change the every element in this new Array to a string
  //   String.fromCharCode(65) === A  String.fromCharCode(66) === B
  const charRange = (start, end) => range(start.charCodeAt(0), end.charCodeAt(0)).map(code => String.fromCharCode(code));
  const evalFormula = (x, cells) => {
    const idToText = id => cells.find(cell => cell.id === id).value;
    const rangeRegex = /([A-J])([1-9][0-9]?):([A-J])([1-9][0-9]?)/gi;
    const rangeFromString = (num1, num2) => range(parseInt(num1), parseInt(num2));
    const elemValue = num => character => idToText(character + num);
    const addCharacters = character1 => character2 => num => charRange(character1, character2).map(elemValue(num));
    const rangeExpanded = x.replace(rangeRegex, (_match, char1, num1, char2, num2) => rangeFromString(num1, num2).map(addCharacters(char1)(char2)));
    const cellRegex = /[A-J][1-9][0-9]?/gi;
    const cellExpanded = rangeExpanded.replace(cellRegex, match => idToText(match.toUpperCase()));
    const functionExpanded = applyFunction(cellExpanded);
    return functionExpanded === x ? functionExpanded : evalFormula(functionExpanded, cells);
  }
  
  //put the elements on the web when the web onload
  window.onload = () => {
    const container = document.getElementById("container");
    //creat label function
    const createLabel = (name) => {
      //create a new div element
      const label = document.createElement("div");
      //give the div class name "label"
      label.className = "label";
      label.textContent = name;
      //put the new div element into the container div
      container.appendChild(label);
    }
    //give the charRange function parameter with A and J
    const letters = charRange("A", "J");
    //use forEach method give A to J div elements
    //the forEach method would automaticly pass the every element in letters 
    //to the createLabel as a parameter
    //so for the first letter A, it would be like letters.forEach(createLabe(A))
    letters.forEach(createLabel);
    //use range function, the length is 99 - 1 + 1 = 99
    range(1, 99).forEach(number => {
      //create a div with name is number 1- 99
      createLabel(number);
      //in the each number give each A - J letter
      letters.forEach(letter => {
        const input = document.createElement("input");
        input.type = "text";
        //input unique ID
        input.id = letter + number;
        input.ariaLabel = letter + number;
        input.onchange = update;
        container.appendChild(input);
      })
    })
  }

  //function update use event as argument
  const update = event => {
    //create variable, assign it the target of event
    const element = event.target;
    //create a variable of value, assign it with element's value which
    //replace a whitespace with a "" 
    const value = element.value.replace(/\s/g, "");
    //fist: looking for value that includes the element.id. includes will return true
    //second: AND value's startwith "="
    if (!value.includes(element.id) && value.startsWith('=')) {
      //assign element.value with call the evalFormula function
      //two parameters
      //first, use slice method return value array's second element
      //second use from method on the Array. get a array from container'children
      element.value = evalFormula(value.slice(1), Array.from(document.getElementById("container").children));
    }
  }
  