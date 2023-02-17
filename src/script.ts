// binding HTML buttons with TS vars
const trigonometryCellButton: HTMLButtonElement = document.getElementById('trigonometry-cell-button') as HTMLButtonElement;
const functionCellButton: HTMLButtonElement = document.getElementById('function-cell-button') as HTMLButtonElement;

const equationText: HTMLDivElement = document.getElementById("equation") as HTMLDivElement;
const outputText: HTMLDivElement = document.getElementById("output") as HTMLDivElement;

const numberButtons: NodeListOf<HTMLDivElement> = document.querySelectorAll("[data-number]");
const unaryOperationButtons: NodeListOf<HTMLDivElement> = document.querySelectorAll("[data-unary-operation]");
const directValueButtons: NodeListOf<HTMLDivElement> = document.querySelectorAll("[data-direct-value]");

const equalButton: HTMLDivElement = document.getElementById('equal-btn') as HTMLDivElement;
const allClearButton: HTMLDivElement = document.getElementById('all-clear-btn') as HTMLDivElement;
const backspaceButton: HTMLDivElement = document.getElementById('backspace-btn') as HTMLDivElement;
const signToggleButton: HTMLDivElement = document.getElementById('sign-toggle-btn') as HTMLDivElement;
const feButton: HTMLDivElement= document.getElementById('fe-btn') as HTMLDivElement;
const degButton: HTMLDivElement = document.getElementById('deg-btn') as HTMLDivElement;
const memoryStoreButton: HTMLDivElement = document.getElementById('ms-btn') as HTMLDivElement;
const memoryReadButton: HTMLDivElement = document.getElementById('mr-btn') as HTMLDivElement;
const memoryPlusButton: HTMLDivElement = document.getElementById('mPlus-btn') as HTMLDivElement;
const memoryMinusButton: HTMLDivElement = document.getElementById('mMinus-btn') as HTMLDivElement;
const memoryClearButton: HTMLDivElement = document.getElementById('mc-btn') as HTMLDivElement;
const powerCellButton: HTMLDivElement = document.getElementById('power-cell') as HTMLDivElement;

class Calculator{

    equation: string;
    isDecimalLegal: boolean;
    feMode: boolean;
    powerMode: boolean;
    isOperatorLegal: boolean;
    degreeMode: boolean;
    lastComputed: number;

    // to init
    constructor(){

        // state to store all equations/ numbers
        this.equation = '0';

        // to handle decimals in equation
        this.isDecimalLegal = true;

        this.feMode = false;
        
        this.powerMode = false;

        this.isOperatorLegal = true;

        this.degreeMode = false;

        this.lastComputed = 0;

        // result text init
        equationText.innerText = '';
        outputText.innerText = this.equation as unknown as string;

        // to check memory state and toggle MC, MR button state
        toggleClearAndReadButtons();
    }

    // returns current equation
    getEquation(): string{
        return this.equation;
    }

    getLastComputed(): number{
        return this.lastComputed;
    }

    // returns current equation
    equationToExponential(): void{
        if(this.lastComputed !== 0){
            this.equation = this.lastComputed as unknown as string;
        }

        if(this.feMode){
            this.equation = Number(this.equation).toFixed();
            this.feMode = false;
        }else{
            this.equation = Number(this.equation).toExponential();
            this.feMode = true;
        }
        outputText.innerText = this.equation;
        this.lastComputed = this.equation as unknown as number;
        this.equation = '0';
    }

