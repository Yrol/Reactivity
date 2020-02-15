import { RootStore } from "./rootStore";
import { observable, action } from "mobx";

export default class CommonStore {
    rootStore: RootStore | undefined;
    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
    }
    
    @observable token: string | null = null;
    @observable appLoaded = false;

    /** the following actions will be used in App.tsx as its the entry point to the app to determine whether user has logged in or not */

    //action to store the token in localStorage and save it in a variable called token
    //the token will be set to null when user logs out
    @action setToken = (token: string | null) => {
        window.localStorage.setItem('jwt', token!);
        this.token = token;
    }

    @action setAppLoaded = () => {
        this.appLoaded = true;
    }
}