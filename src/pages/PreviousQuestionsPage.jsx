import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileQuestion, Search, Download, ExternalLink, ArrowLeft,
  RefreshCw, CheckCircle, BookOpen, Calendar, AlertCircle,
  Languages, BookA, Calculator, Atom, FlaskConical, Leaf,
  Monitor, ShoppingBag, TrendingUp, Receipt, Globe, Microscope, X
} from 'lucide-react';
import { findQuestionPapers, questionPapersCatalog } from '../data/tnMaterials';

const subjects10 = [
  { name: 'Tamil', key: 'tamil', icon: Languages, color: '#ec4899' },
  { name: 'English', key: 'english', icon: BookA, color: '#3b82f6' },
  { name: 'Maths', key: 'maths', icon: Calculator, color: '#f59e0b' },
  { name: 'Science', key: 'science', icon: Microscope, color: '#10b981' },
  { name: 'Social Science', key: 'social-science', icon: Globe, color: '#8b5cf6' },
];

const subjects12 = [
  { name: 'Tamil', key: 'tamil', icon: Languages, color: '#ec4899' },
  { name: 'English', key: 'english', icon: BookA, color: '#3b82f6' },
  { name: 'Maths', key: 'maths', icon: Calculator, color: '#f59e0b' },
  { name: 'Physics', key: 'physics', icon: Atom, color: '#06b6d4' },
  { name: 'Chemistry', key: 'chemistry', icon: FlaskConical, color: '#ef4444' },
  { name: 'Biology', key: 'biology', icon: Leaf, color: '#22c55e' },
  { name: 'Computer Science', key: 'computer-science', icon: Monitor, color: '#00d4ff' },
  { name: 'Commerce', key: 'commerce', icon: ShoppingBag, color: '#a855f7' },
  { name: 'Economics', key: 'economics', icon: TrendingUp, color: '#14b8a6' },
  { name: 'Accountancy', key: 'accountancy', icon: Receipt, color: '#f97316' },
];

const years = ['2025', '2024', '2023', '2022', '2021', '2020', '2019'];

// Build real Google search URL for question papers
function buildSearchUrl(cls, subject, year) {
  const q = `${cls}th ${subject} previous year question paper ${year} Tamil Nadu Samacheer Kalvi PDF`;
  return `https://www.google.com/search?q=${encodeURIComponent(q)}`;
}

// Real portal links for question papers
function getPortalLinks(cls, subject) {
  const sub = subject.toLowerCase().replace(/\s+/g, '-');
  
  // Find exact mapping in catalog if available
  const catalogItem = questionPapersCatalog.find(item => 
    item.standard === cls && item.subject.toLowerCase() === subject.toLowerCase()
  );

  return [
    {
      id: `padasalai-${cls}-${sub}`,
      title: catalogItem ? catalogItem.title : `${cls}th ${subject} — Previous Year Papers (Padasalai)`,
      source: catalogItem ? catalogItem.source : 'Padasalai.net',
      url: catalogItem ? catalogItem.portalUrl : `https://www.padasalai.net/search?q=${encodeURIComponent(cls + 'th ' + subject + ' question paper')}`,
    },
    {
      id: `kalvikadal-${cls}-${sub}`,
      title: `${cls}th ${subject} — Model & Public Exam Papers (KalviKadal)`,
      source: 'KalviKadal.in',
      url: `https://www.kalvikadal.in/search?q=${encodeURIComponent(cls + 'th ' + subject + ' question paper')}`,
    }
  ];
}

// Skeleton loader component
function SkeletonCard() {
  return (
    <div className="card notes-result-card" style={{ opacity: 0.4 }}>
      <div className="notes-result-icon pdf" style={{ background: 'var(--color-bg-tertiary)' }}>
        <div style={{ width: 20, height: 20, background: 'var(--color-border)', borderRadius: 4 }} />
      </div>
      <div className="notes-result-info">
        <div style={{ width: '70%', height: 14, background: 'var(--color-border)', borderRadius: 6, marginBottom: 6 }} />
        <div style={{ width: '40%', height: 10, background: 'var(--color-border)', borderRadius: 4 }} />
      </div>
    </div>
  );
}

