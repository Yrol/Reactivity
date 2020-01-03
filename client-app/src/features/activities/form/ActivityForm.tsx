import React from 'react'
import { Segment, Form, Button } from 'semantic-ui-react';
import { IActivity } from '../../../models/activity';

interface IProps {
    setEditMode: (emode: boolean) => void
}

const ActivityForm: React.FC<IProps> = ({
    setEditMode 
}) => {
    return (
        <Segment clearing>
            {/** "clearing" will include the Cancel and the Submit button within the form*/}
            <Form>
                <Form.Input placeholder="Title" />
                <Form.TextArea rows={2} placeholder="Description" />
                <Form.Input placeholder="Category" />
                <Form.Input placeholder="City" />
                <Form.Input placeholder="Venue" />
                <Form.Input type="date" placeholder="Date" />
                <Button floated='right' positive type='submit' content='Submit' />
                {/** this will set "editMode" to false in "const [editMode, setEditMode]=useState(false)"  defined in Apps.tsx */}
                <Button onClick={() => setEditMode(false)} floated='right' type='button' content='Cancel' />
            </Form>
        </Segment>
    )
}

export default ActivityForm;