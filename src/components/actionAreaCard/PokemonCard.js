import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { Chip } from '@mui/material';

const PokemonCard = ({ pokemon }) => {
    return (
        <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card sx={{ maxWidth: 345 }}>
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
                            <Chip label={type} style={{ margin: '5px' }} />
                        ))}
                    </div>
                </CardContent>
            </Card>
        </Grid>
    );
};

export default PokemonCard;
