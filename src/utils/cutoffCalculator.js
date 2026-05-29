/**
 * TN StudyMate — Cutoff Calculator
 * 
 * 12th: TNEA Engineering cutoff = Maths + (Physics/2) + (Chemistry/2) out of 200
 * 10th: Group eligibility based on subject marks
 */

// ============ 12TH STANDARD ============

export function calculateTNEACutoff(maths, physics, chemistry) {
  const m = parseFloat(maths) || 0;
  const p = parseFloat(physics) || 0;
  const c = parseFloat(chemistry) || 0;
  return m + (p / 2) + (c / 2);
}

export function get12thBranches(cutoff) {
  const branches = [
    { name: 'Computer Science & Engineering', minCutoff: 195, category: 'Engineering' },
    { name: 'Information Technology', minCutoff: 190, category: 'Engineering' },
    { name: 'Electronics & Communication', minCutoff: 185, category: 'Engineering' },
    { name: 'Electrical & Electronics', minCutoff: 178, category: 'Engineering' },
    { name: 'Mechanical Engineering', minCutoff: 175, category: 'Engineering' },
    { name: 'Civil Engineering', minCutoff: 165, category: 'Engineering' },
    { name: 'Biomedical Engineering', minCutoff: 160, category: 'Engineering' },
    { name: 'Chemical Engineering', minCutoff: 155, category: 'Engineering' },
    { name: 'Agriculture Engineering', minCutoff: 145, category: 'Engineering' },
    { name: 'MBBS (via NEET)', minCutoff: 180, category: 'Medical', note: 'Requires NEET qualification' },
    { name: 'BDS (via NEET)', minCutoff: 160, category: 'Medical', note: 'Requires NEET qualification' },
    { name: 'B.Pharm', minCutoff: 140, category: 'Medical' },
    { name: 'B.Sc. Nursing', minCutoff: 130, category: 'Medical' },
    { name: 'B.Sc. Physics', minCutoff: 100, category: 'Arts & Science' },
    { name: 'B.Sc. Chemistry', minCutoff: 100, category: 'Arts & Science' },
    { name: 'B.Sc. Mathematics', minCutoff: 100, category: 'Arts & Science' },
    { name: 'B.Sc. Computer Science', minCutoff: 150, category: 'Arts & Science' },
    { name: 'B.Com', minCutoff: 80, category: 'Arts & Science' },
    { name: 'B.A. English', minCutoff: 60, category: 'Arts & Science' },
    { name: 'BBA', minCutoff: 100, category: 'Arts & Science' },
    { name: 'BCA', minCutoff: 120, category: 'Arts & Science' },
  ];

  return branches.map(branch => {
    let status;
    if (cutoff >= branch.minCutoff) {
      status = 'eligible';
    } else if (cutoff >= branch.minCutoff - 15) {
      status = 'moderate';
    } else {
      status = 'difficult';
    }
    return { ...branch, status };
  });
}

// ============ 10TH STANDARD ============

export function calculate10thPercentage(marks) {
  const { tamil, english, maths, science, socialScience } = marks;
  const total = (parseFloat(tamil) || 0) +
    (parseFloat(english) || 0) +
    (parseFloat(maths) || 0) +
    (parseFloat(science) || 0) +
    (parseFloat(socialScience) || 0);
  return {
    total,
    percentage: (total / 500) * 100,
    maths: parseFloat(maths) || 0,
    science: parseFloat(science) || 0,
  };
}

export function get10thGroups(result) {
  const { percentage, maths, science } = result;
  const mathScienceAvg = (maths + science) / 2;

  const groups = [
    {
      name: 'Bio-Maths',
      description: 'Physics, Chemistry, Biology, Mathematics — Ideal for Medicine & Engineering',
      requiredAvg: 75,
      keySubjects: 'Maths & Science',
      careers: ['Doctor (MBBS)', 'Engineer', 'Researcher', 'Scientist'],
    },
    {
      name: 'Computer Science (CS-Maths)',
      description: 'Physics, Chemistry, Maths, Computer Science — Ideal for IT & Engineering',
      requiredAvg: 70,
      keySubjects: 'Maths & Science',
      careers: ['Software Engineer', 'Data Scientist', 'IT Manager', 'Web Developer'],
    },
    {
      name: 'Pure Science',
      description: 'Physics, Chemistry, Biology/Botany, Zoology — Ideal for Research',
      requiredAvg: 60,
      keySubjects: 'Science',
      careers: ['Lab Technician', 'Researcher', 'Pharmacist', 'Nurse'],
    },
    {
      name: 'Commerce',
      description: 'Accountancy, Commerce, Economics, Business Maths — Ideal for Business',
      requiredAvg: 50,
      keySubjects: 'Maths & General',
      careers: ['CA', 'Banker', 'Accountant', 'Business Manager'],
    },
    {
      name: 'Arts / Humanities',
      description: 'History, Geography, Economics, Political Science — Ideal for Govt. Jobs',
      requiredAvg: 40,
      keySubjects: 'General',
      careers: ['IAS/IPS', 'Teacher', 'Lawyer', 'Journalist'],
    },
  ];

  return groups.map(group => {
    let compatibility;
    if (group.keySubjects === 'Maths & Science') {
      compatibility = Math.min(100, Math.round((mathScienceAvg / group.requiredAvg) * 100));
    } else if (group.keySubjects === 'Science') {
      compatibility = Math.min(100, Math.round((science / group.requiredAvg) * 100));
    } else {
      compatibility = Math.min(100, Math.round((percentage / group.requiredAvg) * 100));
    }

    let status;
    if (compatibility >= 100) status = 'eligible';
    else if (compatibility >= 80) status = 'moderate';
    else status = 'difficult';

    return { ...group, compatibility, status };
  });
}
