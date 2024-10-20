import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import PokemonCard from '../actionAreaCard/PokemonCard';



const Pokedex = ({ language }) => {
    const [pokemons, setPokemons] = useState([]);

    useEffect(() => {
        console.log("Language in Pokedex:", language); // Vérifie ici la valeur reçue
        fetch('/pokedex.json')
            .then((response) => response.json())
            .then((data) => {
                const transformedData = data.map((pokemon) => ({
                    id: pokemon.id,
                    name: pokemon.names?.[language] ?? pokemon.names.fr,
                    image: pokemon.image,
                    types: pokemon.types.map(type => type.charAt(0).toUpperCase() + type.slice(1)),
                    height: pokemon.height,
                    weight: pokemon.weight,
                    moves: pokemon.moves,
                }));
                setPokemons(transformedData);
            })
            .catch((error) => console.error('Erreur lors du chargement des données:', error));
    }, [language]);

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
