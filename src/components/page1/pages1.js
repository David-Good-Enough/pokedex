import React, { useEffect } from "react";
import axios from 'axios';
import './page1.css'












const Page1 = () => {
    
    const fetchPokemon = (id) => {
        axios.get(`${process.env.REACT_APP_API_POKEAPI}/pokemon/${id}`)
        .then(res => {
            const pokemon = res.data;
            this.setSate({ pokemon })
        })
    }

    const user = {
        firstName: "John",
        lastName: "Doe",
        username: "johndoe",
        password: "kittycat",
        friends: ["anna", "nina", "donna"],
      
        sayHi: () => console.log("Hi"),
      };

    // const affList = (objet) => {
    //     objet.array.forEach(element => {
            
    //     });
    // }

    const FriendsList = ({ user }) => {
        return (
            <div className="list-pokemon">
            {user.map((friend, index) => (
              <React.Fragment key={index}>
                <ul className="cadre-pokemon">
                {friend}

                </ul>
              </React.Fragment>
            ))}
          </div>
        );
      }
        
    
    
    
    
    return (
        <div className="full-page-background"></div>,
        <FriendsList user={user.friends} />

    )


}

export default Page1;