export default function PreviousQuestionsPage() {
  const { studentClass } = useAuth();
  const [activeClass, setActiveClass] = useState(studentClass || '12');
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [viewingUrl, setViewingUrl] = useState(null);
  const [viewingTitle, setViewingTitle] = useState('');
  
  // Fuzzy Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [googleSearchUrl, setGoogleSearchUrl] = useState('');
  const debounceRef = useRef(null);

  const subjects = activeClass === '10' ? subjects10 : subjects12;

  // Debounced Fuzzy Search (300ms)
  const debouncedSearch = useCallback((query) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    
    if (!query.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      setIsSearching(false);
      return;
    }
    
    setIsSearching(true);
    
    debounceRef.current = setTimeout(() => {
      const { results, googleSearchUrl: gUrl } = findQuestionPapers(query);
      setSearchResults(results);
      setGoogleSearchUrl(gUrl);
      setHasSearched(true);
      setIsSearching(false);
    }, 300);
  }, []);

  // Handle search input change with debounce
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    debouncedSearch(val);
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setHasSearched(false);
    setIsSearching(false);
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, []);

  const handleSubjectClick = (sub) => {
    setSelectedSubject(sub);
    setSelectedYear(null);
  };

  const handleYearClick = (year) => {
    setSelectedYear(year);
    const url = buildSearchUrl(activeClass, selectedSubject.name, year);
    setViewingUrl(url);
    setViewingTitle(`${activeClass}th ${selectedSubject.name} — ${year} Question Paper`);
  };

  const handlePortalClick = (portal) => {
    setViewingUrl(portal.url);
    setViewingTitle(portal.title);
  };

  const handleSearchResultClick = (result) => {
    setViewingUrl(result.portalUrl);
    setViewingTitle(result.title);
  };

  const portalLinks = selectedSubject ? getPortalLinks(activeClass, selectedSubject.name) : [];

  // Determine if in search mode
  const isSearchMode = searchQuery.length > 0;

  return (
    <div className="page-container">
      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="page-title">📝 Previous Questions</h1>
        <p className="page-subtitle">Search & download public exam question papers</p>
      </motion.div>

      {/* Search Bar */}
      <motion.div 
        className="notes-search"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Search className="notes-search-icon" size={20} />
        <input
          type="text"
          placeholder="Search subject (e.g. 12th physics, maths)..."
          value={searchQuery}
          onChange={handleSearchChange}
          id="qp-search-input"
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            style={{
              position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        )}
      </motion.div>

      {/* Search Results (Real-time) */}
      {isSearchMode && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ marginTop: 'var(--space-4)' }}
        >
          {/* Loading Skeleton */}
          {isSearching && (
            <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          )}

          {/* Results Found */}
          {hasSearched && !isSearching && searchResults.length > 0 && (
            <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>
                Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{searchQuery}"
              </p>
              {searchResults.map((result, i) => (
                <motion.div
                  key={result.id}
                  className="card notes-result-card"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="notes-result-icon pdf">
                    <FileQuestion size={20} />
                  </div>
                  <div className="notes-result-info">
                    <div className="notes-result-title">{result.title}</div>
                    <div className="notes-result-source">{result.source}</div>
                  </div>
                  <button
                    onClick={() => handleSearchResultClick(result)}
                    className="btn btn-primary btn-icon"
                    title="Open & Search"
                    style={{ padding: '10px 14px', minWidth: 44, minHeight: 44 }}
                  >
                    <Search size={16} />
                  </button>
                </motion.div>
              ))}
            </div>
          )}

          {/* No Results */}
          {hasSearched && !isSearching && searchResults.length === 0 && (
            <motion.div
              style={{ textAlign: 'center', padding: 'var(--space-10) var(--space-6)' }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div style={{
                width: 60, height: 60,
                background: 'rgba(245, 158, 11, 0.15)',
                borderRadius: 'var(--radius-2xl)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto var(--space-4)'
              }}>
                <AlertCircle size={28} color="var(--color-accent-orange)" />
              </div>
              <h3 style={{ marginBottom: 'var(--space-2)', fontSize: 'var(--text-lg)' }}>Subject not found</h3>
              <p style={{ color: 'var(--color-text-secondary)', maxWidth: 380, margin: '0 auto var(--space-6)', fontSize: 'var(--text-sm)' }}>
                Please check the spelling and try again. Example: "12th physics", "10th maths"
              </p>
              {googleSearchUrl && (
                <a
                  href={googleSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-lg"
                  style={{ gap: 'var(--space-2)', padding: '12px 24px', minHeight: 48 }}
                >
                  <Search size={18} />
                  Search on Google
                </a>
              )}
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Browse Mode (when not searching) */}
      {!isSearchMode && (
        <>
          {/* Class Toggle */}
          <div className="cutoff-class-toggle" style={{ marginBottom: 'var(--space-6)' }}>
            <button
              className={`cutoff-class-btn ${activeClass === '12' ? 'active' : ''}`}
              onClick={() => { setActiveClass('12'); setSelectedSubject(null); setSelectedYear(null); }}
            >
              12th (HSC)
            </button>
            <button
              className={`cutoff-class-btn ${activeClass === '10' ? 'active' : ''}`}
              onClick={() => { setActiveClass('10'); setSelectedSubject(null); setSelectedYear(null); }}
            >
              10th (SSLC)
            </button>
          </div>

          {/* Subject Grid */}
          {!selectedSubject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <BookOpen size={20} color="var(--color-accent-purple)" />
                Select Subject
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 'var(--space-3)' }}>
                {subjects.map((sub, i) => {
                  const Icon = sub.icon;
                  return (
                  <motion.button
                    key={sub.key}
                    className="card"
                    onClick={() => handleSubjectClick(sub)}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.04 }}
                    style={{
                      padding: 'var(--space-5) var(--space-4)',
                      textAlign: 'center',
                      cursor: 'pointer',
                      border: '1px solid var(--color-border)',
                      transition: 'all 0.2s ease',
                    }}
                    whileHover={{ scale: 1.03, borderColor: `${sub.color}66` }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <div style={{
                      width: 44, height: 44,
                      background: `${sub.color}20`,
                      borderRadius: 'var(--radius-lg)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      margin: '0 auto var(--space-2)',
                    }}>
                      <Icon size={22} color={sub.color} />
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>{sub.name}</div>
                  </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Year Selector + Portal Links */}
          {selectedSubject && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {/* Back to subjects */}
              <button
                onClick={() => { setSelectedSubject(null); setSelectedYear(null); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
                  color: 'var(--color-accent-blue)', background: 'none', border: 'none',
                  cursor: 'pointer', fontWeight: 600, fontSize: 'var(--text-sm)',
                  marginBottom: 'var(--space-4)', padding: 0,
                }}
              >
                <ArrowLeft size={16} /> Back to Subjects
              </button>

              <h3 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-2)' }}>
                {activeClass}th {selectedSubject.name}
              </h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-6)' }}>
                Use the portal links below to find question papers
              </p>

              {/* Portal Links */}
              <div>
                <h4 style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-3)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <Search size={16} />
                  Question Paper Portals
                </h4>
                <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
                  {portalLinks.map((portal, i) => (
                    <motion.div
                      key={portal.id}
                      className="card notes-result-card"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                    >
                      <div className="notes-result-icon pdf">
                        <FileQuestion size={20} />
                      </div>
                      <div className="notes-result-info">
                        <div className="notes-result-title">{portal.title}</div>
                        <div className="notes-result-source">{portal.source}</div>
                      </div>
                      <button
                        onClick={() => handlePortalClick(portal)}
                        className="btn btn-primary btn-icon"
                        title="Open & Search"
                        style={{ padding: '10px 14px', minWidth: 44, minHeight: 44 }}
                      >
                        <Search size={16} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </>
      )}

      {/* ===== In-App Viewer Overlay ===== */}
      <AnimatePresence>
        {viewingUrl && (
          <motion.div
            className="article-reader-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setViewingUrl(null)}
          >
            <motion.div
              className="pdf-viewer-panel"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="article-reader-header">
                <button
                  className="article-reader-close"
                  onClick={() => setViewingUrl(null)}
                >
                  <ArrowLeft size={20} />
                </button>
                <div className="article-reader-header-info">
                  <span className="article-reader-source" style={{ fontSize: 'var(--text-xs)' }}>
                    {viewingTitle}
                  </span>
                </div>
                <button
                  className="btn btn-outline"
                  onClick={() => window.open(viewingUrl, '_blank')}
                  style={{ padding: '6px 12px', fontSize: 'var(--text-xs)', gap: 'var(--space-1)' }}
                >
                  <ExternalLink size={14} />
                  Open
                </button>
              </div>
              <div className="pdf-viewer-body">
                <iframe
                  src={viewingUrl}
                  title={viewingTitle}
                  className="pdf-viewer-iframe"
                  allowFullScreen
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
