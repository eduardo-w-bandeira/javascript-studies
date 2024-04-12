console.log("Hello world!")

function outter(x) {
    function inner() {
        console.log(x)
    }
    return inner
}

inner1 = outter(1)
inner2 = outter(2)

inner2()
inner1()
inner2()
