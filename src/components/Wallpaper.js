import React, { Component } from 'react'
import '../styles/wallpaper.css';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
const API_URL = require('../constants').API_URL;

class Wallpaper extends Component {

    constructor() {
        super();
        this.state = {
            restaurants: [],
            text: '',
            suggestions: []
        }
    }

    getRestaurantsForLocation = (e) => {
        const locationId = e.target.value;
        const selectedLocation = this.props.locationData.find(item => item.location_id === parseInt(locationId));
        const city_id = selectedLocation.city_id;
        const city_name = selectedLocation.city;

        // set the city Id in localStorage
        localStorage.setItem('city_id', city_id);

        // fetch the restaurants for this location
        axios.get(`${API_URL}/getAllRestaurantsByLocation/${city_name}`)
            .then(resp => {
                this.setState({
                    restaurants: resp.data.restaurants
                })
            })
            .catch(err => {
                console.log(err);
            })
    }

    onSearchTextChange = (e) => {
        const searchText = e.target.value;
        const { restaurants } = this.state;
        let suggestions = [];
        if (searchText.length > 0) {
            suggestions = restaurants.filter(item => item.name.toLowerCase().includes(searchText.toLowerCase()));
        }
        this.setState({
            text: searchText,
            suggestions: suggestions || []
        });
    }

    renderSuggestions = () => {
        const { suggestions } = this.state;
        if (suggestions.length === 0) {
            return null;
        }
        return (
            <ul className="suggestionBox">
                {
                    suggestions.map((item, index) => {
                        return (
                            <li className="suggestionItem" onClick={() => this.goToRestaurant(item)}>
                                <div className="suggestionImage">
                                    <img src={require(`../${item.image}`).default} alt="not found" />
                                </div>
                                <div className="suggestionText">
                                    <div className="suggestionTextName">
                                        { item.name }
                                    </div>
                                    <div className="suggestionTextLocality">
                                        { item.locality }
                                    </div>
                                </div>
                                <div className="orderButton">
                                   <span className="orderButton-text">Order Now</span> 
                                </div>
                            </li>
                        )
                    })
                }
            </ul>
        )
    }

    goToRestaurant = (item) => {
        this.props.history.push(`/details?id=${item._id}`);
    }

    render() {
        const { locationData } = this.props;
        return (
            <React.Fragment>
                <div className="topSection">
                    <img src={require('../Assets/bg-img.jpg').default} alt="Not Found" className="homeImage"/>
                    <div className="branding">
                        <div className="logo">e!</div>
                        <div className="headerText">Find the best restaurants, cafés, and bars</div>
                    </div>
                    <div className="wrapper">
                    <div className="search_box ">
                    <i className="fas fa-map-marker-alt"></i>
                        <span>
                            <select className="locationBox" onChange={this.getRestaurantsForLocation}>
                                <option selected disabled> Select City</option>
                                {
                                   locationData && locationData.map((item, index) => {
                                        return (
                                            <option key={index} value={item.location_id}>{item.name}, {item.city}</option>
                                        )
                                    })
                                }
                            </select>
                        </span>
                        <i className="fas fa-search searchIcon"></i>
                        <span className="searchBox">
                            <input type="text" className="searchInput" placeholder="Search for restaurants" onChange={this.onSearchTextChange}/>
                            {
                                this.renderSuggestions()
                            }
                        </span>
                    </div>
                    </div>
                    
                </div>
            </React.Fragment>
        )
    }
}

export default withRouter(Wallpaper);
