import Fuse from 'fuse.js';

// Enhanced JSON Schema with tags, source_name, source_url
export const tnCatalog = [
  // 10th
  { id:'10-tam', title:'10th Tamil Textbook', subject:'Tamil', standard:'10', medium:'Tamil',
    tags:['10th','tamil','10 tamil','thamizh','samacheer','textbook'],
    source_url:'https://www.tntextbooks.in/p/10th-books.html', source_name:'TN SCERT Official', size:'Official' },
  { id:'10-eng', title:'10th English Textbook', subject:'English', standard:'10', medium:'English',
    tags:['10th','english','10 english','samacheer','textbook'],
    source_url:'https://www.tntextbooks.in/p/10th-books.html', source_name:'TN SCERT Official', size:'Official' },
  { id:'10-math-em', title:'10th Maths (English Medium)', subject:'Maths', standard:'10', medium:'English',
    tags:['10th','maths','mathematics','math','em','english medium','algebra','geometry','trigonometry','samacheer'],
    source_url:'https://www.tntextbooks.in/p/10th-books.html', source_name:'TN SCERT Official', size:'Official' },
  { id:'10-math-tm', title:'10th Maths (Tamil Medium)', subject:'Maths', standard:'10', medium:'Tamil',
    tags:['10th','maths','mathematics','math','tm','tamil medium','samacheer'],
    source_url:'https://www.tntextbooks.in/p/10th-books.html', source_name:'TN SCERT Official', size:'Official' },
  { id:'10-sci-em', title:'10th Science (English Medium)', subject:'Science', standard:'10', medium:'English',
    tags:['10th','science','physics','chemistry','biology','em','english medium','samacheer'],
    source_url:'https://www.tntextbooks.in/p/10th-books.html', source_name:'TN SCERT Official', size:'Official' },
  { id:'10-sci-tm', title:'10th Science (Tamil Medium)', subject:'Science', standard:'10', medium:'Tamil',
    tags:['10th','science','physics','chemistry','biology','tm','tamil medium','samacheer'],
    source_url:'https://www.tntextbooks.in/p/10th-books.html', source_name:'TN SCERT Official', size:'Official' },
  { id:'10-soc-em', title:'10th Social Science (English Medium)', subject:'Social Science', standard:'10', medium:'English',
    tags:['10th','social','social science','history','geography','civics','economics','em','english medium','samacheer'],
    source_url:'https://www.tntextbooks.in/p/10th-books.html', source_name:'TN SCERT Official', size:'Official' },
  { id:'10-soc-tm', title:'10th Social Science (Tamil Medium)', subject:'Social Science', standard:'10', medium:'Tamil',
    tags:['10th','social','social science','history','geography','tm','tamil medium','samacheer'],
    source_url:'https://www.tntextbooks.in/p/10th-books.html', source_name:'TN SCERT Official', size:'Official' },
  // 10th Notes & Guides
  { id:'10-tam-guide', title:'10th Tamil Notes & Guides', subject:'Tamil', standard:'10', medium:'Tamil',
    tags:['10th','tamil','guide','guides','notes','study material', 'tm', 'tamil medium'],
    source_url:'https://www.kalvikadal.in/2020/10/10th-tamil-complete-study-materials.html', source_name:'KalviKadal', size:'Web Link' },
  { id:'10-eng-guide', title:'10th English Notes & Guides', subject:'English', standard:'10', medium:'English',
    tags:['10th','english','guide','guides','notes','study material', 'em', 'english medium'],
    source_url:'https://www.kalvikadal.in/2020/10/10th-english-complete-study-material.html', source_name:'KalviKadal', size:'Web Link' },
  { id:'10-math-guide', title:'10th Maths Notes & Guides', subject:'Maths', standard:'10', medium:'English',
    tags:['10th','maths','mathematics','math','guide','guides','notes','study material', 'em', 'english medium', 'tm', 'tamil medium'],
    source_url:'https://www.kalvikadal.in/2020/10/10th-mathematics-complete-study.html', source_name:'KalviKadal', size:'Web Link' },
  { id:'10-sci-guide', title:'10th Science Notes & Guides', subject:'Science', standard:'10', medium:'English',
    tags:['10th','science','guide','guides','notes','study material', 'em', 'english medium', 'tm', 'tamil medium'],
    source_url:'https://www.kalvikadal.in/2020/10/10th-standard-science-complete-study.html', source_name:'KalviKadal', size:'Web Link' },
  { id:'10-soc-guide', title:'10th Social Science Notes & Guides', subject:'Social Science', standard:'10', medium:'English',
    tags:['10th','social','social science','guide','guides','notes','study material', 'em', 'english medium', 'tm', 'tamil medium'],
    source_url:'https://www.kalvikadal.in/2020/10/10th-social-science-complete-study.html', source_name:'KalviKadal', size:'Web Link' },
  // 12th
  { id:'12-tam', title:'12th Tamil Textbook', subject:'Tamil', standard:'12', medium:'Tamil',
    tags:['12th','tamil','samacheer'], source_url:'https://www.tntextbooks.in/p/12th-books.html', source_name:'TN SCERT Official', size:'Official' },
  { id:'12-eng', title:'12th English Textbook', subject:'English', standard:'12', medium:'English',
    tags:['12th','english','samacheer'], source_url:'https://www.tntextbooks.in/p/12th-books.html', source_name:'TN SCERT Official', size:'Official' },
  { id:'12-math-em', title:'12th Maths (English Medium)', subject:'Maths', standard:'12', medium:'English',
    tags:['12th','maths','mathematics','em','english medium','samacheer','integral','differentiation','probability'],
    source_url:'https://www.tntextbooks.in/p/12th-books.html', source_name:'TN SCERT Official', size:'Official' },
  { id:'12-math-tm', title:'12th Maths (Tamil Medium)', subject:'Maths', standard:'12', medium:'Tamil',
    tags:['12th','maths','mathematics','tm','tamil medium','samacheer'],
    source_url:'https://www.tntextbooks.in/p/12th-books.html', source_name:'TN SCERT Official', size:'Official' },
  { id:'12-phy-em', title:'12th Physics (English Medium)', subject:'Physics', standard:'12', medium:'English',
    tags:['12th','physics','em','english medium','samacheer','electrostatics','optics','nuclear','semiconductor'],
    source_url:'https://www.tntextbooks.in/p/12th-books.html', source_name:'TN SCERT Official', size:'Official' },
  { id:'12-phy-tm', title:'12th Physics (Tamil Medium)', subject:'Physics', standard:'12', medium:'Tamil',
    tags:['12th','physics','tm','tamil medium','samacheer'],
    source_url:'https://www.tntextbooks.in/p/12th-books.html', source_name:'TN SCERT Official', size:'Official' },
  { id:'12-che-em', title:'12th Chemistry (English Medium)', subject:'Chemistry', standard:'12', medium:'English',
    tags:['12th','chemistry','em','english medium','samacheer','organic','inorganic','coordination'],
    source_url:'https://www.tntextbooks.in/p/12th-books.html', source_name:'TN SCERT Official', size:'Official' },
  { id:'12-che-tm', title:'12th Chemistry (Tamil Medium)', subject:'Chemistry', standard:'12', medium:'Tamil',
    tags:['12th','chemistry','tm','tamil medium','samacheer'],
    source_url:'https://www.tntextbooks.in/p/12th-books.html', source_name:'TN SCERT Official', size:'Official' },
  { id:'12-bio-em', title:'12th Biology (English Medium)', subject:'Biology', standard:'12', medium:'English',
    tags:['12th','biology','botany','zoology','bio','em','english medium','samacheer','genetics','evolution','reproduction'],
    source_url:'https://www.tntextbooks.in/p/12th-books.html', source_name:'TN SCERT Official', size:'Official' },
  { id:'12-bio-tm', title:'12th Biology (Tamil Medium)', subject:'Biology', standard:'12', medium:'Tamil',
    tags:['12th','biology','botany','zoology','bio','tm','tamil medium','samacheer'],
    source_url:'https://www.tntextbooks.in/p/12th-books.html', source_name:'TN SCERT Official', size:'Official' },
  { id:'12-cs-em', title:'12th Computer Science (English Medium)', subject:'Computer Science', standard:'12', medium:'English',
    tags:['12th','computer','cs','computer science','em','english medium','samacheer','python','c++','sql','data'],
    source_url:'https://www.tntextbooks.in/p/12th-books.html', source_name:'TN SCERT Official', size:'Official' },
  { id:'12-cs-tm', title:'12th Computer Science (Tamil Medium)', subject:'Computer Science', standard:'12', medium:'Tamil',
    tags:['12th','computer','cs','computer science','tm','tamil medium','samacheer'],
    source_url:'https://www.tntextbooks.in/p/12th-books.html', source_name:'TN SCERT Official', size:'Official' },
  { id:'12-com-em', title:'12th Commerce (English Medium)', subject:'Commerce', standard:'12', medium:'English',
    tags:['12th','commerce','accountancy','business','em','english medium','samacheer'],
    source_url:'https://www.tntextbooks.in/p/12th-books.html', source_name:'TN SCERT Official', size:'Official' },
  { id:'12-eco-em', title:'12th Economics (English Medium)', subject:'Economics', standard:'12', medium:'English',
    tags:['12th','economics','em','english medium','samacheer','micro','macro'],
    source_url:'https://www.tntextbooks.in/p/12th-books.html', source_name:'TN SCERT Official', size:'Official' },
];

