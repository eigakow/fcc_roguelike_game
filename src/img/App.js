import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { loadState, saveState } from './localStorage'

import ReactCSSTransitionGroup from 'react-addons-css-transition-group'; // ES6
//import AnimateHeight from 'react-animate-height';

var FontAwesome = require('react-fontawesome');

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: "",
      contents: {
        Pizza:["ind1", "ind2"],
        Pasta:["ind11","ind22", "ind33"],
        Bread:["ind111","ind222", "ind333", "ind111","ind222", "ind333"],
      },
      isModalOpen: false,
      activeModal: "new",
      isConfirmOpen: false
    }
    let local = loadState();
    //console.log("Local:")
    //console.log(local)
    if (local !== undefined) {this.state.contents = local}
  }
  changeActive = (name) =>	{
    //console.log(name);
    this.setState({
			active: name,
      activeModal: name
		});
  }

  updateValues = (oldname, name, ing) => {
    console.log("Now updating " + oldname + " to: " + name + " : " + ing);
    const items = this.state.contents;
    delete items[oldname];
    //console.log(typeof(Object.values(ing)))
    //console.log(Object.values(ing))
    if (name == undefined){name = "-"}
    if (ing== undefined){ing = ["-"]}


    items[name] = typeof(ing) === "string" ? ing.split(",") : Object.values(ing)


    console.log("New content: ", items)
    // update state
    this.setState({
        contents: items
    });
    this.closeModal();
    saveState(this.state.contents);
  }

  removeRecipe = (name) => {
    const items = this.state.contents;
    delete items[name];
    console.log("New content: ", items)
    // update state
    this.setState({
        contents: items
    });
    this.closeConfirm();
    saveState(this.state.contents);
  }

  openModal = (type = "new") => {
    this.setState({ isModalOpen: true, activeModal: type })
    console.log("activeModal:" + this.state.activeModal)
  }
  closeModal = () => {
    this.setState({ isModalOpen: false, activeModal: "new" })
  }
  openConfirm = (type) => {
    this.setState({ isConfirmOpen: true})
  }
  closeConfirm = () => {
    this.setState({ isConfirmOpen: false})
  }

  showModal() {
    console.log("Printing modal with type: " + this.state.activeModal)
    return this.state.isModalOpen ? <div key="1"><div className="backdrop"/><ModifyRecipe type= {this.state.activeModal} close= {this.closeModal} modify={this.updateValues} ing={this.state.contents[this.state.activeModal]}/></div> : null;
  }
  showConfirm() {
    return this.state.isConfirmOpen ? <div key="2"><div className="backdrop"/>
      <ReactCSSTransitionGroup transitionName="items" transitionEnterTimeout={1000} transitionLeaveTimeout={600}>
        <RemoveRecipe name= {this.state.activeModal} remove= {this.removeRecipe} close= {this.closeConfirm} />
      </ReactCSSTransitionGroup> </div> : null;
  }

  render() {
    //console.log(this.state.contents);
    const active = this.state.active;
    const ingList = this.state.contents;

    const renderRecipes = Object.keys(this.state.contents).map(function(x, idx){
      //console.log(this);
      return <Recipe name={x} key={idx} active={active === x} ing={ingList[x]} changeAct = {this.changeActive} modify = {this.openModal} remove = {this.openConfirm}/>
    }, this)

    return (
      <div>
          {this.showModal()}
          {this.showConfirm()}
        <div className="main">
          <ReactCSSTransitionGroup transitionName="items" transitionEnterTimeout={1000} transitionLeaveTimeout={600}>
            {renderRecipes}
          </ReactCSSTransitionGroup>
        <FontAwesome className="plus" size='2x' name="plus-circle" onClick={() => this.openModal("new")} />
      </div>
    </div>
    );
  }
}
class Recipe extends Component {
  constructor(props) {
    super(props);
  }
  showExtended = (name, ing = []) => {
    return(
      <div>
          <div className="recipeBox active"> {name} </div>
          <RecipeIngredients ing={ing} />
    </div>
    )
  }
  showSingle = (name) => {
    return(
        <div className="recipeBox"> {name} </div>
    )
  }
  show = (name, ing = [], full) => {
    const long = //<AnimateHeight easing = {"easeInQuart"} duration={ 1000 } height={ "auto" }>
            <RecipeIngredients key="0" ing={ing} name= {name} modify={this.props.modify} remove={this.props.remove}/>

    return(
      <div>
        { full ? <div className="recipeBox active"> {name} </div> : <div className="recipeBox"> {name} </div> }
  {/*      <ReactCSSTransitionGroup transitionName="ing" transitionEnterTimeout={2000} transitionLeave={false}> */}
          { full ? long : null}
  {/*       </ReactCSSTransitionGroup> */}
      </div>
    )
  }
  render() {
    const active = this.props.active;
    const name = this.props.name;
    const ing = this.props.ing;
    //console.log(active,name)
    return(
      <div onClick = {() => this.props.changeAct(name)}>
        {/*active ? this.showExtended(name, ing) : this.showSingle(name) */}
        {active ? this.show(name, ing, true) : this.show(name, [], false) }
      </div>
    )
  }
}

