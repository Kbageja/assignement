'use client';
import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import axios from 'axios';
import { useRouter } from 'next/navigation';

// Define TypeScript interfaces
interface Pokemon {
  name: string;
  url: string;
}

interface PokemonResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Pokemon[];
}

export default function Page() {
  const [pokemonData, setPokemonData] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get<PokemonResponse>('https://pokeapi.co/api/v2/pokemon?limit=30&offset=0');
        console.log(response);
        setPokemonData(response.data.results);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch Pokémon data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPokemon();
  }, []);

  const handleCardClick = (url: string) => {
    const id = url.split('/').filter(Boolean).pop();
    router.push(`/${id}`);
  };

  const filteredPokemon = pokemonData.filter(pokemon => 
    pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className='min-h-screen w-full bg-gradient-to-br from-emerald-300 via-white to-cyan-300'>
      <header>
        <div className='flex justify-center gap-6 items-center px-8 py-4'>
          {/* Search Bar */}
          <div className='relative flex justify-center w-96'>
            <input
              type='search'
              placeholder='Search Pokémon'
              className='w-full pl-10 pr-4 py-2 rounded-full border bg-white border-black-400 focus:outline-none focus:ring-1 focus:ring-blue-500'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'>
              <Search size={20} />
            </div>
          </div>
        </div>
      </header>

      <main className='container mx-auto px-4 py-8'>
        {isLoading ? (
          <div className='flex justify-center items-center h-64'>
            <p className='text-lg font-medium'>Loading Pokémon...</p>
          </div>
        ) : error ? (
          <div className='flex justify-center items-center h-64'>
            <p className='text-lg font-medium text-red-500'>{error}</p>
          </div>
        ) : (
          <div className='flex flex-wrap gap-4 justify-center'>
            {filteredPokemon.map((pokemon) => {
              const pokemonId = pokemon.url.split('/').filter(Boolean).pop();
              return (
                <Card 
                  key={pokemon.name} 
                  className='w-64 bg-black text-white cursor-pointer hover:shadow-lg transition-shadow duration-300'
                  onClick={() => handleCardClick(pokemon.url)}
                >
                  <CardContent className='pt-6 pb-2'>
                    <div className='h-24 flex items-center justify-center'>
                      <img 
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`}
                        alt={pokemon.name}
                        className='h-40 w-40'
                      />
                    </div>
                  </CardContent>
                  <CardFooter className='flex justify-center pb-6'>
                    <p className='text-lg font-medium'>{pokemon.name}</p>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}

        {filteredPokemon.length === 0 && !isLoading && !error && (
          <div className='flex justify-center items-center h-64'>
            <p className='text-lg font-medium'>No Pokémon found matching '{searchQuery}'</p>
          </div>
        )}
      </main>
    </div>
  );
}