    // append newly added number to equation
    appendNumber(number: string): void{

        // to prevent multiple zeroes
        if(this.equation === '0' && number === '0') return;

        if((number === '+' || number === '-' || number === '*' || number === '/' || number === '%' || number === '**') && this.lastComputed !== 0){
            this.equation = this.lastComputed as unknown as string;
            this.lastComputed = 0;
        }else{
            this.lastComputed = 0;
        }

        if((number === '+' || number === '-' || number === '*' || number === '/' || number === '%' || number === '**') && this.isOperatorLegal === false){
            return;
        }

        // to allow decimal digits after operator
        if((number === '+' || number === '-' || number === '*' || number === '/' || number === '%' || number === '**') && this.isOperatorLegal){
            this.isOperatorLegal = false;
            this.isDecimalLegal = true;
        }else{
            this.isOperatorLegal = true;
        }

        // checking if decimal dot is allowed or not and, set to false to prevent multiple decimal dots
        if(number === '.'){
            if(this.isDecimalLegal === false){
                return;
            }else{
                this.isDecimalLegal = false;
            }
        }

        // same number of parenthesis
        if(number === ')' && ((this.equation.toString().split(")").length - 1) >= (this.equation.toString().split("(").length - 1))){
            return;
        }

        // automatically add * if two parenthesis (1)(2) -> (1)*(2)
        if(number === '(' && this.equation.toString().slice(-1) === ')'){
            this.equation += '*';
        }

        // append number to equation
        if(this.equation === '0' && !(number === '+' || number === '-' || number === '*' || number === '/' || number === '%' || number === '**')){
            this.equation = number;
        }else{
            this.equation += number;
        }

        // displaying equation to output (result section)
        equationText.innerText = '';
        outputText.innerText = this.equation;
    }

    // to compute binary operations
    compute(): void{
        try{
            let computation: string = eval(this.equation);
            equationText.innerText = `${this.equation} =`;

            // checking for divide by zero error
            if(computation == 'Infinity' && this.equation.toString().includes('/')){
                computation = 'Can not divide by zero';
            }
            outputText.innerText = computation;

            if(isNaN(computation as unknown as number)){
                this.lastComputed = 0;
            }else{
                this.lastComputed = computation as unknown as number;
            }
            this.equation = '0';

        }catch(err){
            equationText.innerText = `${this.equation} =`;
            outputText.innerText = `Invalid expression`;
            this.equation = '0';
        }
    }

    // to toggle the sign of number
    signToggle(): void{
        
        if(this.lastComputed !== 0){
            this.equation = this.lastComputed as unknown as string;
        }

        let equationNumber = parseFloat(this.equation);
        if(equationNumber>0){
            this.equation = (Math.abs(equationNumber)*-1) as unknown as string;
        }else{
            this.equation = (Math.abs(equationNumber)) as unknown as string;
        }
        outputText.innerText = this.equation;
        this.lastComputed = this.equation as unknown as number;
    }

    // to compute the unary operations
    unaryOperation(operation: string): void{

        if(this.lastComputed !== 0){
            this.equation = this.lastComputed as unknown as string;
        }

        if (this.equation === '') return;
        
        let computation: number;
        const current: number = parseFloat(this.equation);

        if(isNaN(current)) return;

        switch(operation){
            // trigonometry
            case 'sin':
                if(this.degreeMode){
                    computation = Math.sin(current*Math.PI/180);
                }else{
                    computation = Math.sin(current);
                }
                break;
            case 'cos':
                if(this.degreeMode){
                    computation = Math.cos(current*Math.PI/180);
                }else{
                    computation = Math.cos(current);
                }
                break;
            case 'tan':
                if(this.degreeMode){
                    computation = Math.tan(current*Math.PI/180);
                }else{
                    computation = Math.tan(current);
                }
                break;
            case 'hyp':
                computation = Math.hypot(current);
                break;
            case 'sec':
                if(this.degreeMode){
                    computation = 1 / Math.cos(current*Math.PI/180);
                }else{
                    computation = 1 / Math.cos(current);
                }
                break;
            case 'csc':
                if(this.degreeMode){
                    computation = 1 / Math.sin(current*Math.PI/180);
                }else{
                    computation = 1 / Math.sin(current);
                }
                break;
            case 'cot':
                if(this.degreeMode){
                    computation = 1 / Math.tan(current*Math.PI/180);
                }else{
                    computation = 1 / Math.tan(current);
                }
                break;
            
            // function
            case 'ceil':
                computation = Math.ceil(current);
                break;
            case 'floor':
                computation = Math.floor(current);
                break;
            case 'abs':
                computation = Math.abs(current);
                break;

            // others
            case 'ln':
                if(current!==0){
                    computation = Math.log(current);
                }else{
                    computation = 'invalid input' as unknown as number;
                }
                break;
            case 'log':
                if(current!==0){
                    computation = Math.log10(current);
                }else{
                    computation = 'invalid input' as unknown as number;
                }
                break;
            case '10^':
                computation = Math.pow(10,current);
                break;
            case 'sqrt':
                computation = Math.sqrt(current);
                break;
            case 'cuberoot':
                computation = Math.cbrt(current);
                break;
            case 'sqr':
                computation = Math.pow(current,2);
                break;
            case '1/':
                if(current!==0){
                    computation = 1 / current;
                }else{
                    computation = 'Can not divide by zero' as unknown as number;
                }
                break;
            case 'exp':
                computation = current.toExponential() as unknown as number;
                break;
            
            // 2nd function
            case 'cube':
                computation = Math.pow(current,3);
                break;
            case '2^':
                computation = Math.pow(2,current);
                break;
            case 'e^':
                computation = Math.pow(Math.E,current);
                break;

            // factorial
            case '!':
                if(current >= 0){
                    let factorial = (number: number)=>{
                        let temp=1;
                        for(let i=2; i<=number; i++){
                            temp = temp*i;
                        }
                        return temp;
                    }
                    computation = factorial(current);
                }else{
                    computation = 'Invalid input' as unknown as number;
                }
                break;
            default:
                return;
        }
        equationText.innerText = `${operation}(${this.equation}) =`;
        outputText.innerText = computation as unknown as string;

        if(isNaN(computation)){
            this.lastComputed = 0;
            this.equation = '0';
        }else{
            this.lastComputed = computation;
            this.equation = '0';
        }
        
    }

