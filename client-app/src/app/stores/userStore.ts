import { observable, computed, action } from "mobx";
import { IUser, IUserFormValues } from "../../models/user";
import agent from "../api/agent";

export default class UserStore {

    //can be either an IUser or null
    @observable user: IUser | null = null;

    //"!!" will return true or false
    @computed get isLoggedIn() {return !!this.user}

    @action login = async (values: IUserFormValues) => {
        try {
            //passing the user object to "agent.User.login" method
            const user = await agent.User.login(values)
            this.user = user;
        } catch (error) {
            console.log(error);
        }
    }
}