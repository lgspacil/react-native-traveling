import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';

import startMainTabs from "../MainTabs/startMainTab";

class AuthScreen extends Component {

    loginHandlser = () => {
        startMainTabs();
    }

    render () {
        return (
            <View>
                <Text>Auth Screen</Text>
                <Button title="Login" onPress={this.loginHandlser}/>
            </View>
        );
    }
}

export default AuthScreen;