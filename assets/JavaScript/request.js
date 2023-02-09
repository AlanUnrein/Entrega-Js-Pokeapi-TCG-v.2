const requestPokemon = async (pokemonID) => {
     try {
          const baseURL = `https://pokeapi.co/api/v2/pokemon/${pokemonID}`;
          const res = await fetch(baseURL);
          const data = await res.json();
          return data;
     } catch (error) {
          return null;
     }
};
// traer la cantidad de pokemones actuales
const requestCount = async () => {
     try {
          const baseURL = `https://pokeapi.co/api/v2/pokemon`;
          const res = await fetch(baseURL);
          const data = await res.json();
          return data.count;
     } catch (error) {
          return null;
     }
};

// traer dos movimientos aleatorios, con su ataque y tipo, del total que posee el pokemon, para setear en su correspondiente lugar,
const requestMove = async (pkm) => {
     try {
          const baseURL = `https://pokeapi.co/api/v2/move/${
               pkm.moves[Math.floor(Math.random() * pkm.moves.length)].move.name
          }`;
          const res = await fetch(baseURL);
          const data = await res.json();
          return data;
     } catch (error) {
          console.error("error, tal vez no hay movimientos para este pokemon");
     }
};
const requestMove2 = async (pkm) => {
     try {
          const baseURL = `https://pokeapi.co/api/v2/move/${
               pkm.moves[Math.floor(Math.random() * pkm.moves.length)].move.name
          }`;
          const res = await fetch(baseURL);
          const data = await res.json();
          return data;
     } catch (error) {
          console.error("error, tal vez no hay movimientos para este pokemon");
     }
};
