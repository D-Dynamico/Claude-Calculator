class Calculator {
    constructor(displayElement) {
        this.displayElement = displayElement;
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.shouldResetScreen = false;
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.updateDisplay();
    }

    delete() {
        if (this.currentOperand === '0') return;
        if (this.currentOperand.length === 1) {
            this.currentOperand = '0';
        } else {
            this.currentOperand = this.currentOperand.slice(0, -1);
        }
        this.updateDisplay();
    }

    appendNumber(number) {
        if (this.shouldResetScreen) {
            this.currentOperand = '';
            this.shouldResetScreen = false;
        }
        if (number === '0' && this.currentOperand === '0') return;
        if (number !== '0' && this.currentOperand === '0') {
            this.currentOperand = '';
        }
        if (this.currentOperand.length >= 9) return;
        this.currentOperand = this.currentOperand.toString() + number.toString();
        this.updateDisplay();
    }

    appendDecimal() {
        if (this.shouldResetScreen) {
            this.currentOperand = '0';
            this.shouldResetScreen = false;
        }
        if (this.currentOperand.includes('.')) return;
        this.currentOperand = this.currentOperand + '.';
        this.updateDisplay();
    }

    toggleSign() {
        if (this.currentOperand === '0') return;
        this.currentOperand = (parseFloat(this.currentOperand) * -1).toString();
        this.updateDisplay();
    }

    percentage() {
        let value = parseFloat(this.currentOperand);
        if (this.previousOperand) {
            value = (value * parseFloat(this.previousOperand)) / 100;
        } else {
            value = value / 100;
        }
        this.currentOperand = value.toString();
        this.updateDisplay();
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '0';
        this.shouldResetScreen = true;
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    this.currentOperand = 'Error';
                    this.updateDisplay();
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }

        this.currentOperand = computation.toString().slice(0, 9);
        this.operation = undefined;
        this.previousOperand = '';
        this.shouldResetScreen = true;
        this.updateDisplay();
    }

    updateDisplay() {
        this.displayElement.textContent = this.currentOperand;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const display = document.querySelector('.display');
    const calculator = new Calculator(display);

    document.querySelectorAll('[data-number]').forEach(button => {
        button.addEventListener('click', () => {
            calculator.appendNumber(button.dataset.number);
        });
    });

    document.querySelectorAll('[data-action]').forEach(button => {
        button.addEventListener('click', () => {
            const action = button.dataset.action;
            switch (action) {
                case 'clear':
                    calculator.clear();
                    break;
                case 'backspace':
                    calculator.delete();
                    break;
                case 'decimal':
                    calculator.appendDecimal();
                    break;
                case 'toggle-sign':
                    calculator.toggleSign();
                    break;
                case 'percentage':
                    calculator.percentage();
                    break;
                case 'add':
                    calculator.chooseOperation('+');
                    break;
                case 'subtract':
                    calculator.chooseOperation('-');
                    break;
                case 'multiply':
                    calculator.chooseOperation('×');
                    break;
                case 'divide':
                    calculator.chooseOperation('÷');
                    break;
                case 'equals':
                    calculator.compute();
                    break;
            }
        });
    });

    document.addEventListener('keydown', event => {
        let key = event.key;
        if (/^[0-9]$/.test(key)) {
            calculator.appendNumber(key);
        } else if (key === '.') {
            calculator.appendDecimal();
        } else if (key === 'Backspace') {
            calculator.delete();
        } else if (key === 'Escape') {
            calculator.clear();
        } else if (key === 'Enter') {
            calculator.compute();
        } else if (['+', '-', '*', '/'].includes(key)) {
            const operationMap = {
                '+': '+',
                '-': '-',
                '*': '×',
                '/': '÷'
            };
            calculator.chooseOperation(operationMap[key]);
        }
    });
});