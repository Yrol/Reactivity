/** An interface for type Activity */
/** This interface will enforce strong type / type checking for the type Activity */
export interface IActivity{
    id: string;
    title: string;
    description: string;
    category: string;
    date: Date;
    city: string;
    attendees: IAttendee[];
}

//Partially Extend the IActivity interface defined above 
//Partial will make the all the values optional inside the interface
export interface IActivityFormValues extends Partial<IActivity> {
    time?: Date
}

//class that implements the above IActivityFormValues interface (which extends the IActivity above)
export class ActivityFormValues implements IActivityFormValues {
    id?: string = undefined
    title: string =  ""
    description: string =  ""
    category: string =  ""
    date?: Date = undefined
    time?: Date = undefined
    city?: string = ""

    //this constructor will initialize the Activity class for existing activities
    constructor(init?: IActivityFormValues ) {

        //initializing the date and time since it needs to be done manually
        if (init && init.date){
            init.time = init.date
        }
        
        //automatically mapping the other values of the Activity object from init (init is the Activity object returned from the activityStore fetch from DB)
        Object.assign(this, init)
    }
}

//interface for attendees
export interface IAttendee {
    username: string;
    displayName: string;
    image: string;
    isHost: boolean;
}