class RecipeIngredients extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    //console.log(this.props.ing)
    const renderIng = this.props.ing.map(function(x, idx){
      return <div className="ingredient" key={idx}>{x}</div>
    })
    return(
      <div className="ingBox">
        <p className="title">Ingredients:
          <FontAwesome className="edit" name="pencil-square-o" onClick= {() => this.props.modify(this.props.name, this.props.ing)}/>
          <FontAwesome className="delete" name="trash" onClick = {() => this.props.remove(this.props.name)}/>
        </p>
        { renderIng }
      </div>
    )
  }
}

class ModifyRecipe extends Component {
  constructor(props) {
    super(props);

    let name = this.props.type === "new" ? "" : this.props.type

    this.state = {
      name: name,
      ing: this.props.ing
    }
  }
  changeName = (event) => {
    console.log("Name was changed")
    this.setState({name: event.target.value})
    console.log("New state is: ")
    console.log(this.state.name)
  }
  changeIng = (event) => {
    console.log("Ing was changed")
    this.setState({ing: event.target.value})
    console.log("New state is: of type: " + typeof(this.state.ing))
//    console.log(this.state.ing[0], this.state.ing[1])
  }
  render() {
    let title = this.props.type === "new" ? "Add a Recipe" : "Modify a Recipe "
    console.log("this.props.type: ")
    console.log(this.props.type)
    console.log("this.props.type is of type")
    console.log(typeof(this.props.type))
    return(
      <div className="modal">
        <form>
          <FontAwesome className="close" name="times" onClick={() => this.props.close()} />
          <div className="title">{title}</div>
          <div>Name:</div>
          <input type="text" placeholder="New recipe name..." value={this.state.name} onChange={this.changeName}/>
          <br /><br />
          <div>Ingredients:</div>
          <textarea className="textarea" rows={4} cols={500} placeholder="List the ingredients, comma separeted..." onChange={this.changeIng} value={this.state.ing} />
          <FontAwesome className="plus" size='2x' name="check-circle" onClick={() => this.props.modify(this.props.type, this.state.name, this.state.ing)} />
        </form>
      </div>
    )
  }
}

class RemoveRecipe extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return(
      <div className="modal">
        <FontAwesome className="close" name="times" onClick={() => this.props.close()} />
        <div>Are you sure you want to remove {this.props.name} recipe?</div>
        <FontAwesome className="cancel" size="2x" name="times-circle" onClick={() => this.props.close()} />
        <FontAwesome className="plus" size="2x" name="check-circle" onClick={() => this.props.remove(this.props.name)} />
      </div>
    )
  }
}

export default App;
