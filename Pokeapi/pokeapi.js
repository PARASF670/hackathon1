key = '89c2a527-c682-40b9-86b3-f522109388ed';
const cardurl = 'https://api.pokemontcg.io/v2/cards';
var go = document.getElementById('button-addon2');
go.addEventListener('click', function (event) {
    event.preventDefault();
    var name = document.getElementById('Pokename').value;
    console.log(name);
    
    DisplayApi(name);
})

function DisplayApi(data) {
    
    fetch(cardurl +'?q=name:'+ data,{
        headers: {
          'X-Api-Key':key
      } }
    )
   
        .then((response) => {
            return response.json();
        })
        .then((result) => {
            console.log(result);
            for (i = 0; i < result.data.length;i++) {
                var card = document.createElement('img');
                card.id='poke';
                card.setAttribute('src', result.data[i].images.small);
                document.getElementById('card-container').append(card);
            }
            
        })
        .catch((err) => {
            console.log(err);
    })
    
}
