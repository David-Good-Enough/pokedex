import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import PokemonCard from '../actionAreaCard/PokemonCard';



const Pokedex = () => {

    const [pokemons, setPokemons] = useState([]);

    useEffect(() => {
        fetch('/pokedex.json')
            .then((response) => response.json())
            .then((data) => {
                // Transformation des données pour correspondre aux propriétés attendues par PokemonCard
                const transformedData = data.map((pokemon) => ({
                    id: pokemon.id,
                    name: pokemon.names.fr, // Utilisation du nom en français
                    image: pokemon.image,
                    types: pokemon.types.map(type => type.charAt(0).toUpperCase() + type.slice(1)), // Capitaliser les types
                    height: pokemon.height,
                    weight: pokemon.weight,
                    moves: pokemon.moves,
                }));
                setPokemons(transformedData);
            })
            .catch((error) => console.error('Erreur lors du chargement des données:', error));
    }, []);

    return (
        <Container>
            <Grid container spacing={3}>
                {pokemons.map((pokemon) => (
                    <PokemonCard key={pokemon.id} pokemon={pokemon} />
                ))}
            </Grid>
        </Container>
    );
};

export default Pokedex;
