import React from "react";
import { FieldRenderProps } from "react-final-form";
import { FormFieldProps, Form, Label, Select, Placeholder } from "semantic-ui-react";

//Extending IProps from FieldRenderProps comes from react-final-form which accepts an input as string and an HTMLSelectElement
interface IProps
  extends FieldRenderProps<string, HTMLSelectElement>,
    FormFieldProps {}
//Extending FieldRenderProps allows us to destructure values that a <Field> will support. Doc: https://final-form.org/docs/react-final-form/types/FieldRenderProps
export const SelectInput: React.FC<IProps> = ({
  input,
  width,
  options,
  placeholder,
  meta: { touched, error }
}) => {
  return (
    //Using "<Form.Field> from semantic-ui-react"
    //errors will be shown if the field has been touched and the error is true ("!!error" returns true/ false, otherwise it'll return the actual error value)
    <Form.Field error={touched && !!error} width={width}>
        <Select 
        value={input.value}
        onChange={(e, data) => input.onChange(data.value)} //In here when user selects a value, the component will call this onChange and sets the "data.value" as its current value
        placeholder={placeholder}
        options={options}
        />
      {/**Show the Label only if the input has been touched and there is an error */}
      {touched && error && <Label basic color="red"></Label>}
    </Form.Field>
  );
};
