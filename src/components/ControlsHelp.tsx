import { useState } from "react";

export default function ControlsHelp() {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <>
      {/* Help button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "50px",
          height: "50px",
          borderRadius: "50%",
          background: "#3498db",
          color: "white",
          fontSize: "24px",
          border: "none",
          cursor: "pointer",
          boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isVisible ? "×" : "?"}
      </button>

      {/* Help panel */}
      {isVisible && (
        <div
          style={{
            position: "fixed",
            bottom: "80px",
            right: "20px",
            width: "300px",
            padding: "20px",
            background: "rgba(0,0,0,0.8)",
            color: "white",
            borderRadius: "10px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.5)",
            zIndex: 999,
            fontFamily: "Arial, sans-serif",
          }}
        >
          <h3 style={{ margin: "0 0 15px 0", color: "#3498db" }}>
            Vehicle Controls
          </h3>

          <div style={{ marginBottom: "15px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <div
                style={{
                  width: "30px",
                  height: "30px",
                  border: "2px solid white",
                  borderRadius: "5px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "10px",
                }}
              >
                W
              </div>
              <span>Accelerate</span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <div
                style={{
                  width: "30px",
                  height: "30px",
                  border: "2px solid white",
                  borderRadius: "5px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "10px",
                }}
              >
                S
              </div>
              <span>Brake/Reverse</span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <div
                style={{
                  width: "30px",
                  height: "30px",
                  border: "2px solid white",
                  borderRadius: "5px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "10px",
                }}
              >
                A
              </div>
              <span>Steer Left</span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <div
                style={{
                  width: "30px",
                  height: "30px",
                  border: "2px solid white",
                  borderRadius: "5px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "10px",
                }}
              >
                D
              </div>
              <span>Steer Right</span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <div
                style={{
                  width: "30px",
                  height: "30px",
                  border: "2px solid white",
                  borderRadius: "5px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "10px",
                }}
              >
                Space
              </div>
              <span>Handbrake</span>
            </div>
          </div>

          <h3 style={{ margin: "15px 0", color: "#3498db" }}>
            Camera Controls
          </h3>

          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <div
                style={{
                  width: "30px",
                  height: "30px",
                  border: "2px solid white",
                  borderRadius: "5px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "10px",
                }}
              >
                1
              </div>
              <span>Third-Person Camera</span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <div
                style={{
                  width: "30px",
                  height: "30px",
                  border: "2px solid white",
                  borderRadius: "5px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "10px",
                }}
              >
                2
              </div>
              <span>First-Person Camera</span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <div
                style={{
                  width: "30px",
                  height: "30px",
                  border: "2px solid white",
                  borderRadius: "5px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "10px",
                }}
              >
                3
              </div>
              <span>Overhead Camera</span>
            </div>
          </div>

          <div style={{ marginTop: "15px", fontSize: "12px", opacity: 0.7 }}>
            Click the ? button to hide this panel
          </div>
        </div>
      )}
    </>
  );
}
