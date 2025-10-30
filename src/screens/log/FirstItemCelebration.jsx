import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Confetti from 'react-confetti';

export default function FirstItemCelebration() {
  const location = useLocation();
  const navigate = useNavigate();
  const { item, category } = location.state || {};
  
  const [showConfetti, setShowConfetti] = useState(true);
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    // Stop confetti after 5 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleContinue = () => {
    // Save the item to storage
    const existingData = JSON.parse(localStorage.getItem('palateAppData') || '{}');
    
    if (!existingData[category]) {
      existingData[category] = {
        items: [],
        radarData: item.attributes || {}
      };
    }

    // Add as first item with rank 1 and score 10.0
    const newItem = {
      ...item,
      rank: 1,
      score: 10.0,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };

    existingData[category].items.push(newItem);
    localStorage.setItem('palateAppData', JSON.stringify(existingData));

    // Navigate to collection view
    navigate(`/collection/${category}`);
  };

  if (!item || !category) {
    navigate('/');
    return null;
  }

  return (
    <div className="first-item-celebration">
      {showConfetti && (
        <Confetti
          width={windowDimensions.width}
          height={windowDimensions.height}
          recycle={false}
          numberOfPieces={500}
        />
      )}

      <div className="celebration-content">
        <div className="celebration-icon">🎉</div>
        
        <h1 className="celebration-title">
          You're logging your first {category}!
        </h1>
        
        <p className="celebration-subtitle">
          This is the beginning of your {category} journey
        </p>

        {/* Item Preview */}
        <div className="item-preview-card">
          {item.image && (
            <div className="item-image">
              <img src={item.image} alt={item.name} />
            </div>
          )}
          
          <div className="item-details">
            <h2 className="item-name">{item.name}</h2>
            {item.producer && (
              <p className="item-producer">{item.producer}</p>
            )}
            {item.region && (
              <p className="item-region">{item.region}</p>
            )}
            {item.vintage && (
              <p className="item-vintage">{item.vintage}</p>
            )}
          </div>

          {/* Show attributes if available */}
          {item.attributes && (
            <div className="item-attributes">
              <h3>Profile Characteristics</h3>
              <div className="attributes-grid">
                {Object.entries(item.attributes).map(([key, value]) => (
                  <div key={key} className="attribute-item">
                    <span className="attribute-label">{key}</span>
                    <div className="attribute-bar">
                      <div 
                        className="attribute-fill" 
                        style={{ width: `${(value / 10) * 100}%` }}
                      />
                    </div>
                    <span className="attribute-value">{value}/10</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* First Item Badge */}
          <div className="first-item-badge">
            <div className="badge-content">
              <span className="badge-rank">#1</span>
              <span className="badge-score">10.0</span>
            </div>
            <p className="badge-text">Your first is automatically your favorite!</p>
          </div>
        </div>

        {/* Info Box */}
        <div className="info-box">
          <p>
            <strong>What's next?</strong> When you log your next {category}, 
            you'll compare it to this one to build your personal ranking!
          </p>
        </div>

        {/* Action Button */}
        <button 
          onClick={handleContinue}
          className="btn-primary celebration-cta"
        >
          View My Collection
        </button>
      </div>

      <style jsx>{`
        .first-item-celebration {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .celebration-content {
          max-width: 600px;
          width: 100%;
          text-align: center;
        }

        .celebration-icon {
          font-size: 5rem;
          margin-bottom: 1rem;
          animation: bounce 1s infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }

        .celebration-title {
          color: white;
          font-size: 2rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
        }

        .celebration-subtitle {
          color: rgba(255, 255, 255, 0.9);
          font-size: 1.2rem;
          margin-bottom: 2rem;
        }

        .item-preview-card {
          background: white;
          border-radius: 1rem;
          padding: 1.5rem;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
          margin-bottom: 1.5rem;
        }

        .item-image {
          width: 100%;
          height: 200px;
          margin-bottom: 1rem;
          border-radius: 0.5rem;
          overflow: hidden;
        }

        .item-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .item-details {
          text-align: left;
          margin-bottom: 1rem;
        }

        .item-name {
          font-size: 1.5rem;
          font-weight: bold;
          color: #333;
          margin-bottom: 0.25rem;
        }

        .item-producer, .item-region, .item-vintage {
          color: #666;
          margin: 0.25rem 0;
        }

        .item-attributes {
          margin-top: 1.5rem;
          text-align: left;
        }

        .item-attributes h3 {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: #333;
        }

        .attributes-grid {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .attribute-item {
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

        .attribute-bar {
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

        .first-item-badge {
          margin-top: 1.5rem;
          padding: 1rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 0.5rem;
          color: white;
        }

        .badge-content {
          display: flex;
          justify-content: center;
          align-items: baseline;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .badge-rank {
          font-size: 2rem;
          font-weight: bold;
        }

        .badge-score {
          font-size: 3rem;
          font-weight: bold;
        }

        .badge-text {
          font-size: 0.875rem;
          opacity: 0.9;
        }

        .info-box {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 0.5rem;
          padding: 1rem;
          margin-bottom: 1.5rem;
          backdrop-filter: blur(10px);
        }

        .info-box p {
          color: white;
          margin: 0;
          font-size: 0.875rem;
          line-height: 1.5;
        }

        .celebration-cta {
          width: 100%;
          padding: 1rem 2rem;
          font-size: 1.1rem;
          font-weight: 600;
          background: white;
          color: #667eea;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .celebration-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
}