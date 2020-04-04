import React, { Fragment, useContext } from "react";
import { Menu, Header } from "semantic-ui-react";
import { Calendar } from "react-widgets";
import { RootStoreContext } from "../../../app/stores/rootStore";
import { observer } from "mobx-react-lite";

//this view will be used to show the filters section (as a menu) in the main activities page
const ActivityFilters = () => {
  const rootStore = useContext(RootStoreContext);
  const { predicate, setPredicate } = rootStore.activityStore!;
  return (
    <Fragment>
      <Menu vertical size={"large"} style={{ width: "100%", marginTop: 50 }}>
        <Header icon={"filter"} attached color={"teal"} content={"Filters"} />

        {/* The filter to show all activities. The Active state determined if the "predicate" of the activityStore has the size 0 */}
        <Menu.Item
          active={predicate.size === 0}
          onClick={() => setPredicate("all", "true")}
          color={"blue"}
          name={"all"}
          content={"All Activities"}
        />

        {/** The filter to show only isGoing. The Active state is determined by if the isGoing value is set to ture in predicate available in activityStore */}
        <Menu.Item
          active={predicate.has("isGoing")}
          onClick={() => setPredicate("isGoing", "true")}
          color={"blue"}
          name={"username"}
          content={"I'm Going"}
        />

        {/** The filter to show only isHost. The Active state is determined by if the isHost value is set to ture in predicate available in activityStore */}
        <Menu.Item
          active={predicate.has("isHost")}
          onClick={() => setPredicate("isHost", "true")}
          color={"blue"}
          name={"host"}
          content={"I'm hosting"}
        />
      </Menu>
      <Header
        icon={"calendar"}
        attached
        color={"teal"}
        content={"Select Date"}
      />

      {/** Setting filter based on the calender date by grabbing the date from the Calender at onChange and set it as the "startDate" value*/}
      <Calendar
        onChange={date => setPredicate("startDate", date!)}
        value={predicate.get("startDate") || new Date()} // get the start date set in the predicate or get the today's date
      />
    </Fragment>
  );
};

export default observer(ActivityFilters);
