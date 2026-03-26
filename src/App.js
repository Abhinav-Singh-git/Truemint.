import { ethers } from "ethers";
import { useState, useEffect } from "react";

import "./App.css";
import IssueCertificate from "./components/IssueCertificate"; 
import VerifyCertificate from "./components/VerifyCertificate";

import CertificateVerifierArtifact from "./artifacts/contracts/Certificate.sol/CertificateVerifier.json";


const abi = CertificateVerifierArtifact.abi;
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function App() {
  const [account, setAccount] = useState("Not Connected");

  async function connectWallet() {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        const address = accounts[0];
        setAccount(`${address.substring(0, 6)}...${address.substring(38)}`);
      } catch (error) {
        console.error("User rejected the connection request");
      }
    } else {
      alert("MetaMask not detected! Please install the MetaMask extension.");
    }
  }

  useEffect(() => {
    async function checkWallet() {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          const address = accounts[0];
          setAccount(`${address.substring(0, 6)}...${address.substring(38)}`);
        }
      }
    }
    checkWallet();
    
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setAccount(`${accounts[0].substring(0, 6)}...${accounts[0].substring(38)}`);
        } else {
          setAccount("Not Connected");
        }
      });
    }
  }, []);

  return (
    <div className="app-container">
      {/* Top Status Bar */}
      <div 
        className="status-badge" 
        onClick={connectWallet} 
        style={{ cursor: "pointer" }}
        title="Click to connect wallet"
      >
        <div 
          className="dot" 
          style={{ backgroundColor: account === "Not Connected" ? "#ff4b2b" : "#10b981" }}
        ></div>
        NODE: LOCALHOST | WALLET: {account}
      </div>

      {/* Hero Header */}
      <header className="header-section">
        <h1>CertifyChain</h1>
        <p className="subtitle">DECENTRALIZED ACADEMIC LEDGER v1.0.4</p>
      </header>

      {/* Main Dashboard Grid */}
      <div className="dashboard-grid">
        
        {/* LEFT SIDE: COLLEGE PORTAL */}
        <div className="card">
          <h2>
            <span style={{ color: "var(--primary-glow)" }}>01</span> 
            Issuance Portal
          </h2>
          <p className="subtitle" style={{ marginBottom: "20px" }}>
            Securely mint certificates onto the Ethereum Virtual Machine.
          </p>
          <IssueCertificate contractAddress={contractAddress} abi={abi} />
        </div>

        {/* RIGHT SIDE: VERIFICATION NODE */}
        <div className="card">
          <h2>
            <span style={{ color: "var(--secondary-glow)" }}>02</span> 
            Verification Node
          </h2>
          <p className="subtitle" style={{ marginBottom: "20px" }}>
            Query the blockchain for immutable document validation.
          </p>
          <VerifyCertificate contractAddress={contractAddress} abi={abi} />
        </div>

      </div>

      <footer style={{ marginTop: "80px", color: "var(--text-muted)", fontSize: "0.8rem", letterSpacing: "2px" }}>
        SECURED BY SMART CONTRACT PROTOCOL
      </footer>
    </div>
  );
}

export default App;