    // to print direct values of const like PI
    printDirectValue(value: string): void{
        let computation: number;
        switch(value){
            case 'pi':
                computation = Math.PI;
                break;
            case 'e':
                computation = Math.E;
                break;
            case 'rand':
                computation = Math.random();
                break;
            default:
                computation = 0;
        }
        this.equation = computation as unknown as string;
        equationText.innerText = '';
        outputText.innerText = this.equation;

        this.lastComputed = computation;
        this.equation = '0';
    }

    // to clear all equation, output text
    clear(): void{
        this.equation = '0';
        this.isDecimalLegal = true;
        this.isOperatorLegal = true;
        this.lastComputed = 0;

        equationText.innerText = '';
        outputText.innerText = this.equation;
    }

    // to backspace one char from equation
    backspace(): void{
        this.equation = this.equation.toString().slice(0,-1);
        if(this.equation===''){
            this.equation = '0';
        }
        this.isDecimalLegal = true;
        this.isOperatorLegal = true;
        outputText.textContent = this.equation;
    }
}

// handling dropdowns
// trigonometry dropdown
trigonometryCellButton.onclick = (): void=>{
    if((document.getElementById("trigonometry-cell-content") as HTMLDivElement).style.display==="block"){
        (document.getElementById("trigonometry-cell-content") as HTMLDivElement).style.display="none";
    }else{
        (document.getElementById("trigonometry-cell-content") as HTMLDivElement).style.display="block";
    }
}

// function dropdown
functionCellButton.onclick = (): void=>{
    if((document.getElementById("function-cell-content") as HTMLDivElement).style.display==="block"){
        (document.getElementById("function-cell-content") as HTMLDivElement).style.display="none";
    }else{
        (document.getElementById("function-cell-content") as HTMLDivElement).style.display="block";
    }
}

// creating Calculator class object
const calculator: Calculator = new Calculator();

// handling buttons click
numberButtons.forEach(button =>{
    button.addEventListener('click', (): void=>{
        if(calculator.feMode){
            calculator.feMode = false;
            feButton.style.borderBottom = "none";
        }
        calculator.appendNumber(button.getAttribute('data-number') as string);
    });
});

unaryOperationButtons.forEach(button =>{
    button.addEventListener('click', (): void=>{
        if(calculator.feMode){
            calculator.feMode = false;
            feButton.style.borderBottom = "none";
        }
        calculator.unaryOperation(button.getAttribute('data-unary-operation') as string);
    });
});

directValueButtons.forEach(button =>{
    button.addEventListener('click', (): void=>{
        if(calculator.feMode){
            calculator.feMode = false;
            feButton.style.borderBottom = "none";
        }
        calculator.printDirectValue(button.getAttribute('data-direct-value') as string);
    });
});

