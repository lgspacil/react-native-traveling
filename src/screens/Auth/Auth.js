import React, { Component, } from 'react';
import { View, StyleSheet, ImageBackground, Dimensions, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import DefaultInput from '../../components/UI/DefaultInput/DefaultInput';
import HeadingText from '../../components/UI/HeadingText/HeadingText';
import MainText from '../../components/UI/MainText/MainText';
import backgroundImage from '../../assets/background.jpg';
import ButtonWithBackground from '../../components/UI/Button/ButtonWithBackground';
import validate from '../../utility/validation'
import  { connect } from 'react-redux';
import { tryAuth } from '../../store/actions/index';
import startMainTabs from "../MainTabs/startMainTab";

class AuthScreen extends Component {
    state = {
        viewMode: Dimensions.get("window").height > 500 ? "portrait" : "landscape",
        controls: {
            email: {
                value: "",
                valid: false,
                validationRules: {
                    isEmail: true
                },
                touched: false
            },
            password: {
                value: "",
                valid: false,
                validationRules: {
                    minLength: 6
                },
                touched: false
            },
            confirmPassword: {
                value: "",
                valid: false,
                validationRules: {
                    equalTo: 'password'
                },
                touched: false
            }
        },
        authMode: "login"
    }

    constructor(props){
        super(props);
        // this changes the styles dynamically when you rotate the phone
        Dimensions.addEventListener("change", (dims) => {
            this.setState({
                viewMode: Dimensions.get("window").height > 500 ? "portrait" : "landscape"
            })
        })
    }

    switchAuthModeHandler = () => {
        this.setState(prevState => {
            return  {
                authMode: prevState.authMode === "login" ? "signup" : "login"
            }
        })
    }

    //stops listening to event
    componentWillUnmount() {
        Dimensions.removeEventListener("change", (dims) => {
            this.setState({
                viewMode: Dimensions.get("window").height > 500 ? "portrait" : "landscape"
            })
        })
    }

    loginHandler = () => {
        const authData = {
            email: this.state.controls.email.value,
            password: this.state.controls.password.value
        }
        // this is a redux action we pulled in 
        this.props.onLogin(authData);
        startMainTabs();
    }

    // key is email, password or confirmPassword
    updateInputState = (key, value) => {
        let connectedValue = {};
        if(this.state.controls[key].validationRules.equalTo){
            const equalControl = this.state.controls[key].validationRules.equalTo; //in this case its "password"
            const equalValue = this.state.controls[equalControl].value; // this is looking into controls['password'] value 
            connectedValue = {
                ...connectedValue,
                equalTo: equalValue
            }
        }
        if(key === 'password') {
            connectedValue = {
                ...connectedValue,
                equalTo: value
            }
        }
        this.setState(prevState => {
            return {
                controls: {
                    ...prevState.controls,
                    confirmPassword: {
                        ...prevState.controls.confirmPassword,
                        valid: key === 'password' ? validate(prevState.controls.confirmPassword.value, prevState.controls.confirmPassword.validationRules, connectedValue) : prevState.controls.confirmPassword.valid
                    },
                    [key] : {
                        ...prevState.controls[key],
                        value: value,
                        valid: validate(value, prevState.controls[key].validationRules, connectedValue),
                        touched: true
                    }
                }
            }
        });
    }

    render() {
        let headingText = null;
        let confirmPasswordControl = null;

        if (this.state.authMode === 'signup'){
            confirmPasswordControl = (
                <View style={this.state.viewMode === "portrait" ? styles.portraitPasswordWrapper : styles.landscapePasswordWrapper}>
                    <DefaultInput 
                    placeholder="Confirm Password" 
                    style={styles.input}
                    value={this.state.controls.confirmPassword.value} 
                    valid={this.state.controls.confirmPassword.valid}
                    touched={this.state.controls.confirmPassword.touched}
                    onChangeText={(val) => this.updateInputState('confirmPassword', val)}
                    secureTextEntry />
                </View>
            )
        }

        if(this.state.viewMode === "portrait"){
            headingText = (
                <MainText>
                    <HeadingText>Please Log In</HeadingText>
                </MainText>
            )
        }
        return (
            <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
                {/* Brings up the view with padding when the keyboard is open */}
                <KeyboardAvoidingView style={styles.container} behavior="padding">
                    {headingText}
                    <ButtonWithBackground 
                    color="#29aaf4" 
                    onPress={this.switchAuthModeHandler}
                    >Switch to {this.state.authMode ===  'login' ? 'Sign up' : 'Login'}
                    </ButtonWithBackground>

                    {/*  when you want to exit the keyboard click here */}
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.inputContainer}>

                            <DefaultInput 
                            placeholder="Your email address" 
                            style={styles.input} 
                            value={this.state.controls.email.value} 
                            valid={this.state.controls.email.valid}
                            touched={this.state.controls.email.touched}
                            onChangeText={(val) => this.updateInputState('email', val)}
                            autoCorrect={false}
                            autoCapitalize="none"
                            keyboardType="email-address"/>

                            <View style={this.state.viewMode === "portrait" || this.state.authMode === "login" ? styles.portraitPasswordContainer : styles.landscapePasswordContainer}>
                                <View style={this.state.viewMode === "portrait" || this.state.authMode === "login" ? styles.portraitPasswordWrapper : styles.landscapePasswordWrapper }>
                                    <DefaultInput 
                                    placeholder="Password" 
                                    style={styles.input} 
                                    value={this.state.controls.password.value} 
                                    valid={this.state.controls.password.valid}
                                    touched={this.state.controls.password.touched}
                                    onChangeText={(val) => this.updateInputState('password', val)}
                                    secureTextEntry/>
                                </View>
                                {confirmPasswordControl}
                            </View>

                        </View>
                    </TouchableWithoutFeedback>
                    <ButtonWithBackground 
                    color="#29aaf4" 
                    onPress={this.loginHandler}
                    disabled={
                        !this.state.controls.confirmPassword.valid && this.state.authMode === "signup" || 
                        !this.state.controls.password.valid || 
                        !this.state.controls.email.valid}
                    >Submit</ButtonWithBackground>
                </KeyboardAvoidingView>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    inputContainer: {
        width: "80%"
    },
    input: {
        backgroundColor: "#eee",
        borderColor: "#bbb"
    },
    backgroundImage: {
        width: '100%',
        flex: 1,
    },
    landscapePasswordContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    portraitPasswordContainer: {
        flexDirection: 'column',
        justifyContent: 'flex-start'
    },
    landscapePasswordWrapper: {
        width: '45%'
    },
    portraitPasswordWrapper: {
        width: '100%'
    }
})

// able to fire off a function in redux
const mapDispatchToProps = dispatch => {
    return {
        onLogin: (authData) => dispatch(tryAuth(authData))
    }
};

export default connect(null, mapDispatchToProps)(AuthScreen);