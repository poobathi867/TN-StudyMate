import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Newspaper, ExternalLink, RefreshCw, Clock, Tag, X, ArrowLeft, Share2 } from 'lucide-react';


export default function NewsPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newsItems, setNewsItems] = useState([]);
  const [error, setError] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);

  const fetchNews = async () => {
    setRefreshing(true);
    if (newsItems.length === 0) setLoading(true);
    setError(null);

    // Minimum visual delay for refresh feedback
    await new Promise(r => setTimeout(r, 600));

    try {
      // Try GNews API first (free, real-time, reliable)
      const gnewsKey = 'b0c93e3c5a2ab3bc0f66bbb4b5aa2d22';
      const gnewsUrl = `https://gnews.io/api/v4/search?q=Tamil+Nadu+education+exam&lang=en&country=in&max=10&apikey=${gnewsKey}`;
      
      let articles = [];

      try {
        const gnewsRes = await fetch(gnewsUrl, { cache: 'no-store' });
        if (gnewsRes.ok) {
          const gnewsData = await gnewsRes.json();
          if (gnewsData.articles && gnewsData.articles.length > 0) {
            articles = gnewsData.articles.map((item, i) => {
              let cat = 'Education';
              const t = (item.title + ' ' + (item.description || '') + ' ' + (item.content || '')).toLowerCase();
              if (t.includes('exam') || t.includes('sslc') || t.includes('hsc') || t.includes('result') || t.includes('mark')) cat = 'Board Exams';
              else if (t.includes('counselling') || t.includes('tnea') || t.includes('admission') || t.includes('college') || t.includes('seat')) cat = 'Admissions';

              return {
                id: `gnews-${i}`,
                title: item.title,
                summary: item.description || 'No description available.',
                content: item.content || item.description || 'No content available.',
                source: item.source?.name || 'News',
                sourceUrl: item.source?.url || '',
                date: item.publishedAt,
                category: cat,
                url: item.url,
                image: item.image,
              };
            });
          }
        }
      } catch (e) {
        console.log('GNews API failed, trying RSS fallback...');
      }

      // Fallback: Google News RSS via rss2json
      if (articles.length === 0) {
        const q = encodeURIComponent('Tamil Nadu Education OR TN Board Exam OR TNEA OR SSLC OR HSC results');
        const rssUrl = `https://news.google.com/rss/search?q=${q}&hl=en-IN&gl=IN&ceid=IN:en`;
        const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`, { cache: 'no-store' });
        const data = await res.json();

        if (data.items && data.items.length > 0) {
          articles = data.items.map((item, i) => {
            let cat = 'Education';
            const t = item.title.toLowerCase();
            if (t.includes('exam') || t.includes('sslc') || t.includes('hsc') || t.includes('result')) cat = 'Board Exams';
            else if (t.includes('counselling') || t.includes('tnea') || t.includes('admission') || t.includes('college')) cat = 'Admissions';

            const cleanDesc = item.description ? item.description.replace(/<[^>]*>?/gm, '') : '';

            return {
              id: `rss-${i}`,
              title: item.title,
              summary: cleanDesc.substring(0, 150) + (cleanDesc.length > 150 ? '...' : ''),
              content: cleanDesc || 'Click "Read Full Article" to view the complete story.',
              source: item.source || item.author || 'Education News',
              sourceUrl: '',
              date: item.pubDate,
              category: cat,
              url: item.link,
              image: null,
            };
          });
        }
      }

      if (articles.length > 0) {
        setNewsItems(articles);
      } else {
        setError('Could not fetch news. Please check your internet connection and try again.');
      }
    } catch (e) {
      console.error('Failed to fetch news feed', e);
      setError('Could not load news. Please check your internet and try again.');
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // Disable body scroll when article is open
  useEffect(() => {
    if (selectedArticle) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [selectedArticle]);

  const filtered = activeCategory === 'All' 
    ? newsItems 
    : newsItems.filter(n => n.category === activeCategory);

  const handleRefresh = () => {
    setLoading(true);
    setNewsItems([]);
    fetchNews();
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Recent';
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now - d;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatFullDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { 
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const handleShare = async (article) => {
    if (navigator.share) {
      try {
        await navigator.share({ title: article.title, url: article.url });
      } catch (e) { /* user cancelled */ }
    } else {
      navigator.clipboard.writeText(article.url);
    }
  };

  return (
    <div className="page-container">
      <motion.div 
        className="page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex-between">
          <div>
            <h1 className="page-title">📰 Education News</h1>
            <p className="page-subtitle">Live Tamil Nadu education updates</p>
          </div>
          <button 
            className="btn btn-outline btn-icon"
            onClick={handleRefresh}
            disabled={refreshing}
            style={{ opacity: refreshing ? 0.7 : 1 }}
            id="news-refresh-btn"
          >
            <motion.div
              animate={{ rotate: refreshing ? 360 : 0 }}
              transition={refreshing ? { repeat: Infinity, duration: 1, ease: 'linear' } : { duration: 0.3 }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <RefreshCw size={18} />
            </motion.div>
          </button>
        </div>
      </motion.div>


      {loading ? (
        <div style={{ padding: 'var(--space-12)', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
          <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            style={{ display: 'inline-block', marginBottom: 'var(--space-4)' }}
          >
            <RefreshCw size={32} color="var(--color-accent-blue)" />
          </motion.div>
          <p>Fetching live education news...</p>
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-16)', color: 'var(--color-text-muted)' }}>
          <Newspaper size={48} style={{ opacity: 0.3, marginBottom: 'var(--space-4)' }} />
          <p>{error}</p>
          <button className="btn btn-primary" onClick={handleRefresh} style={{ marginTop: 'var(--space-4)' }}>
            <RefreshCw size={16} /> Try Again
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
          {filtered.map((news, i) => (
            <motion.div
              key={news.id}
              className="card news-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedArticle(news)}
              style={{ cursor: 'pointer' }}
            >
              {news.image ? (
                <img 
                  className="news-card-img" 
                  src={news.image} 
                  alt=""
                  onError={(e) => { 
                    e.target.onerror = null;
                    e.target.style.display = 'none'; 
                  }}
                />
              ) : (
                <div 
                  className="news-card-img" 
                  style={{ 
                    background: `linear-gradient(135deg, ${
                      ['#1a3a5c', '#2d1b4e', '#1a3d2e', '#3d2e1a', '#3d1a2e'][i % 5]
                    }, ${
                      ['#0f2440', '#1a0f33', '#0f2619', '#261a0f', '#260f1a'][i % 5]
                    })`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                >
                  <Newspaper size={28} style={{ opacity: 0.4, color: '#fff' }} />
                </div>
              )}
              <div className="news-card-content">
                <h4 className="news-card-title">{news.title}</h4>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-3)', lineHeight: 1.5 }}>
                  {news.summary}
                </p>
                <div className="news-card-meta">
                  <span className="news-card-source">{news.source}</span>
                  <span>•</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={12} />
                    {formatDate(news.date)}
                  </span>
                  <span>•</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Tag size={12} />
                    {news.category}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: 'var(--space-16)', color: 'var(--color-text-muted)' }}>
          <Newspaper size={48} style={{ opacity: 0.3, marginBottom: 'var(--space-4)' }} />
          <p>No news found in this category</p>
        </div>
      )}

      {/* ===== In-App Article Reader Overlay ===== */}
      <AnimatePresence>
        {selectedArticle && (
          <motion.div
            className="article-reader-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSelectedArticle(null)}
          >
            <motion.div
              className="article-reader"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Reader Header */}
              <div className="article-reader-header">
                <button 
                  className="article-reader-close" 
                  onClick={() => setSelectedArticle(null)}
                  title="Close"
                >
                  <ArrowLeft size={20} />
                </button>
                <div className="article-reader-header-info">
                  <span className="article-reader-source">{selectedArticle.source}</span>
                  <span className="article-reader-badge">{selectedArticle.category}</span>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  <button 
                    className="article-reader-action"
                    onClick={() => handleShare(selectedArticle)}
                    title="Share"
                  >
                    <Share2 size={16} />
                  </button>
                  <button 
                    className="article-reader-action"
                    onClick={() => window.open(selectedArticle.url, '_blank')}
                    title="Open in browser"
                  >
                    <ExternalLink size={16} />
                  </button>
                </div>
              </div>

              {/* Reader Content */}
              <div className="article-reader-body">
                {selectedArticle.image && (
                  <div className="article-reader-image-wrap">
                    <img 
                      src={selectedArticle.image} 
                      alt="" 
                      className="article-reader-image"
                      onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }}
                    />
                  </div>
                )}

                <div className="article-reader-content">
                  <h2 className="article-reader-title">{selectedArticle.title}</h2>
                  
                  <div className="article-reader-meta">
                    <Clock size={14} />
                    <span>{formatFullDate(selectedArticle.date)}</span>
                  </div>

                  <div className="article-reader-divider" />

                  <div className="article-reader-text">
                    {selectedArticle.content.split('\n').map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>

                  <div className="article-reader-divider" />

                  <a
                    href={selectedArticle.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-lg"
                    style={{ width: '100%', marginTop: 'var(--space-4)' }}
                  >
                    <ExternalLink size={18} />
                    Read Full Article on {selectedArticle.source}
                  </a>

                  <p style={{ 
                    fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', 
                    textAlign: 'center', marginTop: 'var(--space-3)' 
                  }}>
                    Source: {selectedArticle.source}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
