import React from "react";
import { FieldRenderProps } from "react-final-form";
import { FormFieldProps, Form, Label } from "semantic-ui-react";

//Extending IProps from FieldRenderProps comes from react-final-form which accepts an input as string and an HTMLInputElement
interface IProps
  extends FieldRenderProps<string, HTMLInputElement>,
    FormFieldProps {}

//Extending FieldRenderProps allows us to destructure values that a <Field> will support. Doc: https://final-form.org/docs/react-final-form/types/FieldRenderProps
export const TextInput: React.FC<IProps> = ({
  input,
  width,
  type,
  placeholder,
  meta: { touched, error }
}) => {
  return (
    //Using "<Form.Field> from semantic-ui-react"
    //errors will be shown if the field has been touched and the error is true ("!!error" returns true/ false, otherwise it'll return the actual error value)
    <Form.Field error={touched && !!error} type={type} width={width}>
      {/** "{...input}" will pass all the properties (such as input.value, input.onChange & etc) of the input as an array*/}
      <input {...input} placeholder={placeholder} />
      {/**Show the Label only if the input has been touched and there is an error */}
  {touched && error && <Label basic color="red">{error}</Label>}
    </Form.Field>
  );
};
