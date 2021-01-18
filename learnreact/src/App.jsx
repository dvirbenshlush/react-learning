// import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react'
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import {useAuthState} from 'react-firebase-hooks/auth'
import {useCollectionData} from 'react-firebase-hooks/firestore'




firebase.initializeApp({
    apiKey: "AIzaSyAqvHJnFUrH7462FrNexcvdarwFklZCZCo",
    authDomain: "chatweb-10bb0.firebaseapp.com",
    projectId: "chatweb-10bb0",
    storageBucket: "chatweb-10bb0.appspot.com",
    messagingSenderId: "704834103403",
    appId: "1:704834103403:web:e4563c8d0412969223a92e",
    measurementId: "G-WE0TJPRLLQ"
})

const auth = firebase.auth();
const firestore = firebase.firestore();


function App() {
    const [user] = useAuthState(auth);

    return ( 
        <div className = "App" >
        <header className = "App-header" >
         
         </header>
        <section>
            {user ? <ChatRoom/> : <SignIn/>}
        </section>
          </div>
    );
}

function SignIn(){
    const signInWithGoogle = ()=>{
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider);
    }

        return(
        <button onClick={signInWithGoogle}>Sign in with google</button>
    )
}

function SignOut(){
    return auth.currentUser && (
        <button onClick={()=>auth.signOut}>Sign out</button>
    )
}

function ChatRoom(){
    const messageRef = firestore.collection('messages')
    const query = messageRef.orderBy('createAt').limit(25)

    const [messages] = useCollectionData(query, {idField:'id'})
    const [formValue, setFormValue] = useState('') 

    const sendMessage = async(e) => {
        e.preventDefault()
        const {uid, photoURL} =auth.currentUser;
        await messageRef.add({
           text: formValue,
           createAt: firebase.firestore.FieldValue.serverTimestamp(),
           uid,
           photoURL 
        });
        setFormValue('')
    }

    return(
        <>
        <div>
            {messages && messages.map(msg => <ChatMessage key={msg.id} message ={msg} />)}

            <form onSubmit={sendMessage}> 
                <input value={formValue} onChange={(e)=> setFormValue(e.target.value)}/>
                <button type="submit">send</button>
            </form>
        </div>
        </>
    )

}

function ChatMessage(props){
    const {text, uid, photoURL} = props.message;
    const messageClass = uid === auth.currentUser.uid ? 'sent' : 'recived';

    return (
        <div className = {`message ${messageClass}`}>
            <img src={photoURL}/>
            <p>{text}</p>
        </div>
        )
}

export default App;