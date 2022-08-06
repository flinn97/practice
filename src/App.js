import './App.css';
import { Component } from 'react';

import authService from './services/auth.service';
// import Dispatch from './dispatch';
import ComponentListInterface from './npm/componentListInterface';
import "bootstrap/dist/css/bootstrap.min.css";
import Register from './register';
import Login from './login';
//model
export default class App extends Component {
  constructor(props){
    super(props);
        this.handleChange=this.handleChange.bind(this);
        this.dispatch=this.dispatch.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
        this.handleSubmission = this.handleSubmission.bind(this);

    this.state={
      user: undefined,
      componentListInterface: new ComponentListInterface(this.dispatch),
      componentList: undefined,
      pic: null,
      switchcase: "login",
      pics : [],
      i:0,
      operate: undefined,
      operation: "cleanJsonPrepare",
      object: undefined,
      currentComponent: undefined,
      backend: false,
      backendUpdate: undefined,
      picChange:false,
      email:"profAdmin@gmail.com",
      login: false,
      trylogin: false,
      register: false,
      user: undefined,
      fullPic: false,
      displayRow:{
        display:"flex",
        flexDirection:"row",
        
      },
      displayColumn:{
        display:"flex",
        flexDirection:"column",
        justifyContent:"center",
        alignItems:"center",
        updatePics: false,
      }
    }
  }
  changeHandler = async (event) => {
    debugger
    
    let opps = this.state.componentListInterface.getOperationsFactory();
    await opps.cleanPrepare({updateuser:this.state.user})
    let path = "images/" + event.target.files[0].name;
    this.setState({
        selectedFile:event.target.files[0],
        path: path
    }) 
    await opps.componentDispatch({ updatepics: path});
    
};
async handleSubmission()  {
    debugger
    await authService.uploadPics(this.state.selectedFile, this.state.path);
    await this.state.user.getPicSrc();
    await this.state.user?.getOperationsFactory().run();
    this.props.app.dispatch({updatePics:true});

};

  async componentDidUpdate(props, state){
    if(this.state.updatePics){
      let pics = await this.state.componentList.getList("temple");
      await this.setState({updatePics:false, pics:pics});

    }

    if(this.state.backend){
      //
      await this.setState({backend: false});
      authService.dispatch(this.state.backendUpdate, this.state.email);  
  }

    if(this.state.picChange){
      
      this.setState({operate:"update", operation:"cleanPrepare", object: this.state.pic, picChange:false, })
    }
    if(this.state.operate!==undefined){
      let operate = this.state.operate;
      let operation= this.state.operation;
      let object= this.state.object;
      await this.setState({operate:undefined, object:undefined, operation:"cleanJsonPrepare"});
      
      let currentComponent = await this.state.componentListInterface.getOperationsFactory().operationsFactoryListener({operate: operate, object:object, operation: operation});
      let key = await this.state.componentListInterface.getOperationsFactory().getSplice(operate);
      if(currentComponent!==undefined){
        this.setState({currentComponent: currentComponent[key][0]});
      }
    }

    
    
    

  }

  async dispatch(obj){

    await this.setState(obj)
}

handleChange = (event) => {
    const { name, value } = event.target
    this.setState({
        [name]: value,
    })
}

  async componentDidMount(){
   
    // 
    if(this.state.componentListInterface && this.state.componentList===undefined){
        let componentList= await this.state.componentListInterface.createComponentList();
        await this.setState({
          componentList:componentList
        })
        
        let user = await authService.getuser(this.state.email, null, componentList);
        await this.setState({
          user: user
        })
        let pics = user.components.getList("temple");
        let i = Math.floor(Math.random() * pics.length)
        let pic = pics[i];
        await this.setState({
          pics:pics,
          currentComponent:pic,
          pic: pic,
          i:i
        })
    }
    
    let myuser = await authService.getCurrentUser();

    if(myuser){
      let user = JSON.parse(myuser);
      let currentuser=await authService.getUserInfo(user.email, this.state.componentList)
      this.setState({
        login:true,
        user: currentuser
      })
    }
   
    
  }

  //view
  render(){
  return (
    <div >
      {this.state.switchcase==="register" &&(<Register app={{state: this.state, dispatch: this.dispatch }} />)}
      {this.state.switchcase==="login" &&(<Login app={{state: this.state, dispatch: this.dispatch }} />)}
      {this.state.switchcase==="app" &&(
          <div>
            {this.state.user?.getJson().name}
            <img style ={{width:"100px", borderRadius:"50%"}}src = {this.state.user?.getJson().picURL} />
            <div class="mb-3">
                   <label for="formFile" class="form-label">Default file input example</label>
                   <input class="form-control" type="file" id="formFile" onChange={this.changeHandler}/>
                 </div>
                    <div>

                    <button className="btn  btn-block" style={{ background: "#696eb5", height: "35px", color: "#F0F2EF" }} 
                    onClick={this.handleSubmission}>Add pic
                    </button>
            
                    </div>

          </div>

      )}
      
      {/* <Dispatch app={{run:this.run, state:this.state, handlechange:this.handleChange, dispatch:this.dispatch, factory:this.factory}} /> */}
    </div>
  )}
}