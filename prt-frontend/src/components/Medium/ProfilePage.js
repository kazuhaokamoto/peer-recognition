
import React, { Component } from "react";
import { Redirect, BrowserRouter as Router, Route} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import profilePic from "./genericProfilePicture.jpeg";
import './ProfilePage.css';

export default class ProfilePage extends Component {
  constructor(props){
    super(props);       
    this.state = {
        username: props.user.username, 
        email: props.user.email,
        company: props.user.company,
        position: props.user.position
    }
    console.log(this.props);

    console.log(this.props.state)
  } 
  profile(){
    return <div class = "relative"> <div class= "entireProfile">

  <div class = "fade-in"> 
   <div className= "profile">       
           <div className = "userInfo">
               <div className = "profileHeader">   
               <p id= "name"><strong>{this.state.username}</strong></p>
               </div>
               <div className = "details">
                 <p class = "info" ><strong>Email:</strong><i> {this.state.email}</i> </p>
                 <p class = "info" ><strong>Company: </strong>{this.state.company} </p>
                 <p class = "info"> <strong>Position: </strong>{this.state.position}</p>
               </div>
           </div>
       </div>
       </div>
   </div>
   </div>
  }
  handleShow = ()=>{ //this is for the post button for open the textarea 
        this.setState({
            isActive: !this.state.isActive
        })
        
        console.log(this.state.isActive)
    }
  render(){

    return (
        
        <div>
          {this.state.isActive && this.profile()}
         <button class = "open" onClick = {this.handleShow}></button> 
         </div>
    );
 }
}