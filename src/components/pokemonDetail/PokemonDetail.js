import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PokemonClient } from "pokenode-ts";
import { Card, CardContent, Typography, Chip, Box } from "@mui/material";

const TYPE_COLORS = {
    grass: "#78C850",
    poison: "#A040A0",
    fire: "#F08030",
    water: "#6890F0",
    electric: "#F8D030",
    psychic: "#F85888",
    ice: "#98D8D8",
    dragon: "#7038F8",
    dark: "#705848",
    fairy: "#EE99AC",
    normal: "#A8A878",
    fighting: "#C03028",
    flying: "#A890F0",
    bug: "#A8B820",
    rock: "#B8A038",
    ghost: "#705898",
    steel: "#B8B8D0",
    ground: "#E0C068",
};

const PokemonDetail = ({ language }) => {
    const { id } = useParams();
    const [pokemon, setPokemon] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPokemon = async () => {
            try {
                const api = new PokemonClient();
                const data = await api.getPokemonById(parseInt(id, 10));
                const speciesData = await api.getPokemonSpeciesById(parseInt(id, 10));

                const namesByLanguage = speciesData.names.reduce((acc, name) => {
                    acc[name.language.name] = name.name;
                    return acc;
                }, {});

                setPokemon({
                    name: namesByLanguage[language] || speciesData.name,
                    image: data.sprites.other["official-artwork"].front_default || data.sprites.front_default,
                    height: data.height,
                    weight: data.weight,
                    types: data.types.map((typeInfo) => ({
                        name: typeInfo.type.name,
                        color: TYPE_COLORS[typeInfo.type.name] || "#A8A8A8",
                    })),
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
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                backgroundColor: "rgb(66, 71, 94)",
                padding: 2,
            }}
        >
            <Card
                sx={{
                    maxWidth: 400,
                    backgroundColor: "#f4f4f4",
                    borderRadius: "16px",
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                }}
            >
                <CardContent>
                    <Typography
                        variant="h4"
                        component="div"
                        sx={{ textAlign: "center", marginBottom: 2, fontWeight: "bold" }}
                    >
                        {pokemon.name}
                    </Typography>
                    <Box sx={{ display: "flex", justifyContent: "center", marginBottom: 2 }}>
                        <img
                            src={pokemon.image}
                            alt={pokemon.name}
                            style={{
                                width: "200px",
                                height: "200px",
                                objectFit: "contain",
                            }}
                        />
                    </Box>
                    <Typography variant="body1" component="p" sx={{ marginBottom: 1 }}>
                        <strong>Height:</strong> {pokemon.height}
                    </Typography>
                    <Typography variant="body1" component="p" sx={{ marginBottom: 1 }}>
                        <strong>Weight:</strong> {pokemon.weight}
                    </Typography>
                    <Typography variant="body1" component="p" sx={{ marginBottom: 1 }}>
                        <strong>Types:</strong>
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                        {pokemon.types.map((type) => (
                            <Chip
                                key={type.name}
                                label={type.name.charAt(0).toUpperCase() + type.name.slice(1)}
                                sx={{
                                    backgroundColor: type.color,
                                    color: "white",
                                    fontWeight: "bold",
                                }}
                            />
                        ))}
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default PokemonDetail;
