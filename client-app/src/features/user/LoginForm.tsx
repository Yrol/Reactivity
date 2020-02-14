import React, { useContext } from "react";
import { Form as FinalForm, Field } from "react-final-form";
import { values } from "mobx";
import { Form, Button, Label } from "semantic-ui-react";
import { TextInput } from "../../app/common/form/TextInput";
import { RootStoreContext } from "../../app/stores/rootStore";
import { IUserFormValues } from "../../models/user";
import { FORM_ERROR } from "final-form";
import { combineValidators, isRequired } from "revalidate";

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
      //passing the current form values of type IUserFormValues on submission to the login func in userStore
      onSubmit={(values: IUserFormValues) =>
        login(values).catch(error => ({
          //setting the errors thrown by the "userStore" to the form if there's any error
          [FORM_ERROR]: error
        }))
      }
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
        <Form onSubmit={handleSubmit}>
          <Field name="email" component={TextInput} placeholder="Email" />
          <Field
            name="password"
            component={TextInput}
            placeholder="Password"
            type="password"
          />
          <Button
            //disable the button if [the form fields aren't valid and last submitted values are the same in the fields] or 
            disabled={invalid && !dirtySinceLastSubmit || pristine}
            loading={submitting}
            positive
            content="Login"
          />
          <pre>
            {submitError && !dirtySinceLastSubmit && (
              <Label color="red" basic content={submitError.statusText} />
            )}
          </pre>

          {/**the following will display all the properties available in the form (derived from the FinalForm "form" property) - useful for debugging */}
          <pre>{JSON.stringify(form.getState(), null, 2)}</pre>
        </Form>
      )}
    />
  );
};
