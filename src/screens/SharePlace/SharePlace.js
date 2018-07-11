import React, { Component } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Image, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { addPlace } from '../../store/actions/index';
import PlaceInput from '../../components/PlaceInput/PlaceInput';
import MainText from "../../components/UI/MainText/MainText";
import HeadingText from "../../components/UI/HeadingText/HeadingText";
import PickImage from "../../components/PickImage/PickImage";
import PickLocation from "../../components/PickLocation/PickLocation";
import validate from "../../utility/validation";
import {startAddPlace} from "../../store/actions/index";


class SharePlaceScreen extends Component {
    // coloring the nav bar button when clicked
    static navigatorStyle = {
        navBarButtonColor: "orange"
    }

    constructor(props) {
        super(props);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent)
    }

    componentWillMount() {
        // initializing the state
        this.reset();
    }

    reset = () => {
        this.setState({
            controls: {
                placeName: {
                    value: "",
                    valid: false,
                    touched: false,
                    validationRules: {
                        notEmpty: true
                    }
                },
                location: {
                    value: null,
                    valid: false
                },
                image: {
                    valid: false,
                    value: null
                }
            }
        });
    }

    componentDidUpdate() {
        // will switch tabs as after we have added a new place
        if(this.props.placeAdded){
            this.props.navigator.switchToTab({tabIndex: 0});
            // this.props.onStartAddPlace();
        }
    }

    onNavigatorEvent = event => {
        if (event.type === "ScreenChangedEvent") {
            if(event.id === "willAppear") {
                this.props.onStartAddPlace();
            }
        }
        if (event.type == "NavBarButtonPress") {
            if (event.id == "sideDrawerToggle") {
                this.props.navigator.toggleDrawer({
                    side: "left"
                })
            }
        }
    }

    placeAddedHandler = () => {
        this.props.onAddPlace(
            this.state.controls.placeName.value,
            this.state.controls.location.value,
            this.state.controls.image.value
        );
        this.reset();
        this.imagePicker.reset();
        this.locationPicker.reset();
    }

    locationPickedHandler = location => {
        this.setState(prevState => {
            return {
                controls: {
                    ...prevState.controls,
                    location: {
                        value: location,
                        valid: true
                    }
                }
            };
        });
    };

    placeNameChangedHandler = val => {
        this.setState(prevState => {
            return {
                controls: {
                    ...prevState.controls,
                    placeName: {
                        ...prevState.controls.placeName,
                        value: val,
                        valid: validate(val, prevState.controls.placeName.validationRules),
                        touched: true
                    }
                }
            }
        })
    }

    imagePickedHandler = image => {
        this.setState(prevState => {
            return {
                controls: {
                    ...prevState.controls,
                    image: {
                        value: image,
                        valid: true
                    }
                }
            }
        })
    }

    render() {
        let submitButton = (
            <Button
                title="Share the Place!"
                onPress={this.placeAddedHandler}
                disabled={!this.state.controls.placeName.valid ||
                    !this.state.controls.location.valid ||
                    !this.state.controls.image.valid} />
        )

        if (this.props.isLoading) {
            submitButton = <ActivityIndicator />
        }
        return (
            <ScrollView>
                <View style={styles.container}>
                    <MainText>
                        <HeadingText>Share a Place with us!</HeadingText>
                    </MainText>
                    {/* ref is giving us access to the pickImage component */}
                    <PickImage onImagePicked={this.imagePickedHandler} ref={ref => (this.imagePicker = ref)}/>
                    <PickLocation onLocationPick={this.locationPickedHandler} ref={ref => (this.locationPicker = ref)}/>
                    <PlaceInput
                        placeData={this.state.controls.placeName}
                        onChangeText={this.placeNameChangedHandler}
                    />
                    <KeyboardAvoidingView style={styles.container} behavior="padding">
                        <View style={styles.button}>
                            {submitButton}
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //align items is the 2nd cross axis
        alignItems: "center"
    },
    placeholder: {
        borderWidth: 1,
        borderColor: "black",
        backgroundColor: "#eee",
        width: "80%",
        height: 150
    },
    button: {
        margin: 8
    },
    previewImage: {
        height: "100%",
        width: "100%"
    }
})

const mapStateToProps = state => {
    return {
        // the ui is what we called uiReducer in configure store
        isLoading: state.ui.isLoading,
        placeAdded: state.places.placeAdded
    };
};

//dispatch means that you want to run a function in redux
const mapDispatchToProps = dispatch => {
    return {
        onAddPlace: (placeName, location, image) => dispatch(addPlace(placeName, location, image)),
        onStartAddPlace: () => dispatch(startAddPlace())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SharePlaceScreen);