import { officialBooks, getOfficialBookUrl } from './officialBooks';

// Remove the mock 10th and 12th standard entries from tnCatalog (but keep guides)
const baseCatalog = tnCatalog.filter(item => {
  if (item.id.includes('-guide')) return true;
  return item.standard !== '10' && item.standard !== '12';
});

// Add the real official books to the catalog with exact names
const realOfficialBooks = officialBooks.map((book, index) => ({
  id: `${book.standard}-official-${index}`,
  title: `${book.standard}th ${book.subject} (${book.medium === 'english' ? 'English Medium' : 'Tamil Medium'})`,
  subject: book.subject,
  standard: book.standard,
  medium: book.medium === 'english' ? 'English' : 'Tamil',
  tags: [`${book.standard}th`, book.subject.toLowerCase(), book.medium, 'samacheer', 'book', 'textbook'],
  source_url: book.url,
  directDownload: book.url,
  source_name: 'TN SCERT Official',
  size: 'Official PDF'
}));

const fullCatalog = [...baseCatalog, ...realOfficialBooks];

// Fuse.js — optimized for 1000+ entries, tags-first ranking
const fuse = new Fuse(fullCatalog, {
  keys: [
    { name: 'tags', weight: 0.5 },
    { name: 'title', weight: 0.3 },
    { name: 'subject', weight: 0.2 }
  ],
  threshold: 0.2,
  distance: 100,
  includeScore: true,
  ignoreLocation: true,
  minMatchCharLength: 2,
  useExtendedSearch: false,
});

