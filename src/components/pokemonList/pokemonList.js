import React from "react";
import ActionAreaCard from "../actionAreaCard/PokemonCard";

const PokemonList = ({ name }) => {
    return (
        <div className="list-pokemon">
            {name.map((pokemonName, index) => (
                <React.Fragment key={index}>
                    <ActionAreaCard friendName={pokemonName} />
                </React.Fragment>
            ))}
        </div>
    );
}

export default PokemonList;
