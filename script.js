const display = document.getElementById('display');
    const buttons = document.querySelectorAll('button');
    const degBtn = document.getElementById('degBtn');
    const radBtn = document.getElementById('radBtn');

    let expression = '';
    let lastResult = null;
    let angleMode = 'deg';

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

    degBtn.addEventListener('click', () => {
      angleMode = 'deg';
      degBtn.classList.add('active');
      radBtn.classList.remove('active');
    });

    radBtn.addEventListener('click', () => {
      angleMode = 'rad';
      radBtn.classList.add('active');
      degBtn.classList.remove('active');
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

        let currentValue = expression || lastResult?.toString() || '0';
        const lastNumberMatch = currentValue.match(/(\d+\.?\d*|\d*\.?\d+)$/);
        
        if (lastNumberMatch) {
          const lastNumber = lastNumberMatch[0];
          let operand = parseFloat(lastNumber);
          let result = 0;

          const isTrigonometric = ['sin', 'cos', 'tan', 'cot', 'sec', 'csc'].includes(value);
          
          // Converte para radianos se o modo for DEG
          let angle = operand;
          if (isTrigonometric) {
            angle = angleMode === 'deg' ? (operand * Math.PI) / 180 : operand;
          }

          switch (value) {
            case 'sin':
              result = Math.sin(angle);
              break;
            case 'cos':
              result = Math.cos(angle);
              break;
            case 'tan':
              result = Math.tan(angle);
              break;
            case 'cot':
              result = 1 / Math.tan(angle);
              break;
            case 'sec':
              result = 1 / Math.cos(angle);
              break;
            case 'csc':
              result = 1 / Math.sin(angle);
              break;
            case 'e^x':
              result = Math.exp(operand);
              break;
            case 'ln':
              result = Math.log(operand);
              break;
          }
          
          expression = currentValue.slice(0, -lastNumber.length) + result.toString();
          lastResult = result;
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