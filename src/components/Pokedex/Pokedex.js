import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PokemonClient, UtilityClient } from "pokenode-ts";
import { Card, CardContent, Typography, Chip, Box, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

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
                const pokemonApi = new PokemonClient();
                const utilityApi = new UtilityClient();

                // Récupérer les données du Pokémon
                const data = await pokemonApi.getPokemonById(parseInt(id, 10));
                const speciesData = await pokemonApi.getPokemonSpeciesById(parseInt(id, 10));

                // Traduire le nom en fonction de la langue
                const namesByLanguage = speciesData.names.reduce((acc, name) => {
                    acc[name.language.name] = name.name;
                    return acc;
                }, {});

                // Traduire les types en fonction de la langue
                const translatedTypes = await Promise.all(
                    data.types.map(async (typeInfo) => {
                        try {
                            const typeData = await utilityApi.getTypeByName(typeInfo.type.name);
                            const translatedType =
                                typeData.names.find((n) => n.language.name === language)?.name ||
                                typeData.names.find((n) => n.language.name === "en")?.name ||
                                typeInfo.type.name;

                            return {
                                name: translatedType,
                                color: TYPE_COLORS[typeInfo.type.name] || "#A8A8A8",
                            };
                        } catch {
                            return {
                                name: typeInfo.type.name,
                                color: TYPE_COLORS[typeInfo.type.name] || "#A8A8A8",
                            };
                        }
                    })
                );

                // Récupérer les attaques (moves)
                const translatedMoves = await Promise.all(
                    data.moves.slice(0, 10).map(async (moveInfo) => {
                        try {
                            const moveData = await pokemonApi.getMoveByName(moveInfo.move.name);
                            const translatedMove =
                                moveData.names.find((n) => n.language.name === language)?.name ||
                                moveData.names.find((n) => n.language.name === "en")?.name ||
                                moveInfo.move.name;

                            return {
                                name: translatedMove,
                                power: moveData.power || "N/A",
                                type: moveData.type.name,
                                accuracy: moveData.accuracy || "N/A",
                            };
                        } catch {
                            return {
                                name: moveInfo.move.name,
                                power: "N/A",
                                type: "unknown",
                                accuracy: "N/A",
                            };
                        }
                    })
                );

                setPokemon({
                    name: namesByLanguage[language] || speciesData.name,
                    image: data.sprites.other["official-artwork"].front_default || data.sprites.front_default,
                    height: data.height,
                    weight: data.weight,
                    types: translatedTypes,
                    moves: translatedMoves,
                });
            } catch (err) {
                console.error("Erreur lors de la récupération des données :", err);
                setError("Impossible de récupérer les données du Pokémon.");
            }
        };

        fetchPokemon();
    }, [id, language]);

    if (error) {
        return <div style={{ color: "red", textAlign: "center" }}>{error}</div>;
    }

    if (!pokemon) {
        return <div style={{ textAlign: "center" }}>Chargement...</div>;
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
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", marginBottom: 2 }}>
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
                    <Typography variant="body1" component="p" sx={{ marginBottom: 1 }}>
                        <strong>Moves:</strong>
                    </Typography>
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>Show Moves</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <ul>
                                {pokemon.moves.map((move) => (
                                    <li key={move.name}>
                                        <strong>{move.name}</strong> - Type: {move.type}, Power: {move.power}, Accuracy: {move.accuracy}
                                    </li>
                                ))}
                            </ul>
                        </AccordionDetails>
                    </Accordion>
                </CardContent>
            </Card>
        </Box>
    );
};

export default PokemonDetail;
