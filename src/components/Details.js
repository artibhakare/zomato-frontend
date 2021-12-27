import React, { Component } from 'react'
import Modal from 'react-modal';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import queryString from 'query-string';
import "react-tabs/style/react-tabs.css";
import "../styles/details.css";
import axios from 'axios';
const API_URL = require('../constants').API_URL;

const menuStyle = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '800px',
        background: 'white',
        zIndex: '10000000'
    }
}

Modal.setAppElement('#root')

export default class Details extends Component {

    constructor() {
        super();
        this.state = {
            restaurant: null,
            menu: [],
            isMenuOpen: false,
            totalPrice: 0, 
            menuItem:[]
        }
    }

    componentDidMount() {
        const params = queryString.parse(this.props.location.search);
        const { id } = params;

        // get the details of the restaurant
        axios.get(`${API_URL}/getRestaurantById/${id}`)
            .then(resp => {
                this.setState({
                    restaurant: resp.data.restaurant
                })
            })
            .catch(err => {
                console.log(err);
            });

        // get the menu for the rstaurant
        axios.get(`${API_URL}/getMenuForRestaurant/${id}`)
            .then(resp => {
                this.setState({
                    menu: resp.data.menu
                })
            })
            .catch(err => {
                console.log(err);
            });

    }

    openMenu = () => {
        this.setState({
            isMenuOpen: true
        })
    }

    closeMenu = () => {
        this.setState({
            isMenuOpen: false
        })
    }

    addItem = (index , operationType) =>{
        let total =0;
        const items = [...this.state.menu];
        console.log(items);
        const item = items[index];
        console.log(item);
        if(operationType === 'add')
        {
            item.qty+=1;
        }else
        {

            item.qty-=1;
        }
        items[index] =item;
        items.map((item)=>{
            return total += item.qty * item.itemPrice;
        })
    
        this.setState({menu : items , totalPrice:total});
    }


    isDate = (val) => {
        return Object.prototype.toString.call(val) === '[object Date]';
    }

    isObj = (val) => {
        return typeof val === 'object';
    }

    stringifyValue = (value) => {
        if (this.isObj(value) && !this.isDate(value)) {
            return JSON.stringify(value);
        } else {
            return value;
        }
    }

    buildForm = (details) => {
        const { action, params } = details;
        const form = document.createElement('form');
        form.setAttribute('method', 'post');
        form.setAttribute('action', action);
        Object.keys(params).forEach(key => {
            const input = document.createElement('input');
            input.setAttribute('type', 'hidden');
            input.setAttribute('name', key);
            input.setAttribute('value', this.stringifyValue(params[key]));
            form.appendChild(input);
        })  
        return form;
    }

    postTheInformationToPaytm = (info) => {
        // build the form data
        const form = this.buildForm(info);

        // attach in the request body
        document.body.appendChild(form);

        // submit the form
        form.submit();

        // destroy the form
        form.remove();

    }

    getChecksum = (data) => {
        return fetch(`${API_URL}/payment`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(resp => {
            return resp.json();
        })
        .catch(err => {
            console.log(err);
        });
    }

    paymentHandler = () => {
        // add the logic to make the payment

        // (1) make API call to the BE and get the payment checksum
        const data = {
            amount: this.state.totalPrice,
            email: 'bhakarearti988@gmail.com',
            mobileNo: '7777777777'
        }

        this.getChecksum(data)
            .then(result => {
                // (2) go to the paytm website, on the paytm website, finish the payment
                let information = {
                    action: 'https://securegw-stage.paytm.in/order/process',
                    params: result
                }
                this.postTheInformationToPaytm(information);
            })
            .catch(err => {
                console.log(err);
            })
    }

    render() {
        const { restaurant, menu, isMenuOpen, totalPrice } = this.state;
        return (
            <>
                <div className="container details">
                    {
                        restaurant
                        ?
                        <>
                            <div className="images">
                                <Carousel showThumbs={false}>
                                    {
                                        restaurant.thumb.map((item, index) => {
                                            return (
                                                <div>
                                                    <img key={index} src={require(`../${item}`).default} alt="img"/>
                                                </div>
                                            )
                                        })
                                    }
                                </Carousel>
                            </div>
                            <div className="restName my-3">
                                { restaurant.name }
                                <button className="btn btn-primary float-end mt-4" onClick={this.openMenu}>Place Online Order</button>
                            </div>
                            <div className="myTabs mb-5">
                                <Tabs>
                                    <TabList>
                                        <Tab>Overview</Tab>
                                        <Tab>Contact</Tab>
                                    </TabList>
                                    <TabPanel>
                                        <div className="about">About this place</div>
                                        <div className="cuisine">Cuisine</div>
                                        <div className="cuisines">
                                            {
                                                restaurant.cuisine.map((item, index) => {
                                                    return <span key={index}>{ item.name } , </span>
                                                })
                                            }
                                        </div>
                                        <div className="cuisine">Average Cost</div>
                                        <div className="cuisines">₹ { restaurant.min_price } for two people (approx.)</div>
                                    </TabPanel>
                                    <TabPanel>
                        
                                        <div className="cuisine ">{ restaurant.name }</div>
                                        <div className="text-muted">
                                            { restaurant.locality } 
                                            <br/>
                                            { restaurant.city }
                                        </div>
                                        <div className="cuisine ">Phone Number
                                            <div className="text-danger"> +91 { restaurant.contact_number }</div>
                                        </div>
                                    </TabPanel>
                                </Tabs>
                            </div>
                            <Modal isOpen={isMenuOpen} style={menuStyle}>
                    <div> 
                    <div class="fas fa-times" style={{ float: 'right', marginBottom: '10px' ,color: 'black' }} onClick={this.closeMenu}></div> 
                       <h3 className="">Menu</h3>
                       <div>{menu.map((item , index)=>{
                        return <div>
                           <div className="row">
                               
                            <div className="col-6 text-left align-self-center menu-details ">                               
                                <div className="menu-resto-name">{item.itemName}</div>
                                <p className="menu-resto-desc">{item.itemDescription}<br/></p>
                                <p className="menu-resto-price">Price : &#8377;  {item.itemPrice}</p>                              
                            </div>
                            <div className="col-3 text-right align-self-right" >
                               {item.qty === 0 ? <div style={{ float: 'right' , padding: '10px'}}><button id="menu-add" onClick={()=>this.addItem(index , 'add')}>Add 
                                 <i class="fa fa-plus ml-1" aria-hidden="true"></i>
                                </button></div>  : <div className = "mt-5">
                                <button id="add-sub-btn" onClick={()=>this.addItem(index , 'sub')}>- </button>
                                <span id="item-qty">{item.qty}</span>
                                <button id="add-sub-btn" onClick={()=>this.addItem(index , 'add')}>+ </button>
                                </div>}
                            </div>
                         </div>  
                        </div> 
                         
                       })}</div>  
                       <div className="price">
                        <h2 style={{ paddingRight:"33px"}}>Total Price : {totalPrice} </h2>  
                        <button className="btn btn-primary rounded  text-end align-self-center" onClick={() => this.paymentHandler()} >Pay Now</button>                       
                        </div> 
                    </div>
                </Modal>   
                        </>
                        :
                        <div>Loading....</div>
                    }
                </div>
            </>
        )
    }
}
