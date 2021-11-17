import React, { useEffect, useState } from 'react'
import { Button, Form, Card } from 'react-bootstrap'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getAuth, updateProfile } from "firebase/auth";
import CardHeader from 'react-bootstrap/esm/CardHeader';
import './UserProfile.css'


export default function UserProfile({ close }) {

    const [file, setFile] = useState(null)
    const [imgUrl, setImgUrl] = useState("")

    console.log(file)
    const handleChange = e => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
        }
        console.log(file)
    };

    function addImage() {
        const storage = getStorage();
        const storageRef = ref(storage, file.name);

        const uploadTask = uploadBytesResumable(storageRef, file);

        // Register three observers:
        // 1. 'state_changed' observer, called any time the state changes
        // 2. Error observer, called on failure
        // 3. Completion observer, called on successful completion
        uploadTask.on('state_changed',
            (snapshot) => {
                // Observe state change events such as progress, pause, and resume
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                }
            },
            (error) => {
                // Handle unsuccessful uploads
            },
            () => {
                // Handle successful uploads on complete
                // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log('File available at', downloadURL);
                    setImgUrl(downloadURL)
                });

            }
        );
    }

    async function saveChanges(){
        const auth = getAuth();
updateProfile(auth.currentUser, {
   photoURL: imgUrl
}).then(() => {
  // Profile updated!
  // ...
}).catch((error) => {
  // An error occurred
  // ...
});
    }




    return (
        <div className="container">
            <Card className="profile-card">
            <CardHeader className="user-profile"><h3>Update Your Profile Information <button className="close" onClick={close}>X</button></h3>
            </CardHeader>

                 <Form onSubmit={saveChanges}>
                    <Form.Group>
                        <Form.Label>Add a profile Image</Form.Label>
                        <Form.Control type="file" accept=".png,.jpg,.jpeg" onChange={handleChange} />
                        <Button onClick={addImage}>Add Image to Profile</Button>
                    </Form.Group>
                    <Button type="submit">Save Changes</Button>
                </Form>
            </Card>
        </div>
    )
}