equalButton.onclick = (): void=>{
    calculator.compute();
}

allClearButton.onclick = (): void=>{
    calculator.clear();
}

backspaceButton.onclick = (): void =>{
    calculator.backspace();
}

signToggleButton.onclick = (): void=>{
    calculator.signToggle();
}

feButton.onclick = (): void=>{
    calculator.equationToExponential();
    if(calculator.feMode){
        feButton.style.borderBottom = "2px solid var(--primaryColor)";
    }else{
        feButton.style.borderBottom = "none";
    }
}

degButton.onclick = (): void=>{
    if(calculator.degreeMode){
        degButton.innerText = "RAD";
        calculator.degreeMode = false;
    }else{
        degButton.innerText = "DEG";
        calculator.degreeMode = true;
    }
}

powerCellButton.onclick = (): void=>{
    turnOnPowerMode();

    if(calculator.powerMode){
        powerCellButton.style.backgroundColor = "var(--primaryColor)";
        powerCellButton.style.color = "var(--cardBackgroundColor)";
    }else{
        powerCellButton.style.backgroundColor = "var(--cardSecondaryBackgroundColor)";
        powerCellButton.style.color = "var(--textColor)";
    }
}

memoryStoreButton.onclick = (): void=>{
    if(calculator.getEquation() !== '' && !(isNaN(calculator.getEquation() as unknown as number))){
        if(calculator.getEquation() == '0'){
            localStorage.setItem('calculator-item',calculator.getLastComputed() as unknown as string);
        }else{
            localStorage.setItem('calculator-item',calculator.getEquation());
        }
        toggleClearAndReadButtons();
    }
}

memoryReadButton.onclick = (): void=>{
    if(localStorage.getItem('calculator-item') !== null){
        if(!(calculator.getEquation().toString().includes('+') || calculator.getEquation().toString().includes('-') || calculator.getEquation().toString().includes('*') || calculator.getEquation().toString().includes('/') || calculator.getEquation().toString().includes('%') || calculator.getEquation().toString().includes('**'))){
            calculator.clear();
        }
        calculator.appendNumber(localStorage.getItem('calculator-item') as string);
    }
}

memoryPlusButton.onclick = (): void=>{
    let current: number = 0;
    if(calculator.getEquation() !== ''){
        if(calculator.getEquation() == '0'){
            current = calculator.getLastComputed();
        }else{
            current = parseFloat(calculator.getEquation());
        }
    }
    if(localStorage.getItem('calculator-item') !== null){
        let memoryValue: number = Number(localStorage.getItem('calculator-item'));
        localStorage.setItem('calculator-item', (memoryValue + current) as unknown as string);
    }else{
        localStorage.setItem('calculator-item',current as unknown as string);
        toggleClearAndReadButtons();
    }
}

memoryMinusButton.onclick = (): void=>{
    let current: number = 0;

    if(calculator.getEquation() !== ''){
        if(calculator.getEquation() == '0'){
            current = calculator.getLastComputed();
        }else{
            current = parseFloat(calculator.getEquation());
        }
    }
    if(localStorage.getItem('calculator-item') !== null){
        let memoryValue = Number(localStorage.getItem('calculator-item'));
        localStorage.setItem('calculator-item', (memoryValue - current) as unknown as string);
    }else{
        localStorage.setItem('calculator-item',current as unknown as string);
        toggleClearAndReadButtons();
    }
}

memoryClearButton.onclick = (): void=>{
    if(localStorage.getItem('calculator-item')){
        localStorage.removeItem('calculator-item');
        toggleClearAndReadButtons();
    }
}

// keyboard events
window.addEventListener('keydown', (e: KeyboardEvent): void=>{
    if(calculator.feMode){
        calculator.feMode = false;
        feButton.style.borderBottom = "none";
    }

    if ((e.key >= '0' && e.key <= '9') || (e.key === "+" || e.key === "-" || e.key === "*" ||e.key === "/" || e.key === "%" || e.key === "." || e.key === "(" || e.key === ")")) { 
        calculator.appendNumber(e.key);
    }
    if(e.key === "^"){
        calculator.appendNumber('**');
    }
    if(e.key === "Enter"){
        calculator.compute();
    }
    if(e.key === "Backspace"){
        calculator.backspace();
    }
    if(e.key === "Escape"){
        calculator.clear();
    }
});

