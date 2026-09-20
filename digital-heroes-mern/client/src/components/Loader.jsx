const Loader = ({
    size = "medium",
    text = "Loading...",
    fullScreen = false,
}) => {
    return (
        <div
            className={`loader-wrapper ${fullScreen ? "fullscreen" : ""
                }`}
        >
            <div className={`loader loader-${size}`} />

            {text && <p className="loader-text">{text}</p>}

            <style>{`
        .loader-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 14px;
          padding: 30px;
        }

        .loader-wrapper.fullscreen {
          min-height: 70vh;
          width: 100%;
        }

        .loader {
          border: 4px solid #dce8e1;
          border-top-color: #0b1f1a;
          border-radius: 50%;
          animation: loader-spin 0.8s linear infinite;
        }

        .loader-small {
          width: 22px;
          height: 22px;
          border-width: 3px;
        }

        .loader-medium {
          width: 40px;
          height: 40px;
        }

        .loader-large {
          width: 60px;
          height: 60px;
          border-width: 5px;
        }

        .loader-text {
          margin: 0;
          color: #52675d;
          font-size: 14px;
        }

        @keyframes loader-spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
        </div>
    );
};

export default Loader;