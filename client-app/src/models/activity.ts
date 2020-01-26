/** An interface for type Activity */
/** This interface will enforce strong type / type checking for the type Activity */
export interface IActivity{
    id: string;
    title: string;
    description: string;
    category: string;
    date: Date;
    city: string;
}

//Partially Extend the IActivity interface defined above 
//Partial will make the all the values optional inside the interface
export interface IActivityFormValue extends Partial<IActivity> {
    time?: Date
}