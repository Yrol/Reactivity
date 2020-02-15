import { RootStore } from "./rootStore";
import { observable, action, reaction } from "mobx";

export default class CommonStore {
    rootStore: RootStore | undefined;
    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;

        //we're running this reaction after the "CommonStore" has initialized and if the "@observable token" below has changed
        //"window.localStorage.setItem" will run when the " @action setToken" assign a token value
        //"window.localStorage.removeItem" will run when the "@action logout" in userStore sets the token value null
        reaction (
            () => this.token,
            token => {
                if (token) {
                    window.localStorage.setItem('jwt', token);
                } else {
                    window.localStorage.removeItem('jwt')
                }
            }
        )
    }
    
    @observable token: string | null = window.localStorage.getItem('jwt');
    @observable appLoaded = false;

    /** the following actions will be used in App.tsx as its the entry point to the app to determine whether user has logged in or not */

    //the token will be set to null when user logs out
    //once the token variable is set, the "reaction" method above will trigger and save the token to local storage 
    @action setToken = (token: string | null) => {
        this.token = token;
    }

    @action setAppLoaded = () => {
        this.appLoaded = true;
    }
}