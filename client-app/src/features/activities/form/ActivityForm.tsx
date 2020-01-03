import React, {useState} from 'react'
import { Segment, Form, Button } from 'semantic-ui-react';
import { IActivity } from '../../../models/activity';

interface IProps {
    setEditMode: (emode: boolean) => void;
    activity: IActivity;
}

const ActivityForm: React.FC<IProps> = ({
    setEditMode,
    activity: initialFormState //give an alias to the activity variable since another of same name used in "useState" below
}) => {

    //if the activity aka - initialFormState is empty, create an empty IActivity defined in "activity.ts" an return
    const initializeForm = () => {
        if(initialFormState) {
            return initialFormState
        }else{
            return{
                id: '',
                title: '',
                description: '',
                category: '',
                date: '',
                city: ''
            }
        }
    }

    //This is a State Hook
    //Getting the object from "initializeForm" and add to the "activity" variable to use in the following form
    const [activity, setActivity] = useState<IActivity>(
        initializeForm
    )

    return (
        <Segment clearing>
            {/** "clearing" will include the Cancel and the Submit button within the form*/}
            <Form>
                <Form.Input placeholder="Title" value={activity.title} />
                <Form.TextArea rows={2} placeholder="Description" value={activity.description} />
                <Form.Input placeholder="Category" value={activity.category} />
                <Form.Input placeholder="City" value={activity.city} />
                <Form.Input type="date" placeholder="Date" value={activity.date} />
                <Button floated='right' positive type='submit' content='Submit' />
                {/** this will set "editMode" to false in "const [editMode, setEditMode]=useState(false)"  defined in Apps.tsx */}
                <Button onClick={() => setEditMode(false)} floated='right' type='button' content='Cancel' />
            </Form>
        </Segment>
    )
}

export default ActivityForm;