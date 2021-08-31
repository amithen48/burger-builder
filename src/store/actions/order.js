import * as actionTypes from './actionTypes';
import axios from '../../axios-orders';

export const purchaseBurgerSuccess = (id,orderData) => {
    return{
        type: actionTypes.PURCHASE_BURGER_SUCCESS,
        orderID: id,
        orderData: orderData

    };
};

export const purchaseBurgerFail = (error) => {
    return{
        type: actionTypes.PURCHASE_BURGER_FAIL,
        error: error
    };
};

export const purchaseBurgerStart = () => {
    return{
        type: actionTypes.PURCHASE_BURGER_START
    };
};

export const purchaseBurger = (order, token) => {
    return dispatch => {
        dispatch(purchaseBurgerStart());
        axios.post('/orders.json?auth=' + token, order)
        .then(response => {
            dispatch(purchaseBurgerSuccess(response.data.name, order));
        })
        .catch(error => {
            dispatch(purchaseBurgerFail(error));
        }); 
    };
};

export const purchaseInit = () => {
    return{
        type: actionTypes.PURCHASE_INIT
    };
};

export const fetchOrdersFailed = (error) => {
    return{
        type: actionTypes.FETCH_ORDERS_FAILED,
        error: error
    };
};

export const fetchOrdersSuccess= (orders) => {
    return{
        type: actionTypes.FETCH_ORDERS_SUCCESS,
        orders: orders
    };
};

export const fetchOrdersStart= () => {
    return{
        type: actionTypes.FETCH_ORDERS_START
    };
};

export const fetchOrders = (token, userID) => {
    return dispatch => {
        dispatch(fetchOrdersStart());
        const queryParams = '?auth' + token + '&orderBy="userID"&equalTo"' + userID + '"'
        axios.get('/orders.json' + queryParams)
        .then(response => {
            const fetchedOrders = [];
            for(let key in response.data){
                fetchedOrders.push({
                    ...response.data[key],
                    id: key
                });
            }
            dispatch(fetchOrdersSuccess(fetchedOrders));
        })
        .catch(error => {
            dispatch(fetchOrdersFailed(error))
        });
    };
};