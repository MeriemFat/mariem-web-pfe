import React from "react";
import { connect } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { isAuthenticated } from "../../../store/selectors/AuthSelectors";
import { useLogout } from "../../../Hooks/useLogout";

function withRouter(Component) {
  function ComponentWithRouterProp(props) {
    let location = useLocation();
    let navigate = useNavigate();
    let params = useParams();
    return <Component {...props} router={{ location, navigate, params }} />;
  }

  return ComponentWithRouterProp;
}

function LogoutPage(props) {
  const location = useLocation();
  const from = location.state?.from?.pathname || "/login";
  const navigate = useNavigate();
  const { logout } = useLogout();
  function onLogout() {
    logout();
    navigate(from, { replace: true });
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
  return (
    <>
      <button className="dropdown-item ai-icon" onClick={onLogout}>
        <svg
          id="icon-logout"
          xmlns="http://www.w3.org/2000/svg"
          className="text-danger"
          width={18}
          height={18}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1={21} y1={12} x2={9} y2={12} />
        </svg>
        <span className="ms-2">Logout </span>
      </button>
    </>
  );
}
const mapStateToProps = (state) => {
  return {
    isAuthenticated: isAuthenticated(state),
  };
};

export default withRouter(connect(mapStateToProps)(LogoutPage));
