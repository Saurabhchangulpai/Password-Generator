const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercase = document.querySelector("#uppercase");
const lowercase = document.querySelector("#lowercase");
const number = document.querySelector("#number");
const symbols = document.querySelector("#symbol");
const generateBtn = document.querySelector(".generatorButton");
const indicator = document.querySelector("[data-indicator]");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const strings = '=!@#$%^&*()_+<,>/?';


let password = "";
let passWordLength = 10;
let checkCount = 0;

setLength();
setIndicator("#ccc")

function setLength() {
    inputSlider.value = passWordLength;
    lengthDisplay.innerText = passWordLength;
    const min=inputSlider.min;
    const max=inputSlider.max;
    inputSlider.style.backgroundSize=((passWordLength-min)*100/(max-min))+"% 100%"
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
   // indicator.style.boxShadow = "0px 0px 12px 1px",color;
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNum() {
    return getRndInteger(0, 9);
}

function generateLowecase() {
    return String.fromCharCode(getRndInteger(97, 123));
}

function generateUppercase() {
    return String.fromCharCode(getRndInteger(65, 91));
}

function generateSymbol() {
    let random = getRndInteger(0, strings.length);
    return strings.charAt(random);
}

function calcString() {
    let upper = false;
    let lower = false;
    let num = false;
    let sys = false;

    if (uppercase.checked) upper = true;
    if (lowercase.checked) lower = true;
    if (number.checked) num = true;
    if (symbols.checked) sys = true;

    if (upper && lower && (num || sys) && passWordLength >= 6) {
        setIndicator("#0f0");
    } else if ((lower || upper) && (num || sys) && passWordLength >= 4) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }
}

async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
    } catch (e) {
        copyMsg.innerText = "Failed";
    }
    copyMsg.classList.add("active");
    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}

function shufflePassword(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }

    let str = "";
    array.forEach((el) => (str += el));
    return str;
}


function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked) checkCount++;
    });
    if (passWordLength < checkCount) {
        passWordLength = checkCount;
        setLength();
    }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener("change", handleCheckBoxChange);
});

inputSlider.addEventListener("input", (e) => {
    passWordLength = e.target.value;
    setLength();
});

copyBtn.addEventListener("click", () => {
    if (passwordDisplay.value) //or passwordDisplay.value
        copyContent();
});

generateBtn.addEventListener("click", () => {
    if (checkCount == 0) return;

    if (passWordLength < checkCount) {
        passWordLength = checkCount;
        setLength();
    }

    password = "";

    let funcArr = [];

    if (uppercase.checked) 
      funcArr.push(generateUppercase);

    if (lowercase.checked) 
        funcArr.push(generateLowecase);

    if (number.checked)
         funcArr.push(generateRandomNum);

    if (symbols.checked)
         funcArr.push(generateSymbol);

    for (let i = 0; i < funcArr.length; i++) 
            password += funcArr[i]();

    for (let i = 0; i < passWordLength - funcArr.length; i++) {
        let randIndex = getRndInteger(0, funcArr.length);
        password += funcArr[randIndex]();
    }

    password = shufflePassword(Array.from(password));

    passwordDisplay.value = password;

    calcString();
});
