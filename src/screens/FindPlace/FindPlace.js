import React, { Component } from 'react';
import {View, TouchableOpacity, StyleSheet, Text, Animated} from 'react-native';
import { connect } from 'react-redux';
import PlaceList from '../../components/PlaceList/PlaceList';
import { getPlaces } from "../../store/actions/index";

class FindPlaceScreen extends Component{
    //coloring the button in the navbar when clicked
    static navigatorStyle = {
        navBarButtonColor: "orange"
    }

    state = {
        placeLoaded: false,
        removeAnim: new Animated.Value(1),
        placesAnim: new Animated.Value(0)
    }
    
    constructor(props) {
        super(props);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent)
    }

    placesSearchHandler = () => {
        Animated.timing(this.state.removeAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true
        }).start();
        this.setState({
            placeLoaded: true
        });
        this.placesLoadedHandler();
    }

    placesLoadedHandler = () => {
        Animated.timing(this.state.placesAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true
        }).start();
      };

    onNavigatorEvent = event => {
        // load this when you enter the screen again even if you have visited before
        if (event.type === "ScreenChangedEvent") {
            if(event.id === "willAppear") {
                this.props.onLoadPlaces();
            }
        }
        if(event.type == "NavBarButtonPress"){
            if(event.id == "sideDrawerToggle"){
                this.props.navigator.toggleDrawer({
                    side: "left"
                })
            }
        }
    }
    
    itemSelectedHandler = key => {
        const selPlace = this.props.places.find(place => {
            return place.key === key;
        });
        this.props.navigator.push({
            screen: "awesome-places.PlaceDetailScreen",
            title: selPlace.name,
            passProps: {
                selectedPlace: selPlace
            }
        })
    };

    render(){
        let content = (
            <Animated.View 
                style={{
                    opacity: this.state.removeAnim,
                    transform: [
                        {
                            scale: this.state.removeAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [12, 1]
                            })
                        }
                    ]
                }}
            >
                <TouchableOpacity onPress={this.placesSearchHandler}>
                    <View style={styles.searchButton}>
                        <Text style={styles.searchButtonText}>Find Places</Text>
                    </View>
                </TouchableOpacity>
            </Animated.View>
        )
        if (this.state.placeLoaded){
            content = (
                <Animated.View
                    style={{
                        opacity: this.state.placesAnim
                    }}
                >
                    <PlaceList 
                        places={this.props.places} 
                        onItemSelected={this.itemSelectedHandler}
                    />
                </Animated.View>
            );
        }
        return (
            <View style={this.state.placeLoaded ? null : styles.buttonContainer}>
                {content}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    buttonContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    searchButton: {
        borderColor: "orange",
        borderWidth: 3,
        borderRadius: 50,
        padding: 20
    },
    searchButtonText: {
        color: "orange",
        fontWeight: "bold",
        fontSize: 26
    }
})

// want to grab the state values
const mapStateToProps = state => {
    return {
        places: state.places.places
    }
    console.log('can you see the places here?', places)
}

const mapDispatchToProps = dispatch => {
    return {
        onLoadPlaces: () => dispatch(getPlaces())
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(FindPlaceScreen);