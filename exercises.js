function isEven(num) {
    if (num === 0 || num % 2 === 0) {
        return true
    }
    return false
}

function evenNums() {
    for (let num = 1; num <= 20; num++) {
        let numType = isEven(num) ? "Even" : "Odd"
        console.log(num, numType)
    }
}

evenNums()

function isMultiple(base, by) {
    if (base % by === 0) {
        return true
    }
    return false
}

function sumFizzBuzz() {
    for (let num = 1; num <= 50; num++) {
        let fizzOrBuzz
        if (isMultiple(num, 3)) {
            fizzOrBuzz = "Fizz"
        } else if (isMultiple(num, 5)) {
            fizzOrBuzz = "Buzz"
        } else {
            fizzOrBuzz = "None of them"
        }
        console.log(num, fizzOrBuzz)
    }
}


function sumFizzBuzz() {
    let sum = 0
    for (let num = 1; num <= 1000; num++) {
        if (isMultiple(num, 3) || isMultiple(num, 5)) {
            sum += num
        }
    }
    console.log(`The sum of all the numbers divisible by 3 or 5 from 1 to 1000 is ${sum}`)
}

sumFizzBuzz()

function reverseString(str) {
    let reversedStr = "";
    for (let i = str.length - 1; i >= 0; i--) {
        reversedStr += str[i];
    }
    return reversedStr;
}

let str = "Hello World"
console.log(`The reverse of ${str} is ${reverseString(str)}`)