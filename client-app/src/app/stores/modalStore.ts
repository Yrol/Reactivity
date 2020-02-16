import { RootStore } from "./rootStore";
import { observable, action } from "mobx";

//this mobx store will consist of all operations related to the modal
export default class ModalStore {
    rootStore: RootStore | undefined;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore
    }

    //observable object that contains two properties
    //by using "shallow" we'll be able to observe the object only @ 1 level rather than observing it deeply (as by default)
    //if we don't use shallow, it'll throw an error as it treats the object as a complex object
    @observable.shallow modal = {
        open: false,
        body: null,
    }

    //passing the content of the modal
    //contains the open state of the modal - true/false
    @action openModal = (content: any) => {
        this.modal.open = true;
        this.modal.body = content;
    }

    @action closeModal = () => {
        this.modal.open = false;
        this.modal.body = null;
    }
}