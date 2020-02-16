import { observable, computed, action, runInAction } from "mobx";
import { IUser, IUserFormValues } from "../../models/user";
import agent from "../api/agent";
import { RootStore } from "./rootStore";
import { history } from '../..';
import ModalStore from "./modalStore";

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

            //hiding the modal (also set it's content to null)
            this.rootStore?.modalStore?.closeModal();
            history.push('/activities')
        } catch (error) {
            //this error will be caught by the login form
            throw error;
        }
    }

    @action register = async (values: IUserFormValues) => {
        try {
            const user = await agent.User.register(values)
            this.rootStore?.commonStore?.setToken(user.token);
            this.rootStore?.modalStore?.closeModal();
            history.push('/activities')
        } catch  (error) {
            //this error will be caught by the register form
            throw error;
        }
    }

    //get the user from "User.current" method defined in "agent.ts" method
    @action getUser = async () => {
        try {
            const user = await agent.User.current();
            runInAction(() => {
                this.user = user;
            })
        } catch (error) {
            console.log(error);
        }
    }

    //handling the logout
    @action logout = () => {
        this.rootStore?.commonStore?.setToken(null); //set token to null
        this.user = null; // set user to null
        history.push('/'); // send user back to homepage
    }
}