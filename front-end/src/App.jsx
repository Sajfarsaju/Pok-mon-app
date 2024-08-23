import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [pokemonData, setPokemonData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=100');
      const pokemonList = response.data.results;

      const pokemonDetails = await Promise.all(
        pokemonList.map(async (pokemon) => {

          const pokeData = await axios.get(pokemon.url);

          return {
            name: pokeData.data.name,
            image: pokeData.data.sprites.front_default,
          };
        })
      );
      setPokemonData(pokemonDetails);
      setFilteredData(pokemonDetails);
      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filtered = pokemonData.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchTerm, pokemonData]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-4">Pokémon Gallery</h1>
      <input
        type="text"
        placeholder="Search Pokémon..."
        className="border p-2 mb-4 w-full"
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {loading ? (
        <div className="mt-10 text-center text-xl">Loading...</div>
      ) : filteredData.length > 0 ? (
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredData.map((pokemon) => (
            <div key={pokemon.name} className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-300">
              <img src={pokemon.image} alt={pokemon.name} className="w-full h-32 object-contain mb-2" />
              <h2 className="text-xl font-semibold text-center capitalize">{pokemon.name}</h2>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-10 text-center text-xl text-gray-500">
          No results found
        </div>
      )}
    </div>
  )
}

export default App
