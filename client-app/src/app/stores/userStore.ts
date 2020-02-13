import { observable, computed, action, runInAction } from "mobx";
import { IUser, IUserFormValues } from "../../models/user";
import agent from "../api/agent";
import { RootStore } from "./rootStore";

export default class UserStore {

    rootStore:RootStore | undefined;

    constructor(rootStore: RootStore){
        this.rootStore = rootStore;
    }

    //can be either an IUser or null
    @observable user: IUser | null = null;

    //"!!" will return true or false
    @computed get isLoggedIn() {return !!this.user}

    @action login = async (values: IUserFormValues) => {
        try {
            //passing the user object to "agent.User.login" method
            const user = await agent.User.login(values)
            runInAction(() => {
                this.user = user;
            })
            console.log(user);
        } catch (error) {
            throw error;
        }
    }
}