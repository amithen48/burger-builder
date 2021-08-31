import React from 'react';

import styles from './Order.module.css';

const Order = (props) => {

   const ingredients = [];

    for(let ingredientName in props.ingredients) {
        ingredients.push({
            name: ingredientName,
            amount: props.ingredients[ingredientName]
        })
    }

    const ingredientOutput = ingredients.map(ig => {
        return <div 
                    key={ig.name} 
                    style={{
                        display:'inline-block', 
                        textTransform:'capitalize',
                        margin: '0 8px',
                        border: '1px solid #ccc',
                        padding: '5px' 
                    }}
                    >{ig.name} : {ig.amount}</div>
    })

    return(
        <div className={styles.Order}>
            <div>Ingredients : {ingredientOutput}</div>
            <div style={{marginTop:'10px'}}>Price: <strong>USD {Number.parseFloat(props.price).toFixed(2)}</strong></div>
        </div>
    );
}

export default Order;