import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import Banner from './Banner'
import Card from './Card'
import './Home.css';

import { getUser, isAuthenticated } from "./services/auth";
import api from "./services/api";

function shuffleArray(array) {
    let i = array.length - 1;
    for (; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
}

function Home() {
    const [posts, setPosts] = useState([]);
    const logged = isAuthenticated();
    const userId = getUser();

    useEffect(() => {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        api.get(`posts/`).then(async res => {
            let shuffled = shuffleArray(res.data);
            let indexesToRemove = [];
            
            // eslint-disable-next-line
            await shuffled.map((i, index) => {
                if (!shuffled[index].is_active || !shuffled[index].is_featured) {
                    indexesToRemove.push(shuffled[index]);
                }
            });
            
            shuffled = shuffled.filter(index => { 
                return indexesToRemove.indexOf(index) < 0;
              });

            let selected = shuffled.slice(0, 8);

            setPosts(selected);
        });
    }, [logged, userId]);
    const history = useHistory();

    const month = ["January", "February", "March","April", "May", "June",
     "July", "August", "September", "October", "November", "December"];

    return (
        <div className='home'>
            <Banner />

            <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>

            <ins className="adsbygoogle"
                style={{display: 'block'}}
                data-ad-client="ca-pub-6446260371759079"
                data-ad-slot="2901378742"
                data-ad-format="auto"
                data-full-width-responsive="true"></ins>
            <script>
                (adsbygoogle = window.adsbygoogle || []).push({});
            </script>

            <h1 className='title'>Featured</h1>
            
            <div className='home__section'>
                {posts.map((i, index) => (
                    <Card
                        src= {`${process.env.REACT_APP_API_URL || (window.location.href.slice(0, -1) + ':8000')}/files/${posts[index].postImages[0].image}`}
                        title={`${posts[index].model.brand.name} ${posts[index].model.name} ${posts[index].model.engine_size}`}
                        description= {[
                            `${posts[index].odometer.toLocaleString('fr')} km`,
                             `
                                ${new Date(posts[index].registration_date).getDate()}
                                ${month[new Date(posts[index].registration_date).getMonth()]}
                                ${new Date(posts[index].registration_date).getFullYear()}
                             `,
                             `${posts[index].model.kilowhatts} kw`]}
                        price={posts[index].price}
                        logged= {logged}
                        userId = {userId}
                        postId= {posts[index].id}
                        onClick={() => history.push(`/post?id=${posts[index].id}`)}
                        key={posts[index].id}
                    />
                ))}
            </div>
        </div>
    )
}

export default Home
