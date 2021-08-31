import React, { Component } from 'react';
import { connect } from 'react-redux';

import Button from '../../../Components/UI/Button/Button';
import Spinner from '../../../Components/UI/Spinner/Spinner';
import axios from '../../../axios-orders';
import Input from '../../../Components/UI/Input/Input';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import styles from './ContactData.module.css';
import * as orderActions from '../../../store/actions/index';


class ContactData extends Component {

    state = {
        orderForm : {
            name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder:'Your Name'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            street: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder:'Street'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            zipCode: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder:'ZIP-Code'
                },
                value: '', 
                validation: {
                    required: true,
                    isNumeric: true,
                    minLength: 5, 
                    maxLength: 8
                },
                valid: false,
                touched: false
            },
            country: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder:'Country'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder:'Your E-Mail'
                },
                value: '',
                validation: {
                    required: true,
                    isEmail: true
                },
                valid: false,
                touched: false
            },
            deliveryMethod: {
                elementType: 'select',
                elementConfig: {
                    options: [
                        {value: 'fastest', displayValue: 'Fastest'},
                        {value: 'cheapest', displayValue: 'Cheapest'}
                    ]
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
        },
        formIsValid: false,
        loading: false
    }

    checkValidatity(value, rules) {

        let isValid = false;

        if(rules.required){
            isValid = value.trim() !== '';
        }
        if(rules.minLength){
            isValid = value.length >= rules.minLength && isValid;
        }
        if(rules.maxLength){
            isValid = value.length <= rules.maxLength && isValid;
        }
        if(rules.isEmail){
            const pattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
            isValid = pattern.test(value) && isValid;
        }
        if(rules.isNumeric){
            const pattern = /^\d+$/;
            isValid = pattern.test(value) && isValid;
        }
        return isValid ;
    }

    orderHandler = (event) => {
        event.preventDefault();
        const formData = {};
        for(let formElementID in this.state.orderForm){
            formData[formElementID] = this.state.orderForm[formElementID].value
        }
        const order = {
            ingredients: this.props.ingredients,
            price: this.props.totalPrice,
            orderData: formData,
            userID: this.props.userID
        }
        this.props.onOrderBurger(order, this.props.token);
    }

    inputChangedHandler = (event, inputID) => {
        const updatedOrderForm = {...this.state.orderForm};
        const updatedFormElement = {...updatedOrderForm[inputID]};
        updatedFormElement.value = event.target.value;
        updatedFormElement.valid = this.checkValidatity(updatedFormElement.value, updatedFormElement.validation);
        updatedFormElement.touched = true;
        console.log(updatedFormElement)
        updatedOrderForm[inputID] = updatedFormElement;
        let formIsValid = true;
        for(let inputID in updatedOrderForm){
            formIsValid = updatedOrderForm[inputID].valid && formIsValid;
        }
        this.setState({orderForm: updatedOrderForm, formIsValid: formIsValid});
    }

    render() {

        const inputs = [];
        for(let key in this.state.orderForm){
            inputs.push({
                id: key,
                config: this.state.orderForm[key]
            });
        }

        let form = this.props.loading ? <Spinner/> :  
        <div className={styles.ContactData}>
                <h4>Enter Your Contact Data</h4>
                <form onSubmit={this.orderHandler}>
                    {inputs.map(input => (
                        <Input 
                            key = {input.id}
                            elementType={input.config.elementType} 
                            elementConfig={input.config.elementConfig} 
                            value={input.config.value}
                            invalid={!input.config.valid}
                            shouldValidate={input.config.validation}
                            touched={input.config.touched}
                            changed={(event) => this.inputChangedHandler(event, input.id)}/>
                    ))}
                    <Button 
                        btnType='Success' 
                        disabled={!this.state.formIsValid}
                        clicked={this.orderHandler}>Order</Button>
                </form>
            </div>
        return form;
    }
}

const mapStateToProps = state => {
    return {
        ingredients: state.burgerBuilder.ingredients,
        totalPrice: state.burgerBuilder.totalPrice,
        loading: state.order.loading, 
        token: state.auth.token,
        userID: state.auth.userID
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onOrderBurger: (order, token) => dispatch(orderActions.purchaseBurger(order, token)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactData, axios));
