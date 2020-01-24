import React, {
  useState,
  ChangeEvent,
  FormEvent,
  useContext,
  useEffect
} from "react";
import { Segment, Form, Button, Grid, GridColumn } from "semantic-ui-react";
import { IActivity } from "../../../models/activity";
import { v4 as uuid } from "uuid";
import ActivityStore from "../../../app/stores/activityStore";
import { observer } from "mobx-react-lite";
import { RouteComponentProps } from "react-router-dom";
import { Form as FinalForm, Field } from "react-final-form";
import {TextInput} from "../../../app/common/form/TextInput"
import {TextAreaInput} from "../../../app/common/form/TextAreaInput";
import {SelectInput} from "../../../app/common/form/SelectInput"
import { category } from "../../../app/common/options/categoryOptions";

interface IProps {
  //setEditMode: (emode: boolean) => void;
  //activity: IActivity;
  //createActivity: (activity: IActivity) => void;
  //editActivity: (activity: IActivity) => void;
  //submitState: boolean;
}

interface DetailsParams {
  id: string;
}

/** Adding an IProps interface and destructuring them - such as setEditMode, activities and etc...  */
const ActivityForm: React.FC<RouteComponentProps<DetailsParams>> = ({
  //setEditMode,
  //activity: initialFormState //give an alias to the activity variable since another of same name used in "useState" below
  //createActivity,
  //editActivity,
  //submitState
  match,
  history
}) => {
  //Defining the MobX store (ActivityStore) and destructuring the required functions and variables from it
  const activityStore = useContext(ActivityStore);
  const {
    selectedActivity: initialFormState,
    createActivity,
    editActivity,
    submitState,
    //cancelFormOpen,
    loadActivity,
    clearActivity
  } = activityStore;

  //if the activity aka - initialFormState is empty, create an empty IActivity defined in "activity.ts" an return
  // const initializeForm = () => {
  //   if (initialFormState) {
  //     return initialFormState;
  //   } else {
  //     return {
  //       id: "",
  //       title: "",
  //       description: "",
  //       category: "",
  //       date: "",
  //       city: ""
  //     };
  //   }
  // };

  //This is a State Hook
  //Getting the object from "initializeForm" and add to the "activity" variable to use in the following form
  //const [activity, setActivity] = useState<IActivity>(initializeForm);

  //setting the activity to empty initially and if in  edit mode, set the selected activity using "setActivity" above
  const [activity, setActivity] = useState<IActivity>({
    id: "",
    title: "",
    description: "",
    category: "",
    date: "",
    city: ""
  });

  //running the useEffect only in edit mode to fetch the activity data from the API
  useEffect(() => {
    //This condition will make sure it'll only be executed when there is an ID available in the URL and the activity is not loaded using setActivity below
    //The reason we use "activity.id.length===0" is to make sure this will not run on submission, once loaded or unmounted
    if (match.params.id && activity.id.length === 0) {
      loadActivity(match.params.id).then(
        // execute "setActivity(initialFormState)" only if an activity is available in the "initialFormState"
        () => initialFormState && setActivity(initialFormState)
      );
    }
    //using the clean up function (componentWillUnmount when click on "Create Activity" button on Navbar) - https://reactjs.org/docs/hooks-effect.html#effects-with-cleanup
    return () => {
      clearActivity();
    };
  }, [
    loadActivity,
    match.params.id,
    initialFormState,
    clearActivity,
    activity.id.length
  ]); //defining all the dependencies.After the initial render, if these dependencies change, the useEffect will be executed. Simple example: https://codesandbox.io/s/l0n6qn3x7

  //Handling input change without ChangeEvent or strict typing such as HTMLInputElement and HTMLTextAreaElement
  // const handleInputChange = (event: any) => {
  //     const {name, value} = event.target
  //     setActivity({ ...activity, [name]: value})
  // }

  //Handling input change with FormEvent and strict typing - HTMLInputElement and HTMLTextAreaElement
  //Without this implementation we won't be able to type inside the form fields since React is based on virtual DOM
  // const handleInputChange = (
  //   event: FormEvent<HTMLInputElement | HTMLTextAreaElement>
  // ) => {
  //   const { name, value } = event.currentTarget;
  //   setActivity({ ...activity, [name]: value });
  // };

  //handle the form submit activity -  this method will only be used when we don't use "react-final-form" for validation. i.e binding directly to the submit button
  const handleSubmit = () => {
    if (activity.id.length === 0) {
      //new activity
      let newActivity = {
        ...activity,
        id: uuid() // npm package for generating unique IDs
      };
      //create activity and take the user to that new activity - using the history push to push a location to the history object
      createActivity(newActivity).then(() =>
        history.push(`/activities/${newActivity.id}`)
      );
    } else {
      //edit an activity and take the user to that new activity - using the history push to push a location to the history object
      editActivity(activity).then(() =>
        history.push(`/activities/${activity.id}`)
      );
    }
  };

  const handleFinalFormSubmit = (values: any) => {
    console.log(values);
  };

  return (
    <Grid>
      <GridColumn width={10}>
        {/** "clearing" will include the Cancel and the Submit button within the form in UI*/}
        <Segment clearing>
          {/** "handleSubmit" is a property passed by FinalForm and in here we're destructuring it and passing it to onSubmit of the <Form>*/}
          {/** We're using the <Field> elements which is a part of <FinalForm>*/}
          <FinalForm
            onSubmit={handleFinalFormSubmit}
            render={({ handleSubmit }) => (
              <Form onSubmit={handleSubmit}>
                <Field
                  name="title"
                  placeholder="Title"
                  value={activity.title}
                  component={TextInput} //using the reusable custom TextInput we've created
                />
                <Field

                  placeholder="Description"
                  name="description"
                  rows={3}
                  component={TextAreaInput} //using the reusable custom TextAreaInput we've created
                />
                <Field
                  name="category"
                  options={category}
                  placeholder="Category"
                  value={activity.category}
                  component={SelectInput}//using the reusable custom SelectInput we've created
                />
                <Field
                  name="city"
                  placeholder="City"
                  value={activity.city}
                  component={TextInput} //using the reusable custom TextInput we've created
                />
                <Field
                  name="date"
                  value={activity.date}
                  component={TextInput} //using the reusable custom TextInput we've created
                />
                <Button
                  loading={submitState}
                  floated="right"
                  positive
                  type="submit"
                  content="Submit"
                />

                {/** this will set "editMode" to false in "const [editMode, setEditMode]=useState(false)"  defined in Apps.tsx */}
                <Button
                  //onClick={() => setEditMode(false)}
                  //onClick={() => cancelFormOpen()}
                  floated="right"
                  type="button"
                  content="Cancel"
                />
              </Form>
            )}
          />
        </Segment>
      </GridColumn>
    </Grid>
  );

  //Implementation without From validation component -  react-final-form
  // return (
  //   <Grid>
  //     <GridColumn width={10}>
  //       {/** "clearing" will include the Cancel and the Submit button within the form in UI*/}
  //       <Segment clearing>
  //       <Form onSubmit={handleSubmit}>
  //               <Form.Input
  //                 onChange={handleInputChange}
  //                 name="title"
  //                 placeholder="Title"
  //                 value={activity.title}
  //               />
  //               <Form.TextArea
  //                 onChange={handleInputChange}
  //                 rows={2}
  //                 placeholder="Description"
  //                 name="description"
  //                 value={activity.description}
  //               />
  //               <Form.Input
  //                 onChange={handleInputChange}
  //                 name="category"
  //                 placeholder="Category"
  //                 value={activity.category}
  //               />
  //               <Form.Input
  //                 onChange={handleInputChange}
  //                 name="city"
  //                 placeholder="City"
  //                 value={activity.city}
  //               />
  //               <Form.Input
  //                 onChange={handleInputChange}
  //                 type="datetime-local"
  //                 name="date"
  //                 value={activity.date}
  //               />
  //               <Button
  //                 loading={submitState}
  //                 floated="right"
  //                 positive
  //                 type="submit"
  //                 content="Submit"
  //               />

  //               {/** this will set "editMode" to false in "const [editMode, setEditMode]=useState(false)"  defined in Apps.tsx */}
  //               <Button
  //                 //onClick={() => setEditMode(false)}
  //                 //onClick={() => cancelFormOpen()}
  //                 floated="right"
  //                 type="button"
  //                 content="Cancel"
  //               />
  //             </Form>
  //       </Segment>
  //     </GridColumn>
  //   </Grid>
  // );
};

export default observer(ActivityForm);
