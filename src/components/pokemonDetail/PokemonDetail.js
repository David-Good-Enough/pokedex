import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const PokemonDetail = ({ language }) => {
    const { id } = useParams();
    const [pokemon, setPokemon] = useState(null);

    useEffect(() => {
        fetch(`/pokedex.json`)
            .then((response) => response.json())
            .then((data) => {
                const foundPokemon = data.find((poke) => poke.id === parseInt(id, 10));
                setPokemon(foundPokemon);
            });
    }, [id]);

    if (!pokemon) {
        return <div>Chargement...</div>;
    }

    const name = pokemon.names?.[language] || "Nom indisponible";

    return (
        <div>
            <h1>{name}</h1>
            <img src={pokemon.image} alt={name} />
            <p>Height: {pokemon.height}</p>
            <p>Weight: {pokemon.weight}</p>
            <p>Types: {pokemon.types.join(", ")}</p>
        </div>
    );
};

export default PokemonDetail;
