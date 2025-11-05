const display = document.getElementById('display');
const buttons = document.querySelectorAll('button');

let expression = '';
let lastResult = null;

buttons.forEach(button => {
  button.addEventListener('click', () => {
    const value = button.dataset.value;

    if (value === 'C') {
      expression = '';
      lastResult = null;
      updateDisplay();
    } else if (value === '=') {
      calculateResult();
    } else if (value === '+/-') {
      toggleSign();
    } else if (value === '%') {
      applyPercentage();
    } else if (isScientificOperator(value)) {
      handleScientific(value);
    } else {
      if (lastResult !== null && !isOperator(value)) {
        expression = '';
        lastResult = null;
      }
      expression += value;
      updateDisplay();
    }
  });
});

function isOperator(value) {
  return ['+', '-', '*', '/', '^'].includes(value);
}

function isScientificOperator(value) {
  return ['sin', 'cos', 'tan', 'cot', 'sec', 'csc', 'e^x', 'ln', 'root'].includes(value);
}

function toggleSign() {
  if (expression) {
    const num = parseFloat(expression);
    if (!isNaN(num)) {
      expression = (num * -1).toString();
      updateDisplay();
    }
  }
}

function applyPercentage() {
  if (expression) {
    const num = parseFloat(expression);
    if (!isNaN(num)) {
      expression = (num / 100).toString();
      updateDisplay();
    }
  }
}

function handleScientific(value) {
  try {
    if (value === 'root') {
      expression += 'root';
      updateDisplay();
      return;
    }

    const lastNumberMatch = expression.match(/(\d+\.?\d*|\d*\.?\d+)$/);
    if (lastNumberMatch) {
      const lastNumber = lastNumberMatch[0];
      const operand = parseFloat(lastNumber);
      let result = 0;

      switch (value) {
        case 'sin':
          result = Math.sin(operand);
          break;
        case 'cos':
          result = Math.cos(operand);
          break;
        case 'tan':
          result = Math.tan(operand);
          break;
        case 'cot':
          result = 1 / Math.tan(operand);
          break;
        case 'sec':
          result = 1 / Math.cos(operand);
          break;
        case 'csc':
          result = 1 / Math.sin(operand);
          break;
        case 'e^x':
          result = Math.exp(operand);
          break;
        case 'ln':
          result = Math.log(operand);
          break;
      }
      expression = expression.slice(0, -lastNumber.length) + result.toString();
      updateDisplay();
    }
  } catch (error) {
    expression = 'Erro';
    updateDisplay();
  }
}

function calculateResult() {
  try {
    let evalExpression = expression;
    if (evalExpression.includes('root')) {
      const parts = evalExpression.split('root');
      const index = parseFloat(parts[0]);
      const radicand = parseFloat(parts[1]);
      if (!isNaN(index) && !isNaN(radicand)) {
        evalExpression = Math.pow(radicand, 1 / index).toString();
      } else {
        throw new Error('Invalid root expression');
      }
    }

    evalExpression = evalExpression.replace(/\^/g, '**');
    const result = eval(evalExpression);
    expression = result.toString();
    lastResult = result;
    updateDisplay();
  } catch (error) {
    expression = 'Erro';
    updateDisplay();
  }
}

function updateDisplay() {
  display.value = expression || '0';
}