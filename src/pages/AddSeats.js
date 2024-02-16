import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCourses, addSeats } from "../app/slice";
import { useNavigate } from "react-router-dom";
import { unwrapResult } from '@reduxjs/toolkit';

//Dispatch 'getCourses' to get available courses
//Dispatch 'addSeats' to modify the seat count for a course
const AddSeats = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [availableSeats, setAvailableSeats] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [newCount, setNewCount] = useState("");
  const { app } = useSelector((state) => state);
  const { courses } = app;

  useEffect(() => {
    dispatch(getCourses());
  }, [])

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(addSeats({ id: selectedCourseId, availableSeats: newCount })).then(unwrapResult)
      .then((result) => {
        dispatch(getCourses());
        setSelectedCourseId("");
        setNewCount("");
        setAvailableSeats("");
        alert('seats added successfully!');
      })
      .catch((error) => {
        console.error(error); // if there is an error
      });

  };

  return (
    <div>

      <form className="container mt-5" onSubmit={handleSubmit}>
        <label className="px-2">
          Course:
          <select
            className="form-select"
            id="courseSelect"
            value={selectedCourseId}
            onChange={(e) => {
              setSelectedCourseId(e.target.value);
              const selectedCourseAvailableCount = courses.find(course => course.courseId === parseInt(e.target.value));
              setAvailableSeats(selectedCourseAvailableCount.availableSeats);
            }}
          >
            <option value="" disabled>
              Select Course
            </option>
            {courses.map((course) => (<option key={course.courseId} value={course.courseId}>{`${course.courseName} (Id: ${course.courseId})`}</option>))}
          </select>
        </label>
        <label className="px-2" id="availableSeats">
          Available Seats: {availableSeats}
          <input
            type="number"
            className="form-control"
            id="newSeatCount"
            placeholder="New count"
            value={newCount}
            onChange={(e) => setNewCount(e.target.value)}
          />
        </label>
        <input
          type="submit"
          className="btn btn-primary"
          id="submitButton"
          value="Submit"
        />
      </form>

    </div>
  );
};

export default AddSeats;
