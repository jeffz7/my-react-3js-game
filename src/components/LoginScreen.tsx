import { useState, useContext, FormEvent } from "react";
import { UserContext } from "../contexts/UserContext";
import "../css/LoginScreen.css";

export default function LoginScreen() {
  const [inputUsername, setInputUsername] = useState("");
  const { setUsername, checkUsernameAvailability, loginError } =
    useContext(UserContext);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const isAvailable = await checkUsernameAvailability(inputUsername);
    if (isAvailable) {
      setUsername(inputUsername);
    }
  };

  return (
    <div className="login-screen">
      <div className="login-container">
        <h2>Welcome to Racing Game</h2>
        <p>Choose a username to start playing</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={inputUsername}
            onChange={(e) => setInputUsername(e.target.value)}
            placeholder="Enter username"
            className="username-input"
          />

          {loginError && <p className="error-message">{loginError}</p>}

          <button type="submit" className="login-button">
            Start Racing
          </button>
        </form>

        <div className="login-info">
          <p>Username requirements:</p>
          <ul>
            <li>At least 3 characters long</li>
            <li>Must start with a letter</li>
            <li>Can contain letters, numbers, and dots</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
