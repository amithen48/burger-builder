import React from 'react';
import { withRouter } from 'react-router-dom';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';

import styles from './Burger.module.css';

const Burger = (props) => {

    console.log(props);

    //turning an object to an array and that array to a list
    let transformedIngredients = Object.keys(props.ingredients)
    .map(igKey => {
        return [...Array(props.ingredients[igKey])].map((_,i) => {
            return <BurgerIngredient key = {igKey + i} type = {igKey}/>
        });
    })
    .reduce((arr, el) => {
        return arr.concat(el)
    }, []);

    console.log(transformedIngredients);

    if(transformedIngredients.length === 0) {
        transformedIngredients = <p>Please start adding ingredients</p>        
    }

    return (
        <div className = {styles.Burger}>
            <BurgerIngredient type = 'bread-top'/>
            {transformedIngredients}
            <BurgerIngredient type = 'bread-bottom'/>
        </div>
    );
};

export default withRouter(Burger);