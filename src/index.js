import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import firebase from 'firebase';

// Firebase configuration, from firebase.google.com. You can make your own free database
// and rewrite what is down here. You will need to change database write permissions to be
// public if you want, or you can implement authentication to the app to work.
let config = {
    apiKey: "AIzaSyCRiFHRaXdvvESjqkORQ05KQyj4iMJRoR4",
    authDomain: "frc2090scouting2018.firebaseapp.com",
    databaseURL: "https://frc2090scouting2018.firebaseio.com",
    projectId: "frc2090scouting2018",
    storageBucket: "frc2090scouting2018.appspot.com",
    messagingSenderId: "815010828374"
};
firebase.initializeApp(config);

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
