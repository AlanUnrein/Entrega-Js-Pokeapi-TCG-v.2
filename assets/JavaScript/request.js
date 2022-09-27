const requestPokemon = async pokemonID => {
    try {
        const baseURL = `https://pokeapi.co/api/v2/pokemon/${pokemonID}`;
        const res = await fetch(baseURL);
        const data = await res.json();
        return data
    } catch (error) {
        console.error('error de api')
    }
}
// traer la cantidad de pokemones actuales
const requestCount = async () => {
    try {
        const baseURL = `https://pokeapi.co/api/v2/pokemon`
        const res = await fetch(baseURL);
        const data = await res.json();
        return data.count
    } catch (error) {
        console.error('error en la api');
    } 
}

const requestMove = async (pkm) => {
    const baseURL = `https://pokeapi.co/api/v2/move/${pkm.moves[Math.floor(Math.random() * pkm.moves.length)].move.name}`;
    const res = await fetch(baseURL);
    const data = await res.json();
    return data;
}
const requestMove2 = async (pkm) => {
    const baseURL = `https://pokeapi.co/api/v2/move/${pkm.moves[Math.floor(Math.random() * pkm.moves.length)].move.name}`;
    const res = await fetch(baseURL);
    const data = await res.json();
    return data;
}