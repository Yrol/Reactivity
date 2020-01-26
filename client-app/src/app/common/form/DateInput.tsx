import React from "react";
import { FieldRenderProps } from "react-final-form";
import { FormFieldProps, Form, Label } from "semantic-ui-react";
import { DateTimePicker } from "react-widgets";

//Extending IProps from FieldRenderProps comes from react-final-form which accepts an input as Date and an HTMLInputElement
interface IProps extends FieldRenderProps<Date | null, HTMLInputElement>, FormFieldProps {}

export const DateInput: React.FC<IProps> = ({
    input,
    width,
    id = null,
    placeholder,
    date = false,
    time = false,
    meta: { touched, error },
    ...rest // the rest of the values available in DateTimePicker
}) => {
  return (
    //Using "<Form.Field> from semantic-ui-react"
    //errors will be shown if the field has been touched and the error is true ("!!error" returns true/ false, otherwise it'll return the actual error value)
    <Form.Field error={touched && !!error} width={width}>
      <DateTimePicker
        placeholder={placeholder}
        date={date}
        time={time}
        value={input.value! || null} //"input.value" when we're editing an activity - date already exists. Null is for a new activity where there's is no date 
        onChange={input.onChange} // the value we're getting back from React Final from when the value is changed
        {...rest}
      />
      {/**Show the Label only if the input has been touched and there is an error */}
      {touched && error && <Label basic color="red"></Label>}
    </Form.Field>
  );
};
