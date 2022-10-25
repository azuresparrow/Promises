//Number Facts
const numberURL = 'http://numbersapi.com/';
const favorite = 2;
const favorites = [2,4,8];

async function requestNumber(){
    let data = await axios.get(`${numberURL}${favorite}?json`);
    appendFact(data.data[0]);
}
requestNumbers();

async function requestNumbers(){
    let data = await axios.get(`${numberURL}${favorites}?json`);
    for(let numb in data.data){
        appendFact(data.data[numb]);
    }
}
requestNumbers();


let promises = [];
for(let i = 0; i < 4; i++)
    promises.push(axios.get(`${numberURL}${favorite}?json`));

async function requestMultiple(){
    let facts = await Promise.all(promises);
    facts => facts.forEach(data => appendFact(data.data.text));
}

requestMultiple();

function appendFact(fact){
    let newFact = `<li>${fact}</li>`;
    $("#facts").append(newFact);
}

//Cards
const cardURL = 'https://deckofcardsapi.com/api/deck';

async function drawCard1(){
    let data = await axios.get(`${cardURL}/new/draw`);
    logCard(data.data.cards[0]);
}
drawCard1();

async function drawCard2(){
    let data = await axios.get(`${cardURL}/new/draw`);
    let card1 = data.data.cards[0];
    data = await axios.get(`${cardURL}/${data.data.deck_id}/draw`);
    logCard(card1);
    logCard(data.data.cards[0]);
}
drawCard2();

let pageDeckId = null;
let $button = $("button");

async function pageLoad(){
    let data = await axios.get(`${cardURL}/new/shuffle`);
    pageDeckId  = data.data.deck_id;
    $button.show();
}

pageLoad();

$('button').on('click', async function(){
    let data = await axios.get(`${cardURL}/${pageDeckId}/draw`);
    appendCard(data.data.cards[0]);
    if(data.data.remaining === 0){
        $('button').remove();
    }
});

function logCard(card){
    let {suit, value} = card;
        console.log(`${value} of ${suit}`);
}
function appendCard(card){
    let {suit, value} = card;
    let newCard = `<li>${value} of ${suit}</li>`;
    $("#cards").append(newCard);
}