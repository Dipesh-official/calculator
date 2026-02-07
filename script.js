const displayResult = document.querySelector(".display .result");
const displayExpression = document.querySelector(".display .expression");

let currentValue = "0";
let previousValue = "";
let operation = null;
let shouldResetDisplay = false;

function updateDisplay() {
  displayResult.textContent = formatDisplay(currentValue);
  displayExpression.textContent = previousValue
    ? `${formatDisplay(previousValue)} ${getOpSymbol(operation)}`
    : "";
}

function formatDisplay(value) {
  if (value === "" || value === "-") return value;
  const num = parseFloat(value);
  if (isNaN(num)) return "0";
  if (num > 1e12 || (num !== 0 && num < 1e-6)) return num.toExponential(4);
  const [intPart, decPart] = value.split(".");
  if (!decPart) return intPart;
  return `${intPart}.${decPart}`;
}

function getOpSymbol(op) {
  const symbols = { "+": "+", "-": "−", "*": "×", "/": "÷", "%": "%" };
  return symbols[op] || op;
}

function inputDigit(digit) {
  if (shouldResetDisplay) {
    currentValue = digit === "." ? "0." : digit;
    shouldResetDisplay = false;
  } else {
    if (digit === "." && currentValue.includes(".")) return;
    if (digit === "0" && currentValue === "0" && !currentValue.includes(".")) return;
    if (digit !== "." && currentValue === "0" && !currentValue.includes(".")) {
      currentValue = digit;
    } else {
      currentValue += digit;
    }
  }
  updateDisplay();
}

function inputOp(op) {
  const num = parseFloat(currentValue);
  if (previousValue !== "" && !shouldResetDisplay) {
    equals();
  }
  previousValue = currentValue;
  operation = op;
  shouldResetDisplay = true;
  updateDisplay();
}

function equals() {
  if (previousValue === "" || operation === null) return;
  const prev = parseFloat(previousValue);
  const curr = parseFloat(currentValue);
  let result;
  switch (operation) {
    case "+":
      result = prev + curr;
      break;
    case "-":
      result = prev - curr;
      break;
    case "*":
      result = prev * curr;
      break;
    case "/":
      result = curr === 0 ? NaN : prev / curr;
      break;
    case "%":
      result = prev % curr;
      break;
    default:
      return;
  }
  currentValue = Number.isNaN(result) ? "Error" : String(result);
  previousValue = "";
  operation = null;
  shouldResetDisplay = true;
  updateDisplay();
}

function clearAll() {
  currentValue = "0";
  previousValue = "";
  operation = null;
  shouldResetDisplay = false;
  updateDisplay();
}

function backspace() {
  if (shouldResetDisplay) return;
  if (currentValue.length <= 1) {
    currentValue = "0";
  } else {
    currentValue = currentValue.slice(0, -1);
  }
  updateDisplay();
}

document.querySelectorAll(".key-num").forEach((btn) => {
  const num = btn.dataset.num;
  btn.addEventListener("click", () => inputDigit(num));
});

document.querySelectorAll(".key-op").forEach((btn) => {
  const op = btn.dataset.op;
  btn.addEventListener("click", () => inputOp(op));
});

document.querySelector(".key-clear").addEventListener("click", clearAll);
document.querySelector(".key-equals").addEventListener("click", equals);
document.querySelector(".key-back").addEventListener("click", backspace);

document.addEventListener("keydown", (e) => {
  if (e.key >= "0" && e.key <= "9") inputDigit(e.key);
  else if (e.key === ".") inputDigit(".");
  else if (e.key === "+" || e.key === "-" || e.key === "*" || e.key === "/") {
    e.preventDefault();
    inputOp(e.key);
  } else if (e.key === "%") {
    e.preventDefault();
    inputOp("%");
  } else if (e.key === "Enter") {
    e.preventDefault();
    equals();
  } else if (e.key === "Escape" || e.key === "c" || e.key === "C") clearAll();
  else if (e.key === "Backspace") {
    e.preventDefault();
    backspace();
  }
});

updateDisplay();
