'use strict'

var CalculatorOSX = (function() {
  // Variables
  var $keyboard = $('.keyboard'),
    $display = $('.display'),
    numbers = ['', ''],
    index = 0,
    operator = '';

  // Binding
  $keyboard.on('click', '.key', clickHandler);

  // This function handles the click events
  function clickHandler() {
    var key = $(this).text();

    if ($.inArray(key, ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']) >= 0) {
      number(key);
    } else if ($.inArray(key, ['÷', '×', '−', '+']) >= 0) {
      operation(key);
    } else if (key === '=') {
      equal();
    } else if (key === 'AC') {
      clearAll();
    } else if (key === '+/−') {
      invertSign();
    } else if (key === '%') {
      percent();
    } else {
      dot();
    }

    render();
  }

  function render() {
    var latest = numbers[1] || numbers[0];
    $display.text(latest);
  }

  function number(n) {
    // Limit the number length
    if (numbers[index].length >= 7) {
      return;
    }

    numbers[index] += n;
  }

  function operation(op) {
    // There is a first number but not an operator? Great, store it.
    if (numbers[0] && !operator) {
      operator = op;
      index = 1;
    }
    // There is a first number, an operator, but not a second number? Just update the operator.
    else if (numbers[0] && operator && !numbers[1]) {
      operator = op;
    }
    // There is a first number, an operator and a second number. Better calculate the result and treat it as a starting point for the next operation.
    else if (numbers[0] && operator && numbers[1]) {
      equal(op);
    }
  }

  function equal(op) {
    if (numbers[0] && operator && numbers[1]) {
      numbers[0] = evaluateExpression(numbers[0], operator, numbers[1]);
      operator = op || '';
      numbers[1] = '';
      if (!op) {
        index = 0;
      }
    }
  }

  function evaluateExpression(n1, op, n2) {
    switch (op) {
      case '÷':
        return (parseFloat(n1) / parseFloat(n2)).toString();
      case '×':
        return (parseFloat(n1) * parseFloat(n2)).toString();
      case '−':
        return (parseFloat(n1) - parseFloat(n2)).toString();
      case '+':
        return (parseFloat(n1) + parseFloat(n2)).toString();
      default:
        throw new Error('Unexpected operator "' + op + '"');
    }
  }

  function clearAll() {
    numbers = ['', ''];
    index = 0;
    operator = '';
  }

  function invertSign() {
    if (numbers[index]) {
      if (numbers[index].charAt(0) === '-') {
        numbers[index] = numbers[index].substring(1);
      } else {
        numbers[index] = '-' + numbers[index];
      }
    }
  }

  function percent() {
    if (numbers[index]) {
      var temp = (parseFloat(numbers[index]) / 100).toString();
      numbers[index] = temp.substring(0, 8);
    }
  }

  function dot() {
    if (numbers[index] && numbers[index].indexOf('.') === -1) {
      numbers[index] += '.';
    }
  }
})();