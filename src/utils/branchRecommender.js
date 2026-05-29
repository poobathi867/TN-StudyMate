/**
 * TN StudyMate — Branch Recommendation Engine
 * 
 * Analyzes student marks and recommends best-fit branches
 * with compatibility percentages and reasoning.
 */export function recommendBranches12th(marks, interests = []) {
  const maths = parseFloat(marks.maths) || 0;
  const physics = parseFloat(marks.physics) || 0;
  const chemistry = parseFloat(marks.chemistry) || 0;
  const biology = parseFloat(marks.biology) || 0;
  const computerScience = parseFloat(marks.computerScience) || 0;
  const english = parseFloat(marks.english) || 0;
  const tamil = parseFloat(marks.tamil) || 0;

  const tneaCutoff = maths + (physics / 2) + (chemistry / 2);
  const scienceAvg = (physics + chemistry + (biology || 0)) / (biology ? 3 : 2);
  const overallAvg = (maths + physics + chemistry + biology + computerScience + english + tamil) / 6;

  const branches = [];

  // 1. Engineering branches
  if (maths >= 50) {
    const engInterests = ['Engineering', 'IT / Software', 'Tech / Innovation'];
    const hasEngInterest = interests.some(i => engInterests.includes(i));
    const engBoost = hasEngInterest ? 20 : 0;

    branches.push({
      name: 'Computer Science & Engineering',
      compatibility: Math.min(100, Math.round((tneaCutoff / 200) * 100 + (computerScience > 0 ? 10 : 0) + engBoost)),
      reason: `${tneaCutoff}/200 Cutoff. ${hasEngInterest ? 'Strong personal interest' : 'Good math background'}. Top choice for IT careers.`,
      color: '#00d4ff',
    });
    branches.push({
      name: 'Electronics & Communication (ECE)',
      compatibility: Math.min(100, Math.round(((maths + physics) / 200) * 100 + engBoost)),
      reason: `Solid Physics (${physics}) and Maths (${maths}). Versatile core engineering path.`,
      color: '#7c3aed',
    });
    branches.push({
      name: 'Information Technology (IT)',
      compatibility: Math.min(100, Math.round(((maths + computerScience) / 200) * 100 + 5 + engBoost)),
      reason: `Practical focus on software and networking. Matches your Math/CS scores.`,
      color: '#06b6d4',
    });
    branches.push({
      name: 'Mechanical / Civil Engineering',
      compatibility: Math.min(100, Math.round(((maths + physics) / 200) * 85 + engBoost)),
      reason: `Fits students strong in core Physics. Essential for infrastructure and design industries.`,
      color: '#10b981',
    });
  }

  // 2. Medical / Bio-Science
  if (biology >= 50 || scienceAvg >= 50) {
    const medInterests = ['Medical / Healthcare', 'Science / Research'];
    const hasMedInterest = interests.some(i => medInterests.includes(i));
    const medBoost = hasMedInterest ? 25 : 0;

    branches.push({
      name: 'MBBS / BDS / AYUSH',
      compatibility: Math.min(100, Math.round(((biology + physics + chemistry) / 300) * 100 + medBoost)),
      reason: `Biology (${biology}) is your strength. ${hasMedInterest ? 'Perfect match for medical interest.' : 'Eligible for medicine.'} (Requires NEET).`,
      color: '#ec4899',
    });
    branches.push({
      name: 'B.Sc. Nursing / Pharmacy',
      compatibility: Math.min(100, Math.round(((biology + chemistry) / 200) * 100 + 10 + medBoost)),
      reason: `Direct clinical healthcare career. High demand in hospital sectors globally.`,
      color: '#fb7185',
    });
    branches.push({
      name: 'Agricultural Sciences (B.Sc Agri)',
      compatibility: Math.min(100, Math.round(((biology + chemistry + maths) / 300) * 90 + medBoost)),
      reason: `Strong scope in TN Government sectors and agro-industry.`,
      color: '#10b981',
    });
  }

  // 3. Commerce / Multi-disciplinary
  const commInterests = ['Commerce / CA', 'Banking / Finance', 'Business / Startup'];
  const hasCommInterest = interests.some(i => commInterests.includes(i));
  const commBoost = hasCommInterest ? 20 : 0;

  branches.push({
    name: 'B.Com / BBA / CA Track',
    compatibility: Math.min(100, Math.round((overallAvg / 80) * 100 + 10 + commBoost)),
    reason: `Great for Banking/Corporate careers. ${hasCommInterest ? 'Aligned with your business interest.' : 'Strong logical aptitude.'}`,
    color: '#f59e0b',
  });

  // 4. Arts / Public Service
  const artsInterests = ['Arts / Design', 'Public Service (IAS/IPS)', 'Teaching', 'Law / Legal'];
  const hasArtsInterest = interests.some(i => artsInterests.includes(i));
  const artsBoost = hasArtsInterest ? 20 : 0;

  branches.push({
    name: 'B.A. Tamil / English / History / Law',
    compatibility: Math.min(100, Math.round((Math.max(english, tamil) / 80) * 100 + 15 + artsBoost)),
    reason: `Ideal if you aim for Civil Services (UPSC/TNPSC) or Legal professions.`,
    color: '#a855f7',
  });

  // Sort by compatibility
  branches.sort((a, b) => b.compatibility - a.compatibility);
  return branches;
}

