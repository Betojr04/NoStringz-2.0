import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import GenderSelector from "../component/GenderSelector";
import { Context } from "../store/appContext";

const Signup = () => {
  const { actions } = useContext(Context);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [genderVerified, setGenderVerified] = useState(false);

  const createAccount = async (e) => {
    e.preventDefault();
    try {
      const result = await actions.createAccount(
        email,
        password,
        genderVerified
      );
      if (result.includes("User already exists :(")) {
        setError("Username Taken");
      } else {
        navigate("/Login");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      className="card w-100 mt-5"
      style={{ maxWidth: "400px", margin: "0 auto" }}
    >
      <div className="card-body">
        <h2 className="text-center mb-4">Create Account</h2>
        <form onSubmit={createAccount}>
          <div className="mb-3">
            <label htmlFor="emailInput" className="form-label">
              Email address
            </label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              className="form-control"
              id="emailInput"
            />
            {error && (
              <div id="emailError" className="form-text text-danger">
                {error}
              </div>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="passwordInput" className="form-label">
              Password
            </label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              className="form-control"
              id="passwordInput"
            />
          </div>
          <div className="mb-3">
            <GenderSelector
              gender={genderVerified}
              setGender={setGenderVerified}
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 mt-3">
            Create Account
          </button>
        </form>
        <Link to="/login" className="d-block text-center mt-3 small">
          Already have an account? Login
        </Link>
      </div>
    </div>
  );
};

export default Signup;
