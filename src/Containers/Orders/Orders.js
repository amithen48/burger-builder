import React, {Component} from 'react';
import { connect } from 'react-redux';

import axios from '../../axios-orders';
import Order from '../../Components/Order/Order';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../store/actions/index';
import Spinner from '../../Components/UI/Spinner/Spinner';


class Orders extends Component {

    componentDidMount () {
        this.props.onFetchOrders(this.props.token, this.props.userID);
    }

    render() {

        let orders = this.props.loading ? 
        <Spinner/>
        :
        <div>
            {this.props.orders.map(order => (
                <Order 
                key={order.id} 
                price={order.price} 
                ingredients={order.ingredients} />
            ))}
        </div>
    
        return(
            <div>
                {orders}           
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        orders: state.order.orders,
        loading: state.order.loading,
        token: state.auth.token,
        userID: state.auth.userID
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onFetchOrders: (token, userID) => dispatch(actions.fetchOrders(token, userID)),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(withErrorHandler(Orders, axios));


