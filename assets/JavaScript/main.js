// traer los elementos 
const form = document.getElementById('form');
const error = document.querySelector('.error')
const inputNumber = document.getElementById('inputNumber');
const cardContainer = document.querySelector('.card--container');

// array del pokemon ingresado
let pokemon = JSON.parse(localStorage.getItem('pokemon'))  || [];
// guarda el array en el local
const saveToLocalStorage = pokemonCard => {
    localStorage.setItem('pokemon', JSON.stringify(pokemonCard))
}

    
// logica de renderizacion de los movimientos 1 y 2
    const renderMove1 = async pokemon => {
        const fetchedMove = await requestMove(pokemon);
        return document.querySelector('.move-1').innerHTML = renderMovements(fetchedMove)
    }
    const renderMove2 = async pokemon => {
        const fetchedMove2 = await requestMove2(pokemon);
        return document.querySelector('.move-2').innerHTML = renderMovements(fetchedMove2)
    }
    // renderizar en el html, las propiedades de los movimientos elegidos al azar de cada pokemon
    const renderMovements = move => {
        if(!move.power) move.power = 0
        return `
        <div class="move--container">
            <span><img class="type-move" width="25px" src="./assets/img/type/${move.type.name}.png" alt="${move.type.name}"></span>
            <div>
                <h2 class="move--name">${move.name}</h2>
                <p class="move--effect"> ${move.effect_entries[0].short_effect}</p>
            </div>
        </div>    
        <span>${move.power}</span>`
    }


// crea el HTML de la card, con los respectivos fondos de carta y de cuadro por tipo
    const createHTML = pkm => {
        const {stats, name, sprites, base_experience, height, weight, id, abilities, types} = pkm
        
        const background = pkm.types.map(value => value.type.name).shift(); // obtengo el primer tipo(que es el importante) de los que posee el pkm para darle un background
        const back = pkm.types.map(value => value.type.name).shift();

        return `
            <div class="card" style="background-image: url(./assets/img/back/${background}.jpg);">
                <i class="card--x fa-solid fa-circle-xmark"></i>
                <section class="card--pokemon">
                    <span>HP ${stats[0].base_stat}</span>
                    <h1 class="pokemon--name">${name} </h1>
                    <ul class="type">
                        ${types.map(ty => `<li><img width='30px' src="./assets/img/type/${ty.type.name}.png" alt="${ty.type.name}"></li>`).join('')}
                    </ul>
                </section>
                <section class="card--img" style="background-image: url(./assets/img/backImg/${back}.png)"> 
                    <img class="pokemon--img" src="${sprites.other["official-artwork"].front_default}" alt="${name}">
                </section>
                <section class="pokemon--prop">
                    <ul>
                        <li>Base exp: ${base_experience}</li>
                        <li>Height: ${height/10}m</li>
                        <li>Weight: ${weight/10}kg</li>
                    </ul>
                </section>
                <section class="pokemon--moves">
                    <div class="move move-1">${renderMove1(pkm)}</div>
                    <div class="move move-2">${renderMove2(pkm)}</div>
                </section>
                <section class="pokemon--abilities">
                    <h3>Abilities</h3>
                    <ul class="abilities">
                        ${abilities.map(ab => `<li>${ab.ability.name}</li>`).join('')} 
                    </ul>
                </section>
                <span class="number">${id}<i class="fa-sharp fa-solid fa-star"></i></span>
                <div class="footer">
                    <h3>By Alan Unrein</h3>
                    <p>© 1995, 96, 98 Nintendo Creatures, GAMEFREAK © 1999 Wizard.</p>
                </div>
            </div>    
        `
    }

// renderiza la logica del html
const renderPokemon = pkm => {
// condicional para solventar bug, necesito explicacion
    if (pkm.id) {
    cardContainer.innerHTML = createHTML(pkm);
    } else return
}

const searchPokemon = async (e) => {
    e.preventDefault();

    let pokemonInput = inputNumber.value;
    let fetchedCount = await requestCount();
    //solucionar 0 a la izquierda   
    const fetchedPokemon = await requestPokemon(pokemonInput); //objeto pkm
    pokemon = fetchedPokemon;
    
    if (!pokemonInput) {
        showError(`<small class="error">Por favor, ingresa el numero de tu Pokemon!</small>`);
        return;
    } else if (pokemonInput > fetchedCount) {
        showError(`<small class="error">Todavia no llegamos a ese numero de Pokemon</small>`);
        form.reset();
        return;
    } else if (pokemonInput > 905) {
        showError(`<small class="error">Lo sentimos, estamos trabajando para mostrar este Pokemon</small>`);
        form.reset();
        return;
    } 

    renderPokemon(pokemon);
    saveToLocalStorage(pokemon);
    form.reset();
    }

// funcio para mostrar errores con temp
const showError = (msg) => {
    error.innerHTML = msg
    setTimeout(() => {
        form.reset();
        error.innerHTML = ''
    }, 1800);
    return
}

    //Funcion para eliminar la card
const removePokemon = e => {
    if (!e.target.classList.contains('card--x')) return;
    
    cardContainer.innerHTML = ''
    pokemon = [];
    saveToLocalStorage(pokemon)
    return
}

// solucionar: al intentar renderizar antes del listener del form, da error, no se guarda el array y tampoco funca la funcion de remover la card
//solucionado aparantemente, poniendo un condicional a la funcion de renderPokemon para que retorne si no encuentra ningun pokemon en el array

const init = () => {
    renderPokemon(pokemon);
    form.addEventListener('submit', searchPokemon);
    cardContainer.addEventListener('click', removePokemon)
}

init();