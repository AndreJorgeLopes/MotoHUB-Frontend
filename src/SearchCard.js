import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import LocationOnIcon from '@material-ui/icons/LocationOn';
import { getUser, isAuthenticated } from "./services/auth";
import api from "./services/api";
import './SearchCard.css';

function SearchCard({image, description, title, info, location, price, negotiable, postId}) {
    const [favouriteStyle, setFavouriteStyle] = useState({}); 
    const [favourites, setFavourites] = useState(null);
    const [favourite, setFavourite] = useState(false);
    const history = useHistory();
    const userId = getUser();

    useEffect(() => {
        if (isAuthenticated()) {
            api.get(`account/${userId}/favourites`).then(res => {
                setFavourites(res.data);
                if (res.data && res.data.some(e => e.post_id === postId)) {
                    setFavourite(true);
                    setFavouriteStyle({ color: '#ff7779' });
                }
            });
        } else setFavouriteStyle({display: 'none'})
    }, [postId, userId]);

    function changeFavouriteState() {
        if(favourites){
            if(favourite) {
                setFavourite(false);
                api.delete(`account/${userId}/favourite/${postId}`).then(res => {
                    setFavouriteStyle({ color: '#000' });
                });
            }
            else {
                setFavourite(true);
                api.put(`account/${userId}/favourite/${postId}`).then(res => {
                    setFavouriteStyle({ color: '#ff7779' });
                });
            } 
        }
    }

    return (
         <div>
            <div className='SearchCardMobile'>
                <div className="SearchCardMobile__image">
                    <img src={image} alt=''/>
                </div>
                <div className="SearchCardMobile__body">
                    <div className="SearchCardMobile__infoTop">
                        <p>{description}</p>
                        <FavoriteBorderIcon style={favouriteStyle} onClick={
                            () => changeFavouriteState()
                        }/>
                    </div>
                    <h3 target="_new" onClick={() => history.push(`/post?id=${postId}`)}>{title}</h3>
                    <p>{info}</p>
                    <div className="SearchCardMobile__infoBottom">
                        <div className="SearchCard__Locations">
                            <LocationOnIcon className="SearchCard__Location" />
                            <p>
                                <strong>{location}</strong>
                            </p>
                        </div>
                        <div className='SearchCards__price'>
                            <h2>{price}</h2>
                            <p>{negotiable}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className='SearchCard'>
                <img src={image} alt=''/>
                <FavoriteBorderIcon className="SearchCard__heart" style={favouriteStyle} onClick={
                    () => changeFavouriteState()
                }/>

                <div className='SearchCard__info'>
                    <div className="SearchCard__infoTop">
                        <p>{description}</p>
                        <h3 target="_new" onClick={() => history.push(`/post?id=${postId}`)}>{title}</h3>
                        <p>____</p>
                        <p>{info}</p>
                    </div>

                    <div className="SearchCard__infoBottom">
                        <div className="SearchCard__Locations">
                            <LocationOnIcon className="SearchCard__Location" />
                            <p>
                                <strong>{location}</strong>
                            </p>
                        </div>
                        <div className='SearchCards__price'>
                            <h2>{price}</h2>
                            <p>{negotiable}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SearchCard
