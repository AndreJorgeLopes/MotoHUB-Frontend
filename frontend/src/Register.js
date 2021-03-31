import React, { useState } from "react";
import { Link, withRouter } from "react-router-dom";
import { useHistory } from "react-router-dom";
import IntlTelInput from 'react-intl-tel-input';
import ComboBox from "react-responsive-combo-box";
import ImageUploader from "react-images-upload";

import Logo from "./assets/logo-text.png";
import api from "./services/api";

import "react-responsive-combo-box/dist/index.css";
import 'react-intl-tel-input/dist/main.css';
import './Register.css';


function Register() {
    const history = useHistory();
    
    const [picture, setPicture] = useState();
    const [regionStyle, setRegionStyle] = useState({display: 'none', width: '100%', marginTop: '20px'});
    const [selectedOptionCity, setSelectedOptionCity] = useState(['City']);
    const [selectedOptionRegion, setSelectedOptionRegion] = useState(['Region']);
    const [selectedOptionCountry, setSelectedOptionCountry] = useState(['Country']);
    const [cityComponent, setCityComponent] = useState();
    const [regionComponent, setRegionComponent] = useState();
    const [citySpanComponent, setCitySpanComponent] = useState();
    const [regionSpanComponent, setRegionSpanComponent] = useState();
    const [city, setCity] = useState();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [error, setError] = useState("");
    
    function renderOptions(type, component) {
        var countryId = null;

        if(type === 'Country'){
            let country = [];

            api.get('countries').then(async res => {
                await res.data.forEach(element => {
                    country.push(element.name);
                })
            });
    
            return country;
        }
        else if(type === 'Region'){
            let region = [];
            countryId = null;

            if (component) {
                api.get('countries').then(async res => {
                    await res.data.forEach(element => {
                        if(element.name === component) {
                            countryId = element.id
                        };
                    })
                    api.get('regions').then(async res => {
                        await res.data.forEach(element => {
                            if(element.country_id === countryId){
                                region.push(element.name);
                            }
                        })
                    });
                }); 
            }
    
            return region;
        }
        else if(type === 'City'){
            let city = [];
            var regionId = null;
            countryId = null;

            if (component) {
                api.get('countries').then(async res => {
                    await res.data.forEach(element => {
                        if(element.name === component) {
                            countryId = element.id
                        };
                    })
                    api.get('regions').then(async res => {
                        await res.data.forEach(element => {
                            if(element.name === component) {
                                regionId = element.id
                            };
                        })
                        api.get('cities').then(async res => {
                            await res.data.forEach(element => {
                                if(element.region_id === regionId){
                                    city.push(element.name);
                                }
                            })
                        });
                    }); 
                }); 
            }
    
            return city;
        }
    }

    const handleRegister = async e => {
        e.preventDefault();
        if (!email || !password || !firstName || !lastName || !city) {
            setError("Fill in all the required fields to continue!");
            window.scrollTo(0, 0)
        } else {
          try {
              const data = {
                email,
                password,
                first_name: firstName,
                last_name: lastName,
                phone_number: phoneNumber,
                city
            };

              Object.keys(data).forEach((key) => {
                  if(typeof data[key] === "undefined" || data[key].length === 0) delete data[key]
              });

              data.permission_level = 1;

              if(Object.keys(data).length !== 0){
                    const account = await api.put("accounts", data);
                    if (picture) {
                        const file = new FormData();
                        file.append('image', picture[0]);
                        await api.put(`account/${account.data[0].id}`, file);
                    } 
                    history.push("/login");
              } else {
                setError("");
                setTimeout(() => {
                    setError("There was a problem creating your account.");
                    window.scrollTo(0, 0)
            }, 500);
              }
        } catch (err) {
            console.log(err)
            setError("");
            setTimeout(() => {
                setError("There was a problem creating your account.");
                window.scrollTo(0, 0)
           }, 500);
        }
      }
    };

    const onDrop = picture => {
        setPicture(picture);
    };
  
    return (
      <div className='register'>
        <form encType="multipart/form-data" onSubmit={handleRegister}>
          <img src={Logo} alt="logo" />
          {error && <p>{error}</p>}
          <div><span>Email</span><span style={{'color': 'red'}}> *</span></div>
          <input
            type="email"
            placeholder="Email"
            onChange={e => setEmail(e.target.value)}
          />
          <div><span>Password</span><span style={{'color': 'red'}}> *</span></div>
          <input
            type="password"
            placeholder="Password"
            onChange={e => setPassword(e.target.value)}
          />
          <div>
            <div><span>Name</span><span style={{'color': 'red'}}> *</span></div>
            <input
                type="text"
                placeholder="First Name"
                onChange={e => setFirstName(e.target.value)}
                style={{marginRight: "3%"}}
            />
            <input
                type="text"
                placeholder="Last Name"
                onChange={e => setLastName(e.target.value)}
                style={{marginLeft: "3%"}}
            />
        </div>
        
        <div style={{width: '100%'}}>
                <div><span>Country</span><span style={{'color': 'red'}}> *</span></div>
                <ComboBox
                    options={renderOptions('Country')}
                    placeholder="Country"
                    defaultIndex={4}
                    optionsListMaxHeight={300}
                    style={{
                        width: "100%"
                    }}
                    focusColor="#ff7779"
                    renderOptions={(option) => {
                        return (<div className="comboBoxOption">{option}</div>)
                    }}
                    onOptionsChange={() => {
                        setRegionSpanComponent()
                        setCitySpanComponent()
                        setRegionComponent()
                        setCityComponent()
                        setRegionStyle({display: 'none', width: '100%', marginTop: '20px'})
                    }}
                    onSelect={option => {
                        setRegionStyle({display: 'flex', width: '100%', marginTop: '20px'})
                        setRegionSpanComponent(<div><span>Region</span><span style={{'color': 'red'}}> *</span></div>);
                        setRegionComponent(
                            <ComboBox
                                options={renderOptions('Region', option)}
                                placeholder="Region"
                                defaultIndex={4}
                                optionsListMaxHeight={300}
                                style={{
                                    width: "170px"
                                }}
                                focusColor="#ff7779"
                                renderOptions={(option) => (
                                <div className="comboBoxOption">{option}</div>
                                )}
                                onOptionsChange={() => {
                                    setCityComponent();
                                    setCitySpanComponent();
                                }}
                                onSelect={option => {
                                    setCitySpanComponent(<div><span>City</span><span style={{'color': 'red'}}> *</span></div>);
                                    setCityComponent(
                                            <ComboBox
                                                options={renderOptions('City', option)}
                                                placeholder="City"
                                                defaultIndex={4}
                                                optionsListMaxHeight={300}
                                                style={{
                                                    width: "170px"
                                                }}
                                                focusColor="#ff7779"
                                                renderOptions={(option) => (
                                                <div className="comboBoxOption">{option}</div>
                                                )}
                                                onSelect={(option) => {
                                                    setCity(option);
                                                    setSelectedOptionCity([selectedOptionCity[0], option])
                                                }}
                                                enableAutocomplete
                                            />
                                    )
                                    setSelectedOptionRegion([selectedOptionRegion[0], option]);
                                }}
                                enableAutocomplete
                            />
                        )
                        setSelectedOptionCountry([selectedOptionCountry[0], option]);
                    }}
                    enableAutocomplete
                />
        </div>

        <div style={regionStyle}>
            <div style={{width: '100%'}}>
                {regionSpanComponent}
                {regionComponent}
            </div>
            <div>
                {citySpanComponent}
                {cityComponent}
            </div>
        </div>
        
        <span style={{marginTop: '20px'}}>Phone</span>
        <IntlTelInput
            onPhoneNumberChange={(valid ,phone, country) => {
                if(phone){
                    setPhoneNumber(`+${country.dialCode} ${phone.replace(/[^\d]/g, '')}`); 
                }
            }}
            preferredCountries={['us','gb','pt']}
        />

        <span>Avatar</span>
        <ImageUploader
            buttonType='button'
            buttonText='Choose image'
            label='Max file size: 5mb, accepted: jpg | png'
            fileSizeError=' is too big.'
            fileTypeError=' does not have a supported file extension.'
            withPreview={true}
            singleImage={true}
            onChange={onDrop}
            imgExtension={[".jpg",".png"]}
        />

        <button type="submit">Create Account</button>
        <hr />
        <Link to="/login">Login</Link>
    </form>
    </div>
);
    
}

export default withRouter(Register);
