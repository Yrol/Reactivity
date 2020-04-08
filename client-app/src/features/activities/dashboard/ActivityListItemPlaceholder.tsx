import React, { Fragment } from 'react';
import { Segment, Button, Placeholder } from 'semantic-ui-react'

//This will create the placeholders for the loading items in the list. Hence when fetching activities, we can use this to give a responsive feel instead of using a big loading indicator
//Using the semantic UI placeholder: https://semantic-ui.com/elements/placeholder.html
//The structure of the following layout reflect on the elements of an activity card such as activity name, description, image, host name and etc.

const ActivityListItemPlaceholder = () => {
    return (
        <Fragment>
            <Placeholder fluid style={{ marginTop: 50 }}>
                <Segment.Group>
                    <Segment style={{ minHeight: 110 }}>
                        <Placeholder>
                            <Placeholder.Header image>
                                <Placeholder.Line/>
                                <Placeholder.Line/>
                            </Placeholder.Header>
                            <Placeholder.Paragraph>
                                <Placeholder.Line/>
                            </Placeholder.Paragraph>
                        </Placeholder>
                    </Segment>
                    <Segment>
                        <Placeholder>
                            <Placeholder.Line/>
                            <Placeholder.Line/>
                        </Placeholder>
                    </Segment>
                    <Segment secondary style={{ minHeight: 70 }} />
                    <Segment clearing>
                        <Button disabled color="blue" floated="right" content="View" />
                    </Segment>
                </Segment.Group>
            </Placeholder>
        </Fragment>
    )
};
export default ActivityListItemPlaceholder;