// Notes search
export const findMaterials = (query) => {
  const originalQ = query.trim().toLowerCase();
  let q = originalQ;
  if (!q) return { pdfs: [], videos: [], articles: [], exactMatch: false, googleSearchUrl: '' };

  let targetStandard = null;
  if (q.includes('12th') || q.includes('12 th') || q.match(/\b12\b/)) targetStandard = '12';
  else if (q.includes('10th') || q.includes('10 th') || q.match(/\b10\b/)) targetStandard = '10';

  // Detect intention: books vs notes/guides
  const wantsNotes = /\b(note|notes|guide|guides|material|materials)\b/i.test(originalQ);
  const wantsBook = /\b(book|books|textbook|textbooks)\b/i.test(originalQ);

  // Remove generic words that cause fuzzy search to match everything broadly
  q = q.replace(/\b(book|books|textbook|textbooks|guide|guides|notes|10th|12th|10|12|std|standard|class|volume|vol|part)\b/gi, '').trim();

  // Map common abbreviations to full subject names
  q = q.replace(/\bmaths?\b/g, 'mathematics')
       .replace(/\bcomp sci\b|\bcs\b/g, 'computer science')
       .replace(/\bbio\b/g, 'biology')
       .replace(/\bphy\b/g, 'physics')
       .replace(/\bchem\b/g, 'chemistry')
       .replace(/\beco\b/g, 'economics')
       .replace(/\baccounts\b/g, 'accountancy')
       .replace(/\bcom\b/g, 'commerce');
  
  let fuseResults = [];
  
  if (!q && targetStandard) {
    // If they ONLY typed the standard, return all items for that standard
    fuseResults = fullCatalog.filter(i => i.standard === targetStandard).map(item => ({ item }));
  } else if (q) {
    fuseResults = fuse.search(q);
  } else {
    return { pdfs: [], videos: [], articles: [], exactMatch: false, googleSearchUrl: '' };
  }

  // Strictly enforce the standard if the user specified it
  if (targetStandard) {
    fuseResults = fuseResults.filter(r => r.item.standard === targetStandard);
  }

  // Enforce type (book vs guide) if specified
  if (wantsNotes) {
    fuseResults = fuseResults.filter(r => r.item.id.includes('-guide') || (r.item.tags && (r.item.tags.includes('guide') || r.item.tags.includes('notes'))));
  } else if (wantsBook) {
    fuseResults = fuseResults.filter(r => !r.item.id.includes('-guide') && (!r.item.tags || !r.item.tags.includes('guide')));
  }
  const pdfs = [];
  const seenIds = new Set();
  for (const r of fuseResults) {
    const item = r.item;
    if (!seenIds.has(item.id)) {
      let finalUrl = item.source_url;
      // Inject the exact PDF link instead of generic site link for 12th std materials
      if (item.standard === '12') {
        const specificUrl = getOfficialBookUrl(item.title);
        if (specificUrl) {
          finalUrl = specificUrl;
        }
      }
      pdfs.push({ ...item, directDownload: finalUrl, source_url: finalUrl });
      seenIds.add(item.id);
    }
  }

  const videos = [];
  if (fuseResults.length > 0) {
    const top = fuseResults[0].item;
    const ytQ = encodeURIComponent(`${top.standard}th ${top.subject} ${top.medium === 'Tamil' ? 'Tamil Medium' : ''} Samacheer Kalvi`);
    videos.push({ id: `yt-${top.id}`, title: `${top.standard}th ${top.subject} Video Lessons`, channel: 'YouTube Search',
      url: `https://www.youtube.com/results?search_query=${ytQ}`, duration: 'Multiple', views: 'Live Search' });
  }

  return {
    pdfs, videos, articles: [],
    exactMatch: fuseResults.length > 0,
    googleSearchUrl: `https://www.google.com/search?q=${encodeURIComponent(query + ' site:tntextbooks.in OR site:kalvikadal.in PDF')}`,
  };
};

