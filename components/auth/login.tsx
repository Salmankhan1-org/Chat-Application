'use client'
import React, { useState } from "react";

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="container p-5 ">
      <div className="row  w-50  m-auto">
        <div className="col">
          <h1 className="fw-bold fs-3 text-center">Welcome Back </h1>
          <div className="row">
            <div className="col">
              <form className="d-flex flex-column gap-3 w-100">
                <div className="form-group">
                  <label
                    htmlFor="exampleInputEmail1"
                    className="fs-6 text-muted"
                  >
                    Email address
                  </label>
                  <div className="input-group input-group-sm">
                    <input
                      type="email"
                      className="form-control form-control-sm"
                      id="exampleInputEmail1"
                      aria-describedby="email"
                      placeholder="Enter email"
                    />
                    <div className="input-group-prepend ">
                      <div
                        className="input-group-text "
                        style={{
                          cursor: "pointer",
                          borderRadius: 0,
                          borderTopRightRadius: "4px",
                          borderBottomRightRadius: "4px",
                        }}
                      >
                        <i className="bi bi-envelope-at-fill"></i>
                      </div>
                    </div>
                  </div>
                  <small id="emailHelp" className="form-text text-muted">
                    We'll never share your email with anyone else.
                  </small>
                </div>
                <div className="form-group">
                  <label
                    htmlFor="exampleInputPassword1"
                    className="fs-6 text-muted"
                  >
                    Password
                  </label>

                  <div className="input-group input-group-sm">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      id="exampleInputPassword1"
                      placeholder="Password"
                    />
                    <div className="input-group-prepend">
                      <div
                        className="input-group-text"
                        style={{
                          cursor: "pointer",
                          borderRadius: 0,
                          borderTopRightRadius: "4px",
                          borderBottomRightRadius: "4px",
                        }}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <i
                          className={`bi ${
                            showPassword ? "bi-eye-slash-fill" : "bi-eye-fill"
                          }`}
                        ></i>
                      </div>
                    </div>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary w-100 mt-3">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
