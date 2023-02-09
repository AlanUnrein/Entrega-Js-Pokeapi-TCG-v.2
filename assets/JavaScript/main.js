// traer los elementos
const form = document.getElementById("form");
const error = document.querySelector(".error");
const inputNumber = document.getElementById("inputNumber");
const cardContainer = document.querySelector(".card--container");
const btnRemoveAll = document.querySelector(".remove-all");

// array del pokemon ingresado
let pokemon = JSON.parse(localStorage.getItem("pokemon")) || [];
// guarda el array en el local
const saveToLocalStorage = (pokemonCard) => {
     localStorage.setItem("pokemon", JSON.stringify(pokemonCard));
};

// crea el HTML de la card, con los respectivos fondos de carta y de cuadro por tipo
const createHTML = (pkm) => {
     const {
          stats,
          name,
          sprites,
          base_experience,
          height,
          weight,
          id,
          abilities,
          types,
     } = pkm;

     /* movimientos */
     const move1 = pkm.moves[0];
     const move2 = pkm.moves[1];
     if (!move1.power) move1.power = "";
     if (!move2.power) move2.power = "";

     const background = pkm.types.map((value) => value.type.name).shift(); // obtengo el primer tipo(que es el importante) de los que posee el pkm para darle un background
     const back = pkm.types.map((value) => value.type.name).shift();

     return `
            <div class="card" style="background-image: url(./assets/img/back/${background}.jpg);">
                <i data-id="${id}"class="card--x fa-solid fa-circle-xmark"></i>
                <section class="card--pokemon">
                    <span>HP ${stats[0].base_stat}</span>
                    <h1 class="pokemon--name">${name} </h1>
                    <ul class="type">
                        ${types
                             .map(
                                  (ty) =>
                                       `<li><img width='30px' src="./assets/img/type/${ty.type.name}.png" alt="${ty.type.name}"></li>`
                             )
                             .join("")}
                    </ul>
                </section>
                <section class="card--img" style="background-image: url(./assets/img/backImg/${back}.png)"> 
                    <img class="pokemon--img" src="${
                         sprites.other["official-artwork"].front_default
                    }" alt="${name}">
                </section>
                <section class="pokemon--prop">
                    <ul>
                        <li>Base exp: ${base_experience}</li>
                        <li>Height: ${height / 10}m</li>
                        <li>Weight: ${weight / 10}kg</li>
                    </ul>
                </section>
                <section class="pokemon--moves">
                    <div class="move move-1">
                        <div class="move--container">
                            <span><img class="type-move" width="25px" src="./assets/img/type/${
                                 move1.type.name
                            }.png" alt="${move1.type.name}"></span>
                            <div>
                                <h2 class="move--name">${move1.name}</h2>
                                <p class="move--effect"> ${move1.effect_entries[0].short_effect.replace(
                                     "$effect_chance%",
                                     ""
                                )}</p>
                            </div>
                         </div>    
                        <span>${move1.power}</span>
                    </div>
                    <div class="move move-2">
                        <div class="move--container">
                            <span><img class="type-move" width="25px" src="./assets/img/type/${
                                 move2.type.name
                            }.png" alt="${move2.type.name}"></span>
                            <div>
                                <h2 class="move--name">${move2.name}</h2>
                                <p class="move--effect"> ${move2.effect_entries[0].short_effect.replace(
                                     "$effect_chance%",
                                     ""
                                )}</p>
                            </div>
                         </div>    
                        <span>${move2.power}</span>
                    </div>
                </section>
                <section class="pokemon--abilities">
                    <h3>Abilities</h3>
                    <ul class="abilities">
                        ${abilities
                             .map((ab) => `<li>${ab.ability.name}</li>`)
                             .join("")} 
                    </ul>
                </section>
                <span class="number">${id}<i class="fa-sharp fa-solid fa-star"></i></span>
                <div class="footer">
                    <h3>By Alan Unrein</h3>
                    <p>© 1995, 96, 98 Nintendo Creatures, GAMEFREAK © 1999 Wizard.</p>
                </div>
            </div>    
        `;
};

// renderiza la logica del html
const renderPokemon = (pkm) => {
     cardContainer.innerHTML = pkm.map((pk) => createHTML(pk));
};

const searchPokemon = async (e) => {
     e.preventDefault();
     let pokemonInput = inputNumber.value;

     if (pokemon.some((e) => e.id === Number(pokemonInput))) {
          showError(
               `<small class="error">Ya estamos viendo ese Pokemon!</small>`
          );
          form.reset();
          return;
     }

     let fetchedCount = await requestCount();
     const fetchedPokemon = await requestPokemon(pokemonInput); //objeto pkm
     // movimientos pkm
     const fetchedMove = await requestMove(fetchedPokemon);
     const fetchedMove2 = await requestMove2(fetchedPokemon);
     if (fetchedMove === fetchedMove2) requestMove2(fetchedPokemon); // para que no se repita
     fetchedPokemon.moves = [fetchedMove, fetchedMove2];
     pokemon = [...pokemon, fetchedPokemon];

     if (!pokemonInput) {
          showError(
               `<small class="error">Por favor, ingresa el numero de tu Pokemon!</small>`
          );
          return;
     } else if (pokemonInput > fetchedCount) {
          showError(
               `<small class="error">Todavia no llegamos a ese numero de Pokemon</small>`
          );
          form.reset();
          return;
     } else if (pokemonInput > 905) {
          showError(
               `<small class="error">Lo sentimos, estamos trabajando para mostrar este Pokemon</small>`
          );
          form.reset();
          return;
     }

     renderPokemon(pokemon);
     saveToLocalStorage(pokemon);
     btnRemoveAll.classList.remove("hidden");
     form.reset();
};

// funcio para mostrar errores con temp
const showError = (msg) => {
     error.innerHTML = msg;
     setTimeout(() => {
          form.reset();
          error.innerHTML = "";
     }, 1800);
     return;
};

//Funcion para eliminar la card
const removePokemon = (e) => {
     if (!e.target.classList.contains("card--x")) return;
     pokemon = pokemon.filter((pk) => pk.id != e.target.dataset.id);
     renderPokemon(pokemon);
     saveToLocalStorage(pokemon);
     showDeleteBtn();
     return;
};

//remover pk unico
const showDeleteBtn = () => {
     if (!pokemon.length) {
          btnRemoveAll.classList.add("hidden");
          return;
     }
     btnRemoveAll.classList.remove("hidden");
};
//remover todos los pk
const removeAll = () => {
     if (!confirm("Quieres remover todas las cartas?")) return;
     pokemon = [];
     renderPokemon(pokemon);
     saveToLocalStorage(pokemon);
     btnRemoveAll.classList.add("hidden");
};

const init = () => {
     renderPokemon(pokemon);
     document.addEventListener("DOMContentLoaded", showDeleteBtn);
     btnRemoveAll.addEventListener("click", removeAll);
     form.addEventListener("submit", searchPokemon);
     cardContainer.addEventListener("click", removePokemon);
};

init();
