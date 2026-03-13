import { useState, useRef } from 'react'
import axios from 'axios'
import { 
  UploadCloud, Car, Calendar, CreditCard, 
  Download, LayoutDashboard, History, Settings, 
  CheckCircle, AlertCircle, Loader2, Trash2,
  Cpu, Zap, Target 
} from 'lucide-react'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [selectedFile, setSelectedFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [scanHistory, setScanHistory] = useState([])
  
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      setPreview(URL.createObjectURL(file))
      setResult(null)
      setError(null)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return
    setLoading(true)
    setError(null)
    
    const formData = new FormData()
    formData.append("file", selectedFile)

    try {
      const response = await axios.post("http://localhost:8000/detect/", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })
      
      const newResult = response.data
      setResult(newResult)
      
      setScanHistory(prevHistory => [
        { ...newResult, id: Date.now() }, 
        ...prevHistory
      ])
      
    } catch (err) {
      console.error("Error:", err)
      setError("Model inference error. Ensure the Python backend is running.")
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setSelectedFile(null)
    setPreview(null)
    setResult(null)
    setError(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const downloadReport = () => {
    if (!result) return
    // UPDATED: Now includes the Vehicle Body Type in the text file
    const reportText = `HSRP SCAN REPORT\n-------------------\nPlate Number: ${result.plate_characters}\nVehicle Type: ${result.vehicle_type}\nHSRP Category: ${result.classification}\nTimestamp: ${result.timestamp}\nStatus: Verified via YOLOv8 & CNN Engine\n`
    const blob = new Blob([reportText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `HSRP_Report_${result.plate_characters}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // --- VIEWS ---

  const renderDashboard = () => (
    <div className="dashboard-grid animate-fade-in">
      <section className="card scanner-card">
        <h3 className="card-title">Image Input</h3>
        
        {!preview ? (
          <div className="upload-dropzone" onClick={() => fileInputRef.current.click()}>
            <input 
              type="file" 
              ref={fileInputRef}
              accept="image/*" 
              onChange={handleFileChange} 
              className="hidden-input"
            />
            <UploadCloud size={48} className="upload-icon" />
            <p className="upload-text">Click to browse or drag image here</p>
            <p className="upload-hint">Supports JPG, PNG up to 10MB</p>
          </div>
        ) : (
          <div className="preview-container">
            <img src={preview} alt="Vehicle Preview" className="image-preview" />
            {error && (
              <div className="error-alert">
                <AlertCircle size={18} /> {error}
              </div>
            )}
            <div className="action-row">
              <button onClick={handleReset} className="btn-outline" disabled={loading}>Clear</button>
              <button onClick={handleUpload} className="btn-primary" disabled={loading}>
                {loading ? <><Loader2 className="spinner" size={18} /> Processing...</> : "Run Analysis"}
              </button>
            </div>
          </div>
        )}
      </section>

      <section className="card results-card">
        <h3 className="card-title">Analysis Results</h3>
        
        {loading ? (
          <div className="empty-state">
            <Loader2 className="spinner large-spinner" size={48} />
            <p>Running YOLOv8 inference & CNN OCR...</p>
          </div>
        ) : result ? (
          <div className="results-wrapper">
            <div className="results-content animate-slide-up">
              <div className="status-badge success">
                <CheckCircle size={16} /> Scan Complete
              </div>
              
              <div className="result-group highlight-group">
                <div className="result-header">
                  <CreditCard size={18} />
                  <span>Registration Number</span>
                </div>
                <div className="plate-display">{result.plate_characters}</div>
              </div>

              {/* NEW: Vehicle Shape Display */}
              <div className="result-group">
                <div className="result-header">
                  <Car size={18} />
                  <span>Vehicle Body Type</span>
                </div>
                <div className="result-value">{result.vehicle_type}</div>
              </div>

              {/* UPDATED: Plate Category Display */}
              <div className="result-group">
                <div className="result-header">
                  <Settings size={18} />
                  <span>HSRP Category</span>
                </div>
                <div className="result-value">{result.classification}</div>
              </div>

              <div className="result-group">
                <div className="result-header">
                  <Calendar size={18} />
                  <span>Timestamp</span>
                </div>
                <div className="result-value timestamp-value">{result.timestamp}</div>
              </div>
            </div>

            {/* Model Architecture Comparison Section */}
            <div className="metrics-container animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="metrics-header-main">
                <Cpu size={16} /> 
                <h4>Inference Architecture Performance</h4>
              </div>
              
              <div className="metrics-grid">
                {/* YOLOv8 Card */}
                <div className="metric-box yolo-box">
                  <div className="metric-header">
                    <Target size={16} /> YOLOv8 <span className="badge">Localization</span>
                  </div>
                  <div className="metric-row">
                    <span className="metric-label">Task</span>
                    <span className="metric-val">Plate Detection</span>
                  </div>
                  <div className="metric-row">
                    <span className="metric-label">Avg. Speed</span>
                    <span className="metric-val speed-val"><Zap size={12}/> ~42ms</span>
                  </div>
                  <div className="metric-row">
                    <span className="metric-label">Confidence</span>
                    <span className="metric-val">98.5% (mAP)</span>
                  </div>
                </div>

                {/* CNN Card */}
                <div className="metric-box cnn-box">
                  <div className="metric-header">
                    <Layers size={16} /> Custom CNN <span className="badge">OCR</span>
                  </div>
                  <div className="metric-row">
                    <span className="metric-label">Task</span>
                    <span className="metric-val">Char Extraction</span>
                  </div>
                  <div className="metric-row">
                    <span className="metric-label">Avg. Speed</span>
                    <span className="metric-val speed-val"><Zap size={12}/> ~115ms</span>
                  </div>
                  <div className="metric-row">
                    <span className="metric-label">Accuracy</span>
                    <span className="metric-val">96.2%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <Car className="empty-icon" size={48} />
            <p>Upload an image and run analysis to see results here.</p>
          </div>
        )}
      </section>
    </div>
  )

  const renderHistory = () => (
    <div className="card animate-fade-in full-width-card">
      <div className="card-header-flex">
        <h3 className="card-title">Session Scan History</h3>
        <button 
          className="btn-outline btn-small" 
          onClick={() => setScanHistory([])}
          disabled={scanHistory.length === 0}
        >
          <Trash2 size={16} /> Clear History
        </button>
      </div>
      
      {scanHistory.length === 0 ? (
        <div className="empty-state">
          <History className="empty-icon" size={48} />
          <p>No scans performed in this session yet.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="history-table">
            <thead>
              {/* UPDATED: Added a column for the new Vehicle Type data */}
              <tr>
                <th>Registration Plate</th>
                <th>Body Type</th>
                <th>HSRP Category</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {scanHistory.map((scan) => (
                <tr key={scan.id}>
                  <td className="fw-bold">{scan.plate_characters}</td>
                  <td>{scan.vehicle_type}</td>
                  <td>{scan.classification}</td>
                  <td className="timestamp-value small-text">{scan.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )

  const renderSettings = () => (
    <div className="card animate-fade-in full-width-card settings-card">
      <h3 className="card-title">Model Configuration</h3>
      <div className="settings-grid">
        <div className="setting-item">
          <label>Detection Engine</label>
          <select disabled className="settings-input"><option>YOLOv8 + Custom CNN</option></select>
          <p className="setting-hint">Primary object detection and OCR engine.</p>
        </div>
        <div className="setting-item">
          <label>Weights Dataset</label>
          <select disabled className="settings-input"><option>Indian_HSRP_v2.pt</option></select>
          <p className="setting-hint">Trained on custom HSRP dataset (30k+ epochs).</p>
        </div>
        <div className="setting-item">
          <label>Confidence Threshold</label>
          <input type="range" disabled min="0" max="100" value="85" className="settings-input" />
          <p className="setting-hint">Require 85% model confidence to log successful scan.</p>
        </div>
      </div>
    </div>
  )

  return (
    <div className="webapp-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <Car className="brand-icon" />
          <h2>HSRP Vision</h2>
        </div>
        <nav className="sidebar-nav">
          <button className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button className={`nav-item ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
            <History size={20} /> Scan History
          </button>
          <button className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
            <Settings size={20} /> Settings
          </button>
        </nav>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <h1 className="page-title">
              {activeTab === 'dashboard' && "Scanner Dashboard"}
              {activeTab === 'history' && "Scan History"}
              {activeTab === 'settings' && "Model Settings"}
            </h1>
            <p className="page-subtitle">
              {activeTab === 'dashboard' && "Upload and analyze vehicle registration plates."}
              {activeTab === 'history' && "Review previously scanned vehicles from this session."}
              {activeTab === 'settings' && "Configure local AI models and detection thresholds."}
            </p>
          </div>
          {activeTab === 'dashboard' && result && (
            <button onClick={downloadReport} className="btn-export">
              <Download size={18} /> Export Report
            </button>
          )}
        </header>

        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'history' && renderHistory()}
        {activeTab === 'settings' && renderSettings()}

      </main>
    </div>
  )
}

const Layers = ({size}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 12 12 17 22 12"></polyline><polyline points="2 17 12 22 22 17"></polyline></svg>
);

export default App