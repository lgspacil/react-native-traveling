import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated } from "react-native";

class ListItem extends Component {

  state = {
    animated: new Animated.Value(0)
  }

  constructor(props) {
    super(props);
  }

  componentDidUpdate(){
    //resetting
    this.state.animated.setValue(0);
  }

  annimate = () => {
    //resetting the annimation
    Animated.timing(this.state.animated, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true
    }).start(() => {
      this.props.onItemPressed();
    });
  }

  render(){
    // opacity annimation
    const opacity = this.state.animated.interpolate({
      // for every interpolation value of 0 we will map 0
      // then it will move to 1 with 1
      // this is linear interpolation
      inputRange:[0,1],
      outputRange:[1,0]
    })

    //move item to the right
    const translateX = this.state.animated.interpolate({
      inputRange:[0,1],
      outputRange:[0,500]
    })

    //translate needs to be passed to transform 
    const transform = [{translateX}];

    return (
      <Animated.View style={{transform}}>
      <TouchableOpacity onPress={this.annimate}>
        <View style={styles.listItem}>
          <Image resizeMode="cover" source={this.props.placeImage} style={styles.placeImage} />
          <Text>{this.props.placeName}</Text>
        </View>
      </TouchableOpacity>
      </Animated.View>
    )
  };
};

const styles = StyleSheet.create({
  listItem: {
    width: "100%",
    marginBottom: 5,
    padding: 10,
    backgroundColor: "#eee",
    flexDirection: "row",
    alignItems: "center"
  },
  placeImage: {
      marginRight: 8,
      height: 30,
      width: 30
  }
});

export default ListItem;
