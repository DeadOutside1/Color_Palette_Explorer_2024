let saveBtn = document.querySelector(".save");
let saveContainer = document.querySelector(".save-container");
let savePopup = document.querySelector(".save-popup");
let closeSave = document.querySelector(".save-close");
let saveName = document.querySelector(".save-name");
let save = document.querySelector(".save-submit");
let libBtn = document.querySelector(".library");
let libContainer = document.querySelector(".library-container");
let libPopup = document.querySelector(".library-popup");
let closeLib = document.querySelector(".library-close");
let cacheDataHexes = [];
let cacheData = [];
let deleteAllBtn = document.querySelector(".delete-btn");

/*Event Listeners*/

getLocalPalette();
saveBtn.addEventListener("click",openSavePanel);
closeSave.addEventListener("click",closeSavePanel);
save.addEventListener("click",savePalette);

libBtn.addEventListener("click",() => {
    openLibPanel();
});
closeLib.addEventListener("click",closeLibPanel);
deleteAllBtn.addEventListener("click",deleteAllPalettes);

/*Functions*/
function openSavePanel(){
    saveContainer.classList.add("active");
    savePopup.classList.add("active");
}
function closeSavePanel(){
    saveContainer.classList.remove("active");
    savePopup.classList.remove("active");
}
function savePalette(){

    let paletteInLocal = checkLocalStorage();
    let paletteName = saveName.value;
    colorDivs.forEach(color => {
        cacheDataHexes.push(color.children[0].innerText);
    });
    let localObj = {name: paletteName, palette: cacheDataHexes, paletterNr:paletteInLocal.length}
    cacheData.push(localObj);
    saveLocalStorage(localObj);
    cacheDataHexes = [];
    saveName.value = "";
    saveInLibrary(localObj);
}
function openLibPanel(){
    libContainer.classList.add("active");
    libPopup.classList.add("active");
}
function closeLibPanel(){
    libContainer.classList.remove("active");
    libPopup.classList.remove("active");
}

/*local storage*/

function checkLocalStorage(){
    let paletteInLocal;
    if(localStorage.getItem("paletteInLocal"))  return JSON.parse(localStorage.getItem("paletteInLocal"));
    return [];
}

function saveLocalStorage(cacheData){
    let paletteInLocal = checkLocalStorage();
    paletteInLocal.push(cacheData);
    localStorage.setItem("paletteInLocal",JSON.stringify(paletteInLocal));

    saveContainer.classList.remove("active");
    savePopup.classList.remove("active");
}
function getLocalPalette(){
    let paletteInLocal = checkLocalStorage();
    paletteInLocal.forEach(savePalette => saveInLibrary(savePalette));
}

function selectSavedPalette(savePalette) {
    colorArray = [];
    closeLibPanel();
    let color = savePalette.palette;
    colorDivs.forEach((div,i) => {

        let icons = div.querySelectorAll(".controls button");
        let hexText = div.children[0];
        div.style.backgroundColor = color[i];
        hexText.innerHTML = color[i];
        if(div.classList.contains("locked")) {
            colorArray.push(hexText.innerText);
            return;
        }
        else colorArray.push(chroma(color[i]).hex());
        /*check luminance for hexText*/
        checkLuminence(color[i], hexText);
        for(icon of icons) checkLuminence(color[i], icon);

        /*colorize sliders*/
        let Tcolor = chroma(color[i]);
        let sliderItems = div.querySelectorAll(".sliders input");
        const hue = sliderItems[0];
        const saturation = sliderItems[1];
        const brightness = sliderItems[2];
        colorizeSliders(Tcolor, hue, saturation, brightness);
    })
    resetSlider();
}

function saveInLibrary(savePalette){
        let index = savePalette.paletterNr;
        let palettePreview = document.createElement("div");
        palettePreview.classList.add("palette-preview");
        let paletteTitle = document.createElement("h4");
        paletteTitle.innerText = savePalette.name;
        paletteTitle.classList.add("palette-title");
        let smallPreview = document.createElement("div");
        smallPreview.classList.add("small-preview")
        savePalette.palette.forEach((palette) => {
            if(palette){
                let smallDiv = document.createElement("div");
                smallDiv.classList.add("small-div")
                smallDiv.style.backgroundColor = palette;
                smallPreview.appendChild(smallDiv);
            }
        })
        let selectBtn = document.createElement("button");
        selectBtn.classList.add("select-btn");
        selectBtn.innerHTML = "Select";

        /*delete button*/
        let deleteBtn = document.createElement("button");
        deleteBtn.classList.add("delete");
        deleteBtn.innerHTML = `<i class="fas fa-trash-alt"></i>`;

        /*select event*/
        selectBtn.addEventListener("click", () => selectSavedPalette(savePalette));

        /*delete event */
        deleteBtn.addEventListener("click", (e) => {
            deleteFromLocalStorage(index);
            e.target.parentElement.remove();

        })

        palettePreview.appendChild(paletteTitle);
        palettePreview.appendChild(smallPreview);
        palettePreview.appendChild(selectBtn);
        palettePreview.appendChild(deleteBtn);
        libPopup.appendChild(palettePreview);
}

function deleteFromLocalStorage(index){
    let paletteInLocal = checkLocalStorage();
    paletteInLocal.splice(index,1);
    localStorage.setItem("paletteInLocal", JSON.stringify(paletteInLocal));
}

function deleteAllPalettes(e){
    let parentPopup = e.target.parentElement.children;
    let palettes = Object.values(parentPopup);
    palettes.forEach(palette => {
        if(palette.classList[0] == "palette-preview"){
            palette.remove();
        }
    })
    localStorage.clear();
}