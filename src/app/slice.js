import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getApplications = createAsyncThunk("getApplications", async () => {
  /* Get applications of all user  
     Use url-  /api/applications with GET method */
  const response = await axios.get(`/api/applications`);
  return response.data;
});

export const modifyApplicationStatus = createAsyncThunk(
  "modifyApplicationStatus",
  async (args) => {
    /* To modify the status of Application  
       Use url-  /api/applications/${id} with PATCH method 
       Req body - { status: <newStatus> },  newstatus can be Approved/Rejected*/

  });

export const getCourses = createAsyncThunk("getCourses", async () => {
  /* Get all courses offered 
    Use url-  /api/courses with GET method */
  const response = await axios.get(`/api/courses`);
  return response.data;
});

export const addSeats = createAsyncThunk("addSeats", async (args) => {
  /* To modify seatCount of Course 
    Use url-  /api/courses/${id} with PATCH method 
    Req body - { availableSeats: <updatedSeatCount> } */

});

export const getApplicationStatus = createAsyncThunk(
  "getApplicationStatus",
  async (args) => {
    /* Get applications of logged user  
     Use url-  /api/applications?applicantEmail=${email} with GET method */
    const response = await axios.get(`/api/applications?applicantEmail=${args}`);
    return response.data;
  }
);

const initialState = {
  courses: [],
  applicationsForAdmin: [],
  applicationsStatus: [],
  loggedUser: {
    name: "",
    isAdmin: false,
    isAuthenticated: false
  }
};

export const slice = createSlice({
  name: "admissions",
  initialState,
  reducers: {
    setLoggedUser: (state, action) => {
      state.loggedUser = action.payload;
      state.loggedUser.isAuthenticated = true;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(getApplications.fulfilled, (state, action) => {
      state.applicationsForAdmin.push(...action.payload)
    });

    builder.addCase(getApplicationStatus.fulfilled, (state, action) => {
      state.applicationsStatus.push(...action.payload)
    });

    builder.addCase(getCourses.fulfilled, (state, action) => {
      state.courses.push(...action.payload)
    });
  }
});

const { actions, reducer } = slice;
export const { setLoggedUser } = actions;
export default reducer;
