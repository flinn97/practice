export default class BaseClass {
    operationsFactory;
    json;
    class=true;
    constructor(oppsFactory){
        this.setJson=this.setJson.bind(this);
        this.getJson=this.getJson.bind(this);
        this.getOperationsFactory=this.getOperationsFactory.bind(this)
        this.operationsFactory=oppsFactory;
    }

    getOperationsFactory(){
        return this.operationsFactory;
    }
    setJson(json){
        this.json=json;
    }
    getJson(){
        return this.json
    }
}