// Question papers search
export const questionPapersCatalog = [
  { id:'qp-10-tam', title:'10th Tamil — Previous Year Papers', subject:'Tamil', standard:'10', source:'Padasalai',
    tags:['10th','tamil','question paper','previous year'], portalUrl:'https://www.padasalai.net/2022/12/10th-Tamil-Latest-Study-Materials-PDF-Download.html',
    googleUrl:'https://www.google.com/search?q=10th+tamil+previous+year+question+paper+Tamil+Nadu+PDF' },
  { id:'qp-10-eng', title:'10th English — Previous Year Papers', subject:'English', standard:'10', source:'Padasalai',
    tags:['10th','english','question paper','previous year'], portalUrl:'https://www.padasalai.net/2022/12/SSLC-10th-English-New-Study-Materials-Download.html',
    googleUrl:'https://www.google.com/search?q=10th+english+previous+year+question+paper+Tamil+Nadu+PDF' },
  { id:'qp-10-math', title:'10th Maths — Previous Year Papers', subject:'Maths', standard:'10', source:'Padasalai',
    tags:['10th','maths','mathematics','math','question paper','previous year'], portalUrl:'https://www.padasalai.net/2022/12/SSLC-10th-Maths-New-Study-Materials-PDF-Download.html',
    googleUrl:'https://www.google.com/search?q=10th+maths+previous+year+question+paper+Tamil+Nadu+PDF' },
  { id:'qp-10-sci', title:'10th Science — Previous Year Papers', subject:'Science', standard:'10', source:'Padasalai',
    tags:['10th','science','question paper','previous year'], portalUrl:'https://www.padasalai.net/2022/12/SSLC-10th-Science-New-Study-Materials-PDF-Download.html',
    googleUrl:'https://www.google.com/search?q=10th+science+previous+year+question+paper+Tamil+Nadu+PDF' },
  { id:'qp-10-soc', title:'10th Social Science — Previous Year Papers', subject:'Social Science', standard:'10', source:'Padasalai',
    tags:['10th','social','social science','question paper','previous year'], portalUrl:'https://www.padasalai.net/2022/12/SSLC-10th-Social-Science-New-Study-Materials-PDF-Download.html',
    googleUrl:'https://www.google.com/search?q=10th+social+science+previous+year+question+paper+Tamil+Nadu+PDF' },
  { id:'qp-12-tam', title:'12th Tamil — Previous Year Papers', subject:'Tamil', standard:'12', source:'Padasalai / KalviKadal',
    tags:['12th','tamil','question paper','previous year'], portalUrl:'https://www.padasalai.net/search?q=12th+tamil+question+paper',
    googleUrl:'https://www.google.com/search?q=12th+tamil+previous+year+question+paper+Tamil+Nadu+PDF' },
  { id:'qp-12-eng', title:'12th English — Previous Year Papers', subject:'English', standard:'12', source:'Padasalai / KalviKadal',
    tags:['12th','english','question paper','previous year'], portalUrl:'https://www.padasalai.net/search?q=12th+english+question+paper',
    googleUrl:'https://www.google.com/search?q=12th+english+previous+year+question+paper+Tamil+Nadu+PDF' },
  { id:'qp-12-math', title:'12th Maths — Previous Year Papers', subject:'Maths', standard:'12', source:'Padasalai / KalviKadal',
    tags:['12th','maths','mathematics','math','question paper','previous year'], portalUrl:'https://www.padasalai.net/search?q=12th+maths+question+paper',
    googleUrl:'https://www.google.com/search?q=12th+maths+previous+year+question+paper+Tamil+Nadu+PDF' },
  { id:'qp-12-phy', title:'12th Physics — Previous Year Papers', subject:'Physics', standard:'12', source:'Padasalai / KalviKadal',
    tags:['12th','physics','question paper','previous year'], portalUrl:'https://www.padasalai.net/search?q=12th+physics+question+paper',
    googleUrl:'https://www.google.com/search?q=12th+physics+previous+year+question+paper+Tamil+Nadu+PDF' },
  { id:'qp-12-che', title:'12th Chemistry — Previous Year Papers', subject:'Chemistry', standard:'12', source:'Padasalai / KalviKadal',
    tags:['12th','chemistry','question paper','previous year'], portalUrl:'https://www.padasalai.net/search?q=12th+chemistry+question+paper',
    googleUrl:'https://www.google.com/search?q=12th+chemistry+previous+year+question+paper+Tamil+Nadu+PDF' },
  { id:'qp-12-bio', title:'12th Biology — Previous Year Papers', subject:'Biology', standard:'12', source:'Padasalai / KalviKadal',
    tags:['12th','biology','botany','zoology','question paper','previous year'], portalUrl:'https://www.padasalai.net/search?q=12th+biology+question+paper',
    googleUrl:'https://www.google.com/search?q=12th+biology+previous+year+question+paper+Tamil+Nadu+PDF' },
  { id:'qp-12-cs', title:'12th Computer Science — Previous Year Papers', subject:'Computer Science', standard:'12', source:'Padasalai / KalviKadal',
    tags:['12th','computer','cs','computer science','question paper','previous year'], portalUrl:'https://www.padasalai.net/search?q=12th+computer+science+question+paper',
    googleUrl:'https://www.google.com/search?q=12th+computer+science+previous+year+question+paper+Tamil+Nadu+PDF' },
  { id:'qp-12-com', title:'12th Commerce — Previous Year Papers', subject:'Commerce', standard:'12', source:'Padasalai / KalviKadal',
    tags:['12th','commerce','accountancy','question paper','previous year'], portalUrl:'https://www.padasalai.net/search?q=12th+commerce+question+paper',
    googleUrl:'https://www.google.com/search?q=12th+commerce+previous+year+question+paper+Tamil+Nadu+PDF' },
  { id:'qp-12-eco', title:'12th Economics — Previous Year Papers', subject:'Economics', standard:'12', source:'Padasalai / KalviKadal',
    tags:['12th','economics','question paper','previous year'], portalUrl:'https://www.padasalai.net/search?q=12th+economics+question+paper',
    googleUrl:'https://www.google.com/search?q=12th+economics+previous+year+question+paper+Tamil+Nadu+PDF' },
];

const qpFuse = new Fuse(questionPapersCatalog, {
  keys: [
    { name: 'tags', weight: 0.4 },
    { name: 'title', weight: 0.3 },
    { name: 'subject', weight: 0.2 },
    { name: 'standard', weight: 0.1 },
  ],
  threshold: 0.4, distance: 200, includeScore: true, ignoreLocation: true, minMatchCharLength: 2,
});

export const findQuestionPapers = (query) => {
  const q = query.trim();
  if (!q) return { results: [], googleSearchUrl: '' };
  const fuseResults = qpFuse.search(q);
  const results = []; const seenIds = new Set();
  for (const r of fuseResults) { if (!seenIds.has(r.item.id)) { results.push(r.item); seenIds.add(r.item.id); } }
  return { results, googleSearchUrl: `https://www.google.com/search?q=${encodeURIComponent(query + ' previous year question paper Tamil Nadu PDF')}` };
};
