export default class Opps {
    components=[];
    dispatch;
    backArray={};
    operationsFactory;
    componentListInterface;
    componentsList={};
    constructor(componentListInterface){
        this.register=this.register.bind(this);
        this.add=this.add.bind(this);
        this.update=this.update.bind(this);
        this.del=this.del.bind(this);
        this.getComponents=this.getComponents.bind(this);
        this.getComponent=this.getComponent.bind(this);

        this.getOperationsFactory=this.getOperationsFactory.bind(this);
        this.componentListInterface=componentListInterface;
        this.operationsFactory=componentListInterface.getOperationsFactory();
        this.operationsFactory.setRegister(this.register);
        this.dispatch=componentListInterface.dispatch;
    }
    getComponents(){
        return this.components
    }
    async register(obj){
        
        let operate={
            add: this.add,
            update: this.update,
            del: this.del
        }
        //debugger
        for(const key in obj){
            if(obj[key].length!==0){
                let backarr = {...this.backArray};
                let backadd = await operate[key](obj[key]);
                backarr[key]=backadd;
                this.backArray=backarr;
            }
        }
        //debugger
        this.dispatch({ backend:true, backendUpdate:this.backArray});
        this.backArray=[];
    }
    async add(arr){
        for(const key in arr){
            let comp = [...this.components];
            let id = (Math.random(Date.now())+Date.now()+performance.now()).toString();
            if(arr[key].getJson()._id){
               id =  arr[key].getJson()._id;
            }
            await arr[key].setJson({...arr[key].getJson(), _id:id ,});
            await comp.push(arr[key]);
            this.components=comp;
        }
        await this.setComponentsList();
        return arr;
    }
    async update(arr){
        for(const key in arr){
            if(arr[key][0]){
            let json= arr[key][0].getJson();
                arr[key][0].setJson({...json, ...arr[key][1]})
            }
        }
        return arr
    }
    async del(arr){
        let backArr=[];
        for(const key in arr){
            let id = arr[key].getJson()._id;
            this.components = await this.components.filter(data => data.getJson()._id !== id);
            await backArr.push(id);
        }
        await this.setComponentsList();
        return backArr;
    }

    async addComponents(arr, backend){
        this.backend=backend;
        let prep = []
        for(const key in arr){
            
            let comp = this.componentListInterface.getFactory().getComponent({component:arr[key].type, json: arr[key]});
            prep.push(comp);
        }
        this.components= [...this.components, ...prep];
        await this.setComponentsList();
        if(this.backend){
            this.dispatch({backend: true, backendUpdate:prep });
        }
        this.backArray=true;
    } 
    

    getOperationsFactory(){
        return this.operationsFactory;
    }

    setComponentsList(){
        let comps = [...this.components];
        let tempcomps={};
        for(const key in comps){
            let type = comps[key].getJson().type
            if(Object.keys(tempcomps).includes(type)){
                tempcomps[type]=[...tempcomps[type], comps[key]];
            }
            else{
                tempcomps[type]=[comps[key]]
            }
        }
        this.componentsList = tempcomps;
    }
    getList(list, id, filterKey, ){
        let temp = [];
        if(this.componentsList[list]!==undefined){
            temp = [...this.componentsList[list]];
        }
        if(id!==undefined ){
            let key = filterKey!==undefined ? filterKey: "owner"
            temp = temp.filter(data => data.getJson()[key] === id);
        }
        return temp;
    }
    getComponent(list, id, filterKey, ){
        let temp = [];
        if(this.componentsList[list]!==undefined){
            temp = [...this.componentsList[list]];
        }
        if(id!==undefined ){
            let key = filterKey!==undefined ? filterKey: "owner"
            temp = temp.filter(data => data.getJson()[key] === id);
        }
        return temp[0];
    }

    
}
