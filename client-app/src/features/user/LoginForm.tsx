import React, { useContext } from 'react'
import {Form as FinalForm, Field} from 'react-final-form'
import { values } from 'mobx'
import { Form, Button } from 'semantic-ui-react'
import { TextInput } from '../../app/common/form/TextInput'
import { RootStoreContext } from '../../app/stores/rootStore'
import { IUserFormValues } from '../../models/user'
import { FORM_ERROR } from 'final-form'

export const LoginForm = () => {
    const rootStore = useContext(RootStoreContext)
    const {login} = rootStore.userStore!//destructuring the login value from "userStore"
    return (
        <FinalForm 
            //passing the current form values of type IUserFormValues on submission to the login func in userStore
            onSubmit={(values: IUserFormValues) => login(values).catch(error => ({
                //setting the errors thrown by the "userStore" to the form if there's any error
                [FORM_ERROR]: error
            }))}

            //"submitting" is the submitting status and "form" contains the information about the form  (both available in FinalForm)
            //
            render={({ handleSubmit, submitting, form, submitError }) => (
                <Form onSubmit={handleSubmit}>
                    <Field name='email' component={TextInput} placeholder='Email'/>
                    <Field 
                        name='password'
                        component={TextInput}
                        placeholder='Password'
                        type='password'
                    />
                    {submitError}
                    <Button loading={submitting} positive content='Login' />

                    {/**the following will display all the properties available in the form (derived from the FinalForm "form" property) - useful for debugging */}
                    <pre>{JSON.stringify(form.getState(), null, 2)}</pre>
                </Form>
            )} 
        />
    )
}
