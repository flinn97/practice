import authService from "../services/auth.service";
export default class OppsFactory {
    componentUpdate=[];
    register;
    factory;
    constructor(componentListInterface){

        this.prepare=this.prepare.bind(this);
        this.prepareArray=this.prepareArray.bind(this);
        this.cleanPrepare=this.cleanPrepare.bind(this);
        this.cleanPrepareRun=this.cleanPrepareRun.bind(this);
        this.prepareRun=this.prepareRun.bind(this);
        this.run=this.run.bind(this);
        this.operationsFactoryListener=this.operationsFactoryListener.bind(this);
        this.isArray=this.isArray.bind(this);
        this.handleChange=this.handleChange.bind(this);
        this.cleanJsonPrepareRun= this.cleanJsonPrepareRun.bind(this);
        this.setRegister=this.setRegister.bind(this);
        this.jsonPrepare=this.jsonPrepare.bind(this);
        this.cleanJsonPrepare=this.cleanJsonPrepare.bind(this);
        this.componentUpdate=componentListInterface.getUpdater();
        this.factory= componentListInterface.getFactory();
        
    }
    setRegister(register){
        this.register= register;
    }
    getUpdater(){
        return this.componentUpdate;
    }
    async cleanJsonPrepare(obj ){
        let prep = {add:[],update:[], del:[]};
        for(const key in obj){
            let splice = this.getSplice(key);
            obj[key]=this.isArray(obj[key]);
            for(let i = 0; i<obj[key].length; i++){
                let comp = await this.factory.getComponent({component:key.substring(splice.length, key.length), json: obj[key][i]})
                prep[splice].push(comp);
            }
        }
        this.getUpdater().setJson(prep);
    }
    async jsonPrepare(obj ){
        let prep = await this.getUpdater().getJson();
        for(const key in obj){
            let splice = this.getSplice(key);
            obj[key]=this.isArray(obj[key]);
            for(let i = 0; i<obj[key].length; i++){
                let comp = await this.factory.getComponent({component:key.substring(splice.length, key.length), json: obj[key][i]})
                prep[splice].push(comp);
            }
        }
        this.getUpdater().setJson(prep);
    }
    
    async prepare(obj){
        //debugger
        let prep = await this.componentUpdate.getJson();
        let preparation = await this.prepareArray(obj);
        for(const key in prep){
            if(preparation[key].length!==0){
                prep[key]=[...prep[key], ...preparation[key]];
            }
        }
    }
    async cleanPrepare(obj){
        let prep = await this.componentUpdate.getJson();
        let preparation = await this.prepareArray(obj);
        for(const key in prep){
                prep[key]=[...preparation[key]];
        }
    }
    async prepareRun(obj){
        await this.prepare(obj);
        await this.run(); 
    }
    async jsonPrepareRun(obj){
        await this.jsonPrepare(obj);
        await this.run(); 
    }
    async cleanJsonPrepareRun(obj){
        //debugger
        await this.cleanJsonPrepare(obj);
        await this.run(); 
    }
    async cleanPrepareRun(obj){
        await this.cleanPrepare(obj);
        await this.run(); 
    }
    async run(option, clean){
        //debugger
        if(option !==undefined && !option.pageX){
            let obj={
                clean: this.cleanPrepareRun,
                notClean: this.prepareRun
            }
            await obj[clean===true?"clean":"notClean"](option);
        }
        let comps= {...this.componentUpdate.getJson()}
        this.componentUpdate.setJson({add:[], update:[], del:[]});
        await this.register(comps);  
        
    }

    async prepareArray(obj){
        let newObj={add:[],update:[],del:[]};
            for (const key in obj){
            let updateArr=[];
            let getSplice = await this.getSplice(key);
            let i = obj[key];
            let bool =Number.isInteger(i)
            updateArr=bool?updateArr:[...this.isArray(i)];
            if(bool){
                updateArr = [...newObj[getSplice]];
                for(let j=0; j<i; j++){
                    let component = key.substring(getSplice.length, key.length);
                    let comp = await this.factory.getComponent({component:component})
                    updateArr.push(comp);
                    newObj[getSplice]=updateArr;
                } 
            }
            else {
                newObj[getSplice]=updateArr;
            }
    }
        return newObj
    }

    getSplice(word){
        if( word.includes("add")){
            word="add";
        }
        else if(word.includes("update")){
            word="update";
        }
        else if(word.includes("del")){
            word="del";
        }
        return word;
    }


    handleChange = (event) => {
        //debugger
        let update = this.getUpdater().getJson();
        let { name, value } = event.target;
        let key = this.getSplice(name);
        let valueupdate = name.substring(key.length, name.length);
        if (value==="false"){
            value = false;
        }
        if (value === "true"){
            value  = true;
        }
        update[key][0].getJson()[valueupdate]=value;
    }
    componentDispatch(obj){
        //debugger
        let newObj={};
        let objkey;
        for(const key in obj){
            objkey = this.getSplice(key);
            let valueupdate = key.substring(objkey.length, key.length)
            newObj[valueupdate]=obj[key];
        }
        
        let update = this.getUpdater().getJson();
        update[objkey][0].setJson({...update[objkey][0].getJson(), ...newObj});
    }



    isArray(obj){
        let arr;
        if(Number.isInteger(obj)){
            arr = obj;
        }
        else{
            arr = Array.isArray(obj)? obj: [obj];
        }
        return arr
    }


    async operationsFactoryListener(obj){
        // debugger
        let updater = this.getUpdater().getJson();
        if(obj.operation!=="run"){
            let operation= obj.operation!== undefined? this[obj.operation]: this.cleanPrepare;
            let operate =(!obj.operate.includes("add") &&!obj.operate.includes("del") && !obj.operate.includes("update"))? "add"+obj.operate :obj.operate;
            let object = 1;
            object =obj.object!==undefined?  obj.object: object;
            await operation({[operate]: object});
            updater = this.getUpdater().getJson();
        }
        else{
            this[obj.operation]();
        }
        return updater;
    }
}
