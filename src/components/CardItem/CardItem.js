import React from "react";
import { View } from "react-native";
import { Card, CardAction, CardButton, CardImage } from 'react-native-cards';


const cardItem = props => (

    <Card>
        <CardImage
            source={props.placeImage}
            title={props.placeName}
        />
        <CardAction
            separator={true}
            inColumn={false}>
            <CardButton
                onPress={props.onItemPressed}
                title="Explore"
                color="#4e6891"
            />
        </CardAction>
    </Card>
);



export default cardItem;
