import React, { Component } from "react";
import {
  View,
  Image,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Dimensions,
  ScrollView
} from "react-native";
import { connect } from "react-redux";
import ImageGallery from "../../components/ImageGallery/ImageGallery";
import MapModal from "../../components/MapModal/MapModal";
import Icon from "react-native-vector-icons/Ionicons";
import { deletePlace } from "../../store/actions/index";

class PlaceDetail extends Component {
  state = {
    viewMode: "portrait",
    modal: false,
    imageView: false
  };

  constructor(props) {
    super(props);
    Dimensions.addEventListener("change", this.updateStyles);
  }

  componentWillUnmount() {
    Dimensions.removeEventListener("change", this.updateStyles);
  }

  updateStyles = dims => {
    this.setState({
      viewMode: dims.window.height > 500 ? "portrait" : "landscape"
    });
  };

  placeDeletedHandler = () => {
    this.props.onDeletePlace(this.props.selectedPlace.key);
    this.props.navigator.pop();
  };

  mapModalHandler = () => {
    this.setState(prevState => {
      return {
        modal: prevState.modal ? false : true
      };
    });
  }

  imageModalHandler = () => {
    this.setState(prevState => {
      return {
        imageView: prevState.imageView ? false : true
      };
    });
  };

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
        <TouchableOpacity onPress={this.imageModalHandler}>
          <View style={styles.pictureContainer}>
            <Image
              source={this.props.selectedPlace.image}
              style={styles.placeImage}
            />
          </View>
        </TouchableOpacity>

          <ImageGallery openViewModal={this.state.imageView} onViewModalClosed={this.imageModalHandler} imageData={this.props.selectedPlace.image}/>

            <Button title="View Location on Google Maps" onPress={this.mapModalHandler}/>
            <MapModal mapInfo={this.props.selectedPlace.location} openMapModal={this.state.modal} onModalClosed={this.mapModalHandler}/>        

          <View >
            <Text style={styles.placeName}>
              {this.props.selectedPlace.name}
            </Text>
          </View>

          <View>
            <Text>
              {this.props.selectedPlace.description}
            </Text>
          </View>

          <View>
            <TouchableOpacity onPress={this.placeDeletedHandler}>
              <View style={styles.deleteButton}>
                <Icon
                  size={30}
                  name={Platform.OS === "android" ? "md-trash" : "ios-trash"}
                  color="red"
                />
              </View>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    margin: 22,
    flex: 1,
  },
  placeImage: {
    width: "100%",
    height: "100%"
  },
  placeName: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 28
  },
  map: {
    flex: 1
  },
  deleteButton: {
    alignItems: "center"
  },
  pictureContainer: {
    height: 300,
    width: '100%',
    marginBottom: 10
  },
  mapContiner: {
    height: 200,
    width: '100%'
  }
});

const mapDispatchToProps = dispatch => {
  return {
    onDeletePlace: key => dispatch(deletePlace(key))
  };
};

export default connect(null, mapDispatchToProps)(PlaceDetail);


{/* <View style={styles.mapContiner}>
            <MapView
              initialRegion={{
                ...this.props.selectedPlace.location,
                latitudeDelta: 0.0122,
                longitudeDelta:
                  Dimensions.get("window").width /
                  Dimensions.get("window").height *
                  0.0122
              }}
              style={styles.map}
            >
              <MapView.Marker coordinate={this.props.selectedPlace.location} />
            </MapView>
          </View> */}