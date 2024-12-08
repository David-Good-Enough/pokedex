import React, { useState } from 'react';
import { TextField, Button, CircularProgress, Box } from '@mui/material';
import { PokemonClient } from 'pokenode-ts';

const SearchBar = ({ language, onSearchResult }) => {
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = async () => {
        if (!query) return;

        setIsLoading(true);
        setError(null);

        const api = new PokemonClient();

        try {
            const pokemonData = await api.getPokemonByName(query.toLowerCase());
            const speciesData = await api.getPokemonSpeciesByName(query.toLowerCase());

            const pokemon = {
                id: pokemonData.id,
                name:
                    speciesData.names.find((n) => n.language.name === language)?.name ||
                    speciesData.name,
                image: pokemonData.sprites.front_default,
                types: pokemonData.types.map((type) => ({
                    name: type.type.name,
                })),
                stats: pokemonData.stats.map((stat) => ({
                    name: stat.stat.name,
                    baseStat: stat.base_stat,
                })),
            };

            onSearchResult(pokemon);
        } catch (err) {
            console.error('Erreur lors de la recherche :', err);
            setError('Aucun Pokémon trouvé.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box display="flex" gap={2} alignItems="center" sx={{ marginBottom: 4 }}>
            <TextField
                label="Rechercher un Pokémon"
                variant="outlined"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                sx={{ width: '300px' }}
            />
            <Button
                variant="contained"
                onClick={handleSearch}
                disabled={isLoading || !query}
            >
                {isLoading ? <CircularProgress size={24} /> : 'Rechercher'}
            </Button>
            {error && <Box color="red">{error}</Box>}
        </Box>
    );
};

export default SearchBar;
