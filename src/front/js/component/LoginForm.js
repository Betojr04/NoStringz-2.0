import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const LoginForm = ({
  email,
  setEmail,
  password,
  setPassword,
  error,
  setError,
  setIsLoggedIn,
  actions,
}) => {
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await actions.handleLogin(email, password);
      if (result) {
        setIsLoggedIn(true);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      className="card w-100 mt-5"
      style={{ maxWidth: "400px", margin: "0 auto" }}
    >
      <div className="card-body">
        <h2 className="text-center mb-4">Login</h2>
        <form onSubmit={handleLogin}>
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
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          <button type="submit" className="btn btn-primary w-100 mt-3">
            Login
          </button>
        </form>
        <Link to="/signup" className="d-block text-center mt-3 small">
          Create Account
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;
