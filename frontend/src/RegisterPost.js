import React, { useState } from "react";
import { Link, withRouter } from "react-router-dom";
import { useHistory } from "react-router-dom";
import ComboBox from "react-responsive-combo-box";
import ImageUploader from "react-images-upload";
import DatePicker from 'react-date-picker'
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { getUser, isAuthenticated } from "./services/auth";

import Logo from "./assets/logo-text.png";
import api from "./services/api";

import "react-responsive-combo-box/dist/index.css";
import './RegisterPost.css';


function RegisterPost() {
    const history = useHistory();

    const defaultDate = new Date();
    const [images, setImages] = useState([]);
    const [registrationDate, setRegistrationDate] = useState(new Date());
    const [modelStyle, setModelStyle] = useState({display: 'none', width: '100%', marginTop: '20px'});
    const [brand, setBrand] = useState(['Brand']);
    const [model, setModel] = useState(['Model']);
    const [engineSize, setEngineSize] = useState(['Engine Size']);
    const [engineSizeComponent, setEngineSizeComponent] = useState();
    const [modelComponent, setModelComponent] = useState();
    const [engineSizeSpanComponent, setEngineSizeSpanComponent] = useState();
    const [modelSpanComponent, setModelSpanComponent] = useState();
    const [odometer, setOdometer] = useState();
    const [price, setPrice] = useState();
    const [negotiable, setNegotiable] = useState(false);
    const [error, setError] = useState("");
    
    function renderOptions(type, component) {
        var brandId = null;

        if(type === 'Brand'){
            let brand = [];

            api.get('brands').then(async res => {
                await res.data.forEach(element => {
                    brand.push(element.name);
                })
            });
    
            return brand;
        }
        else if(type === 'Model'){
            let model = [];
            brandId = null;

            if (component) {
                api.get('brands').then(async res => {
                    await res.data.forEach(element => {
                        if(element.name === component) {
                            brandId = element.id
                        };
                    })
                    api.get('models').then(async res => {
                        await res.data.forEach(element => {
                            if(element.brand_id === brandId && !model.includes(element.name)){
                                model.push(element.name);
                            }
                        })
                    });
                }); 
            }
    
            return model;
        }
        else if(type === 'Engine Size'){
            var engineSize = [];

            api.get('models').then(async res => {
                await res.data.forEach(element => {
                    if(element.name === component) {
                        engineSize.push(element.engine_size)
                    };
                })
            }); 
            if (component) {
            }
            return engineSize;
        }
    }

    const handleRegisterPost = async e => {
        e.preventDefault();
        
        if(!isAuthenticated()){
            setError("You must be logged in to post a motorcycle!");
            window.scrollTo(0, 0)
        }
        else {
            if (!document.getElementById('description').innerText || !odometer || !price || !brand || !model
                || !engineSize || registrationDate > defaultDate || !images) {
                setError("Fill in all the required fields to continue!");
                window.scrollTo(0, 0)
            } else {
              try {
                  const data = {
                    description: document.getElementById('description').innerText,
                    odometer,
                    price,
                    brand: brand[1],
                    model: model[1],
                    engine_size: engineSize,
                    registration_date: registrationDate,
                    is_price_negotiable: negotiable
                };
    
                  Object.keys(data).forEach((key) => {
                      if(typeof data[key] === "undefined" || data[key].length === 0) delete data[key]
                  });
    
                  data.is_active = true;
                  data.is_featured = false;
    
                  if(Object.keys(data).length !== 0 && images.length < 9){
                        const post = await api.put(`account/${getUser()}/posts`, data);
                        if (images) {
                            images[0].forEach(async (image, index) => {
                                const file = new FormData();
                                file.append('image', image);
                                await api.put(`post/${post.data.id}/images`, file);
                            })
                        } 
                        history.push(`/post?id=${post.data.id}`);
                  } else {
                    setError("");
                    setTimeout(() => {
                        setError("There was a problem creating the post.");
                        window.scrollTo(0, 0)
                }, 500);
                  }
            } catch (err) {
                console.log(err)
                setError("");
                setTimeout(() => {
                    setError("There was a problem creating the post.");
                    window.scrollTo(0, 0)
               }, 500);
            }
          }
        }
    };

    const onDrop = image => {
        setImages([...images, image]);
    };
  
    return (
      <div className='registerPost'>
        <form encType="multipart/form-data" onSubmit={handleRegisterPost}>
          <img src={Logo} alt="logo" />
          {error && <p>{error}</p>}
          <div><span>Description</span><span style={{'color': 'red'}}> *</span></div>
          <span
            id='description'
            contentEditable="true"
          />
          <div style={{display: 'flex'}}>
              <div style={{width: '100%'}}>
                  <div><span>Odometer</span><span style={{'color': 'red'}}> *</span></div>
                  <input 
                    type="number" 
                    placeholder="Odometer" 
                    style={{width: '100%'}} 
                    onChange={e => setOdometer(e.target.value)}
                  />
              </div>
              <div style={{width: '100%'}}>
                  <div><span>Price</span><span style={{'color': 'red'}}> *</span></div>
                  <input 
                    type="number" 
                    placeholder="Price" 
                    style={{width: '100%'}} 
                    onChange={e => setPrice(e.target.value)}
                  />
              </div>
          </div>
        
        <div style={{width: '100%'}}>
                <div><span>Brand</span><span style={{'color': 'red'}}> *</span></div>
                <ComboBox
                    options={renderOptions('Brand')}
                    placeholder="Brand"
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
                        setModelSpanComponent()
                        setEngineSizeSpanComponent()
                        setModelComponent()
                        setEngineSizeComponent()
                        setModelStyle({display: 'none', width: '100%', marginTop: '20px'})
                    }}
                    onSelect={option => {
                        setBrand([brand[0], option])
                        setModelStyle({display: 'flex', width: '100%', marginTop: '20px'})
                        setModelSpanComponent(<div><span>Model</span><span style={{'color': 'red'}}> *</span></div>);
                        setModelComponent(
                            <ComboBox
                                options={renderOptions('Model', option)}
                                placeholder="Model"
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
                                    setEngineSizeComponent();
                                    setEngineSizeSpanComponent();
                                }}
                                onSelect={option => {
                                    setEngineSizeSpanComponent(<div><span>Engine Size</span><span style={{'color': 'red'}}> *</span></div>);
                                    setEngineSizeComponent(
                                            <ComboBox
                                                options={renderOptions('Engine Size', option)}
                                                placeholder="Engine Size"
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
                                                    setEngineSize(option);
                                                }}
                                                enableAutocomplete
                                            />
                                    )
                                    setModel([model[0], option]);
                                }}
                                enableAutocomplete
                            />
                        )
                        setEngineSize([engineSize[0], option]);
                    }}
                    enableAutocomplete
                />
        </div>

        <div style={modelStyle}>
            <div style={{width: '100%'}}>
                {modelSpanComponent}
                {modelComponent}
            </div>
            <div>
                {engineSizeSpanComponent}
                {engineSizeComponent}
            </div>
        </div>
        
        <div style={{marginTop: '25px', marginBottom: '5px'}} className='centeredText'><span>Registration Date</span><span style={{'color': 'red'}}> *</span></div>
        <div className='date'>
            <DatePicker
                onChange={setRegistrationDate}
                value={registrationDate}
            />
        </div>
        
        <FormGroup>
          <FormControlLabel
            control={<Checkbox checked={negotiable} onChange={() => setNegotiable(!negotiable)} />}
            label="Negotiable"
          />
        </FormGroup>

        <div style={{marginTop: '15px'}} className='centeredText'><span>Images</span><span style={{'color': 'red'}}> *</span></div>
        <ImageUploader
            buttonType='button'
            buttonText='Choose images'
            label='Max file size: 5mb, accepted: jpg | png'
            fileSizeError=' is too big.'
            fileTypeError=' does not have a supported file extension.'
            withPreview={true}
            onChange={onDrop}
            imgExtension={[".jpg",".png"]}
        />

        <button type="submit">Sell</button>
        <hr />
        <Link to="/register">Create Account</Link>
    </form>
    </div>
);
    
}

export default withRouter(RegisterPost);
