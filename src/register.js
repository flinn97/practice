import React, { Component } from 'react';
import authService from './services/auth.service';
export default class Register extends Component {
    constructor(props){
        super(props);
        this.handleSubmission= this.handleSubmission.bind(this);
        this.handleChange=this.handleChange.bind(this);
        this.wrapperRef = React.createRef();
        this.setWrapperRef = this.setWrapperRef;
        this.state={
            selectedFile: undefined,
            path: undefined,
            email: "",
            password: ""
        }
    }

	handleChange = async (event) => {
        let { name, value } = event.target;
        this.setState({
            [name]: value
        })
        
	};


	async handleSubmission()  {
        debugger
        let user =await authService.register(this.state.email, this.state.password)
        if(user){
            await this.props.app.state.currentComponent?.getOperationsFactory().componentDispatch({addemail:this.state.email, addname:this.state.name, add_id:user.uid})
            await this.props.app.state.currentComponent?.getOperationsFactory().run();
            this.props.app.dispatch({switchcase:"app",  user:this.props.app.state.currentComponent})
        }
        
        
	};
 
    render(){
        let app = this.props.app;
        let state = app.state;
        let dispatch = app.dispatch;
        let component = state.currentComponent;
        let compJson = component?.getJson();
        let opps = component?.getOperationsFactory();
        let key =compJson?.collection? "update": "add";
        return(
                    <div style={{width:"30vw", height:"40vh", borderRadius:"10px, 10px, 10px, 10px", background:"white", opacity:"1"}}>
                        <div style={{marginLeft:"20px",marginTop:"20px"}}>
                        <h3>Register</h3>    
                        <div style={{marginTop:"20px"}} className="form-group">
                            <label htmlFor="lastName"><b>Name</b></label>
                            <input style ={{width:"80%",}} type="text" className="form-control" id="last"   onChange={this.handleChange} name="name"/>
                        </div>                 
                     <div style={{marginTop:"20px"}} className="form-group">
                            <label htmlFor="lastName"><b>Email</b></label>
                            <input style ={{width:"80%",}} type="text" className="form-control" id="last"   onChange={this.handleChange} name="email"/>
                        </div>
                        <div style={{marginTop:"20px"}} className="form-group">
                            <label htmlFor="lastName"><b>password</b></label>
                            <input style ={{width:"80%",}} type="text" className="form-control" id="last"   onChange={this.handleChange} name="password"/>
                        </div>
                        <div>
                         <button style={{marginTop:"20px"}} class= "btn" onClick={this.handleSubmission}>Submit</button>
                         <div style={{marginTop:"20px", marginLeft:"10px", cursor:"pointer"}} onClick={dispatch.bind(this, {switchcase:"login"})}> Login</div>
                     </div>
                     </div>
                 </div>
             )
    }
	
}