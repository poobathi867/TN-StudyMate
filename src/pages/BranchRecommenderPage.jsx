import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { GitBranch, Sparkles, Trophy, Target, ArrowRight } from 'lucide-react';
import { recommendBranches12th, recommendBranches10th } from '../utils/branchRecommender';

export default function BranchRecommenderPage() {
  const { studentClass } = useAuth();
  const [activeClass, setActiveClass] = useState(studentClass || '12');
  const [recommendations, setRecommendations] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [calculated, setCalculated] = useState(false);

  // 12th marks state
  const [marks12, setMarks12] = useState({
    tamil: '', english: '', maths: '', physics: '', chemistry: '',
    biology: '', computerScience: ''
  });

  // 10th marks state
  const [marks10, setMarks10] = useState({
    tamil: '', english: '', maths: '', science: '', socialScience: ''
  });

  const careerInterests = [
    'Engineering', 'IT / Software', 'Medical / Healthcare', 'Science / Research',
    'Commerce / CA', 'Banking / Finance', 'Business / Startup',
    'Public Service (IAS/IPS)', 'Teaching', 'Law / Legal', 'Arts / Design'
  ];

  const toggleInterest = (interest) => {
    setSelectedInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleRecommend = () => {
    let results;
    if (activeClass === '12') {
      results = recommendBranches12th(marks12, selectedInterests);
    } else {
      results = recommendBranches10th(marks10, selectedInterests);
    }
    setRecommendations(results);
    setCalculated(true);
  };

  const getRankStyle = (index) => {
    if (index === 0) return 'gold';
    if (index === 1) return 'silver';
    if (index === 2) return 'bronze';
    return '';
  };

  const getCompatibilityColor = (pct) => {
    if (pct >= 80) return 'var(--color-accent-emerald)';
    if (pct >= 60) return 'var(--color-accent-blue)';
    if (pct >= 40) return 'var(--color-accent-orange)';
    return 'var(--color-accent-red)';
  };

  return (
    <div className="page-container">
      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="page-title">🎯 Branch Recommender</h1>
        <p className="page-subtitle">
          Get personalized {activeClass === '12' ? 'branch' : 'group'} recommendations based on your marks & interests
        </p>
      </motion.div>

      <div className="cutoff-calculator">
        {/* Class Toggle */}
        <div className="cutoff-class-toggle">
          <button
            className={`cutoff-class-btn ${activeClass === '12' ? 'active' : ''}`}
            onClick={() => { setActiveClass('12'); setCalculated(false); }}
            id="recommend-class-12"
          >
            12th — Branches
          </button>
          <button
            className={`cutoff-class-btn ${activeClass === '10' ? 'active' : ''}`}
            onClick={() => { setActiveClass('10'); setCalculated(false); }}
            id="recommend-class-10"
          >
            10th — Groups
          </button>
        </div>

        {/* Interests Section */}
        <motion.div 
          className="card"
          style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
            <Sparkles size={20} color="var(--color-accent-orange)" />
            <h4 style={{ margin: 0 }}>What are you passionate about?</h4>
          </div>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>
            Select your career interests to get more accurate recommendations.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
            {careerInterests.map(interest => (
              <button
                key={interest}
                onClick={() => toggleInterest(interest)}
                className={`chip ${selectedInterests.includes(interest) ? 'active' : ''}`}
                style={{ cursor: 'pointer' }}
              >
                {interest}
              </button>
            ))}
          </div>
        </motion.div>

        {/* 12th Input */}
        {activeClass === '12' && (
          <motion.div
            className="card"
            style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h4 style={{ marginBottom: 'var(--space-2)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Target size={20} color="var(--color-accent-blue)" />
              Enter Your 12th Marks (out of 100)
            </h4>
            
            <div className="cutoff-input-grid">
              {[
                { key: 'tamil', label: 'Tamil' },
                { key: 'english', label: 'English' },
                { key: 'maths', label: 'Mathematics' },
                { key: 'physics', label: 'Physics' },
                { key: 'chemistry', label: 'Chemistry' },
                { key: 'biology', label: 'Biology', disabled: marks12.computerScience !== '' },
                { key: 'computerScience', label: 'Computer Science', disabled: marks12.biology !== '' },
              ].map(field => (
                <div key={field.key} className="cutoff-input-group">
                  <label style={{ opacity: field.disabled ? 0.5 : 1 }}>{field.label}</label>
                  <input
                    type="number" min="0" max="100" placeholder="—"
                    value={marks12[field.key]}
                    onChange={(e) => setMarks12(p => ({ ...p, [field.key]: e.target.value }))}
                    disabled={field.disabled}
                    style={{ 
                      opacity: field.disabled ? 0.5 : 1, 
                      cursor: field.disabled ? 'not-allowed' : 'text' 
                    }}
                  />
                </div>
              ))}
            </div>

            <button
              className="btn btn-primary btn-lg"
              onClick={handleRecommend}
              style={{ width: '100%', marginTop: 'var(--space-4)' }}
              id="recommend-submit-12"
            >
              <Sparkles size={18} />
              Get Recommendations
              <ArrowRight size={18} />
            </button>
          </motion.div>
        )}

        {/* 10th Input */}
        {activeClass === '10' && (
          <motion.div
            className="card"
            style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h4 style={{ marginBottom: 'var(--space-2)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Target size={20} color="var(--color-accent-purple)" />
              Enter Your 10th Marks (out of 100)
            </h4>

            <div className="cutoff-input-grid">
              {[
                { key: 'tamil', label: 'Tamil' },
                { key: 'english', label: 'English' },
                { key: 'maths', label: 'Mathematics' },
                { key: 'science', label: 'Science' },
                { key: 'socialScience', label: 'Social Science' },
              ].map(field => (
                <div key={field.key} className="cutoff-input-group">
                  <label>{field.label}</label>
                  <input
                    type="number" min="0" max="100" placeholder="0"
                    value={marks10[field.key]}
                    onChange={(e) => setMarks10(p => ({ ...p, [field.key]: e.target.value }))}
                  />
                </div>
              ))}
            </div>

            <button
              className="btn btn-purple btn-lg"
              onClick={handleRecommend}
              style={{ width: '100%', marginTop: 'var(--space-4)' }}
              id="recommend-submit-10"
            >
              <Sparkles size={18} />
              Get Group Recommendations
              <ArrowRight size={18} />
            </button>
          </motion.div>
        )}


        {/* Results */}
        {calculated && recommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
              <Trophy size={22} color="var(--color-accent-orange)" />
              <h3 style={{ fontSize: 'var(--text-xl)' }}>
                Your {activeClass === '12' ? 'Branch' : 'Group'} Rankings
              </h3>
            </div>

            <div className="recommender-results">
              {recommendations.map((rec, i) => (
                <motion.div
                  key={rec.name}
                  className="card recommender-card"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <div className={`recommender-rank ${getRankStyle(i)}`}>
                    {i + 1}
                  </div>
                  <div className="recommender-info" style={{ flex: 1 }}>
                    <div className="recommender-name">{rec.name}</div>
                    <div className="recommender-reason">{rec.reason}</div>
                    {rec.careers && (
                      <div style={{ 
                        fontSize: 'var(--text-xs)', 
                        color: 'var(--color-accent-blue)', 
                        marginTop: 4 
                      }}>
                        Career paths: {rec.careers}
                      </div>
                    )}
                    <div className="recommender-bar">
                      <div
                        className="recommender-bar-fill"
                        style={{
                          width: `${Math.min(rec.compatibility, 100)}%`,
                          background: `linear-gradient(90deg, ${rec.color || getCompatibilityColor(rec.compatibility)}, ${getCompatibilityColor(rec.compatibility)})`,
                        }}
                      />
                    </div>
                  </div>
                  <div 
                    className="recommender-percentage"
                    style={{ color: getCompatibilityColor(rec.compatibility) }}
                  >
                    {Math.min(rec.compatibility, 100)}%
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="card"
              style={{ marginTop: 'var(--space-6)', padding: 'var(--space-5)', textAlign: 'center' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                💡 These recommendations are based on your marks. For personalized career guidance, 
                try our <a href="/ai" style={{ color: 'var(--color-accent-blue)', fontWeight: 600 }}>AI Study Agent</a>!
              </p>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
