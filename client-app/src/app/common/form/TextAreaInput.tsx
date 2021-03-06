import React from "react";
import { FieldRenderProps } from "react-final-form";
import { FormFieldProps, Form, Label } from "semantic-ui-react";

//Extending IProps from FieldRenderProps comes from react-final-form which accepts an input as string and an HTMLTextAreaElement
interface IProps
  extends FieldRenderProps<string, HTMLTextAreaElement>,
    FormFieldProps {}

//Extending FieldRenderProps allows us to destructure values that a <Field> will support. Doc: https://final-form.org/docs/react-final-form/types/FieldRenderProps
export const TextAreaInput: React.FC<IProps> = ({
  input,
  width,
  rows,
  placeholder,
  meta: { touched, error }
}) => {
  return (
    <Form.Field error={touched && !!error} width={width}>
    {/** "{...input}" will pass all the properties (such as input.value, input.onChange & etc) of the input as an array*/}
    <textarea rows={rows} {...input} placeholder={placeholder} />
    {/**Show the Label only if the input has been touched and there is an error */}
  {touched && error && <Label basic color="red">{error}</Label>}
  </Form.Field>
  );
};
