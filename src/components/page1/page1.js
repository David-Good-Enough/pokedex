import React from 'react';
import Pokedex from '../Pokedex/Pokedex';

const Page1 = ({ language }) => {
  return (
    <div className="full-page-background">
      <Pokedex language={language} />
    </div>
  );
};

export default Page1;
