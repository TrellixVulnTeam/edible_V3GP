import React, { Component } from 'react';
import logo from './logo.svg';
import firebase, { auth, provider } from './fire.js';
import './App.css';

var foodItem = "";
var foodItemsChecked = false;
var foodItemSnapshots = "";
var foodButtonList = [];

class App extends Component {
  constructor() {
      super();
      this.state = {
          user: null,      		
      		foodItemField: 'Please enter a food item'
    }

    this.login = this.login.bind(this); 
    this.logout = this.logout.bind(this); 
    this.handleChange = this.handleChange.bind(this);
  }

  saveFoodItem(){
    firebase.database().ref('food-items/').push(foodItem);
  }

  createFoodItemList() {

    console.log("list created")

		//If maps haven't been cheked, get the list from Firebase to generate buttons
		if (!foodItemsChecked) {
			foodItemsChecked = true;

    		//Get the names of all of a user's maps, and add to a list. This will be used to generate links in the 'maps' section
      		var db = firebase.database();
      		var ref = db.ref('food-items/');
      		ref.orderByChild("food-items").on("child_added", function (snapshot) {
         			foodItemSnapshots+="|"+snapshot.val(); 
        	});

    }
    
    console.log(foodItemSnapshots);
    this.generateButtonList();
  }

  //Parse map data to generate a list of buttons to create	
	generateButtonList(){
    console.log("generating buttons");
		foodButtonList = foodItemSnapshots.split("|");
    foodButtonList.shift();
    console.log(foodButtonList);
	}

  //Update map name field with user input
  handleChange(event) {
    this.setState({ foodItemField: event.target.value });
    foodItem = event.target.value;
    console.log(event.target.value);
  }

  //Auth functions
  logout() {
    auth.signOut()
      .then(() => {
        this.setState({
          user: null
        });
      });
  }

  login() {
    auth.signInWithPopup(provider)
      .then((result) => {
        const user = result.user;
        console.log("user: " + user);
        this.setState({
          user
        });
      });
  }

  removeFoodItem(item){
    console.log("remove");

  }  
  
  //Render introduction overlay when web app starts
  render() {
    return (
      <div id="interctable" >
        <div id="intro">
        </div>
            {foodButtonList.map((item, index) => {
              return (
                <div className="box" key={index}>
                  <div>
                    <button onClick={() => this.removeFoodItem(item)}>{item/*.title*/}</button>
                  </div>
                </div>
              )
            })}
        <div>
              {this.state.user && !foodItemsChecked ? this.createFoodItemList(): false
              }
              </div>
        <div>
              {foodItemSnapshots==null ? false : this.generateButtonList()}
            </div><div>
    {this.state.user ?
              <button  className="save-map" onClick={this.saveFoodItem.bind(this)}>Save Map</button>
              :
              <button  className="save-map" onClick={this.login}>Sign In</button>
            }
          <img src={logo} className="App-logo" alt="logo" />
          <div className = "profile-details"  id="profile-details">
            {this.state.user ?
              <button onClick={this.logout}>Log Out</button>
              :
              <button onClick={this.login}>Ignore this button for now</button>
            }
            <input
            type="text"
            value={this.state.foodItemField}
            onChange={this.handleChange}
          />
            </div>
            </div>
            </div>
            );
  }
  //Check auth info
  componentDidMount() {
    auth.onAuthStateChanged((user) => {
        if (user) {
          this.setState({ user });
          var userID = user.uid;
        }
    });
  }

  

}


export default App;