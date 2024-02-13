import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getCourses, getApplicationStatus } from "../app/slice";

//Dispatch 'getCourses' to get available courses
//Dispatch 'getApplicationStatus' to get user applications. Prevent user to reapply for same course.
import axios from "axios";

function ApplyCourse() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { app } = useSelector((state) => state);
  const { courses, loggedUser } = app;

  useEffect(() => {
    dispatch(getCourses());
  }, [])


  const applyCourse = async (courseId, courseName) => {
    /*
    To submit user application 
    Use url-  /api/applications with POST method 
    
    requestbody = {
        id:new Date().getTime(),
        applicantEmail,
        applicantName,
        courseId,
        courseName,
        status: "Pending",
        markPercentage,
      };
      
      On success display the alert - 'Your application submitted successfully' */

    const retrievedApplications = await dispatch(getApplicationStatus(loggedUser.email));
    console.log(retrievedApplications);
    const isCourseAlreadyApplied = retrievedApplications.payload.filter((application) => application.courseId === courseId).length !== 0;
    if (isCourseAlreadyApplied) {
      return;
    }
    const response = await axios.post(`/api/applications`, JSON.stringify({
      id: new Date().getTime(),
      applicantEmail: loggedUser.email,
      applicantName: loggedUser.name,
      courseId,
      courseName,
      status: "Pending",
      markPercentage: loggedUser.markPercentage,
    }),
      {
        headers: { 'Content-Type': 'application/json' }
      });

    if (response.status === 201) {
      alert('Your application submitted successfully');
    }

  };

  return (
    <div className="container">
      <table className="table table-hover">
        <thead>
          <tr>
            <th scope="col">Course Id</th>
            <th scope="col">Course Name</th>
            <th scope="col">Available Seats</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {
            courses.map((course) => (
              <tr key={course.id}>
                <td>{course.courseId}</td>
                <td>{course.courseName}</td>
                <td>{course.availableSeats}</td>
                <td>
                  {course.availableSeats !== 0 && <button className="btn btn-outline-success mx-1" onClick={() => applyCourse(course.courseId, course.courseName)}>Apply</button>}
                </td>
              </tr>
            ))
          }

        </tbody>
      </table>
    </div>
  );
}

export default ApplyCourse;
