import React, { useState, useEffect } from 'react';
import FavoriteBorderIcon from "@material-ui/icons/Favorite";
import './Card.css'

import api from "./services/api";

function Card({ src, title, description, price, logged, userId, onClick, postId}) {
    const [favourite, setFavourite] = useState(false);
    const [favourites, setFavourites] = useState(null);
    const [favouriteStyle, setFavouriteStyle] = useState({}); 

    useEffect(() => {
        if (logged) {
            api.get(`account/${userId}/favourites`).then(res => {
                setFavourites(res.data);
                if (res.data && res.data.some(e => e.post_id === postId)) {
                    setFavourite(true);
                    setFavouriteStyle({
                        background: 'rgba(255,255,255,0.3)',
                        color: '#ff7779'
                    });
                }
            });
        } else setFavouriteStyle({display: 'none'})
    }, [logged, postId, userId]);

    function changeFavouriteState() {
        if(favourites){
            if(favourite) {
                setFavourite(false);
                setFavouriteStyle({
                    background: 'rgba(255,255,255,0.3)',
                    color: '#ff7779'
                });
                api.delete(`account/${userId}/favourite/${postId}`).then(res => {
                    setFavouriteStyle({
                        background: 'rgba(0,0,0,0.3)',
                        color: '#fff'
                    });
                });
            }
            else {
                setFavourite(true);
                api.put(`account/${userId}/favourite/${postId}`).then(res => {
                    setFavouriteStyle({
                        background: 'rgba(255,255,255,0.3)',
                        color: '#ff7779'
                    });
                });
            } 
        }
    }

    description = description.map(item => <span key={item}>{item}</span>)
    
    return (
        <div className='card'>
            <img src={src} alt="" />
            <FavoriteBorderIcon className="card__heart" style={favouriteStyle} onClick={
                () => changeFavouriteState()
            } />
            <div className="card__info">
                <h2 onClick={onClick}>{title}</h2>
                <div>{description}</div>
                <h3>{price} €</h3>
            </div>
        </div>
    )
}

export default Card
