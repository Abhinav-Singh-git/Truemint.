import { useState } from "react";
import { ethers } from "ethers";

export default function VerifyCertificate({ contractAddress, abi }) {
  const [searchId, setSearchId] = useState("");
  const [certData, setCertData] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleVerify() {
    if (!searchId) return alert("Please enter an ID");
    setLoading(true);
    setCertData(null);

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, abi, provider);

      const certIdBytes = ethers.utils.formatBytes32String(searchId);
      
      const data = await contract.verify(certIdBytes);

      if (data[3] === true) { 
        setCertData({
          name: data[0],
          course: data[1],
          ipfs: data[2]
        });
        setSearchId("");
      } else {
        alert("Verification Failed: No record exists for this ID. Certificate not found!");
      }
    } catch (error) {
      console.error("Verification Error:", error);
      alert("Invalid ID : ID does not exist on this contract.");
    }
    setLoading(false);
  }

  return (
    <div className="card">
      <h3>Verify Certificate</h3>
      <input 
        placeholder="Enter ID (e.g. 101)" 
        onChange={e => setSearchId(e.target.value)} 
      />
      <button onClick={handleVerify} disabled={loading}>
        {loading ? "Searching..." : "Verify Authenticity"}
      </button>

      {certData && (
  <div className="verify-result" style={{ marginTop: "20px", padding: "20px", border: "2px solid #10b981", borderRadius: "10px" }}>
    <h4>✅ Authenticity Confirmed</h4>
    <p><strong>Student:</strong> {certData.name}</p>
    <p><strong>Course:</strong> {certData.course}</p>
    
    {/* NEW: Preview of the document directly in the browser */}
    <div style={{ marginTop: "15px" }}>
      <p><strong>Official Document Preview:</strong></p>
      <img 
        src={`https://gateway.pinata.cloud/ipfs/${certData.ipfs}`} 
        alt="Certificate Preview" 
        style={{ width: "100%", maxWidth: "400px", borderRadius: "5px", border: "1px solid #ddd" }} 
      />
    </div>

    <div style={{ marginTop: "15px" }}>
      <a href={`https://gateway.pinata.cloud/ipfs/${certData.ipfs}`} target="_blank" rel="noreferrer" className="view-link">
        Open Full Resolution Document ↗
      </a>
    </div>
  </div>
)}
    </div>
  );
}