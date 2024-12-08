import React, { useState, useEffect, useRef, useCallback } from 'react';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import { PokemonClient } from 'pokenode-ts';
import PokemonCard from '../actionAreaCard/PokemonCard';

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
    const [offset, setOffset] = useState(0); // Début de la pagination
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasMore, setHasMore] = useState(true); // Contrôle s'il reste des Pokémon à charger
    const observer = useRef(null); // Référence pour l'observateur
    const loadingRef = useRef(false); // Drapeau temporaire pour empêcher les appels multiples
    const LIMIT = 20; // Nombre de Pokémon par page

    // Cache des données des Pokémon
    const pokemonCache = useRef(new Map());

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

            // Vérifier le cache avant de faire une requête
            const pokemonDetails = await Promise.all(
                pokemonList.results.map(async (pokemon) => {
                    if (pokemonCache.current.has(pokemon.name)) {
                        // Utiliser les données en cache
                        return pokemonCache.current.get(pokemon.name);
                    } else {
                        // Récupérer les données si elles ne sont pas en cache
                        const speciesData = await api.getPokemonSpeciesByName(pokemon.name);
                        const pokemonData = await api.getPokemonByName(pokemon.name);

                        const pokemonDetail = {
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

                        // Mettre à jour le cache
                        pokemonCache.current.set(pokemon.name, pokemonDetail);

                        return pokemonDetail;
                    }
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

    useEffect(() => {
        const sentinel = document.querySelector('#sentinel');

        if (!sentinel) return;

        const observerInstance = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !loadingRef.current) {
                    fetchPokemons();
                }
            },
            { threshold: 1.0 }
        );

        observerInstance.observe(sentinel);
        observer.current = observerInstance;

        return () => {
            if (observer.current) {
                observer.current.disconnect();
            }
        };
    }, [fetchPokemons]);

    if (error) {
        return <div style={{ color: 'red' }}>{error}</div>;
    }

    return (
        <Container>
            <Grid container spacing={3}>
                {pokemons.map((pokemon) => (
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
