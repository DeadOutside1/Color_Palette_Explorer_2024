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

/*colorize Sliders*/
function colorizeSliders(color, hue, saturation, brightness) {
    /*scale saturation*/
    const noSat = color.set('hsl.s',0);
    const fullSat = color.set('hsl.s',1);
    const scaleSat = chroma.scale([noSat,color,fullSat]);

    /*scale lightness*/
    const midLight = color.set('hsl.l',0.5);
    const scaleLight = chroma.scale(["black",midLight,"white"]);

    /*update input color*/
    saturation.style.backgroundImage = `linear-gradient(to right, ${scaleSat(0)}, ${scaleSat(0.5)}, ${scaleSat(1)})`;
    brightness.style.backgroundImage = `linear-gradient(to right, ${scaleLight(0)}, ${scaleLight(0.5)}, ${scaleLight(1)})`;
    hue.style.backgroundImage = `linear-gradient(to right, rgb(204,75,75),rgb(204,204,75),rgb(75,204,75),rgb(75,204,204),rgb(75,75,204),rgb(204,75,204),rgb(204,75,75))`;
}

/*update bg by slider*/
function updateBackground(e) {
    let index = e.target.getAttribute("data-hue") || e.target.getAttribute("data-sat") || e.target.getAttribute("data-light");
    let slider = e.target.parentElement.querySelectorAll('input[type="range"]');
    let hue = slider[0];
    let saturation = slider[1];
    let lightness = slider[2];

    let color = colorArray[index];
    let bgColor = chroma(color)
        .set("hsl.h",hue.value)
        .set("hsl.s",saturation.value)
        .set("hsl.l",lightness.value);
    colorDivs[index].style.backgroundColor = bgColor;

    /*color to sliders*/
    colorizeSliders(bgColor, hue, saturation, lightness)
}

