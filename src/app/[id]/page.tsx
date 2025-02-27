"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from "next/navigation";

interface Pokemon {
  name: string;
  sprites: { front_default: string };
  types: { type: { name: string } }[];
  abilities: { ability: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
  moves: { move: { name: string } }[];
}


export default function PokemonDetail() {
  const params = useParams(); // Access params correctly
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  console.log(params.id)
  useEffect(() => {
    async function fetchPokemon() {
      try {
        setLoading(true);
        const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${params.id}`);
        setPokemon(res.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load pokemon");
        setLoading(false);
      }
    }

    fetchPokemon();
  }, [params.id]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!pokemon) return <div className="p-8">Pokemon not found</div>;

  return (
    <div className="p-4 w-full min-h-screen bg-gradient-to-br from-amber-500 via-white to-emerald-300">
      <div className="max-w-md text-white mx-auto bg-gradient-to-br from-black via-black to-purple-500 p-4 rounded-lg shadow">
        <h1 className="text-2xl font-bold capitalize mb-2">{pokemon.name}</h1>

        <div className="flex justify-center mb-4">
          <img src={pokemon.sprites.front_default} alt={pokemon.name} className="h-32 w-32" />
        </div>

        <div className="mb-4">
          <h2 className="font-bold mb-1">Types:</h2>
          <div className="flex gap-2">
            {pokemon.types.map((type) => (
              <span key={type.type.name} className="bg-white text-black px-2 py-1 rounded capitalize">
                {type.type.name}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <h2 className="font-bold mb-1">Abilities:</h2>
          <ul className="list-disc pl-5">
            {pokemon.abilities.slice(0, 4).map((ability) => (
              <li key={ability.ability.name} className="capitalize">
                {ability.ability.name.replace('-', ' ')}
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-4">
          <h2 className="font-bold mb-1">Stats:</h2>
          {pokemon.stats.map((stat) => (
            <div key={stat.stat.name} className="mb-1">
              <div className="flex justify-between text-sm capitalize">
                <span>{stat.stat.name}</span>
                <span className='text-white-700 font-bold'>{stat.base_stat}</span>
              </div>
              
            </div>
          ))}
        </div>
        <div className="mb-4">
  <h2 className="font-bold mb-1">Moves:</h2>
  <ul className="flex flex-wrap gap-2">
    {pokemon.moves.map((move) => (
      <li
        key={move.move.name}
        className="bg-amber-300 text-white font-bold text-sm capitalize px-2 py-1 rounded-md hover:bg-white hover:text-black"
      >
        {move.move.name}
      </li>
    ))}
  </ul>
</div>

      </div>
    </div>
  );
}
