import React from "react";
import { Link } from 'react-router-dom';
import { Select, MenuItem, FormControl, Box } from '@mui/material';
import Logo from './logo.png'

const Header = ({ selectedLanguage, onLanguageChange }) => {
    return (
        <Box 
            component="nav" 
            display="flex" 
            justifyContent="space-between" 
            alignItems="center" 
            p={2}
        >
            <Link to="/" style={{ display: 'inline-block', maxWidth: '15%', maxHeight: '15%' }}>
                <Box
                    component="img"
                    src={Logo}
                    alt="pokedexID"
                    sx={{
                        height: '100%',
                        width: '100%',
                    }}
                />
            </Link>
            <FormControl 
                variant="outlined" 
                size="small" 
                sx={{ minWidth: 150 }}
            >
                <Select
                    value={selectedLanguage}
                    onChange={(e) => onLanguageChange(e.target.value)}
                    displayEmpty
                    sx={{
                        backgroundColor: 'white',
                        minHeight: 40,
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'lightblue',
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'transparent',
                        },
                    }}
                >
                    <MenuItem value="fr">Français</MenuItem>
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="es">Español</MenuItem>
                    <MenuItem value="de">Deutsch</MenuItem>
                    <MenuItem value="it">Italiano</MenuItem>
                    <MenuItem value="ja">日本語</MenuItem>
                    <MenuItem value="ko">한국어</MenuItem>
                    <MenuItem value="zh-Hans">简体中文</MenuItem>
                    <MenuItem value="zh-Hant">繁體中文</MenuItem>
                </Select>
            </FormControl>
        </Box>
    );
}

export default Header;