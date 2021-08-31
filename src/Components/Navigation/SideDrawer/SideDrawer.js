import React from 'react';

import styles from './SideDrawer.module.css';
import Logo from '../../Logo/Logo';
import NavigationItems from '../NavigationItems/NavigationItems';
import BackDrop from '../../UI/Backdrop/Backdrop';
import Aux from '../../../hoc/Auxiliary';

const SideDrawer = (props) => {

    let attachedClasses = [styles.SideDrawer, styles.Close];

    if(props.show){
        attachedClasses[1] = styles.Open;
    }

    return(
        <Aux>
            <BackDrop show = {props.show} clicked = {props.closed}/>
            <div className = {attachedClasses.join(' ')}>
                <div className = {styles.Logo}>
                    <Logo/>
                </div>
                <nav>
                    <NavigationItems isAuthenticated = {props.isAuthenticated}/>
                </nav>
            </div>
        </Aux>
    )
}

export default SideDrawer;