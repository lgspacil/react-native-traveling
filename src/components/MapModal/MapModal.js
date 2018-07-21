import React from 'react';

import { Modal, View, Text, StyleSheet, Dimensions, Button } from 'react-native';
import MapView from "react-native-maps";

const mapModal = props => (
    <Modal onRequestClose={props.onModalClosed} visible={props.openMapModal} animationType="slide">
        <View>
            <Button title="Close" onPress={props.onModalClosed} color="#4064935e"/>
            <View style={styles.mapContiner}>
                <MapView
                    initialRegion={{
                        ...props.mapInfo,
                        latitudeDelta: 0.0122,
                        longitudeDelta:
                            Dimensions.get("window").width /
                            Dimensions.get("window").height *
                            0.0122
                    }}
                    style={styles.map}
                >
                    <MapView.Marker coordinate={props.mapInfo} />
                </MapView>
            </View>
            
        </View>
    </Modal>
)

const styles = StyleSheet.create({
    
    map: {
      flex: 1
    },
    mapContiner: {
      height: "100%",
      width: '100%'
    }
  });

export default mapModal;