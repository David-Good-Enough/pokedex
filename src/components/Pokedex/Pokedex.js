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
    const observer = useRef(null); // Référence pour l'observer
    const loadingRef = useRef(false); // Drapeau temporaire pour empêcher les appels multiples
    const LIMIT = 20; // Nombre de Pokémon par page

    // Fonction pour charger un lot de Pokémon
    const fetchPokemons = useCallback(async (reset = false) => {
        if (loadingRef.current || !hasMore) return; // Bloque si déjà en cours ou plus de données
        loadingRef.current = true; // Active le drapeau

        const api = new PokemonClient();
        setIsLoading(true);
        setError(null);

        try {
            // Récupérer un lot de Pokémon
            const pokemonList = await api.listPokemonSpecies(reset ? 0 : offset, LIMIT);

            // Si aucun résultat n'est retourné, arrêter le chargement
            if (pokemonList.results.length === 0) {
                setHasMore(false);
                return;
            }

            // Récupérer les détails pour chaque Pokémon
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
                        types: await Promise.all(
                            pokemonData.types.map(async (type) => {
                                const typeData = await api.getTypeByName(type.type.name);
                                const translatedName =
                                    typeData.names.find((n) => n.language.name === language)
                                        ?.name || type.type.name;
                                return {
                                    englishName: type.type.name,
                                    translatedName,
                                    color: TYPE_COLORS[type.type.name] || '#A8A8A8',
                                };
                            })
                        ),
                        height: pokemonData.height,
                        weight: pokemonData.weight,
                    };
                })
            );

            // Si on recharge toute la liste (après changement de langue)
            if (reset) {
                setPokemons(pokemonDetails);
                setOffset(LIMIT);
                setHasMore(true);
            } else {
                setPokemons((prev) => [...prev, ...pokemonDetails]); // Ajoute les nouveaux Pokémon
                setOffset((prev) => prev + LIMIT); // Augmente l'offset pour le prochain lot
            }
        } catch (err) {
            console.error('Erreur lors du chargement des données :', err);
            setError('Impossible de charger les données.');
        } finally {
            setTimeout(() => {
                loadingRef.current = false; // Libère le drapeau
            }, 300);
            setIsLoading(false);
        }
    }, [offset, language, hasMore]);

    // Recharger la liste lors du changement de langue
    useEffect(() => {
        fetchPokemons(true); // Réinitialise les données avec `reset=true`
    }, [language, fetchPokemons]);

    // Initialiser l'observer d'intersection
    useEffect(() => {
        const sentinel = document.querySelector('#sentinel');

        if (!sentinel) return;

        observer.current = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    fetchPokemons();
                }
            },
            { threshold: 1.0 }
        );

        observer.current.observe(sentinel);

        return () => {
            if (observer.current) observer.current.disconnect();
        };
    }, [fetchPokemons]);

    if (error) {
        return <div>{error}</div>;
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
            {/* Sentinelle pour déclencher le chargement suivant */}
            <div id="sentinel" style={{ height: '20px', marginBottom: '20px' }}></div>
        </Container>
    );
};

export default Pokedex;
