import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, FileText, Video, BookOpen, Download, ExternalLink, 
  Play, X, Bookmark, BookmarkCheck, RefreshCw, ArrowLeft, 
  CheckCircle, AlertCircle, Share2
} from 'lucide-react';
import { findMaterials } from '../data/tnMaterials';
import { getOfficialBookUrl } from '../data/officialBooks';


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

// Class badge component
function ClassBadge({ standard }) {
  const colors = { '10': '#ec4899', '11': '#8b5cf6', '12': '#3b82f6' };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', padding: '2px 8px',
      borderRadius: 'var(--radius-full)', fontSize: 10, fontWeight: 700,
      background: `${colors[standard] || '#666'}22`, color: colors[standard] || '#666',
      border: `1px solid ${colors[standard] || '#666'}44`, whiteSpace: 'nowrap',
    }}>
      {standard}th
    </span>
  );
}

// WhatsApp share
function shareToWhatsApp(item) {
  const text = `📚 *${item.title}*\n🔗 Download: ${item.source_url}\n\n— Shared via TN StudyMate`;
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
}

// Redirect to source (not direct download — avoids hotlink blocks)
function openSource(url) {
  window.open(url, '_blank', 'noopener,noreferrer');
}

export default function NotesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('pdfs');
  const [results, setResults] = useState({ pdfs: [], videos: [], articles: [] });
  const [hasSearched, setHasSearched] = useState(false);
  const [googleSearchUrl, setGoogleSearchUrl] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [viewingPdf, setViewingPdf] = useState(null);
  const [downloadStatus, setDownloadStatus] = useState({});
  const [officialBookUrl, setOfficialBookUrl] = useState(null);
  const debounceRef = useRef(null);
  
  const [bookmarks, setBookmarks] = useState(() => {
    const saved = localStorage.getItem('tn_studymate_bookmarks');
    return saved ? JSON.parse(saved) : [];
  });

  // Debounced search (300ms)
  const debouncedSearch = useCallback((query) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    
    // Check for official book url immediately
    const officialUrl = getOfficialBookUrl(query);
    setOfficialBookUrl(officialUrl);

    if (!query.trim()) { setResults({ pdfs: [], videos: [], articles: [] }); setHasSearched(false); setIsSearching(false); return; }
    setIsSearching(true);
    debounceRef.current = setTimeout(() => {
      const res = findMaterials(query);
      setResults(res); setGoogleSearchUrl(res.googleSearchUrl || '');
      setHasSearched(true); setIsSearching(false);
      if (res.pdfs.length > 0) setActiveTab('pdfs');
      else if (res.videos.length > 0) setActiveTab('videos');
    }, 300);
  }, []);

  const handleSearchChange = (e) => { setSearchQuery(e.target.value); debouncedSearch(e.target.value); };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && officialBookUrl) {
      window.open(officialBookUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleChipClick = (chip) => {
    setSearchQuery(chip); setIsSearching(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setTimeout(() => {
      const res = findMaterials(chip); setResults(res); setGoogleSearchUrl(res.googleSearchUrl || '');
      setHasSearched(true); setIsSearching(false);
      if (res.pdfs.length > 0) setActiveTab('pdfs'); else if (res.videos.length > 0) setActiveTab('videos');
    }, 400);
  };
  const clearSearch = () => { setSearchQuery(''); setResults({ pdfs: [], videos: [], articles: [] }); setHasSearched(false); setIsSearching(false); };
  useEffect(() => () => { if (debounceRef.current) clearTimeout(debounceRef.current); }, []);

  const toggleBookmark = (item) => {
    const isMarked = bookmarks.some(b => b.id === item.id);
    const updated = isMarked ? bookmarks.filter(b => b.id !== item.id) : [...bookmarks, item];
    setBookmarks(updated); localStorage.setItem('tn_studymate_bookmarks', JSON.stringify(updated));
  };
  const isBookmarked = (id) => bookmarks.some(b => b.id === id);

  // Download: try blob, fallback to redirect (CORS-safe)
  const handleDownload = async (pdf) => {
    const url = pdf.directDownload || pdf.source_url || pdf.url;
    const id = pdf.id;
    setDownloadStatus(prev => ({ ...prev, [id]: 'downloading' }));
    try {
      const response = await fetch(url, { mode: 'cors' });
      if (response.ok) {
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl; a.download = pdf.title.replace(/[^a-zA-Z0-9\s]/g, '').substring(0, 50) + '.pdf';
        document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(blobUrl);
        setDownloadStatus(prev => ({ ...prev, [id]: 'done' }));
      } else { throw new Error('CORS'); }
    } catch {
      openSource(url);
      setDownloadStatus(prev => ({ ...prev, [id]: 'done' }));
    }
    setTimeout(() => setDownloadStatus(prev => ({ ...prev, [id]: null })), 3000);
  };

  const handleViewPdf = (pdf) => {
    const url = pdf.directDownload || pdf.source_url || pdf.url;
    const viewerUrl = url.includes('google.com/viewer') ? url : `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
    setViewingPdf({ ...pdf, viewerUrl });
  };

  const tabs = [
    { key: 'pdfs', label: '📄 Books & Notes', count: results.pdfs?.length || 0 },
    { key: 'videos', label: '🎥 Video Classes', count: results.videos?.length || 0 },
  ];

  return (
    <div className="page-container">
      <motion.div className="page-header" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="page-title">📚 Notes & Guides</h1>
        <p className="page-subtitle">Search & download official syllabus materials instantly</p>
      </motion.div>

      {/* Search */}
      <motion.div className="notes-search" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Search className="notes-search-icon" size={20} />
        <input type="text" placeholder="Search subject (e.g. 12th physics, maths)..." value={searchQuery} onChange={handleSearchChange} onKeyDown={handleKeyDown} id="notes-search-input" />
        {searchQuery && (
          <button onClick={clearSearch} style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        )}
      </motion.div>


      {/* Official Book Banner */}
      <AnimatePresence>
        {officialBookUrl && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
            style={{ marginBottom: 'var(--space-6)' }}
          >
            <div className="card" style={{ 
              background: 'linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(37,99,235,0.1) 100%)',
              border: '1px solid rgba(59,130,246,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-4)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <div style={{ background: 'rgba(59,130,246,0.2)', padding: 'var(--space-2)', borderRadius: 'var(--radius-md)' }}>
                  <BookOpen size={24} color="#3b82f6" />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: 'var(--text-base)', fontWeight: 700 }}>Official PDF Found!</h4>
                  <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Press Enter or click here to view the PDF directly.</p>
                </div>
              </div>
              <button 
                onClick={() => window.open(officialBookUrl, '_blank', 'noopener,noreferrer')}
                className="btn btn-primary"
                style={{ padding: 'var(--space-2) var(--space-4)' }}
              >
                Open PDF <ExternalLink size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skeleton */}
      {isSearching && <div style={{ padding: 'var(--space-6) 0', display: 'grid', gap: 'var(--space-3)' }}><SkeletonCard /><SkeletonCard /><SkeletonCard /></div>}

      {/* Results */}
      {hasSearched && !isSearching && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          <div className="notes-tabs">
            {tabs.map(tab => (
              <button key={tab.key} className={`notes-tab ${activeTab === tab.key ? 'active' : ''}`} onClick={() => setActiveTab(tab.key)}>
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'pdfs' && (
              <motion.div key="pdfs" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} style={{ display: 'grid', gap: 'var(--space-3)' }}>
                {results.pdfs.map((pdf, i) => (
                  <motion.div key={pdf.id} className="card notes-result-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <div className="notes-result-icon pdf"><FileText size={20} /></div>
                    <div className="notes-result-info">
                      <div className="notes-result-title" style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                        {pdf.title}
                        <ClassBadge standard={pdf.standard} />
                      </div>
                      <div className="notes-result-source">{pdf.source_name} • {pdf.size}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--space-1)', flexShrink: 0, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                      <button className="btn btn-ghost btn-icon" onClick={() => toggleBookmark(pdf)} title={isBookmarked(pdf.id) ? 'Remove' : 'Bookmark'} style={{ minWidth: 38, minHeight: 38 }}>
                        {isBookmarked(pdf.id) ? <BookmarkCheck size={16} color="var(--color-accent-blue)" /> : <Bookmark size={16} />}
                      </button>
                      <button className="btn btn-ghost btn-icon" onClick={() => shareToWhatsApp(pdf)} title="Share via WhatsApp" style={{ minWidth: 38, minHeight: 38 }}>
                        <Share2 size={16} color="#25D366" />
                      </button>
                      <button onClick={() => openSource(pdf.source_url)} className="btn btn-primary btn-icon" title="Download from Source" style={{ minWidth: 38, minHeight: 38 }}>
                        <Download size={16} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
            {activeTab === 'videos' && (
              <motion.div key="videos" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} style={{ display: 'grid', gap: 'var(--space-3)' }}>
                {results.videos.map((vid, i) => (
                  <motion.div key={vid.id} className="card notes-result-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <button className="notes-result-icon video" onClick={() => window.open(vid.url, '_blank')} style={{ cursor: 'pointer', border: 'none', minWidth: 44, minHeight: 44 }}><Play size={20} /></button>
                    <div className="notes-result-info">
                      <div className="notes-result-title">{vid.title}</div>
                      <div className="notes-result-source">{vid.channel} • {vid.duration}</div>
                    </div>
                    <button onClick={() => window.open(vid.url, '_blank')} className="btn btn-outline btn-icon" title="Watch" style={{ minWidth: 44, minHeight: 44 }}><ExternalLink size={16} /></button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* No Results */}
      {hasSearched && !isSearching && results.pdfs.length === 0 && results.videos.length === 0 && (
        <motion.div style={{ textAlign: 'center', padding: 'var(--space-10) var(--space-6)' }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ width: 60, height: 60, background: 'rgba(245,158,11,0.15)', borderRadius: 'var(--radius-2xl)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-4)' }}>
            <AlertCircle size={28} color="var(--color-accent-orange)" />
          </div>
          <h3 style={{ marginBottom: 'var(--space-2)', fontSize: 'var(--text-lg)' }}>Subject not found</h3>
          <p style={{ color: 'var(--color-text-secondary)', maxWidth: 380, margin: '0 auto var(--space-6)', fontSize: 'var(--text-sm)' }}>
            Please check the spelling and try again. Example: "12th physics", "10th maths"
          </p>
          {googleSearchUrl && (
            <a href={googleSearchUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg" style={{ gap: 'var(--space-2)', padding: '12px 24px', minHeight: 48 }}>
              <Search size={18} /> Search on Google
            </a>
          )}
        </motion.div>
      )}

      {/* Empty */}
      {!hasSearched && !isSearching && (
        <motion.div style={{ textAlign: 'center', padding: 'var(--space-16) var(--space-6)' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <div style={{ width: 80, height: 80, background: 'rgba(124,58,237,0.15)', borderRadius: 'var(--radius-2xl)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-6)' }}>
            <BookOpen size={36} color="var(--color-accent-purple)" />
          </div>
          <h3 style={{ marginBottom: 'var(--space-2)' }}>Search for Study Materials</h3>
          <p style={{ color: 'var(--color-text-secondary)', maxWidth: 400, margin: '0 auto' }}>Type a subject name to find official notes, PDFs, and videos instantly.</p>
        </motion.div>
      )}

      {/* PDF Viewer Overlay */}
      <AnimatePresence>
        {viewingPdf && (
          <motion.div className="article-reader-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setViewingPdf(null)}>
            <motion.div className="pdf-viewer-panel" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 300 }} onClick={e => e.stopPropagation()}>
              <div className="article-reader-header">
                <button className="article-reader-close" onClick={() => setViewingPdf(null)}><ArrowLeft size={20} /></button>
                <div className="article-reader-header-info"><span className="article-reader-source" style={{ fontSize: 'var(--text-xs)' }}>{viewingPdf.title}</span></div>
                <button className="btn btn-primary" onClick={() => openSource(viewingPdf.source_url || viewingPdf.url)} style={{ padding: '6px 12px', fontSize: 'var(--text-xs)', gap: 'var(--space-1)' }}><Download size={14} /> Download</button>
              </div>
              <div className="pdf-viewer-body"><iframe src={viewingPdf.viewerUrl} title={viewingPdf.title} className="pdf-viewer-iframe" allowFullScreen /></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
