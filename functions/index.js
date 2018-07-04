const functions = require('firebase-functions');
const cors = require("cors")({origin: true});
const fs = require("fs");
const gcconfig = {
    projectId: "react-native-myt-1530315514387",
    keyFilename: "awesome-place.json"
}
const gcs = require("@google-cloud/storage")(gcconfig);
const UUID = require("uuid-v4");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.storeImage = functions.https.onRequest((request, response) => {
    // cors is used since we will be running this on a native device
    cors(request, response, () => {
        //parse the request body which is the image
        const body = JSON.parse(request.body);
        // this writes the file and blocks the execution until its done to temp area
        fs.writeFileSync("/tmp/uploaded-image.jpg", body.image, "base64", err => {
            console.log(err);
            return response.status(500).json({error: err});
        });
        const bucket = gcs.bucket("react-native-myt-1530315514387.appspot.com");
        const uuid = UUID();

        bucket.upload("/tmp/uploaded-image.jpg", {
            //specify type
            upload: "media",
            destination: "/place/" + uuid + ".jpg",
            metadata: {
                metadata: {
                    contentType: "image/jpeg",
                    firebaseStorageDownloadTokens: uuid
                }
            }
        }, (err, file) => {
            if (!err) {
                return response.status(201).json({
                  imageUrl:
                    "https://firebasestorage.googleapis.com/v0/b/" +
                    bucket.name +
                    "/o/" +
                    encodeURIComponent(file.name) +
                    "?alt=media&token=" +
                    uuid
                });
            } else {
                console.log(err);
                response.status(500).json({error: err});
            }
        });
    });
});
