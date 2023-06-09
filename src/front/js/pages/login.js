import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import LoginForm from "../component/LoginForm";

const Login = () => {
  const navigate = useNavigate();
  const { store, actions } = useContext(Context);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/home");
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className="d-flex justify-content-center align-items-center mx-auto">
      <div>
        <LoginForm
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          error={error}
          setError={setError}
          setIsLoggedIn={setIsLoggedIn}
          actions={actions}
        />
      </div>
    </div>
  );
};

export default Login;
