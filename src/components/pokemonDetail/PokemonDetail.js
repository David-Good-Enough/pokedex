import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PokemonClient } from "pokenode-ts";

const PokemonDetail = ({ language }) => {
    const { id } = useParams();
    const [pokemon, setPokemon] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPokemon = async () => {
            try {
                const api = new PokemonClient();
                const data = await api.getPokemonById(parseInt(id, 10)); // Récupération des données du Pokémon par ID

                // Transformation des données pour inclure les traductions des noms
                const speciesData = await api.getPokemonSpeciesById(parseInt(id, 10));
                const namesByLanguage = speciesData.names.reduce((acc, name) => {
                    acc[name.language.name] = name.name;
                    return acc;
                }, {});

                setPokemon({
                    name: namesByLanguage[language] || speciesData.name,
                    image: data.sprites.front_default,
                    height: data.height,
                    weight: data.weight,
                    types: data.types.map((typeInfo) => typeInfo.type.name),
                });
            } catch (err) {
                setError("Impossible de récupérer les données du Pokémon.");
            }
        };

        fetchPokemon();
    }, [id, language]);

    if (error) {
        return <div>{error}</div>;
    }

    if (!pokemon) {
        return <div>Chargement...</div>;
    }

    return (
        <div>
            <h1>{pokemon.name}</h1>
            <img src={pokemon.image} alt={pokemon.name} />
            <p>Height: {pokemon.height}</p>
            <p>Weight: {pokemon.weight}</p>
            <p>Types: {pokemon.types.join(", ")}</p>
        </div>
    );
};

export default PokemonDetail;
