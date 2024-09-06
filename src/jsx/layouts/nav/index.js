import React, { Fragment, useState } from "react";
import SideBar from "./SideBar";
import NavHader from "./NavHader";
import Header from "./Header";
import ChatBox from "../ChatBox";

const JobieNav = ({ title, onClick: ClickToAddEvent, onClick2, onClick3 }) => {
   const [toggle, setToggle] = useState("");
    const onClick = (name) => setToggle(toggle === name ? "" : name);

    const [toggleActivity, setToggleActivity] = useState(false);
    const handleActivityToggle = () => {
        setToggleActivity(!toggleActivity);
    };
   // const userRoles = [Role.USER, Role.ADMIN,Role.FOURNISSEUR,Role.COLLABORATEUR ];
    //userRoles={userRoles}
    return (
      <Fragment>
         <NavHader />
         <SideBar    onClick={() => onClick2()} onClick3={() => onClick3()} />
         <Header
            onActivity={handleActivityToggle}
            onNote={() => onClick("chatbox")}
            onNotification={() => onClick("notification")}
            onProfile={() => onClick("profile")}
            toggle={toggle}
            title={title}
            onBox={() => onClick("box")}
            onClick={() => ClickToAddEvent()}
         />
         <ChatBox onClick={() => onClick("chatbox")} toggle={toggle} />
      </Fragment>
   );
};

export default JobieNav;
