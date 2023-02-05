let displayValue = "0";
let firstOperand = null;
let secondOperand = null;
let firstOperator = null;
let secondOperator = null;
let result = null;
const buttons = document.querySelectorAll("button");

window.addEventListener("keydown", function (e) {
  const key = document.querySelector(`button[data-key='${e.keyCode}']`);
  key.click();
});

function updateDisplay() {
  const display = document.getElementById("display");
  display.innerText = displayValue;
  if (displayValue.length > 9) {
    display.innerText = displayValue.substring(0, 9);
  }
}

updateDisplay();

function clickButton() {
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", function () {
      if (buttons[i].classList.contains("operand")) {
        inputOperand(buttons[i].value);
        updateDisplay();
      } else if (buttons[i].classList.contains("operator")) {
        inputOperator(buttons[i].value);
      } else if (buttons[i].classList.contains("equals")) {
        inputEquals();
        updateDisplay();
      } else if (buttons[i].classList.contains("decimal")) {
        inputDecimal(buttons[i].value);
        updateDisplay();
      } else if (buttons[i].classList.contains("percent")) {
        inputPercent(displayValue);
        updateDisplay();
      } else if (buttons[i].classList.contains("sign")) {
        inputSign(displayValue);
        updateDisplay();
        //new button handlers
      } else if (buttons[i].classList.contains("sqrt")) {
        inputSqrt(displayValue);
        updateDisplay();
      } else if (buttons[i].classList.contains("squared")) {
        inputSquared(displayValue);
        updateDisplay();
      } else if (buttons[i].classList.contains("pi")) {
        inputPi(buttons[i].value);
        //clear display
      } else if (buttons[i].classList.contains("clear")) clearDisplay();
      updateDisplay();
    });
  }
}

clickButton();

function inputOperand(operand) {
  if (firstOperator === null) {
    if (displayValue === "0" || displayValue === 0) {
      //1st click - handles first operand input
      displayValue = operand;
    } else if (displayValue === firstOperand) {
      //starts new operation after inputEquals()
      displayValue = operand;
    } else {
      displayValue += operand;
    }
  } else {
    //3rd/5th click - inputs to secondOperand
    if (displayValue === firstOperand) {
      displayValue = operand;
    } else {
      displayValue += operand;
    }
  }
}

function inputOperator(operator) {
  if (firstOperator != null && secondOperator === null) {
    //4th click - handles input of second operator
    secondOperator = operator;
    secondOperand = displayValue;
    //need to update the operands if they include symbols such as pi
    const { updatedFirstOperand, updatedSecondOperand } = calculateSymbols(
      firstOperand,
      secondOperand
    );

    //calculate result
    result = operate(updatedFirstOperand, updatedSecondOperand, firstOperator);

    //update display value
    displayValue = roundAccurately(result, 15).toString();
    firstOperand = displayValue;
    result = null;
  } else if (firstOperator != null && secondOperator != null) {
    //6th click - new secondOperator
    secondOperand = displayValue;

    //need to update the operands if they include symbols such as pi
    const { updatedFirstOperand, updatedSecondOperand } = calculateSymbols(
      firstOperand,
      secondOperand
    );

    //calculate result
    result = operate(updatedFirstOperand, updatedSecondOperand, secondOperand);
    secondOperator = operator;
    displayValue = roundAccurately(result, 15).toString();
    firstOperand = displayValue;
    result = null;
  } else {
    //2nd click - handles first operator input
    firstOperator = operator;
    firstOperand = displayValue;
  }
}

function inputEquals() {
  //hitting equals doesn't display undefined before operate()
  if (firstOperator === null) {
    displayValue = displayValue;
  } else if (secondOperator != null) {
    //handles final result
    secondOperand = displayValue;

    //need to update the operands if they include symbols such as pi
    const { updatedFirstOperand, updatedSecondOperand } = calculateSymbols(
      firstOperand,
      secondOperand
    );

    //calculate result
    result = operate(updatedFirstOperand, updatedSecondOperand, secondOperator);

    if (result === "lmao") {
      displayValue = "lmao";
    } else {
      displayValue = roundAccurately(result, 15).toString();
      firstOperand = displayValue;
      secondOperand = null;
      firstOperator = null;
      secondOperator = null;
      result = null;
    }
  } else {
    //handles first operation
    secondOperand = displayValue;

    //need to update the operands if they include symbols such as pi
    const { updatedFirstOperand, updatedSecondOperand } = calculateSymbols(
      firstOperand,
      secondOperand
    );

    //calculate result
    result = operate(updatedFirstOperand, updatedSecondOperand, firstOperator);
    if (result === "lmao") {
      displayValue = "lmao";
    } else {
      displayValue = roundAccurately(result, 15).toString();
      firstOperand = displayValue;
      secondOperand = null;
      firstOperator = null;
      secondOperator = null;
      result = null;
    }
  }
}

function inputDecimal(dot) {
  if (displayValue === firstOperand || displayValue === secondOperand) {
    displayValue = "0";
    displayValue += dot;
  } else if (!displayValue.includes(dot)) {
    displayValue += dot;
  }
}

function inputPercent(num) {
  displayValue = (num / 100).toString();
}

function inputSign(num) {
  displayValue = (num * -1).toString();
}

function clearDisplay() {
  displayValue = "0";
  firstOperand = null;
  secondOperand = null;
  firstOperator = null;
  secondOperator = null;
  result = null;
}

function inputBackspace() {
  if (firstOperand != null) {
    firstOperand = null;
    updateDisplay();
  }
}

function operate(x, y, op) {
  if (op === "+") {
    return x + y;
  } else if (op === "-") {
    return x - y;
  } else if (op === "*") {
    return x * y;
  } else if (op === "/") {
    if (y === 0) {
      return "lmao";
    } else {
      return x / y;
    }
  }
}

function roundAccurately(num, places) {
  return parseFloat(Math.round(num + "e" + places) + "e-" + places);
}

// ******* NEW FUNCTIONS ****** //

//function to handle square root input
function inputSqrt(num) {
  displayValue = Math.sqrt(num).toString();
}

//function to handle squared input
function inputSquared(num) {
  displayValue = (num * num).toString();
}

//function to handle pi inputs
function inputPi(value) {
  inputOperand(value);
  updateDisplay();
}

//loops over the operands
//calculates special symbols such as pi and e
function calculateSymbols(firstOperand, secondOperand) {
  //init total variables
  let updatedFirstOperand = 0,
    updatedSecondOperand = 0;

  //loop over first operand
  for (let i = 0; i < firstOperand.length; i++) {
    //calculate updated operand
    updatedFirstOperand += calculateUpdatedOperand(firstOperand[i]);
  }

  //loop over second operand
  for (let i = 0; i < secondOperand.length; i++) {
    //calculate updated operand
    updatedSecondOperand += calculateUpdatedOperand(secondOperand[i]);
  }

  //return updated operands
  return { updatedFirstOperand, updatedSecondOperand };
}

//checks for symbols in the current operand
//returns the respective value of symbol or number
function calculateUpdatedOperand(operand) {
  switch (operand) {
    //check for pi
    case "π":
      return 3.14159265359;
    //default case, i.e. current value is a number
    default:
      return Number(operand);
  }
}
