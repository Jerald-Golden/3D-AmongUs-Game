import React, { useEffect, useState } from "react";
import { useLobby } from "../../multiplayer/lobbyContext";

type RoomId = {
    roomName: string;
    roomId: string | undefined;
};

interface StartingPageProps {
    onEnterGame: (name: string, room: RoomId) => void;
}

const bannedNames = ["observer", "admin", "root", "server", "system"];

const generateRandomName = () => {
    const adjectives = ["Swift", "Brave", "Mighty", "Clever", "Shadow"];
    const nouns = ["Falcon", "Tiger", "Warrior", "Phoenix", "Ninja"];
    return `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${nouns[Math.floor(Math.random() * nouns.length)]}`;
};

const StartingPage: React.FC<StartingPageProps> = ({ onEnterGame }) => {
    const [name, setName] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isEditingName, setIsEditingName] = useState(false);
    const [newRoomName, setNewRoomName] = useState("");
    const [isCreatingRoom, setIsCreatingRoom] = useState(false);
    const { rooms, client } = useLobby();

    useEffect(() => {
        let storedName = localStorage.getItem("playerName");
        if (!storedName) {
            storedName = generateRandomName();
            localStorage.setItem("playerName", storedName);
        }
        setName(storedName);
    }, []);

    const handleNameSubmit = () => {
        if (bannedNames.includes(name.trim().toLowerCase())) {
            setErrorMessage("This name is not allowed.");
        } else {
            localStorage.setItem("playerName", name);
            setErrorMessage("");
            setIsEditingName(false);
        }
    };

    const joinRoom = (room: { roomId: string; name: string }) => {
        if (!client) return;
        onEnterGame(name, { roomName: room.name, roomId: room.roomId });
    };

    const createRoom = () => {
        if (!newRoomName.trim()) {
            setErrorMessage("Room name cannot be empty.");
            return;
        }
        setErrorMessage("");
        onEnterGame(name, { roomName: newRoomName, roomId: undefined });
        setIsCreatingRoom(false);
    };

    return (
        <div className="starting-page">
            <div className="player-name">
                Player: {name}
                <span className="edit-icon" onClick={() => setIsEditingName(!isEditingName)}>
                    ✏️
                </span>
            </div>

            <div className="name-edit-container">
                {isEditingName && (
                    <>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your name here..."
                            className="starting-page-input"
                        />
                        <button onClick={handleNameSubmit} className="starting-page-button">
                            Submit
                        </button>
                    </>
                )}
                {errorMessage && <div className="error-message">{errorMessage}</div>}
            </div>

            <div className="room-list">
                <h3>Available Rooms</h3>

                {isCreatingRoom ? (
                    <div className="room-name-input-container">
                        <input
                            type="text"
                            value={newRoomName}
                            onChange={(e) => setNewRoomName(e.target.value)}
                            placeholder="Enter room name..."
                            className="starting-page-input"
                        />
                        <button onClick={createRoom} className="create-room-button">
                            Confirm Room
                        </button>
                        <button onClick={() => setIsCreatingRoom(false)} className="cancel-button">
                            Cancel
                        </button>
                    </div>
                ) : (
                    <button onClick={() => setIsCreatingRoom(true)} className="create-room-button">
                        Create Room
                    </button>
                )}

                {rooms.length > 0 ? (
                    <ul>
                        {rooms.map((room) => (
                            <li key={room.roomId} className="room-card">
                                <div className="room-info">
                                    <span>Room Name: {room.name}</span>
                                    <span>Players: {room.clients}</span>
                                </div>
                                <button className="join-room-button" onClick={() => joinRoom(room)}>
                                    Join
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="no-rooms-message">No rooms available. Create a new one!</div>
                )}
            </div>
        </div>
    );
};

export default StartingPage;