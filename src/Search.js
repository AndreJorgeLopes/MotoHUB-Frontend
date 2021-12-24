import React, {useState} from 'react';
import './Search.css';
import { Button } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import ComboBox from "react-responsive-combo-box";
import "react-responsive-combo-box/dist/index.css";

import api from "./services/api";

function Search() {
    const history = useHistory();

    const [cityComponent, setCityComponent] = useState();
    const [regionComponent, setRegionComponent] = useState();
    const [modelComponent, setModelComponent] = useState();
    const [selectedOptionBrand, setSelectedOptionBrand] = useState(['brand']);
    const [selectedOptionModel, setSelectedOptionModel] = useState(['model']);
    const [selectedOptionOdometer, setSelectedOptionOdometer] = useState(['odometer']);
    const [selectedOptionPrice, setSelectedOptionPrice] = useState(['price']);
    const [selectedOptionMonth, setSelectedOptionMonth] = useState(['month']);
    const [selectedOptionYear, setSelectedOptionYear] = useState(['year']);
    const [selectedOptionCity, setSelectedOptionCity] = useState(['city']);
    const [selectedOptionRegion, setSelectedOptionRegion] = useState(['region']);
    const [selectedOptionCountry, setSelectedOptionCountry] = useState(['country']);

    function renderOptions(type, component){
        var countryId = null;

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
            var brandId = null;

            if (component) {
                api.get('brands').then(async res => {
                    await res.data.forEach(element => {
                        if(element.name === component) {
                            brandId = element.id
                        };
                    })
                    api.get('models').then(async res => {
                        await res.data.forEach(element => {
                            if(element.brand_id === brandId){
                                model.push(`${element.name} ${element.engine_size}`);
                            }
                        })
                    });
                }); 
            }
    
            return model;
        }
        else if(type === 'Country'){
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
        else if(type === 'Odometer') return [ "500 km", "1.000 km", "5.000 km", "10.000 km", "25.000 km", "50.000 km", "100.000 km", "250.000 km", "500.000 km", "1.000.000 km" ]
        else if(type === 'Price') return ["250 €","500 €","750 €","1.000 €","2.000 €","3.000 €","4.000 €","5.000 €","6.000 €","7.000 €","8.000 €","9.000 €","10.000 €","12.000 €","14.000 €","16.000 €","18.000 €","20.000 €","22.000 €","24.000 €","26.000 €","28.000 €","30.000 €","32.000 €","34.000 €","36.000 €","38.000 €","40.000 €","50.000 €","60.000 €","70.000 €","80.000 €","90.000 €","100.000 €"]
        else if(type === 'Month') return [1,2,3,4,5,6,7,8,9,10,11,12]
        else if(type === 'Year') return [
            "1900",
            "1930",
            "1960",
            "1980",
            "1990",
            "1991",
            "1992",
            "1993",
            "1994",
            "1995",
            "1996",
            "1997",
            "1998",
            "1999",
            "2000",
            "2001",
            "2002",
            "2003",
            "2004",
            "2005",
            "2006",
            "2007",
            "2008",
            "2009",
            "2010",
            "2011",
            "2012",
            "2013",
            "2014",
            "2015",
            "2016",
            "2017",
            "2018",
            "2019",
            "2020",
            "2021"
          ]
        return []
    }

    function searchQueryCreate() {    
        const selectedOptions = [
            selectedOptionCountry,
            selectedOptionRegion,
            selectedOptionCity,
            selectedOptionBrand,
            selectedOptionModel,
            selectedOptionOdometer,
            selectedOptionPrice,
            selectedOptionMonth,
            selectedOptionYear,
        ]

        let query = '/search'
        if (selectedOptions.some(e => e[1] || e[2])){
            query += '?'
            selectedOptions.forEach((selectedOption, index) => {
                if(selectedOption[1] || selectedOption[2]){
                    if(index>4) {
                        query += `&${selectedOption[0]}=${selectedOption[1]}&${selectedOption[0]}=${selectedOption[2]}`
                    } else {
                        query += `&${selectedOption[0]}=${selectedOption[1]}`
                    }
                }
            })
        }
        history.push(query);
    }

    return (
        <div className='search'>
            <div className='single_section' >
                <h5>
                    Brand
                </h5>
                <ComboBox
                    options={renderOptions('Brand')}
                    placeholder="choose brand"
                    defaultIndex={4}
                    optionsListMaxHeight={300}
                    style={{
                    width: "350px"
                    }}
                    focusColor="#ff7779"
                    renderOptions={(option) => {
                        return (<div className="comboBoxOption">{option}</div>)
                    }}
                    onOptionsChange={() => {setModelComponent()}}
                    onSelect={option => {
                        setModelComponent(
                            <ComboBox
                                options={renderOptions('Model', option)}
                                placeholder="choose model"
                                defaultIndex={4}
                                optionsListMaxHeight={300}
                                style={{
                                width: "350px"
                                }}
                                focusColor="#ff7779"
                                renderOptions={(option) => (
                                    <div className="comboBoxOption">{option}</div>
                                )}
                                onSelect={(option) => setSelectedOptionModel([selectedOptionModel[0], option])}
                                enableAutocomplete
                            />
                        )
                        setSelectedOptionBrand([selectedOptionBrand[0], option]);
                    }}
                    enableAutocomplete
                />
            </div>
            <div className='single_section' style={{height: '56px'}}>
                <h5>
                    Model
                </h5>
                {modelComponent}
            </div>
            <div className='double_section'>
                <h5>
                    Odometer
                </h5>
                <h5>
                </h5>
                <ComboBox
                    options={renderOptions('Odometer')}
                    placeholder="From"
                    defaultIndex={4}
                    optionsListMaxHeight={300}
                    style={{
                        width: "170px"
                    }}
                    focusColor="#ff7779"
                    renderOptions={(option) => (
                    <div className="comboBoxOption">{option}</div>
                    )}
                    onSelect={(option) => setSelectedOptionOdometer([selectedOptionOdometer[0], option, selectedOptionOdometer[2]])}
                    enableAutocomplete
                />
                <ComboBox
                    options={renderOptions('Odometer')}
                    placeholder="To"
                    defaultIndex={4}
                    optionsListMaxHeight={300}
                    style={{
                        width: "170px"
                    }}
                    focusColor="#ff7779"
                    renderOptions={(option) => (
                    <div className="comboBoxOption">{option}</div>
                    )}
                    onSelect={(option) => setSelectedOptionOdometer([selectedOptionOdometer[0], selectedOptionOdometer[1], option])}
                    enableAutocomplete
                />
            </div>
            <div className='double_section'>
                <h5>
                    Price
                </h5>
                <h5>
                </h5>
                <ComboBox
                    options={renderOptions('Price')}
                    placeholder="From"
                    defaultIndex={4}
                    optionsListMaxHeight={300}
                    style={{
                        width: "170px"
                    }}
                    focusColor="#ff7779"
                    renderOptions={(option) => (
                    <div className="comboBoxOption">{option}</div>
                    )}
                    onSelect={(option) => setSelectedOptionPrice([selectedOptionPrice[0], option, selectedOptionPrice[2]])}
                    enableAutocomplete
                />
                <ComboBox
                    options={renderOptions('Price')}
                    placeholder="To"
                    defaultIndex={4}
                    optionsListMaxHeight={300}
                    style={{
                        width: "170px"
                    }}
                    focusColor="#ff7779"
                    renderOptions={(option) => (
                    <div className="comboBoxOption">{option}</div>
                    )}
                    onSelect={(option) => setSelectedOptionPrice([selectedOptionPrice[0], selectedOptionPrice[1], option])}
                    enableAutocomplete
                />
            </div>
            <div className='double_section'>
                <h5>
                    Month
                </h5>
                <h5>
                </h5>
                <ComboBox
                    options={renderOptions('Month')}
                    placeholder="From"
                    defaultIndex={4}
                    optionsListMaxHeight={300}
                    style={{
                        width: "170px"
                    }}
                    focusColor="#ff7779"
                    renderOptions={(option) => (
                    <div className="comboBoxOption">{option}</div>
                    )}
                    onSelect={(option) => setSelectedOptionMonth([selectedOptionMonth[0], option, selectedOptionMonth[2]])}
                    enableAutocomplete
                />
                <ComboBox
                    options={renderOptions('Month')}
                    placeholder="To"
                    defaultIndex={4}
                    optionsListMaxHeight={300}
                    style={{
                        width: "170px"
                    }}
                    focusColor="#ff7779"
                    renderOptions={(option) => (
                    <div className="comboBoxOption">{option}</div>
                    )}
                    onSelect={(option) => setSelectedOptionMonth([selectedOptionMonth[0], selectedOptionMonth[1], option])}
                    enableAutocomplete
                />
            </div>
            <div className='double_section'>
                <h5>
                    Year
                </h5>
                <h5>
                </h5>
                <ComboBox
                    options={renderOptions('Year')}
                    placeholder="From"
                    defaultIndex={4}
                    optionsListMaxHeight={300}
                    style={{
                        width: "170px"
                    }}
                    focusColor="#ff7779"
                    renderOptions={(option) => (
                    <div className="comboBoxOption">{option}</div>
                    )}
                    onSelect={(option) => setSelectedOptionYear([selectedOptionYear[0], option, selectedOptionYear[2]])}
                    enableAutocomplete
                />
                <ComboBox
                    options={renderOptions('Year')}
                    placeholder="To"
                    defaultIndex={4}
                    optionsListMaxHeight={300}
                    style={{
                        width: "170px"
                    }}
                    focusColor="#ff7779"
                    renderOptions={(option) => (
                    <div className="comboBoxOption">{option}</div>
                    )}
                    onSelect={(option) => setSelectedOptionYear([selectedOptionYear[0], selectedOptionYear[1], option])}
                    enableAutocomplete
                />
            </div>
            <div className='single_section'>
                <h5 style={{height: "20px"}}>
                    Country
                </h5>
                <ComboBox
                    options={renderOptions('Country')}
                    placeholder="choose country"
                    defaultIndex={4}
                    optionsListMaxHeight={300}
                    style={{
                    width: "350px"
                    }}
                    focusColor="#ff7779"
                    renderOptions={(option) => {
                        return (<div className="comboBoxOption">{option}</div>)
                    }}
                    onOptionsChange={() => {
                        setRegionComponent()
                        setCityComponent()
                    }}
                    onSelect={option => {
                        setRegionComponent(
                            <ComboBox
                                options={renderOptions('Region', option)}
                                placeholder="choose region"
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
                                    setCityComponent()
                                }}
                                onSelect={option => {
                                    setCityComponent(
                                        <ComboBox
                                            options={renderOptions('City', option)}
                                            placeholder="choose city"
                                            defaultIndex={4}
                                            optionsListMaxHeight={300}
                                            style={{
                                                width: "170px"
                                            }}
                                            focusColor="#ff7779"
                                            renderOptions={(option) => (
                                            <div className="comboBoxOption">{option}</div>
                                            )}
                                            onSelect={(option) => setSelectedOptionCity([selectedOptionCity[0], option])}
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
            <div className='double_section'>
                <h5>
                    Region
                </h5>
                <h5>
                    City
                </h5>
                {regionComponent}
                {cityComponent}
            </div>
            <Button onClick={() => searchQueryCreate()}>Search Motorcycle</Button>
        </div>
    )
}

export default Search