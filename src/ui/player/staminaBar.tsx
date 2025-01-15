

const StaminaBar: React.FC<{ stamina: number }> = ({ stamina }) => {
    return (
        <div
            style={{
                position: 'absolute',
                bottom: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '200px',
                height: '20px',
                backgroundColor: '#444',
                borderRadius: '10px',
                overflow: 'hidden',
            }}
        >
            <div
                style={{
                    width: `${stamina}%`,
                    height: '100%',
                    backgroundColor: stamina > 30 ? '#4caf50' : '#f44336',
                    transition: 'width 0.3s ease',
                }}
            ></div>
        </div>
    );
};

export default StaminaBar;