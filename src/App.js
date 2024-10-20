import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/header/header';
import Page1 from './components/page1/page1';
import PokemonDetail from './components/pokemonDetail/PokemonDetail';

function App() {
  const [language, setLanguage] = useState('fr');

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
};



  return (
    <Router>
        <div style={{ backgroundColor: 'rgb(66, 71, 94)'}}>
        <Header selectedLanguage={language} onLanguageChange={handleLanguageChange} />
        <Routes>
          <Route path="/" element={<Page1 language={language} />} />
          <Route path="/pokemon/:id" element={<PokemonDetail language={language} />} />


        
          </Routes>  
      </div>
    
    
    
    
    </Router>
  );
}

export default App;
