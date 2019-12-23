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