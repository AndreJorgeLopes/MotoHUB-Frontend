import React, { useEffect, useState } from 'react';
import api from "./services/api";
import qs from 'qs';
import './SearchPage.css';
import SearchCard from "./SearchCard";
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

function SearchPage() {
    const query = qs.parse(window.location.href);
    delete query[Object.keys(query)[0]];

    const options = [
        { value: 0, label: 'Time: newly listed' },
        { value: 1, label: 'Time: ending soonest' },
        { value: 2, label: 'Price: Low to High' },
        { value: 3, label: 'Price: High to Low' }
      ];

    const [posts, setPosts] = useState([]); 
    const [postsElements, setPostsElements] = useState([]); 
    const [selectedOption, setSelectedOption] = useState(options[0]); 

    const month = ["January", "February", "March","April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

    useEffect(() => {
        const postsComponents = [];
        api.get(`posts/`).then(async res => {
            await res.data.forEach((post, index) => {
                Object.entries(query).forEach(
                    ([key, value]) => {
                        if(!post.is_active){
                            delete res.data[index];
                        }
                        else if(key === 'city') {
                            if(post.user.city.name !== value){
                                delete res.data[index];
                            }
                        } else if(key === 'region') {
                            if(post.user.city.region.name !== value){
                                delete res.data[index];
                            }
                        } else if(key === 'country') {
                            if(post.user.city.region.country.name !== value){
                                delete res.data[index];
                            }
                        } else if(key === 'model') {
                            if(`${post.model.name} ${post.model.engine_size}` !== value){
                                delete res.data[index];
                            }
                        } else if(key === 'brand') {
                            if(post.model.brand.name !== value){
                                delete res.data[index];
                            }
                        } else{
                            if(key === 'year'){
                                const year = new Date(post.registration_date).getFullYear();
                                post[key] = year;
                            } else if(key === 'month'){
                                const month = new Date(post.registration_date).getMonth()+1;
                                post[key] = month;
                            }
                            if(typeof value === 'string'){
                                if(post[key] !== Number(value.replace(/\D/g,''))){
                                    delete res.data[index];
                                }
                            } else {
                                if(value[0] === 'undefined'){
                                    if(post[key] > Number(value[1].replace(/\D/g,''))){
                                        delete res.data[index];
                                    }
                                } else if(value[1] === 'undefined'){
                                    if(post[key] < Number(value[0].replace(/\D/g,''))){
                                        delete res.data[index];
                                    }
                                } else {
                                    if(post[key] < Number(value[0].replace(/\D/g,'')) || post[key] > Number(value[1].replace(/\D/g,''))){
                                        delete res.data[index];
                                    }
                                }
                            }
                        }
                    }
                )
            });

            res.data.sort((a, b) => {
                if(a.last_renewed_on) a.creation_date = a.last_renewed_on
                if(b.last_renewed_on) b.creation_date = b.last_renewed_on
                return a.creation_date < b.creation_date
            })
            await res.data.forEach(post => {
                postsComponents.push(
                    <SearchCard 
                        description={post.description}
                        title={`${post.model.brand.name} ${post.model.name} ${post.model.engine_size}`}
                        info={`${post.odometer.toLocaleString('fr')} km  · 
                                ${new Date(post.registration_date).getDate()}
                                ${month[new Date(post.registration_date).getMonth()]}
                                ${new Date(post.registration_date).getFullYear()}
                                · ${post.model.kilowhatts} kw`}
                        location={`${post.user.city.name} (${post.user.city.region.name})`}
                        price={`${post.price} €`}
                        negotiable={post.is_price_negotiable}
                        image={`${process.env.REACT_APP_API_URL || (window.location.href.slice(0, -1) + ':8000')}/files/${post.postImages[0].image}`}
                        postId={post.id}
                        key={post.id}
                    />
                )
            })
            setPostsElements(res.data);
            setPosts(postsComponents);
        });
    // eslint-disable-next-line
    }, []);

    function getQuery(){
        let tempQuery = '';
        Object.entries(query).forEach(
            ([key, value]) => {
                if(typeof value === 'string'){
                    tempQuery += `${key}: ${value} · `
                } else {
                    if(value[0] === 'undefined') value[0] = '0' + value[1].replace(/[0-9]/g, '').replace('.', "");
                    if(value[1] === 'undefined') value[0] = 'unlimited' + value[1].replace(/[0-9]/g, '').replace('.', "");
                    tempQuery += `${key}: From ${value[0]} To ${value[1]} · `
                }
            }
        )

        return tempQuery.slice(0, -3);
    }

    function sort(type){
        let postsComponents = [];
        switch (type) {
            case 0:
                postsElements.sort((a, b) => {
                    if(a.last_renewed_on) a.creation_date = a.last_renewed_on
                    if(b.last_renewed_on) b.creation_date = b.last_renewed_on
                    return 0 - (new Date(a.creation_date) - new Date(b.creation_date))
                })
                break;
            case 1:
                postsElements.sort((a, b) => {
                    if(a.last_renewed_on) a.creation_date = a.last_renewed_on
                    if(b.last_renewed_on) b.creation_date = b.last_renewed_on
                    return (new Date(a.creation_date) - new Date(b.creation_date)) - 0
                })
                break;
            case 2:
                postsElements.sort((a, b) => {return a.price - b.price});
                break;
            case 3:
                postsElements.sort((a, b) => {return b.price - a.price});
                break;
            default:
                break;
        }
        postsElements.forEach(post => {
            postsComponents.push(
                <SearchCard 
                    description={post.description}
                    title={`${post.model.brand.name} ${post.model.name} ${post.model.engine_size}`}
                    info={`${post.odometer.toLocaleString('fr')} km  · 
                            ${new Date(post.registration_date).getDate()}
                            ${month[new Date(post.registration_date).getMonth()]}
                            ${new Date(post.registration_date).getFullYear()}
                            · ${post.model.kilowhatts} kw`}
                    location={`${post.user.city.name} (${post.user.city.region.name})`}
                    price={`${post.price} €`}
                    negotiable={post.is_price_negotiable}
                    image={`${process.env.REACT_APP_API_URL || (window.location.href.slice(0, -1) + ':8000')}/files/${post.postImages[0].image}`}
                    postId={post.id}
                    key={post.id}
                />
            )
        })
        setPosts(postsComponents);
    }

    return (
        <div className='searchPage'>
            <div className='searchPage__info'>
                <h1>Filters</h1>
                <p>{getQuery()}</p>
                <Dropdown 
                    options={options} 
                    onChange={type => {
                        sort(type.value);
                        setSelectedOption(options[type.value]);
                    }} 
                    value={selectedOption}
                />
            </div>
            {posts}
        </div>
    )
}

export default SearchPage
