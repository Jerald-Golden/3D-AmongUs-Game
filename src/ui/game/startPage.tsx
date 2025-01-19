import React, { useState } from "react";

interface StartingPageProps {
    onEnterGame: (name: string) => void;
}

const bannedNames = ["observer", "admin", "root", "server", "system"];

const StartingPage: React.FC<StartingPageProps> = ({ onEnterGame }) => {
    const [name, setName] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    const handleEnterGame = () => {
        if (name.trim() === "") {
            setErrorMessage("Please enter a valid name.");
        } else if (bannedNames.includes(name.trim().toLowerCase())) {
            setErrorMessage("This name is not allowed.");
        } else {
            onEnterGame(name);
            localStorage.setItem("playerName", name);
            setErrorMessage("");
        }
    };

    return (
        <div className="starting-page">
            <input
                type="text"
                value={name}
                onChange={handleNameChange}
                placeholder="Your name here..."
                className="starting-page-input"
            />
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <button
                onClick={handleEnterGame}
                className="starting-page-button"
            >
                Enter Game
            </button>
        </div>
    );
};

export default StartingPage;
