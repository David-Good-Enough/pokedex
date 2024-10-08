import React from 'react';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import PokemonCard from '../actionAreaCard/PokemonCard';

const pokemons = [
    {
        id: '001',
        name: 'Bulbizarre',
        image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
        types: ['Plante', 'Poison'],
    },
    {
        id: '002',
        name: 'Herbizarre',
        image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png',
        types: ['Plante', 'Poison'],
    },
    {
        id: '002',
        name: 'Herbizarre',
        image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png',
        types: ['Plante', 'Poison'],
    },
    {
        id: '002',
        name: 'Herbizarre',
        image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png',
        types: ['Plante', 'Poison'],
    },
    {
        id: '002',
        name: 'Herbizarre',
        image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png',
        types: ['Plante', 'Poison'],
    },
    
];

const Pokedex = () => {
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
