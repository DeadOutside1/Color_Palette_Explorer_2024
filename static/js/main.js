let colorDivs = document.querySelectorAll(".color");
let generateBtn = document.querySelector(".generate")
let copyBtns = document.querySelectorAll(".copy");
let adjustBtns = document.querySelectorAll(".adjust");
let sliders = document.querySelectorAll(".sliders");
let closeBtns = document.querySelectorAll(".close-adjustments");
let lockBtns = document.querySelectorAll(".lock");
let sliderInputs = document.querySelectorAll('input[type="range"]')
let colorHexes = document.querySelectorAll('.color h2');
let copyContainer = document.querySelector(".copy-container");
let colorArray = [];
/*functions*/

/*generating color*/
function generateHex() {
    const hexLetters = "0123456789abcdef";
    let hash = "#";
    for(let i=0; i<6; i++) {
        hash += hexLetters[Math.floor(Math.random()*16)];
    }
    return hash;

    /*chroma library*/
    // let hash = chroma.random();
    // return hash;
}

/*text and bg contrast -luminance*/
function checkLuminence(color,text) {
    let contrast = chroma(color).luminance();
    if(contrast < 0.5) text.style.color = "white";
    else text.style.color = "black";
}

/*get Color*/
function randomColor() {
    colorArray = [];
    colorDivs.forEach((div) => {
        let generatedHex = generateHex();
        let hexText = div.children[0];
        let icons = div.querySelectorAll(".controls button");

        if(div.classList.contains("locked")) {
            colorArray.push(hexText.innerText);
            return;
        }
        else colorArray.push(chroma(generatedHex).hex());
        //console.log(color.children); -HTML collection color.childNode: nodelist w/ text and in between elements

        /*setting up color*/
        hexText.innerHTML = generatedHex;
        div.style.backgroundColor = generatedHex;

        /*check luminance for hexText*/
        checkLuminence(generatedHex, hexText);
        for(icon of icons) checkLuminence(generatedHex, icon);

        /*colorize sliders*/
        let color = chroma(generatedHex);
        let sliderItems = div.querySelectorAll(".sliders input");
        const hue = sliderItems[0];
        const saturation = sliderItems[1];
        const brightness = sliderItems[2];
        colorizeSliders(color, hue, saturation, brightness);
    })

    /*reset slider*/
    resetSlider();
}

