import React from 'react'
import { AxiosResponse } from 'axios'
import { Message } from 'semantic-ui-react'

//Receiving the Axios error response through props
interface IProps {
    error: AxiosResponse
    text: string;
}

export const ErrorMessage: React.FC<IProps> = ({error, text}) => {
    return (
        <Message error>
            <Message.Header>{error.statusText}</Message.Header>

            {/** Displaying registration errors returned from the server */}
            {/** if "error.data.errors" is not empty loop through it using flat().map()*/}
            {error.data && Object.keys(error.data.errors).length > 0 && (
                <Message.List>
                    {Object.values(error.data.errors).flat().map((err, i) => (
                        <Message.Item key={i}>{err}</Message.Item>
                    ))}
                </Message.List>
            )}

            {/** Displaying a simple error for Login */}
            {text && <Message.Content content={text} />}
        </Message>
    )
}