// to close dropdown on any other click
window.onclick = function(event: Event): void {
    if (!(event.target as HTMLElement).matches('.function-cell-button')) {

      let dropdowns: HTMLCollectionOf<HTMLElement> = document.getElementsByClassName("function-cell-content") as HTMLCollectionOf<HTMLElement>;

      for (let i = 0; i < dropdowns.length; i++) {

        let openDropdown: HTMLElement = dropdowns[i];

        if (openDropdown.style.display==="block") {
            openDropdown.style.display="none";
        }
      }
    }
    if (!(event.target as HTMLElement).matches('.trigonometry-cell-button')) {

        let dropdowns: HTMLCollectionOf<HTMLElement> = document.getElementsByClassName("trigonometry-cell-content") as HTMLCollectionOf<HTMLElement>;

        for (let i = 0; i < dropdowns.length; i++) {

          let openDropdown: HTMLElement = dropdowns[i];

          if (openDropdown.style.display==="block") {
              openDropdown.style.display="none";
          }
        }
    }
}

// Utility functions
function turnOnPowerMode(): void{
    if(calculator.powerMode){
        (document.getElementById('sqrOrCube') as HTMLElement).setAttribute('data-unary-operation',"sqr");
        (document.getElementById('sqrOrCube') as HTMLElement).innerHTML = "x<sup>2</sup>";

        (document.getElementById('sqrtOrCuberoot') as HTMLElement).setAttribute('data-unary-operation',"sqrt");
        (document.getElementById('sqrtOrCuberoot') as HTMLElement).innerHTML = "&#8730;";

        (document.getElementById('10RaiseXOr2RaiseX') as HTMLElement).setAttribute('data-unary-operation',"10^");
        (document.getElementById('10RaiseXOr2RaiseX') as HTMLElement).innerHTML = "10<sup>x</sup>";

        (document.getElementById('logOrERaiseX') as HTMLElement).setAttribute('data-unary-operation',"log");
        (document.getElementById('logOrERaiseX') as HTMLElement).innerHTML = "log";

        calculator.powerMode = false;
    }else{
        (document.getElementById('sqrOrCube') as HTMLElement).setAttribute('data-unary-operation',"cube");
        (document.getElementById('sqrOrCube') as HTMLElement).innerHTML = "x<sup>3</sup>";

        (document.getElementById('sqrtOrCuberoot') as HTMLElement).setAttribute('data-unary-operation',"cuberoot");
        (document.getElementById('sqrtOrCuberoot') as HTMLElement).innerHTML = "&#8731;";
        (document.getElementById('sqrtOrCuberoot') as HTMLElement).style.padding = "0.5rem";

        (document.getElementById('10RaiseXOr2RaiseX') as HTMLElement).setAttribute('data-unary-operation',"2^");
        (document.getElementById('10RaiseXOr2RaiseX') as HTMLElement).innerHTML = "2<sup>x</sup>";

        (document.getElementById('logOrERaiseX') as HTMLElement).setAttribute('data-unary-operation',"e^");
        (document.getElementById('logOrERaiseX') as HTMLElement).innerHTML = "e<sup>x</sup>";
        (document.getElementById('logOrERaiseX') as HTMLElement).style.padding = "0.5rem";

        calculator.powerMode = true;
    }
}

// to toggle state of MC and MR button based on memory value
function toggleClearAndReadButtons(): void{
    if(localStorage.getItem('calculator-item') === null){
        memoryClearButton.style.opacity = '0.1';
        memoryReadButton.style.opacity = '0.1';

        memoryClearButton.style.pointerEvents = "none";
        memoryReadButton.style.pointerEvents = "none";

    }else{
        memoryClearButton.style.opacity = '1';
        memoryReadButton.style.opacity = '1';

        memoryClearButton.style.pointerEvents = "auto";
        memoryReadButton.style.pointerEvents = "auto";
    }
}

