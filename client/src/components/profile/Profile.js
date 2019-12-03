import React, { Fragment, useEffect } from "react";
import { connect } from "react-redux";
import Spinner from "../layouts/Spinner";
import { getProfileById } from "../../actions/profile";
import PropTypes from "prop-types";

const Profile = ({
  getProfileById,
  profile: { profile, loading },
  auth,
  match
}) => {
  useEffect(() => {
    getProfileById(match.params.id);
  }, [getProfileById]);
  return <div>Profile</div>;
};

const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.auth
});

Profile.propTypes = {
  getProfileById: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

export default connect(mapStateToProps, { getProfileById })(Profile);
