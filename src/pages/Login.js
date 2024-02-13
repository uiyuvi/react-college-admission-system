import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLoggedUser } from "../app/slice";
import axios from "axios";

const Login = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userNotExist, setUserNotExist] = useState(false);
  const [invalidPassword, setInvalidPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    /*
    To get user credentials
    Use url-  /api/applicants?email=${email} with GET method 

    To get admin credentials
    Use url-  /api/admin?email=${email} with GET method 
    */
    axios.get(`/api/${isAdmin ? 'admin' : 'applicants'}?email=${email}`)
      .then(function (response) {
        console.log(response);
        if (response.data.length === 0) {
          setUserNotExist(true)
          return;
        }
        if (password === response.data[0].password) {
          dispatch(setLoggedUser({
            ...response.data[0],
            isAdmin
          }));
          navigate(isAdmin ? '/applications' : '/apply');
          return;
        }
        setInvalidPassword(true);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <div>
      <form className="container mt-5">
        <div className="form-header">
          <h3 id="loginHeader">Admin Login / Applicant Login</h3>
          <div className="float-right ">
            <input
              type="checkbox"
              id="userType"
              name="user"
              className="form-check-input"
              checked={isAdmin}
              onChange={() => setIsAdmin(!isAdmin)}
            />
            <label className="form-check-label ps-2">Admin</label>
          </div>
          <br />
          <p>Enter your credentials here to Login</p>
        </div>

        <input
          type="email"
          name="email"
          id="userEmail"
          placeholder="your email"
          className="form-control mt-2"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          name="password"
          id="userPassword"
          placeholder="password"
          className="form-control mt-2"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <p className="text-danger" id="errorMessage">
          {userNotExist && "Email not registered"}
          {invalidPassword && "Password is incorrect"}
        </p>
        <button className="btn btn-primary" id="loginButton" onClick={(e) => handleSubmit(e)}>
          Login
        </button>
        <div className="form-group pt-3">
          <p>
            Do not have an Account{" "}
            <Link id="signupLink" to="/signup">
              Signup
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
