import axios from 'redaxios';
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { doc, getDocs, collection, getDoc, updateDoc, addDoc, where, query, setDoc, deleteDoc } from "firebase/firestore";
import { db, storage, auth } from '../firbase.config.js';
import { createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword, onAuthStateChanged  } from "firebase/auth";
import Factory from '../npm/factory.js';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
const API_URL = "https://legato.flinnapps.com/legato/";

// const API_URL = "http://localhost:8080/legato/";
//be sure to upload axios. This is my controller for everything that I do for the backend.
class AuthService {

    async getCurrentUser(){
        return localStorage.getItem("user");
    }
    async getAllTheDataForTheUser(email, componentList, student, teacher) {
        let obj = {}
        let rawData=[];
        const components= await query(collection(db,"devOpsUsers", "devOpsAPP", "components"), where('collection', '==', "devOps@gmail.com"));
        let comps= await getDocs(components);
        for(const key in comps.docs){
            let data= comps.docs[key].data()
            rawData.push(data);
        }
        await componentList.addComponents(rawData, false);
    }
    async register(email, password, addToCache) {
        
        let user;
        await createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
            user = userCredential.user;
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
        })
            if(addToCache){
                localStorage.setItem("user", JSON.stringify(user));

            }
        
        return user;
    }
    async getUserInfo(email, componentList, student, teacher){
        const components =   await query(collection(db,"devOpsUsers", "devOpsAPP", "components"), where('collection', '==', "devOps@gmail.com"));
        let comps = await getDocs(components);
        let rawData=[];
        for (const key in comps.docs) {
            let data = comps.docs[key].data();
            rawData.push(data);

        }
    }
    async login(email, password, componentList, student, teacher) {
        let user;
        await signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                user = userCredential.user;
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
            });
            if(user){
                let saveUser =  user
                await localStorage.setItem("user", JSON.stringify(saveUser));
                await this.getUserInfo(email, componentList, student, teacher);
                await this.getAllTheDataForTheUser(email, componentList, student, teacher);
                user=await componentList.getComponent('user');
            }
            return user;
    }

    async logout() {
        await localStorage.clear();
        let logouser;
        await onAuthStateChanged(auth, (user) => {
            if (user) {
              // User is signed in, see docs for a list of available properties
              // https://firebase.google.com/docs/reference/js/firebase.User
              logouser = user.uid;
              // ...
            } 
            })
        if(logouser){
            await signOut(auth);

        }
        // window.location.reload();
    }
   

    async uploadPics(pic, name) {
        const storageRef = ref(storage, name);
        await uploadBytes(storageRef, pic).then((snapshot) => {
            console.log('Uploaded a blob or file!');
        });
    }
    async downloadPics(name) {
        let src;
        await getDownloadURL(ref(storage, name)).then((url) => {

            src = url;
        })
        return src;
    }
    deletePics(name) {
        
        const delRef = ref(storage, name);
        // Delete the file
        deleteObject(delRef).then(() => {
            // File deleted successfully
        }).catch((error) => {
            // Uh-oh, an error occurred!
        });
    }

    /**
     * 
     * @param {*} role 
     * @param {*} id 
     * @param {*} changeData 
     * @returns change any data I want.
     */
    async dispatch(obj, email){
        email="devOps@gmail.com";
        debugger
        for(const key in obj){
            let operate = obj[key];
            for(let i =0;i<operate.length; i++){
                const delay = ms => new Promise(res => setTimeout(res, ms));
                await delay(1000);
                let component = key!=="del"?operate[i].getJson(): operate[i];
            switch(key){
                case "add":
                    component.collection=email;
                    await setDoc(doc(db, "devOpsUsers", "devOpsAPP", "components", component._id), component);
                    break;
                case "del":
                    await deleteDoc(doc(db, "devOpsUsers", "devOpsAPP", "components", component));
                    break;
                case "update":
                    await updateDoc(doc(db, "devOpsUsers", "devOpsAPP", "components", component._id), component);
                    break;
            }
           
        }
        }

    }


     async registerStudent(obj, email){
        await setDoc(doc(db, 'users', email+"@legato.com"), obj);
        
        }
        async getStudentsTeacher(email){
            const docRef = doc(db, "users", email);
            const docSnap = await getDoc(docRef);
            return docSnap.data();
            
            }

    
        
    
    deleteStudent(student, email) {
        console.log(student);
        return axios
            .post(API_URL + "deleteStudent", {
                student, email,
            })
    }
  
    

}
export default new AuthService();
    
    