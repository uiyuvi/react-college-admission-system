import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getApplications,
  modifyApplicationStatus,
  getCourses,
  addSeats
} from "../app/slice";
import { useNavigate } from "react-router-dom";
import { unwrapResult } from '@reduxjs/toolkit';

function ViewApplications() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { app } = useSelector((state) => state);
  const { applicationsForAdmin: applications, loggedUser, courses } = app;
  const [approvedApplications, setApprovedApplications] = useState([]);
  const [rejectedApplications, setRejectedApplications] = useState([]);
  const [pendingApplications, setPendingApplications] = useState([]);
  /* To Approve/ Reject an application dispatch 'modifyApplicationStatus'
     To get all user applications dispatch 'getApplications'
     To get all course details dispatch 'getCourses' to know seat availability
  */
  useEffect(() => {
    dispatch(getApplications());
    dispatch(getCourses());
  }, [])

  useEffect(() => {
    const pendingApps = applications.filter(application => application.status === "Pending");
    const approvedApps = applications.filter(application => application.status === "Approved");
    const rejectedApps = applications.filter(application => application.status === "Rejected");
    setPendingApplications(pendingApps);
    setApprovedApplications(approvedApps);
    setRejectedApplications(rejectedApps);
  }, [applications])


  const approve = async (event, application) => {
    event.preventDefault();
    const foundCourse = courses.find((course) => course.courseId === application.courseId);
    if (foundCourse.availableSeats === 0) {
      return;
    }
    dispatch(modifyApplicationStatus({ id: application.id, status: "Approved" }))
      .then(unwrapResult)
      .then((result) => {
        dispatch(addSeats({ id: application.courseId, availableSeats: foundCourse.availableSeats - 1 }))
          .then(unwrapResult)
          .then((result) => {
            dispatch(getCourses());
            dispatch(getApplications());
          });
      })
      .catch((error) => {
        console.error(error); // if there is an error
      });
  }

  const reject = async (event, application) => {
    event.preventDefault();
    dispatch(modifyApplicationStatus({ id: application.id, status: "Rejected" }))
      .then(unwrapResult)
      .then((result) => {
        dispatch(getApplications());
      })
      .catch((error) => {
        console.error(error); // if there is an error
      });
  }

  return (
    <div className="container mt-3">
      <h4 className="text-primary">New Applications</h4>
      {pendingApplications.length === 0 &&
        <p>No new applications</p>
      }
      {/* If there are no new applications */}
      {pendingApplications.length > 0 &&
        (
          <table className="table table-hover mb-5" id="newApplicationsTable">
            <thead>
              <tr>
                <th scope="col">Application Id</th>
                <th scope="col">Course Id</th>
                <th scope="col">Course Name</th>
                <th scope="col">Applicant Name</th>
                <th scope="col">Applicant Email</th>
                <th scope="col">Mark Percentage</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingApplications.map((application) => (
                (<tr key={application.id}>
                  <td>{application.id}</td>
                  <td>{application.courseId}</td>
                  <td>{application.courseName}</td>
                  <td>{application.applicantName}</td>
                  <td>{application.applicantEmail}</td>
                  <td>{application.markPercentage}</td>
                  <td>
                    <button className="btn btn-success mx-1" onClick={(event) => approve(event, application)}>Approve</button>
                    <button className="btn btn-danger mx-1" onClick={(event) => reject(event, application)}>Reject</button>
                  </td>
                </tr>)
              ))}
            </tbody>
          </table>
        )
      }
      <hr></hr>
      <h4 className="text-primary">Approved Applications</h4>
      {approvedApplications.length === 0 &&
        <p>No approved applications</p>
      }
      {approvedApplications.length > 0 && (
        <table className="table table-hover mb-5" id="approvedApplicationsTable">
          <thead>
            <tr>
              <th scope="col">Application Id</th>
              <th scope="col">Course Id</th>
              <th scope="col">Course Name</th>
              <th scope="col">Applicant Name</th>
              <th scope="col">Applicant Email</th>
              <th scope="col">Mark Percentage</th>
            </tr>
          </thead>
          <tbody>
            {approvedApplications.map((application) => (
              <tr key={application.id}>
                <td>{application.id}</td>
                <td>{application.courseId}</td>
                <td>{application.courseName}</td>
                <td>{application.applicantName}</td>
                <td>{application.applicantEmail}</td>
                <td>{application.markPercentage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <hr></hr>
      <h4 className="text-primary">Rejected Applications</h4>
      {rejectedApplications.length === 0 &&
        <p>No rejected applications</p>
      }
      {rejectedApplications.length > 0 && (
        <table className="table table-hover mb-5" id="rejectedApplicationsTable">
          <thead>
            <tr>
              <th scope="col">Application Id</th>
              <th scope="col">Course Id</th>
              <th scope="col">Course Name</th>
              <th scope="col">Applicant Name</th>
              <th scope="col">Applicant Email</th>
              <th scope="col">Mark Percentage</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((application) => (
              application.status === "Rejected" ?
                (<tr key={application.id}>
                  <td>{application.id}</td>
                  <td>{application.courseId}</td>
                  <td>{application.courseName}</td>
                  <td>{application.applicantName}</td>
                  <td>{application.applicantEmail}</td>
                  <td>{application.markPercentage}</td>
                </tr>) : null
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ViewApplications;
