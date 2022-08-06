import Factory from "./factory";
import OppsFactory from "./operationsFactory";
import Opps from "./compontsList";
import Updater from "./updater";

export default class ComponentListInterface{
    factory;
    updater;
    operationsFactory;
    dispatch;
    constructor(dispatch){
        this.getFactory= this.getFactory.bind(this);
        this.createComponentList= this.createComponentList.bind(this);
        this.getOperationsFactory= this.getOperationsFactory.bind(this);
        this.getUpdater= this.getUpdater.bind(this);

        this.dispatch=dispatch;
        
    }

    getFactory(){
        
        if(this.factory===undefined){
            this.factory= new Factory(this);
        }
        return this.factory;
    }
    createComponentList(){
        
        return new Opps(this)
    }
    getOperationsFactory(){
        
        if(this.operationsFactory===undefined){
            this.operationsFactory= new OppsFactory(this);
            
            this.factory.setOperationsFactory(this.operationsFactory);
        }
        return this.operationsFactory;
    }
    getUpdater(){
        
        if(this.updater===undefined){
            this.updater =new Updater();
        }
        return this.updater;

    }

}