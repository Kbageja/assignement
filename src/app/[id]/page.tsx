"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
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
  const { id } = useParams();
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
        setPokemon(res.data);
      } catch (err) {
        console.log(err);
        setError("Failed to fetch Pokémon details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPokemon();
  }, [id]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!pokemon) return <div className="p-8">Pokémon not found</div>;

  return (
    <div className="p-4 min-h-screen bg-gradient-to-br from-amber-500 via-white to-emerald-300">
      <div className="max-w-md mx-auto bg-gradient-to-br from-black via-black to-purple-500 p-6 rounded-lg shadow-lg text-white">
        <h1 className="text-2xl font-bold capitalize mb-4">{pokemon.name}</h1>
        <div className="flex justify-center mb-4">
          <img
            src={pokemon.sprites.front_default}
            alt={pokemon.name}
            width={128}
            height={128}
            className="h-32 w-32"
          />
        </div>

        <div className="mb-4">
          <h2 className="font-bold mb-2">Types:</h2>
          <div className="flex gap-2">
            {pokemon.types.map(({ type }) => (
              <span key={type.name} className="bg-white text-black px-2 py-1 rounded capitalize">
                {type.name}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <h2 className="font-bold mb-2">Abilities:</h2>
          <ul className="list-disc pl-5">
            {pokemon.abilities.slice(0, 4).map(({ ability }) => (
              <li key={ability.name} className="capitalize">
                {ability.name.replace("-", " ")}
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-4">
          <h2 className="font-bold mb-2">Stats:</h2>
          {pokemon.stats.map(({ base_stat, stat }) => (
            <div key={stat.name} className="flex justify-between text-sm capitalize">
              <span>{stat.name}</span>
              <span className="font-bold">{base_stat}</span>
            </div>
          ))}
        </div>

        <div className="mb-4">
          <h2 className="font-bold mb-2">Moves (First 10):</h2>
          <ul className="flex flex-wrap gap-2">
            {pokemon.moves.slice(0, 10).map(({ move }) => (
              <li
                key={move.name}
                className="bg-amber-300 text-white font-bold text-sm capitalize px-2 py-1 rounded-md hover:bg-white hover:text-black"
              >
                {move.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
