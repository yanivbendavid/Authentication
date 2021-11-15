import AuthContext from "../../store/auth-context";
import { useHistory } from "react-router";
import { useContext, useRef } from "react";
import classes from "./ProfileForm.module.css";

const ProfileForm = () => {
  const context = useContext(AuthContext);
  const newPass = useRef();
  const history = useHistory();

  const changePasswordHandler = (event) => {
    event.preventDefault();
    const password = newPass.current.value;
    if (password.length === 0) {
      alert("Invalid password");
    }

    fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyCr2wHn3qrByV04utMcvYekTj8ny_ibH3A",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idToken: context.token,
          password,
          returnSecureToken: true,
        }),
      }
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Authentication failed!");
      })
      .then((res) => {
        context.login(res.idToken, parseInt(res.expiresIn));
        history.push("/");
      })
      .catch((error) => alert(error));
  };

  return (
    <form className={classes.form} onSubmit={changePasswordHandler}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input type="password" id="new-password" minLength="6" ref={newPass} />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
};

export default ProfileForm;
