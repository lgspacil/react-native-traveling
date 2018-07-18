import React from 'react';
import {Modal, Button} from 'react-native';
import Gallery from 'react-native-image-gallery';

const imageGallery = props => (
  <Modal onRequestClose={props.onViewModalClosed} visible={props.openViewModal} animationType="slide">
    <Gallery
        style={{ flex: 1, backgroundColor: 'black' }}
        images={[
          { source: props.imageData, dimensions: { width: 150, height: 150 } }
          // { source: { uri: 'http://i.imgur.com/XP2BE7q.jpg' } },
          // { source: { uri: 'http://i.imgur.com/5nltiUd.jpg' } },
          // { source: { uri: 'http://i.imgur.com/6vOahbP.jpg' } },
          // { source: { uri: 'http://i.imgur.com/kj5VXtG.jpg' } }
        ]}
      />
    </Modal>
)


export default imageGallery;