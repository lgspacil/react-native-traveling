import React from "react";
import { StyleSheet, FlatList } from "react-native";

import CardItem from "../CardItem/CardItem";

const placeCard = props => {
    console.log(props.places)
  return (
      <FlatList
      style={styles.listContainer}
      data={props.places}
      renderItem={(info) => (
        <CardItem
          placeName={info.item.name}
          placeImage={info.item.image}
          // calling a function automatically
          onItemPressed={() => props.onItemSelected(info.item.key)}
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    width: "100%"
  }
});

export default placeCard;





