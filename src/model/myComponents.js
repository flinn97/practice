import BaseClass from "../npm/baseClass";
import authService from "../services/auth.service";
class BaseObject extends BaseClass{
    constructor(operationsFactory){
        super(operationsFactory);
    }
    json;
    starting={
        name:"",
        type: "temple",
        _id: "",
        owner:"",
        
    }


}

class Pic extends BaseObject{
    constructor(operationsFactory){
        super(operationsFactory);
        this.favorites=this.favorites.bind(this);
        this.getPicSrc=this.getPicSrc.bind(this);

    }
    json={
        ...this.starting,
        pics: "", 
        fact:"",
        favorites: 0,
        picURL: ""
    }
    async favorites(user){
        
        this.json.favorites= this.json.favorites+1;
        let userFavorites = user.getJson().favorites;
        userFavorites.push(this.json._id)
        await this.operationsFactory.cleanPrepareRun({"update":[this, user]})
    }
    async getPicSrc(){
        let pic = await authService.downloadPics(this.json.pics);
        this.json.picURL=pic;
        
    }
}

class User extends BaseObject{
    constructor(operationsFactory){
        super(operationsFactory);
        this.getPicSrc=this.getPicSrc.bind(this);

        this.deleteFromList=this.deleteFromList.bind(this);
    }
    json={
        ...this.starting,
        pics: "", 

        email:"",
        type: "user",
        favorites:[],
        picURL: ""

    }
    async getPicSrc(){
        let pic = await authService.downloadPics(this.json.pics);
        this.json.picURL=pic;
        
    }
    async deleteFromList(id){
        for(let i = 0; i<this.json.favorites.length; i++){
            if(this.json.favorites[i]===id){
                this.json.favorites.splice(i, 1);
                break;
            }
        }
        await this.operationsFactory.cleanPrepareRun({"update":this})
    }
}



// class Factory {
//     factory ={
//         pic: new Pic(),
//         user: new User(),
//     }

//     getComponent(component, json){
//         let comp = this.factory[component];
//         comp = Object.assign(Object.create(Object.getPrototypeOf(comp)), comp);
//         comp.setJson({...comp.getJson(), ...json,});
//         return comp;
//     }
// }
export {User, Pic};
