import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const typeColors = {
    Grass: 'green',
    Poison: 'purple',
    Fire: 'red',
    Water: 'blue',
    Electric: 'yellow',
    Psychic: 'pink',
    Ice: 'lightblue',
    Dragon: 'orange',
    Dark: 'black',
    Fairy: 'lightpink',
    Normal: 'gray',
    Fighting: 'brown',
    Flying: 'skyblue',
    Bug: 'limegreen',
    Rock: 'darkgoldenrod',
    Ghost: 'indigo',
    Steel: 'slategray',
    Ground: 'saddlebrown'
};

const getTypeColor = (type) => typeColors[type] || 'gray';

const PokemonCard = ({ pokemon }) => {
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/pokemon/${pokemon.id}`);
    };

    return (
        <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card 
                sx={{ maxWidth: 345, cursor: 'pointer' }}
                onClick={handleCardClick}
            >
                <CardMedia
                    component="img"
                    image={pokemon.image}
                    alt={pokemon.name}
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {pokemon.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        No.{pokemon.id}
                    </Typography>
                    <div>
                        {pokemon.types.map((type) => (
                            <Chip 
                                key={type}
                                label={type} 
                                style={{ 
                                    backgroundColor: getTypeColor(type), 
                                    color: 'white', 
                                    margin: '5px' 
                                }} 
                            />
                        ))}
                    </div>
                </CardContent>
            </Card>
        </Grid>
    );
};

export default PokemonCard;
