//Number Facts
const numberURL = 'http://numbersapi.com/';
const favorite = 2;
const favorites = [2,4,8];

axios.get(`${numberURL}${favorite}?json`).then(data => {
    appendFact(data.data.text);
});

axios.get(`${numberURL}${favorites}?json`).then(data => {
    for(let numb in data.data){
        appendFact(data.data[numb]);
    }
});

let promises = [];
for(let i = 0; i < 4; i++)
    promises.push(axios.get(`${numberURL}${favorite}?json`));

Promise.all(promises)
    .then(args => args.forEach(data => appendFact(data.data.text)))
    .catch(err=>console.log(err));


function appendFact(fact){
    let newFact = `<li>${fact}</li>`;
    $("#facts").append(newFact);
}

//Cards
const cardURL = 'https://deckofcardsapi.com/api/deck';
axios.get(`${cardURL}/new/draw`)
    .then(data => { 
        logCard(data.data.cards[0]);
    })
    .catch(err=>console.log(err));

const drawnCards = [];
axios.get(`${cardURL}/new/draw`)
    .then(data => { 
        let deckID  = data.data.deck_id;
        drawnCards.push(data.data.cards[0]);
        return axios.get(`${cardURL}/${deckID}/draw`);
    })
    .then(data => {
        drawnCards.push(data.data.cards[0]);
        drawnCards.forEach(logCard);
    })
    .catch(err=>console.log(err));

let pageDeckId = null;
let $button = $("button");

axios.get(`${cardURL}/new/shuffle`)
.then(data => { 
    pageDeckId  = data.data.deck_id;
    $button.show();
})


$('button').on('click', () => {
    
    axios.get(`${cardURL}/${pageDeckId}/draw`)
    .then(data => {
        appendCard(data.data.cards[0]);
        if(data.data.remaining === 0){
            $('button').remove();
        }
            
    })
    .catch(err=>console.log(err));

})

function logCard(card){
    let {suit, value} = card;
        console.log(`${value} of ${suit}`);
}
function appendCard(card){
    let {suit, value} = card;
    let newCard = `<li>${value} of ${suit}</li>`;
    $("#cards").append(newCard);
}