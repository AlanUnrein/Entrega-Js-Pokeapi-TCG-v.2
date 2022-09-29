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

    //renderizar los tipos del pkm
    const renderTypes = pkm => {
        return pkm.types.map(ab =>  `<li><img width='30px' src="./assets/img/type/${ab.type.name}.png" alt="${ab.type.name}"></li>`).join('');
    }

    // renderizar las habilidades del pkm
    const renderAbilities = pkm => {
        return pkm.abilities.map(ab => `<li>${ab.ability.name}</li>`).join('')
    }
    // render el backgroun de la card segun el tipo
    const renderBackground = pkm => {
        const background = pkm.types.map(value => value.type.name).shift();
        cardContainer.style.backgroundImage = `url(./assets/img/back/${background}.jpg)`;
        return
    }
    //render el backgroun de la img del pokemon 
    const renderBackImg = pkm => {
        const back = pkm.types.map(value => value.type.name).shift();
        document.querySelector('.card--img').style.backgroundImage = `url(./assets/img/backImg/${back}.png)`;
        return
    } 
    const renderMove = async pkm => {
        fetchedMove = await requestMove(pokemon);
        fetchedMove2 = await requestMove2(pokemon);
        return document.querySelector('.move-1').innerHTML = renderMovements(fetchedMove), document.querySelector('.move-2').innerHTML = renderMovements(fetchedMove2)
    }
    // renderizar en el html, las propiedades de los movimientos elegidos al azar de cada pokemon
    const renderMovements = move => {
        if(!move.power) move.power = 0

        return `
        <span><img class="type-move" width="25px" src="./assets/img/type/${move.type.name}.png" alt="${move.type.name}"></span>
        <div>
            <h2 class="move--name">${move.name}</h2>
            <p class="move--effect"> ${move.effect_entries[0].short_effect}</p>
        </div>
        <span>${move.power}</span>`
    }


    // crea el HTML de la card
    const createHTML = pkm => {
        const {order, stats, name, sprites, base_experience, height, weight, id} = pkm
        return `
            <i class="card--x fa-solid fa-circle-xmark" data-id="${order}"></i>
            <section class="card--pokemon">
                <span>HP ${stats[0].base_stat}</span>
                <h1 class="pokemon--name">${name} </h1>
                <ul class="type">
                
                </ul>
            </section>
            <section class="card--img"> 
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
                <div class="move move-1"></div>
                <div class="move move-2"></div>
            </section>
            <section class="pokemon--abilities">
                <h3>Abilities</h3>
                <ul class="abilities">
                </ul>
            </section>
            <span class="number">${id}<i class="fa-sharp fa-solid fa-star"></i></span>
            <div class="footer">
                <h3>By Alan Unrein</h3>
                <p>© 1995, 96, 98 Nintendo Creatures, GAMEFREAK © 1999 Wizard.</p>
            </div>
        `
    }

// renderiza la logica del html
const renderPokemon = pkm => {
// condicional para solventar bug, necesito explicacion
    if (pkm.id) {
    cardContainer.innerHTML = createHTML(pkm);
    cardContainer.classList.remove('hidden')
    document.querySelector('.type').innerHTML = renderTypes(pkm);
    renderMove(pkm)
    document.querySelector('.abilities').innerHTML = renderAbilities(pkm);
    renderBackground(pkm);
    renderBackImg(pkm);
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

    cardContainer.classList.add('hidden');
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