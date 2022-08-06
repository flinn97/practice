import {User, Pic } from "../model/myComponents.js"
import BaseClass from "./baseClass";

class Factory {
    operationsFactory;

    factory ={
        pic: Pic,
        user: User,
        baseClass: BaseClass,
    }
    registerComponents(register){
        this.factory[register.name]= register.component;
    }
    setOperationsFactory(operationsFactory){
        this.operationsFactory= operationsFactory
    }

    getComponent(obj){
        // debugger
        let key = Object.keys(this.factory).includes(obj.component)? obj.component:"baseClass"
        let comp = new this.factory[key](this.operationsFactory);
        comp.setJson({...comp.getJson(), ...obj.json});
        return comp;      
    }
}
export default Factory;