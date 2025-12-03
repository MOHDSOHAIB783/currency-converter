const BASE_URL="https://v6.exchangerate-api.com/v6/f178546b5af0ea27884bfd35/latest/USD";
const dropdowns=document.querySelectorAll(".dropdown select");
const button=document.querySelector("form button");
const fromCurr=document.querySelector(".from select");
const toCurr=document.querySelector(".to select");
const msg=document.querySelector(".msg");



// document.querySelector(".amount input").addEventListener("input", (e) => {
//     speak(`Amount changed to ${e.target.value}`);
// });
let typingTimer;
const inputAmount = document.querySelector(".amount input");

inputAmount.addEventListener("input", (e) => {
    clearTimeout(typingTimer); // Cancel any previous pending speech
    typingTimer = setTimeout(() => {
        if (e.target.value) { // Only speak if input is not empty
            speak(`amount entered is ${e.target.value}`);
        }
    }, 800); // Wait 800ms after user stops typing
});


// Convert countryList into an array and sort alphabetically by country name
const sortedCountries = Object.keys(countryList).sort((a, b) => {
    let nameA = countryList[a].name.toUpperCase();
    let nameB = countryList[b].name.toUpperCase();
    return nameA.localeCompare(nameB);
});



for(let select of dropdowns){
    for(let currcode of sortedCountries){
        let newoption=document.createElement("option");
        // newoption.innerText=currcode;
        newoption.innerText = `${countryList[currcode].name} (${currcode})`;
        newoption.value=currcode;
        if(select.name==="to"&& currcode==="INR"){
            newoption.selected="selected";
        }
       else if(select.name==="from"&& currcode==="USD"){
            newoption.selected="selected";
        }
        select.append(newoption);
    }
    select.addEventListener("change",(evt)=>{
        updateflag(evt.target);
        speak(`currency selected is ${evt.target.value}`);
    });
}



const updateExchangeRate = async()=>{
     let amount=document.querySelector(".amount input");
    let amtval=amount.value;
    if(amtval===""|| amtval<1){
        amtval=1;
        amount.value="1";
    }
    // console.log(amtval);

// console.log(fromCurr.value,toCurr.value);
// const URL=`${BASE_URL}/${fromCurr.value.toLowerCase()}/${toCurr.value.toUpperCase()}.json`;
let response = await fetch(`https://v6.exchangerate-api.com/v6/f178546b5af0ea27884bfd35/latest/${fromCurr.value}`);
let data= await response.json();
let rate = data.conversion_rates[toCurr.value.toUpperCase()];
let finalamount = amtval*rate;
msg.innerText=`${amtval}${fromCurr.value}=${finalamount}${toCurr.value}`;
speak(msg.innerText);
}




// const updateflag=(element)=>{
//     let currcode=element.value;
//     console.log(currcode);
//     let countrycode=countryList[currcode].code;
//     let newsrc=`https://flagsapi.com/${countrycode}/flat/64.png`;
//     let img=element.parentElement.querySelector("img");
//     img.src=newsrc;
// };




button.addEventListener("click",(evt)=>{
    evt.preventDefault();
    updateExchangeRate();
});


window.addEventListener("load",()=>{
    updateExchangeRate();
});




// animation added
const updateflag = (element) => {
    let currcode = element.value;
    let countrycode = countryList[currcode].code;
    let img = element.parentElement.querySelector("img");

    img.classList.remove("loaded");  // reset fade

    img.onload = () => {
        img.classList.add("loaded"); // fade in
    };

    img.src = `https://flagsapi.com/${countrycode}/flat/64.png`;
};



function speak(text) {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-US";
    speechSynthesis.speak(utter);
}



 