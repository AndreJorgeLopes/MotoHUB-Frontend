import React, { useEffect, useState } from 'react';
import api from "./services/api";
import "./PostPage.css";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import LocationOnIcon from '@material-ui/icons/LocationOn';
import { getUser, isAuthenticated } from "./services/auth";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import { useHistory } from "react-router-dom";

function PostPage() { 
    const postId = new URLSearchParams(window.location.search).get('id');
    const [post, setPost] = useState({
        id: 0,
        odometer: 0,
        price: 0,
        registration_date: "0000-00-00",
        creation_date: "0000-00-00",
        last_renewed_on: "0000-00-00",
        description: "",
        is_active: false,
        is_featured: false,
        is_price_negotiable: false,
        account_id: 0,
        model_id: 0,
        user: {
          id: 0,
          permission_level: 0,
          email: "",
          password: "",
          first_name: "",
          last_name: "",
          phone_number: "",
          avatar: null,
          banned: false,
          city_id: 0,
          city: {
            id: 0,
            name: "",
            region_id: 0,
            region: {
              id: 0,
              name: "",
              country_id: 0,
              country: {
                id: 0,
                name: ""
              }
            }
          }
        },
        model: {
          id: 0,
          name: "",
          engine_size: 0,
          kilowhatts: 0,
          brand_id: 0,
          brand: {
            id: 0,
            name: ""
          }
        },
        postImages: []
    });
    const [images, setImages] = useState([]);
    const [favouriteStyle, setFavouriteStyle] = useState({}); 
    const [favourites, setFavourites] = useState(null);
    const [favourite, setFavourite] = useState(false);
    const userId = getUser();
    const history = useHistory();

    const month = ["January", "February", "March","April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

    useEffect(() => {
        api.get(`post/${postId}`).then(res => {
            if(!res.data){
                history.push('/404');
            }
            let images = [];
            setPost(res.data);

            res.data.postImages.forEach(image => {
                images.push(
                    <div style={{maxHeight:'500px'}} key={image.id}>
                        <img 
                            src={`http://${window.location.hostname}:8000/files/${image.image}`} 
                            alt=''
                            />
                    </div>
                );
            });
            setImages(images);

            if (isAuthenticated()) {
                api.get(`account/${userId}/favourite/${postId}`).then(res => {
                    setFavourites(res.data);
                    if (res.data) {
                        setFavourite(true);
                        setFavouriteStyle({ color: '#ff7779' });
                    }
                });
            } else setFavouriteStyle({display: 'none'})
        });
    // eslint-disable-next-line
    }, []);

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
        <div className="item">
          <div className="inner">
            <h1>{`${post.model.brand.name} ${post.model.name} ${post.model.engine_size}`}</h1>
            <div className="item__price">   
              <i style={{ color: "black", textDecoration: "none" }}>{post.price} € </i>
            </div>
            <FavoriteBorderIcon className="item__heart" style={favouriteStyle} onClick={
                () => changeFavouriteState()
            }/>
            <Carousel>
                {images}
            </Carousel>
            <h4>{`${post.odometer.toLocaleString('fr')} km  · 
                                ${new Date(post.registration_date).getDate()}
                                ${month[new Date(post.registration_date).getMonth()]}
                                ${new Date(post.registration_date).getFullYear()}
                                · ${post.model.kilowhatts} kw`}</h4>
            <hr />
            <h3>{post.description}</h3>
            <h3>{post.user.phone_number}</h3>
            <hr />
            <h2 style={{ padding: "0 0 25px 0" }}>Location</h2>
            <div className="item__Location">
                <LocationOnIcon style={{ color: "#ca3433"}}/>
                <h3 style={{ textDecoration: "none" }}>
                    {`${post.user.city.name} (${post.user.city.region.name})`}
                </h3>
            </div> 
          </div>
        </div>
      </div>
    );  
}

export default PostPage;