import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Button from '../../Components/UI/Button/Button';
import Input from '../../Components/UI/Input/Input';
import Spinner from '../../Components/UI/Spinner/Spinner';
import styles from './Auth.module.css';
import * as actions from '../../store/actions/index';
 
class Auth extends Component {

    state = {
        controls: {
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
            password: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder:'Your Password'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 6
                },
                valid: false,
                touched: false
            },
        },
        isSignUp: true
    }

    componentDidMount () {
        if(!this.props.building && this.props.authRedirectPath !== '/') {
            this.props.onSetAuthRedirectPath();
        }
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

    inputChangedHandler = (event, inputID) => {
        const updatedControls = {
            ...this.state.controls,
            [inputID]: {
                ...this.state.controls[inputID],
                value: event.target.value,
                valid: this.checkValidatity(event.target.value, this.state.controls[inputID].validation),
                touched: true
            }
        };
        this.setState({controls: updatedControls});
    }

    submitHandler = (event) => {
        event.preventDefault();
        this.props.onAuth(this.state.controls.email.value, this.state.controls.password.value, this.state.isSignUp)
    }

    switchAuthModeHandler = () => {
        this.setState(prevState => {
            return {isSignUp: !prevState.isSignUp}
        })    
    }

    render() {
        const inputs = [];
        for(let key in this.state.controls){
            inputs.push({
                id: key,
                config: this.state.controls[key]
            });
        }

        let errorMessage = this.props.error ? 
        <p>
            {this.props.error.message}    
        </p>
        :
        null;



        let form = this.props.loading ?
        <Spinner/>
        : 
        inputs.map(input => (
            <Input 
                key = {input.id}
                elementType={input.config.elementType} 
                elementConfig={input.config.elementConfig} 
                value={input.config.value}
                invalid={!input.config.valid}
                shouldValidate={input.config.validation}
                touched={input.config.touched}
                changed={(event) => this.inputChangedHandler(event, input.id)}/>
        ));

        let authRedirect = null;
        if(this.props.isAuthenticated) {
            authRedirect = <Redirect to ={this.props.authRedirectPath}/>
        }

        return (
            <div className={styles.Auth}>
                <h1>{this.state.isSignUp ? 'SIGN UP' : 'SIGN IN'}</h1>
                {authRedirect}
                {errorMessage}
                <form onSubmit={this.submitHandler}>
                    {form}
                    <Button btnType='Success'>SUBMIT</Button>
                </form>
                <Button 
                btnType='Danger'
                clicked={this.switchAuthModeHandler}>SWITCH TO {this.state.isSignUp ? 'SIGN IN' : 'SIGN UP'}</Button>       
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        isAuthenticated: state.auth.token !== null,
        building: state.burgerBuilder.building,
        authRedirectPath: state.auth.authRedirectPath
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email, password, isSignUp) => dispatch(actions.auth(email, password, isSignUp)),
        onSetAuthRedirectPath: () => dispatch(actions.setAuthPathRedirect('/'))
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Auth);


