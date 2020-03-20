import React, { useContext } from "react";
import { Form as FinalForm, Field } from "react-final-form";
import { values } from "mobx";
import { Form, Button, Label, Header } from "semantic-ui-react";
import { TextInput } from "../../app/common/form/TextInput";
import { RootStoreContext } from "../../app/stores/rootStore";
import { IUserFormValues } from "../../models/user";
import { FORM_ERROR } from "final-form";
import { combineValidators, isRequired } from "revalidate";
import { ErrorMessage } from "../../app/common/form/ErrorMessage";

//using "combineValidators" to validate required fields
const validate = combineValidators({
  email: isRequired("email"),
  password: isRequired("password")
});

export const LoginForm = () => {
  const rootStore = useContext(RootStoreContext);
  const { login } = rootStore.userStore!; //destructuring the login value from "userStore"
  return (
    <FinalForm
      //passing the current form values of type IUserFormValues (values in form fields will be mapped automatically to the entities in IUserFormValues by the field name) on submission to the login func in userStore
      onSubmit={(values: IUserFormValues) =>
        login(values).catch(error => ({
          //setting the errors thrown by the "userStore" to the form if there's any error
          [FORM_ERROR]: error
        }))
      }

      //enable validation using combine validators
      validate={validate}

      //"submitting" is the submitting status and "form" contains the information about the form (both available in FinalForm)
      render={({
        handleSubmit,
        submitting,
        form,
        submitError,
        invalid,
        pristine, 
        dirtySinceLastSubmit //return true when the value of the field is not equal to the value last submitted 
      }) => (
        <Form onSubmit={handleSubmit} error>
          <Header as='h2' content='Login to Reactivities' color='teal' textAlign='center' />
          <Field name="email" component={TextInput} placeholder="Email" />
          <Field
            name="password"
            component={TextInput}
            placeholder="Password"
            type="password"
          />
          <Button
            //disable the button if [the form fields aren't valid (invalid) and last submitted values are the same in the fields(dirtySinceLastSubmit)] or nothing has changes since the last change
            disabled={(invalid && !dirtySinceLastSubmit) || pristine}
            loading={submitting}
            positive
            content="Login"
            fluid
          />
          <pre>
            {submitError && !dirtySinceLastSubmit && (
              // <Label color="red" basic content={submitError.statusText} />
              <ErrorMessage error={submitError} text="Invalid email or password" />
            )}
          </pre>

          {/**the following will display all the properties available in the form (derived from the FinalForm "form" property) - useful for debugging */}
          <pre>{JSON.stringify(form.getState(), null, 2)}</pre>
        </Form>
      )}
    />
  );
};