export function recommendBranches10th(marks, interests = []) {
  const maths = parseFloat(marks.maths) || 0;
  const science = parseFloat(marks.science) || 0;
  const english = parseFloat(marks.english) || 0;
  const tamil = parseFloat(marks.tamil) || 0;
  const socialScience = parseFloat(marks.socialScience) || 0;
  const total = maths + science + english + tamil + socialScience;
  const percentage = (total / 500) * 100;
  const mathSciAvg = (maths + science) / 2;

  const groups = [];

  // Group 1: Bio-Maths (Core A)
  const medEngInt = interests.some(i => ['Medical / Healthcare', 'Engineering'].includes(i));
  groups.push({
    name: 'Group 1: Bio-Maths',
    compatibility: Math.min(100, Math.round((mathSciAvg / 85) * 100 + (medEngInt ? 15 : 0))),
    reason: `Highest flexibility. Keep both Engineering and Medicine options open with Core subjects.`,
    color: '#ec4899',
    careers: 'Doctor, Engineer, Research Scientist',
  });

  // Group 2: CS-Maths (Core B)
  const itInt = interests.some(i => ['IT / Software', 'Engineering'].includes(i));
  groups.push({
    name: 'Group 2: Computer Science',
    compatibility: Math.min(100, Math.round((maths / 80) * 100 + 10 + (itInt ? 20 : 0))),
    reason: `Direct path to Software Engineering. Replaces Biology with CS to focus on tech.`,
    color: '#00d4ff',
    careers: 'Software Engineer, Data Scientist, Tech Lead',
  });

  // Group 3: Commerce & Accountancy
  const busInt = interests.some(i => ['Commerce / CA', 'Banking / Finance'].includes(i));
  groups.push({
    name: 'Group 3: Commerce / Business Maths',
    compatibility: Math.min(100, Math.round((percentage / 60) * 100 + 10 + (busInt ? 20 : 0))),
    reason: `Best path for Chartered Accountancy (CA) and Banking. Ideal for business mindset.`,
    color: '#f59e0b',
    careers: 'CA, Banker, Entrepreneur, Manager',
  });

  // Group 4: Humanities (History / Geography / Economics)
  const artsSvcInt = interests.some(i => ['Public Service (IAS/IPS)', 'Arts / Design', 'Teaching'].includes(i));
  groups.push({
    name: 'Group 4: Humanities / Arts',
    compatibility: Math.min(100, Math.round((socialScience / 70) * 100 + 20 + (artsSvcInt ? 30 : 0))),
    reason: `Perfect for UPSC/TNPSC aspirinats. Deep study of History, Politics, and Geography.`,
    color: '#a855f7',
    careers: 'IAS/IPS Officer, Lawyer, Professor, Geographer',
  });

  // Vocational Groups (Official TN Board tracks)
  const vocationalInt = interests.some(i => ['Engineering', 'Medical / Healthcare'].includes(i));
  groups.push({
    name: 'Vocational: Nursing / Electrical / Electronics',
    compatibility: Math.min(100, Math.round((science / 50) * 100 + 10 + (vocationalInt ? 10 : 0))),
    reason: `Direct job-oriented training. Ideal for early career entry into technical or healthcare services.`,
    color: '#10b981',
    careers: 'Staff Nurse, Lab Tech, Electrical Technician',
  });

  // Vocational: Nursing / Pre-Medical
  const medInt = interests.includes('Medical / Healthcare');
  groups.push({
    name: 'Vocational: Nursing / Healthcare',
    compatibility: Math.min(100, Math.round((science / 55) * 100 + (medInt ? 25 : 0))),
    reason: `Direct entry into clinical support roles. Perfect for those passionate about patient care and healthcare services.`,
    color: '#fb7185',
    careers: 'Staff Nurse, Lab Technician, Pharmacist Assistant',
  });

  // Vocational: Agriculture
  const agriInt = interests.some(i => ['Science / Research', 'Business / Startup'].includes(i));
  groups.push({
    name: 'Group 501: Agricultural Science',
    compatibility: Math.min(100, Math.round((science / 60) * 100 + (agriInt ? 20 : 0))),
    reason: `Focuses on modern farming, crop science, and agro-business. High demand in TN rural development sectors.`,
    color: '#10b981',
    careers: 'Agri-Officer, Farm Manager, Food Technologist',
  });

  // Diploma / Polytechnic
  groups.push({
    name: 'Diploma (Polytechnic) - 3 Year',
    compatibility: Math.min(100, Math.round((mathSciAvg / 50) * 100 + 20)),
    reason: `Skip $+2$ and directly enter technical education. Practical, skill-focused learning.`,
    color: '#64748b',
    careers: 'Junior Engineer, Industrial Tech, Self-employment',
  });

  groups.sort((a, b) => b.compatibility - a.compatibility);
  return groups;
}
