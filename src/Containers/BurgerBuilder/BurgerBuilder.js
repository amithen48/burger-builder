import React, { Component } from "react";
import { connect } from 'react-redux';
import axios from '../../axios-orders';

import Aux from '../../hoc/Auxiliary';
import Burger from '../../Components/Burger/Burger';
import BuildControls from "../../Components/Burger/BuildControls/BuildControls";
import Modal from '../../Components/UI/Modal/Modal';
import Spinner from '../../Components/UI/Spinner/Spinner';
import OrederSummary from '../../Components/Burger/OrderSummary/OrderSummary';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../store/actions/index';

class BurgerBuilder extends Component{

    state = {
        purchasing: false,
    }

    componentDidMount = () => {
        this.props.onInitIngredients();   
    }

    updatePurchaseState = (ingredients) => {
        const sum = Object.keys(ingredients).map(igKey => {
            return ingredients[igKey];
        }).reduce((sum, el) => {
            return sum + el;
        },0);
        return sum > 0 ;
    }
    

    purchaseHnadler = () => {
        if(this.props.isAuthenticated) {
            this.setState({purchasing: true});
        } else {
            this.props.onSetAuthRedirectPath('/checkout');
            this.props.history.push('auth');
        }
    }

    purchaseCancleHandler = () => {
        this.setState ({purchasing: false})
    }
    
    purchaseContinueHandler = () => {   
        this.props.onInitPurchase();   
        this.props.history.push('/checkout');
    }

    render() {

        const disabledInfo = {
            ...this.props.ingredients
        };
        for(let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <= 0
        }

        let orderSummary = null;
        let burger = this.props.error ? <h1>Ingridients fail</h1> : <Spinner/>
        
        if(this.props.ingredients){
            burger = (
                <Aux>
                    <Burger ingredients = {this.props.ingredients}/>
                    <BuildControls 
                            added = {this.props.onIngredientAdded}
                            removed = {this.props.onIngredientRemoved}
                            disabled = {disabledInfo}
                            price = {this.props.totalPrice}
                            purchasable = {this.updatePurchaseState(this.props.ingredients)}
                            orderClick = {this.purchaseHnadler}
                            isAuthenticated = {this.props.isAuthenticated}/>
                </Aux>
            );
            orderSummary =
                <OrederSummary 
                    ingredients = {this.props.ingredients}
                    price = {this.props.totalPrice}
                    purchaseCancelled = {this.purchaseCancleHandler}
                    purchaseContinue = {this.purchaseContinueHandler}/>
        } 

        return (
            <Aux>
                <Modal 
                    show = {this.state.purchasing} 
                    modalClosed = {this.purchaseCancleHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }
}

const mapStateToProps = state => {
    return {
        ingredients: state.burgerBuilder.ingredients,
        totalPrice: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error,
        purchased: state.order.purchased,
        isAuthenticated: state.auth.token !== null
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch(actions.addIngredient(ingName)),
        onIngredientRemoved: (ingName) => dispatch(actions.removeIngredient(ingName)),
        onInitIngredients: () => dispatch(actions.initIngredients()),
        onInitPurchase: () => dispatch(actions.purchaseInit()),
        onSetAuthRedirectPath: (path) => dispatch(actions.setAuthPathRedirect(path))
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));