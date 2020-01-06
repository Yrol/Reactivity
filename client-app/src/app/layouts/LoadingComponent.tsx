import React from 'react'
import { Dimmer, Loader } from 'semantic-ui-react'


/** adding properties and destructure them - such as inverted, content and etc...  */
export const LoadingComponent: React.FC<{inverted?: boolean, content?: string}> = ({
    inverted, 
    content
}) => {
    return (
        <Dimmer active inverted={inverted}>
            <Loader indeterminate content={content} />
        </Dimmer>
    )
}
