import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Calculator, CheckCircle, AlertCircle, XCircle, TrendingUp } from 'lucide-react';
import { 
  calculateTNEACutoff, get12thBranches,
  calculate10thPercentage, get10thGroups 
} from '../utils/cutoffCalculator';

export default function CutoffPage() {
  const { studentClass } = useAuth();
  const [activeClass, setActiveClass] = useState(studentClass || '12');
  
  // 12th marks
  const [marks12, setMarks12] = useState({ maths: '', physics: '', chemistry: '' });
  const [cutoff12, setCutoff12] = useState(null);
  const [branches12, setBranches12] = useState([]);

  // 10th marks
  const [marks10, setMarks10] = useState({ 
    tamil: '', english: '', maths: '', science: '', socialScience: '' 
  });
  const [result10, setResult10] = useState(null);
  const [groups10, setGroups10] = useState([]);

  const handleCalculate12 = () => {
    const cutoff = calculateTNEACutoff(marks12.maths, marks12.physics, marks12.chemistry);
    setCutoff12(cutoff);
    setBranches12(get12thBranches(cutoff));
  };

  const handleCalculate10 = () => {
    const result = calculate10thPercentage(marks10);
    setResult10(result);
    setGroups10(get10thGroups(result));
  };

  const getScoreColor = (score, max) => {
    const pct = (score / max) * 100;
    if (pct >= 80) return 'var(--color-accent-emerald)';
    if (pct >= 60) return 'var(--color-accent-blue)';
    if (pct >= 40) return 'var(--color-accent-orange)';
    return 'var(--color-accent-red)';
  };

  const statusIcon = (status) => {
    if (status === 'eligible') return <CheckCircle size={16} color="var(--color-accent-emerald)" />;
    if (status === 'moderate') return <AlertCircle size={16} color="var(--color-accent-orange)" />;
    return <XCircle size={16} color="var(--color-accent-red)" />;
  };

  return (
    <div className="page-container">
      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="page-title">🧮 Calculate Cutoff</h1>
        <p className="page-subtitle">Enter your marks to calculate cutoff and see eligible branches</p>
      </motion.div>

      <div className="cutoff-calculator">
        {/* Class Toggle */}
        <div className="cutoff-class-toggle">
          <button
            className={`cutoff-class-btn ${activeClass === '12' ? 'active' : ''}`}
            onClick={() => setActiveClass('12')}
            id="cutoff-class-12"
          >
            12th (HSC)
          </button>
          <button
            className={`cutoff-class-btn ${activeClass === '10' ? 'active' : ''}`}
            onClick={() => setActiveClass('10')}
            id="cutoff-class-10"
          >
            10th (SSLC)
          </button>
        </div>

        {/* 12th Calculator */}
        {activeClass === '12' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
              <h4 style={{ marginBottom: 'var(--space-2)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <TrendingUp size={20} color="var(--color-accent-blue)" />
                TNEA Cutoff Formula
              </h4>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>
                Cutoff = Maths (100) + Physics/2 (50) + Chemistry/2 (50) = Out of 200
              </p>

              <div className="cutoff-input-grid">
                <div className="cutoff-input-group">
                  <label>Mathematics (out of 100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="0"
                    value={marks12.maths}
                    onChange={(e) => setMarks12(p => ({ ...p, maths: e.target.value }))}
                    id="cutoff-maths-12"
                  />
                </div>
                <div className="cutoff-input-group">
                  <label>Physics (out of 100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="0"
                    value={marks12.physics}
                    onChange={(e) => setMarks12(p => ({ ...p, physics: e.target.value }))}
                    id="cutoff-physics-12"
                  />
                </div>
                <div className="cutoff-input-group">
                  <label>Chemistry (out of 100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="0"
                    value={marks12.chemistry}
                    onChange={(e) => setMarks12(p => ({ ...p, chemistry: e.target.value }))}
                    id="cutoff-chemistry-12"
                  />
                </div>
              </div>

              <button
                className="btn btn-primary btn-lg"
                onClick={handleCalculate12}
                style={{ width: '100%' }}
                id="cutoff-calculate-12"
              >
                <Calculator size={18} />
                Calculate Cutoff
              </button>
            </div>

            {/* 12th Result */}
            {cutoff12 !== null && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="card cutoff-result-box">
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>
                    Your TNEA Cutoff
                  </p>
                  <div className="cutoff-score" style={{ color: getScoreColor(cutoff12, 200) }}>
                    {cutoff12.toFixed(1)}
                  </div>
                  <div className="cutoff-max">/ 200</div>
                  
                  <div className="cutoff-meter">
                    <div 
                      className="cutoff-meter-fill" 
                      style={{ 
                        width: `${(cutoff12 / 200) * 100}%`,
                        background: `linear-gradient(90deg, var(--color-accent-blue), ${getScoreColor(cutoff12, 200)})`
                      }} 
                    />
                  </div>

                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                    {cutoff12 >= 190 ? '🔥 Excellent! Top tier colleges are within reach!' :
                     cutoff12 >= 170 ? '💪 Great score! Many good colleges available.' :
                     cutoff12 >= 140 ? '👍 Good score. Apply to multiple colleges.' :
                     '📚 Consider improving through supplementary exams.'}
                  </p>
                </div>

                <div style={{ marginTop: 'var(--space-6)' }}>
                  <h4 style={{ marginBottom: 'var(--space-4)' }}>Branch Eligibility</h4>
                  <div className="cutoff-branches">
                    {branches12.map((branch, i) => (
                      <motion.div
                        key={branch.name}
                        className="cutoff-branch-item"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03 }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                          {statusIcon(branch.status)}
                          <div>
                            <div className="cutoff-branch-name">{branch.name}</div>
                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                              {branch.category} {branch.note ? `• ${branch.note}` : `• Min: ${branch.minCutoff}`}
                            </div>
                          </div>
                        </div>
                        <span className={`cutoff-branch-status ${branch.status}`}>
                          {branch.status === 'eligible' ? 'Eligible' : 
                           branch.status === 'moderate' ? 'Possible' : 'Difficult'}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* 10th Calculator */}
        {activeClass === '10' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
              <h4 style={{ marginBottom: 'var(--space-2)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <TrendingUp size={20} color="var(--color-accent-purple)" />
                Group Selection Calculator
              </h4>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>
                Enter your 10th marks to find the best group for you
              </p>

              <div className="cutoff-input-grid">
                <div className="cutoff-input-group">
                  <label>Tamil (out of 100)</label>
                  <input
                    type="number" min="0" max="100" placeholder="0"
                    value={marks10.tamil}
                    onChange={(e) => setMarks10(p => ({ ...p, tamil: e.target.value }))}
                    id="cutoff-tamil-10"
                  />
                </div>
                <div className="cutoff-input-group">
                  <label>English (out of 100)</label>
                  <input
                    type="number" min="0" max="100" placeholder="0"
                    value={marks10.english}
                    onChange={(e) => setMarks10(p => ({ ...p, english: e.target.value }))}
                    id="cutoff-english-10"
                  />
                </div>
                <div className="cutoff-input-group">
                  <label>Mathematics (out of 100)</label>
                  <input
                    type="number" min="0" max="100" placeholder="0"
                    value={marks10.maths}
                    onChange={(e) => setMarks10(p => ({ ...p, maths: e.target.value }))}
                    id="cutoff-maths-10"
                  />
                </div>
                <div className="cutoff-input-group">
                  <label>Science (out of 100)</label>
                  <input
                    type="number" min="0" max="100" placeholder="0"
                    value={marks10.science}
                    onChange={(e) => setMarks10(p => ({ ...p, science: e.target.value }))}
                    id="cutoff-science-10"
                  />
                </div>
                <div className="cutoff-input-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Social Science (out of 100)</label>
                  <input
                    type="number" min="0" max="100" placeholder="0"
                    value={marks10.socialScience}
                    onChange={(e) => setMarks10(p => ({ ...p, socialScience: e.target.value }))}
                    id="cutoff-social-10"
                  />
                </div>
              </div>

              <button
                className="btn btn-purple btn-lg"
                onClick={handleCalculate10}
                style={{ width: '100%' }}
                id="cutoff-calculate-10"
              >
                <Calculator size={18} />
                Find Best Group
              </button>
            </div>

            {/* 10th Result */}
            {result10 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="card cutoff-result-box">
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>
                    Your Total & Percentage
                  </p>
                  <div className="cutoff-score" style={{ color: getScoreColor(result10.percentage, 100) }}>
                    {result10.total}
                  </div>
                  <div className="cutoff-max">/ 500 ({result10.percentage.toFixed(1)}%)</div>
                  
                  <div className="cutoff-meter">
                    <div 
                      className="cutoff-meter-fill" 
                      style={{ 
                        width: `${result10.percentage}%`,
                        background: `linear-gradient(90deg, var(--color-accent-purple), ${getScoreColor(result10.percentage, 100)})`
                      }} 
                    />
                  </div>
                </div>

                <div style={{ marginTop: 'var(--space-6)' }}>
                  <h4 style={{ marginBottom: 'var(--space-4)' }}>Recommended Groups</h4>
                  <div className="cutoff-branches">
                    {groups10.map((group, i) => (
                      <motion.div
                        key={group.name}
                        className="cutoff-branch-item"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        style={{ flexDirection: 'column', alignItems: 'stretch', gap: 'var(--space-3)' }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                            {statusIcon(group.status)}
                            <div className="cutoff-branch-name">{group.name}</div>
                          </div>
                          <span className={`cutoff-branch-status ${group.status}`}>
                            {group.compatibility}% Match
                          </span>
                        </div>
                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginLeft: 'var(--space-8)' }}>
                          {group.description}
                        </p>
                        <div style={{ marginLeft: 'var(--space-8)' }}>
                          <div className="recommender-bar">
                            <div
                              className="recommender-bar-fill"
                              style={{
                                width: `${group.compatibility}%`,
                                background: group.status === 'eligible' ? 'var(--gradient-emerald)' :
                                  group.status === 'moderate' ? 'var(--gradient-orange)' : 'var(--color-accent-red)'
                              }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
