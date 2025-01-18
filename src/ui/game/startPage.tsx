import React, { useState } from "react";

interface StartingPageProps {
    onEnterGame: (name: string) => void;
}

const StartingPage: React.FC<StartingPageProps> = ({ onEnterGame }) => {
    const [name, setName] = useState("");

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    const handleEnterGame = () => {
        if (name.trim()) {
            onEnterGame(name);
            localStorage.setItem("playerName", name)
        } else {
            alert("Please enter a valid name.");
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