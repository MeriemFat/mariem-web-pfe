import React, { useReducer, useEffect, useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Collapse } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { useScrollPosition } from "@n8tb1t/use-scroll-position";
import { MenuList } from './Menu';

const reducer = (previousState, updatedState) => ({
  ...previousState,
  ...updatedState,
});

const initialState = {
  active: "",
  activeSubmenu: "",
};

const SideBar = () => {
  const d = new Date();
  const [state, setState] = useReducer(reducer, initialState);
  const [role, setRole] = useState(null);
  const [menuList, setMenuList] = useState([]); // Use state for menuList

  const user = localStorage.getItem("user");
  let handleheartBlast = document.querySelector('.heart');
  function heartBlast() {
    return handleheartBlast.classList.toggle("heart-blast");
  }

  const [hideOnScroll, setHideOnScroll] = useState(true);
  useScrollPosition(
    ({ prevPos, currPos }) => {
      const isShow = currPos.y > prevPos.y;
      if (isShow !== hideOnScroll) setHideOnScroll(isShow);
    },
    [hideOnScroll]
  );

  useEffect(() => {
    const value = JSON.parse(user);
    setRole(value?.roles[0]);
  }, []);

  const handleMenuActive = (status) => {
    setState({ active: status });
    if (state.active === status) {
      setState({ active: "" });
    }
  };

  const handleSubmenuActive = (status) => {
    setState({ activeSubmenu: status });
    if (state.activeSubmenu === status) {
      setState({ activeSubmenu: "" });
    }
  };

  /// Path
  let path = window.location.pathname;
  path = path.split("/");
  path = path[path.length - 1];

  useEffect(() => {
    
    const filteredMenuList = MenuList.filter(menu => {
      return menu.roles && menu.roles.includes(role);
    });

    setMenuList(filteredMenuList); // Update the state with filtered menu items
  }, [path, role]);

  return (
    <div className="deznav" style={{ backgroundColor: '#d32a28' }}>
      <PerfectScrollbar className="deznav-scroll">
        <ul className="metismenu" id="menu">
          {menuList.map((data, index) => {
            let menuClass = data.classsChange;
            if (menuClass === "menu-title") {
              return (
                <li className={menuClass} key={index}>{data.title}</li>
              );
            } else {
              return (
                <li className={` ${state.active === data.title ? 'mm-active' : ''}`}
                  key={index}
                >
                  {data.content && data.content.length > 0 ?
                    <>
                      <Link to={"#"}
                        className="has-arrow"
                        onClick={() => { handleMenuActive(data.title) }}
                      >
                        {data.iconStyle}
                        <span className="nav-text">{data.title}</span>
                        <span className="badge badge-xs style-1 badge-danger">{data.update}</span>
                      </Link>
                      <Collapse in={state.active === data.title ? true : false}>
                        <ul className={`${menuClass === "mm-collapse" ? "mm-show" : ""}`}>
                          {data.content && data.content.map((data, ind) => {
                            return (
                              <li key={ind}
                                className={`${state.activeSubmenu === data.title ? "mm-active" : ""}${data.to === path ? 'mm-active' : ''}`}
                              >
                                {data.content && data.content.length > 0 ?
                                  <>
                                    <Link to={data.to} className={data.hasMenu ? 'has-arrow' : ''}
                                      onClick={() => { handleSubmenuActive(data.title) }}
                                    >
                                      {data.title}
                                    </Link>
                                    <Collapse in={state.activeSubmenu === data.title ? true : false}>
                                      <ul className={`${menuClass === "mm-collapse" ? "mm-show" : ""}`}>
                                        {data.content && data.content.map((data, index) => {
                                          return (
                                            <li key={index}>
                                              <Link className={`${path === data.to ? "mm-active" : ""}`} to={data.to}>{data.title}</Link>
                                            </li>
                                          )
                                        })}
                                      </ul>
                                    </Collapse>
                                  </>
                                  :
                                  <Link to={data.to}
                                    className={`${data.to === path ? 'mm-active' : ''}`}
                                  >
                                    {data.title}
                                  </Link>
                                }
                              </li>
                            )
                          })}
                        </ul>
                      </Collapse>
                    </>
                    :
                    <Link to={data.to} >
                      {data.iconStyle}
                      <span className="nav-text">{data.title}</span>
                    </Link>
                  }
                </li>
              );
            }
          })}
        </ul>
      </PerfectScrollbar>
    </div>
  );
}

export default SideBar;
