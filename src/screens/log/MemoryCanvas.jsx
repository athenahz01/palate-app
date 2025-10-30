import { useState } from 'react';
import { getRadarAttributes } from '../../services/liquorKnowledgeDatabase';

export default function MemoryCanvas({ 
  isOpen,
  onClose,
  category, 
  capturedPhoto,
  extractedData,
  onComplete
}) {
  // Initialize form with enriched data
  const [formData, setFormData] = useState({
    name: extractedData?.name || '',
    producer: extractedData?.producer || '',
    vintage: extractedData?.vintage || '',
    region: extractedData?.region || '',
    type: extractedData?.type || '',
    abv: extractedData?.abv || '',
    grapes: extractedData?.grapes?.join(', ') || '',
    description: extractedData?.description || '',
    where: '',
    when: '',
    with: '',
    notes: ''
  });

  // Get radar attributes from database if available
  const [radarAttributes] = useState(() => {
    // If enriched data has attributes, use them
    if (extractedData?.attributes) {
      return extractedData.attributes;
    }
    // Otherwise try to get from database
    const dbAttributes = getRadarAttributes(extractedData?.name, category);
    return dbAttributes || null;
  });

  // Show enrichment badge if data was found in database
  const isEnriched = extractedData?.enriched || false;
  const enrichmentConfidence = extractedData?.enrichmentConfidence || 0;

  if (!isOpen) return null;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    // Include attributes in the form data
    const dataToSubmit = {
      ...formData,
      attributes: radarAttributes
    };
    
    onComplete(dataToSubmit);
  };

  return (
    <div className="memory-canvas-modal">
      <div className="memory-canvas-overlay" onClick={onClose} />
      
      <div className="memory-canvas-content">
        <div className="memory-canvas-header">
          <h2>Memory Canvas</h2>
          <button onClick={onClose} className="close-button">✕</button>
        </div>

        <div className="memory-canvas-body">
          {/* Scanned Image Preview */}
          {capturedPhoto && (
            <div className="image-preview">
              <img src={capturedPhoto} alt="Scanned label" />
            </div>
          )}

          {/* Enrichment Badge */}
          {isEnriched && (
            <div className="enrichment-badge">
              <span className="badge-icon">✨</span>
              <span className="badge-text">
                Found in database ({enrichmentConfidence}% match)
              </span>
            </div>
          )}

          {/* Form Fields */}
          <div className="form-container">
            <div className="form-group">
              <label>Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Wine name"
              />
            </div>

            <div className="form-group">
              <label>Producer</label>
              <input
                type="text"
                value={formData.producer}
                onChange={(e) => handleInputChange('producer', e.target.value)}
                placeholder="Producer/Distillery"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Vintage</label>
                <input
                  type="text"
                  value={formData.vintage}
                  onChange={(e) => handleInputChange('vintage', e.target.value)}
                  placeholder="2020"
                />
              </div>

              <div className="form-group">
                <label>ABV</label>
                <input
                  type="text"
                  value={formData.abv}
                  onChange={(e) => handleInputChange('abv', e.target.value)}
                  placeholder="13.5%"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Region</label>
              <input
                type="text"
                value={formData.region}
                onChange={(e) => handleInputChange('region', e.target.value)}
                placeholder="Bordeaux, France"
              />
            </div>

            <div className="form-group">
              <label>Type</label>
              <input
                type="text"
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                placeholder="Red Wine"
              />
            </div>

            {formData.grapes && (
              <div className="form-group">
                <label>Grapes</label>
                <input
                  type="text"
                  value={formData.grapes}
                  onChange={(e) => handleInputChange('grapes', e.target.value)}
                  placeholder="Cabernet Sauvignon, Merlot"
                />
              </div>
            )}

            {/* Memory Fields */}
            <div className="form-section-title">Memory</div>
            
            <div className="form-group">
              <label>Where</label>
              <input
                type="text"
                value={formData.where}
                onChange={(e) => handleInputChange('where', e.target.value)}
                placeholder="Where did you have this?"
              />
            </div>

            <div className="form-group">
              <label>When</label>
              <input
                type="text"
                value={formData.when}
                onChange={(e) => handleInputChange('when', e.target.value)}
                placeholder="When did you have this?"
              />
            </div>

            <div className="form-group">
              <label>With</label>
              <input
                type="text"
                value={formData.with}
                onChange={(e) => handleInputChange('with', e.target.value)}
                placeholder="Who were you with?"
              />
            </div>

            <div className="form-group">
              <label>Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={3}
                placeholder="Any additional notes..."
              />
            </div>

            {/* Show Radar Preview if attributes available */}
            {radarAttributes && (
              <div className="radar-preview">
                <h3>Expected Profile</h3>
                <div className="radar-attributes">
                  {Object.entries(radarAttributes).map(([key, value]) => (
                    <div key={key} className="attribute-bar">
                      <span className="attribute-label">{key}</span>
                      <div className="attribute-value-bar">
                        <div 
                          className="attribute-fill" 
                          style={{ width: `${(value / 10) * 100}%` }}
                        />
                      </div>
                      <span className="attribute-value">{value}</span>
                    </div>
                  ))}
                </div>
                <p className="radar-note">
                  {isEnriched 
                    ? '✓ Attributes from our knowledge database' 
                    : 'You can adjust these during comparison'}
                </p>
              </div>
            )}
          </div>

          {/* Additional info from database */}
          {extractedData?.typicalPrice && (
            <div className="additional-info">
              <p><strong>Typical Price:</strong> ${extractedData.typicalPrice}</p>
            </div>
          )}

          {extractedData?.classification && (
            <div className="additional-info">
              <p><strong>Classification:</strong> {extractedData.classification}</p>
            </div>
          )}
        </div>

        <div className="memory-canvas-footer">
          <button 
            onClick={onClose} 
            className="btn-secondary"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit} 
            className="btn-primary"
            disabled={!formData.name}
          >
            Continue
          </button>
        </div>
      </div>

      <style jsx>{`
        .memory-canvas-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .memory-canvas-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
        }

        .memory-canvas-content {
          position: relative;
          z-index: 1001;
          width: 90%;
          max-width: 600px;
          max-height: 90vh;
          background: white;
          border-radius: 1rem;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          display: flex;
          flex-direction: column;
        }

        .memory-canvas-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid #e0e0e0;
        }

        .memory-canvas-header h2 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .close-button {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #666;
          padding: 0.25rem 0.5rem;
        }

        .close-button:hover {
          color: #333;
        }

        .memory-canvas-body {
          flex: 1;
          overflow-y: auto;
          padding: 1.5rem;
        }

        .image-preview {
          width: 100%;
          height: 200px;
          margin-bottom: 1rem;
          border-radius: 0.5rem;
          overflow: hidden;
        }

        .image-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .enrichment-badge {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }

        .badge-icon {
          font-size: 1.2rem;
        }

        .badge-text {
          font-size: 0.875rem;
          font-weight: 500;
        }

        .form-container {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .form-section-title {
          font-size: 1.125rem;
          font-weight: 600;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #e0e0e0;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group label {
          font-size: 0.875rem;
          font-weight: 500;
          color: #333;
        }

        .form-group input,
        .form-group textarea {
          padding: 0.75rem;
          border: 1px solid #d0d0d0;
          border-radius: 0.5rem;
          font-size: 1rem;
          font-family: inherit;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #667eea;
        }

        .radar-preview {
          margin-top: 1.5rem;
          padding: 1rem;
          background: #f5f5f5;
          border-radius: 0.5rem;
        }

        .radar-preview h3 {
          margin: 0 0 1rem 0;
          font-size: 1rem;
          font-weight: 600;
        }

        .radar-attributes {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .attribute-bar {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .attribute-label {
          font-size: 0.875rem;
          color: #666;
          width: 80px;
          text-align: left;
          text-transform: capitalize;
        }

        .attribute-value-bar {
          flex: 1;
          height: 8px;
          background: #e0e0e0;
          border-radius: 4px;
          overflow: hidden;
        }

        .attribute-fill {
          height: 100%;
          background: linear-gradient(90deg, #667eea, #764ba2);
          transition: width 0.3s ease;
        }

        .attribute-value {
          font-size: 0.875rem;
          color: #333;
          font-weight: 600;
          width: 40px;
          text-align: right;
        }

        .radar-note {
          margin-top: 0.75rem;
          font-size: 0.75rem;
          color: #666;
          text-align: center;
        }

        .additional-info {
          margin: 0.5rem 0;
          padding: 0.75rem;
          background: #f9f9f9;
          border-radius: 0.5rem;
        }

        .additional-info p {
          margin: 0;
          font-size: 0.875rem;
          color: #333;
        }

        .memory-canvas-footer {
          display: flex;
          gap: 1rem;
          padding: 1.5rem;
          border-top: 1px solid #e0e0e0;
        }

        .btn-secondary,
        .btn-primary {
          flex: 1;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 0.5rem;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-secondary {
          background: #e0e0e0;
          color: #333;
        }

        .btn-secondary:hover {
          background: #d0d0d0;
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .memory-canvas-content {
            width: 100%;
            height: 100%;
            max-width: none;
            max-height: none;
            border-radius: 0;
          }

          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}