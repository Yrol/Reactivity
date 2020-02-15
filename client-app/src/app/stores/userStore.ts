import { observable, computed, action, runInAction } from "mobx";
import { IUser, IUserFormValues } from "../../models/user";
import agent from "../api/agent";
import { RootStore } from "./rootStore";
import { history } from '../..';

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
            //save the token to the commonStore once retrieved successfully from the server
            this.rootStore?.commonStore?.setToken(user.token);
            history.push('/activities')
        } catch (error) {
            throw error;
        }
    }

    //handling the logout
    @action logout = () => {
        this.rootStore?.commonStore?.setToken(null); //set token to null
        this.user = null; // set user to null
        history.push('/'); // send user back to homepage
    }
}