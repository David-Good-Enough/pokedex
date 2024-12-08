import React, { useState, useEffect, useRef, useCallback } from 'react';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import { PokemonClient } from 'pokenode-ts';
import PokemonCard from '../actionAreaCard/PokemonCard';
import SearchBar from '../SearchBar/SearchBar';

// Couleurs associées aux types Pokémon
const TYPE_COLORS = {
    grass: '#78C850',
    poison: '#A040A0',
    fire: '#F08030',
    water: '#6890F0',
    electric: '#F8D030',
    psychic: '#F85888',
    ice: '#98D8D8',
    dragon: '#7038F8',
    dark: '#705848',
    fairy: '#EE99AC',
    normal: '#A8A878',
    fighting: '#C03028',
    flying: '#A890F0',
    bug: '#A8B820',
    rock: '#B8A038',
    ghost: '#705898',
    steel: '#B8B8D0',
    ground: '#E0C068',
};

const Pokedex = ({ language }) => {
    const [pokemons, setPokemons] = useState([]);
    const [offset, setOffset] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const [filteredPokemon, setFilteredPokemon] = useState(null);

    const observer = useRef(null);
    const loadingRef = useRef(false);
    const LIMIT = 20;

    const fetchPokemons = useCallback(async (reset = false) => {
        if (loadingRef.current || !hasMore) return;
        loadingRef.current = true;

        const api = new PokemonClient();
        setIsLoading(true);
        setError(null);

        try {
            const pokemonList = await api.listPokemonSpecies(reset ? 0 : offset, LIMIT);

            if (pokemonList.results.length === 0) {
                setHasMore(false);
                return;
            }

            const pokemonDetails = await Promise.all(
                pokemonList.results.map(async (pokemon) => {
                    const speciesData = await api.getPokemonSpeciesByName(pokemon.name);
                    const pokemonData = await api.getPokemonByName(pokemon.name);

                    return {
                        id: speciesData.id,
                        name:
                            speciesData.names.find((n) => n.language.name === language)?.name ||
                            speciesData.name,
                        image: pokemonData.sprites.front_default,
                        types: pokemonData.types.map((type) => ({
                            name: type.type.name,
                            color: TYPE_COLORS[type.type.name] || '#A8A8A8',
                        })),
                        stats: pokemonData.stats.map((stat) => ({
                            name: stat.stat.name,
                            baseStat: stat.base_stat,
                        })),
                    };
                })
            );

            if (reset) {
                setPokemons(pokemonDetails);
                setOffset(LIMIT);
                setHasMore(true);
            } else {
                setPokemons((prev) => [...prev, ...pokemonDetails]);
                setOffset((prev) => prev + LIMIT);
            }
        } catch (err) {
            console.error('Erreur lors du chargement des Pokémon :', err);
            setError('Impossible de charger les Pokémon.');
        } finally {
            loadingRef.current = false;
            setIsLoading(false);
        }
    }, [offset, language, hasMore]);

    useEffect(() => {
        fetchPokemons(true);
    }, [language, fetchPokemons]);

    const handleSearchResult = (pokemon) => {
        setFilteredPokemon(pokemon); // Affiche uniquement le Pokémon recherché
    };

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <Container>
            {/* Barre de recherche */}
            <SearchBar language={language} onSearchResult={handleSearchResult} />

            {/* Liste des Pokémon */}
            <Grid container spacing={3}>
                {(filteredPokemon ? [filteredPokemon] : pokemons).map((pokemon) => (
                    <PokemonCard key={pokemon.id} pokemon={pokemon} />
                ))}
            </Grid>

            {isLoading && <div>Chargement des Pokémon...</div>}
            {!hasMore && <div>Fin de la liste des Pokémon.</div>}
            <div id="sentinel" style={{ height: '20px', marginBottom: '20px' }}></div>
        </Container>
    );
};

export default Pokedex;
