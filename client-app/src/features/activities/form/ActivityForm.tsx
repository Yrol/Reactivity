import React, {
  useState,
  ChangeEvent,
  FormEvent,
  useContext,
  useEffect
} from "react";
import { Segment, Form, Button } from "semantic-ui-react";
import { IActivity } from "../../../models/activity";
import { v4 as uuid } from "uuid";
import ActivityStore from "../../../app/stores/activityStore";
import { observer } from "mobx-react-lite";
import { RouteComponentProps } from "react-router-dom";

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
  match
}) => {
  //Defining the MobX store (ActivityStore) and destructuring the required functions and variables from it
  const activityStore = useContext(ActivityStore);
  const {
    selectedActivity: initialFormState,
    createActivity,
    editActivity,
    submitState,
    cancelFormOpen,
    loadActivity,
    clearActivity
  } = activityStore;

  //running the useEffect only in edit mode to fetch the activity data from the API
  useEffect(() => {
    if (match.params.id) {
      loadActivity(match.params.id).then(
        // execute "setActivity(initialFormState)" only if an activity is available in the "initialFormState"
        () => initialFormState && setActivity(initialFormState)
      );
    }
    //using the clean up function (componentWillUnmount when click on "Create Activity" button on Navbar) - https://reactjs.org/docs/hooks-effect.html#effects-with-cleanup
    return () => {
      clearActivity();
    }
  }, [loadActivity, match.params.id, initialFormState, clearActivity]); //defining all the dependencies.After the initial render, if these dependencies change, the useEffect will be executed. Simple example: https://codesandbox.io/s/l0n6qn3x7

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

  //Handling input change without ChangeEvent or strict typing such as HTMLInputElement and HTMLTextAreaElement
  // const handleInputChange = (event: any) => {
  //     const {name, value} = event.target
  //     setActivity({ ...activity, [name]: value})
  // }

  //Handling input change with FormEvent and strict typing - HTMLInputElement and HTMLTextAreaElement
  //Without this implementation we won't be able to type inside the form fields since React is based on virtual DOM
  const handleInputChange = (
    event: FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.currentTarget;
    setActivity({ ...activity, [name]: value });
  };

  //handle the form submit activity
  const handleSubmit = () => {
    if (activity.id.length === 0) {
      //new activity
      let newActivity = {
        ...activity,
        id: uuid() // npm package for generating unique IDs
      };
      console.log(newActivity);
      createActivity(newActivity);
    } else {
      //edit an activity
      editActivity(activity);
      console.log(activity);
    }
  };

  return (
    <Segment clearing>
      {/** "clearing" will include the Cancel and the Submit button within the form*/}
      <Form onSubmit={handleSubmit}>
        <Form.Input
          onChange={handleInputChange}
          name="title"
          placeholder="Title"
          value={activity.title}
        />
        <Form.TextArea
          onChange={handleInputChange}
          rows={2}
          placeholder="Description"
          name="description"
          value={activity.description}
        />
        <Form.Input
          onChange={handleInputChange}
          name="category"
          placeholder="Category"
          value={activity.category}
        />
        <Form.Input
          onChange={handleInputChange}
          name="city"
          placeholder="City"
          value={activity.city}
        />
        <Form.Input
          onChange={handleInputChange}
          type="datetime-local"
          name="date"
          value={activity.date}
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
          onClick={() => cancelFormOpen()}
          floated="right"
          type="button"
          content="Cancel"
        />
      </Form>
    </Segment>
  );
};

export default observer(ActivityForm);
