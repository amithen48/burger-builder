import React, { Component } from 'react';
import { connect } from 'react-redux';

import Aux from '../../hoc/Auxiliary';
import styles from './Layout.module.css';
import Toolbar from '../../Components/Navigation/Toolbar/Toolbar';
import Sidedrawer from '../../Components/Navigation/SideDrawer/SideDrawer';

class Layout extends Component {

    state = {
        showSideDrawer: false
    }

    sideDrawerClosedHandler = () => {
        this.setState ({showSideDrawer: false});
    }

    sideDrawerToggleHandler = () => {
        this.setState((prevState) => {
            return {showSideDrawer: !prevState.showSideDrawer};
        })
    }

    render(){
        return(
            <Aux>
                <Toolbar 
                    toggle = {this.sideDrawerToggleHandler}
                    isAuthenticated = {this.props.isAuthenticated}/>
                <Sidedrawer 
                    isAuthenticated = {this.props.isAuthenticated}
                    closed = {this.sideDrawerClosedHandler}
                    show = {this.state.showSideDrawer}/>
                <main className = {styles.Content}>
                    {this.props.children}
                </main>
            </Aux>
        )
    }
}

const mapStateToProps = state => {
    return{
        isAuthenticated: state.auth.token !== null, 
    }
}
    
export default connect(mapStateToProps)(Layout);