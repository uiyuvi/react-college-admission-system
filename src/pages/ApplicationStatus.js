import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getApplicationStatus } from "../app/slice";

//Dispatch 'getApplicationStatus' to get all user applications.
function ApplicationStatus() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { app } = useSelector((state) => state);
  const { applicationsStatus: applications, loggedUser } = app;

  useEffect(() => {
    dispatch(getApplicationStatus(loggedUser.email))
  }, [])
  return (
    <div className="container">
      <h3>Your Applications</h3>
      {/* If user haven't applied for any course*/}
      {applications.length === 0 &&
        <p>You have not applied for any course.</p>}
      {/* If any application is available, display data in table*/}
      {applications.length !== 0 &&
        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col">Application Id</th>
              <th scope="col">Course Id</th>
              <th scope="col">Course Name</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((application) => (
              <tr key={application.id}>
                <td>{application.id}</td>
                <td>{application.courseId}</td>
                <td>{application.courseName}</td>
                <td>{application.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      }
    </div>
  );
}

export default ApplicationStatus;
