// Nigerian university course catalogue used by the CGPA forecaster.
// Codes and units are based on the common NUC BMAS / typical departmental
// course lists across UNILAG, LASU, OAU, UI, UNN, Covenant, Babcock, etc.
//
// To extend: add a department to DEPARTMENTS and append courses to COURSES
// with the matching `department` and `level` ("100" → "600").

export type AcademicLevel = "100" | "200" | "300" | "400" | "500" | "600";

export const LEVELS: AcademicLevel[] = ["100", "200", "300", "400", "500", "600"];

export type CatalogueCourse = {
  code: string;
  title: string;
  units: number;
  department: string; // matches Department.id
  level: AcademicLevel;
  semester?: 1 | 2;
};

export type Department = {
  id: string;
  name: string;
  faculty: string;
};

export const DEPARTMENTS: Department[] = [
  { id: "csc", name: "Computer Science", faculty: "Science" },
  { id: "mth", name: "Mathematics", faculty: "Science" },
  { id: "phy", name: "Physics", faculty: "Science" },
  { id: "chm", name: "Chemistry", faculty: "Science" },
  { id: "bio", name: "Biology / Biological Sciences", faculty: "Science" },
  { id: "bch", name: "Biochemistry", faculty: "Science" },
  { id: "mcb", name: "Microbiology", faculty: "Science" },
  { id: "eee", name: "Electrical / Electronic Engineering", faculty: "Engineering" },
  { id: "mee", name: "Mechanical Engineering", faculty: "Engineering" },
  { id: "cve", name: "Civil Engineering", faculty: "Engineering" },
  { id: "che", name: "Chemical Engineering", faculty: "Engineering" },
  { id: "acc", name: "Accounting", faculty: "Management Sciences" },
  { id: "bus", name: "Business Administration", faculty: "Management Sciences" },
  { id: "eco", name: "Economics", faculty: "Social Sciences" },
  { id: "mac", name: "Mass Communication", faculty: "Social Sciences" },
  { id: "pol", name: "Political Science", faculty: "Social Sciences" },
  { id: "psy", name: "Psychology", faculty: "Social Sciences" },
  { id: "law", name: "Law (LL.B)", faculty: "Law" },
  { id: "mbbs", name: "Medicine & Surgery (MBBS)", faculty: "Clinical Sciences" },
  { id: "nsc", name: "Nursing Science", faculty: "Clinical Sciences" },
  { id: "pha", name: "Pharmacy", faculty: "Pharmaceutical Sciences" },
  { id: "arc", name: "Architecture", faculty: "Environmental Sciences" },
  { id: "eng", name: "English & Literary Studies", faculty: "Arts" },
  { id: "his", name: "History & International Studies", faculty: "Arts" },
  { id: "edu", name: "Education", faculty: "Education" },
];

// --- Shared general-studies (GST) — taken by virtually every Nigerian student
const GST: CatalogueCourse[] = [
  { code: "GST 101", title: "Use of English I", units: 2, department: "*", level: "100", semester: 1 },
  { code: "GST 102", title: "Use of English II", units: 2, department: "*", level: "100", semester: 2 },
  { code: "GST 103", title: "Nigerian Peoples & Culture", units: 2, department: "*", level: "100", semester: 1 },
  { code: "GST 105", title: "History & Philosophy of Science", units: 2, department: "*", level: "100", semester: 2 },
  { code: "GST 201", title: "Logic, Philosophy & Human Existence", units: 2, department: "*", level: "200", semester: 1 },
  { code: "GST 202", title: "Leadership Skills", units: 2, department: "*", level: "200", semester: 2 },
  { code: "GST 301", title: "Entrepreneurship Studies", units: 2, department: "*", level: "300", semester: 1 },
  { code: "GST 401", title: "Research Methodology", units: 2, department: "*", level: "400", semester: 1 },
];

// --- Department-specific courses (compact, representative core list) ---
const DEPT_COURSES: CatalogueCourse[] = [
  // Computer Science
  { code: "CSC 101", title: "Intro to Computer Science", units: 3, department: "csc", level: "100" },
  { code: "CSC 102", title: "Intro to Problem Solving", units: 3, department: "csc", level: "100" },
  { code: "MTH 101", title: "Elementary Mathematics I", units: 3, department: "csc", level: "100" },
  { code: "MTH 102", title: "Elementary Mathematics II", units: 3, department: "csc", level: "100" },
  { code: "PHY 101", title: "General Physics I", units: 3, department: "csc", level: "100" },
  { code: "CSC 201", title: "Computer Programming I (C)", units: 3, department: "csc", level: "200" },
  { code: "CSC 202", title: "Computer Programming II (Java)", units: 3, department: "csc", level: "200" },
  { code: "CSC 203", title: "Discrete Structures", units: 3, department: "csc", level: "200" },
  { code: "CSC 204", title: "Digital Logic Design", units: 3, department: "csc", level: "200" },
  { code: "CSC 301", title: "Data Structures & Algorithms", units: 3, department: "csc", level: "300" },
  { code: "CSC 302", title: "Operating Systems", units: 3, department: "csc", level: "300" },
  { code: "CSC 303", title: "Database Management Systems", units: 3, department: "csc", level: "300" },
  { code: "CSC 304", title: "Computer Architecture", units: 3, department: "csc", level: "300" },
  { code: "CSC 305", title: "System Analysis & Design", units: 3, department: "csc", level: "300" },
  { code: "CSC 401", title: "Software Engineering", units: 3, department: "csc", level: "400" },
  { code: "CSC 402", title: "Artificial Intelligence", units: 3, department: "csc", level: "400" },
  { code: "CSC 403", title: "Computer Networks", units: 3, department: "csc", level: "400" },
  { code: "CSC 404", title: "Web Technologies", units: 3, department: "csc", level: "400" },
  { code: "CSC 499", title: "Final Year Project", units: 6, department: "csc", level: "400" },

  // Mathematics
  { code: "MTH 101", title: "Elementary Mathematics I", units: 3, department: "mth", level: "100" },
  { code: "MTH 102", title: "Elementary Mathematics II", units: 3, department: "mth", level: "100" },
  { code: "MTH 103", title: "Vectors, Geometry & Dynamics", units: 3, department: "mth", level: "100" },
  { code: "MTH 201", title: "Mathematical Methods I", units: 3, department: "mth", level: "200" },
  { code: "MTH 202", title: "Linear Algebra I", units: 3, department: "mth", level: "200" },
  { code: "MTH 203", title: "Sets, Logic & Algebra", units: 3, department: "mth", level: "200" },
  { code: "MTH 301", title: "Real Analysis", units: 3, department: "mth", level: "300" },
  { code: "MTH 302", title: "Complex Analysis", units: 3, department: "mth", level: "300" },
  { code: "MTH 303", title: "Abstract Algebra", units: 3, department: "mth", level: "300" },
  { code: "MTH 401", title: "Functional Analysis", units: 3, department: "mth", level: "400" },
  { code: "MTH 402", title: "Numerical Analysis", units: 3, department: "mth", level: "400" },
  { code: "MTH 499", title: "Project", units: 6, department: "mth", level: "400" },

  // Physics
  { code: "PHY 101", title: "General Physics I (Mechanics)", units: 3, department: "phy", level: "100" },
  { code: "PHY 102", title: "General Physics II (E&M)", units: 3, department: "phy", level: "100" },
  { code: "PHY 103", title: "Practical Physics I", units: 1, department: "phy", level: "100" },
  { code: "PHY 201", title: "Mechanics & Properties of Matter", units: 3, department: "phy", level: "200" },
  { code: "PHY 202", title: "Thermal Physics", units: 3, department: "phy", level: "200" },
  { code: "PHY 203", title: "Electromagnetism", units: 3, department: "phy", level: "200" },
  { code: "PHY 301", title: "Quantum Mechanics I", units: 3, department: "phy", level: "300" },
  { code: "PHY 302", title: "Atomic & Nuclear Physics", units: 3, department: "phy", level: "300" },
  { code: "PHY 303", title: "Electronics", units: 3, department: "phy", level: "300" },
  { code: "PHY 401", title: "Solid State Physics", units: 3, department: "phy", level: "400" },
  { code: "PHY 499", title: "Project", units: 6, department: "phy", level: "400" },

  // Chemistry
  { code: "CHM 101", title: "General Chemistry I", units: 3, department: "chm", level: "100" },
  { code: "CHM 102", title: "General Chemistry II", units: 3, department: "chm", level: "100" },
  { code: "CHM 103", title: "Practical Chemistry", units: 1, department: "chm", level: "100" },
  { code: "CHM 201", title: "Organic Chemistry I", units: 3, department: "chm", level: "200" },
  { code: "CHM 202", title: "Physical Chemistry I", units: 3, department: "chm", level: "200" },
  { code: "CHM 203", title: "Inorganic Chemistry I", units: 3, department: "chm", level: "200" },
  { code: "CHM 301", title: "Organic Chemistry II", units: 3, department: "chm", level: "300" },
  { code: "CHM 302", title: "Analytical Chemistry", units: 3, department: "chm", level: "300" },
  { code: "CHM 401", title: "Industrial Chemistry", units: 3, department: "chm", level: "400" },
  { code: "CHM 499", title: "Project", units: 6, department: "chm", level: "400" },

  // Biology
  { code: "BIO 101", title: "General Biology I", units: 3, department: "bio", level: "100" },
  { code: "BIO 102", title: "General Biology II", units: 3, department: "bio", level: "100" },
  { code: "BIO 201", title: "General Physiology", units: 3, department: "bio", level: "200" },
  { code: "BIO 202", title: "Genetics I", units: 3, department: "bio", level: "200" },
  { code: "BIO 301", title: "Ecology", units: 3, department: "bio", level: "300" },
  { code: "BIO 302", title: "Cell Biology", units: 3, department: "bio", level: "300" },
  { code: "BIO 401", title: "Evolution", units: 3, department: "bio", level: "400" },
  { code: "BIO 499", title: "Project", units: 6, department: "bio", level: "400" },

  // Biochemistry
  { code: "BCH 201", title: "General Biochemistry I", units: 3, department: "bch", level: "200" },
  { code: "BCH 202", title: "General Biochemistry II", units: 3, department: "bch", level: "200" },
  { code: "BCH 301", title: "Enzymology", units: 3, department: "bch", level: "300" },
  { code: "BCH 302", title: "Metabolism of Carbohydrates", units: 3, department: "bch", level: "300" },
  { code: "BCH 303", title: "Protein Chemistry", units: 3, department: "bch", level: "300" },
  { code: "BCH 401", title: "Molecular Biology", units: 3, department: "bch", level: "400" },
  { code: "BCH 402", title: "Clinical Biochemistry", units: 3, department: "bch", level: "400" },
  { code: "BCH 499", title: "Project", units: 6, department: "bch", level: "400" },

  // Microbiology
  { code: "MCB 201", title: "Introductory Microbiology", units: 3, department: "mcb", level: "200" },
  { code: "MCB 202", title: "Microbial Physiology", units: 3, department: "mcb", level: "200" },
  { code: "MCB 301", title: "Medical Microbiology", units: 3, department: "mcb", level: "300" },
  { code: "MCB 302", title: "Food Microbiology", units: 3, department: "mcb", level: "300" },
  { code: "MCB 303", title: "Virology", units: 3, department: "mcb", level: "300" },
  { code: "MCB 401", title: "Industrial Microbiology", units: 3, department: "mcb", level: "400" },
  { code: "MCB 499", title: "Project", units: 6, department: "mcb", level: "400" },

  // Electrical / Electronic Engineering
  { code: "EEE 201", title: "Applied Electricity I", units: 3, department: "eee", level: "200" },
  { code: "EEE 202", title: "Workshop Practice", units: 2, department: "eee", level: "200" },
  { code: "EEE 301", title: "Circuit Theory I", units: 3, department: "eee", level: "300" },
  { code: "EEE 302", title: "Electromagnetic Fields", units: 3, department: "eee", level: "300" },
  { code: "EEE 303", title: "Electronics I", units: 3, department: "eee", level: "300" },
  { code: "EEE 304", title: "Measurement & Instrumentation", units: 3, department: "eee", level: "300" },
  { code: "EEE 401", title: "Control Systems Engineering", units: 3, department: "eee", level: "400" },
  { code: "EEE 402", title: "Communication Principles", units: 3, department: "eee", level: "400" },
  { code: "EEE 403", title: "Power Systems I", units: 3, department: "eee", level: "400" },
  { code: "EEE 501", title: "Digital Signal Processing", units: 3, department: "eee", level: "500" },
  { code: "EEE 502", title: "Power Electronics", units: 3, department: "eee", level: "500" },
  { code: "EEE 599", title: "Final Year Project", units: 6, department: "eee", level: "500" },

  // Mechanical Engineering
  { code: "MEE 201", title: "Engineering Drawing", units: 3, department: "mee", level: "200" },
  { code: "MEE 202", title: "Workshop Technology", units: 2, department: "mee", level: "200" },
  { code: "MEE 301", title: "Thermodynamics I", units: 3, department: "mee", level: "300" },
  { code: "MEE 302", title: "Mechanics of Machines", units: 3, department: "mee", level: "300" },
  { code: "MEE 303", title: "Fluid Mechanics I", units: 3, department: "mee", level: "300" },
  { code: "MEE 401", title: "Heat Transfer", units: 3, department: "mee", level: "400" },
  { code: "MEE 402", title: "Machine Design", units: 3, department: "mee", level: "400" },
  { code: "MEE 501", title: "Automobile Engineering", units: 3, department: "mee", level: "500" },
  { code: "MEE 599", title: "Final Year Project", units: 6, department: "mee", level: "500" },

  // Civil Engineering
  { code: "CVE 201", title: "Civil Engineering Drawing", units: 2, department: "cve", level: "200" },
  { code: "CVE 301", title: "Strength of Materials", units: 3, department: "cve", level: "300" },
  { code: "CVE 302", title: "Surveying I", units: 3, department: "cve", level: "300" },
  { code: "CVE 303", title: "Soil Mechanics", units: 3, department: "cve", level: "300" },
  { code: "CVE 401", title: "Structural Analysis", units: 3, department: "cve", level: "400" },
  { code: "CVE 402", title: "Reinforced Concrete Design", units: 3, department: "cve", level: "400" },
  { code: "CVE 501", title: "Highway Engineering", units: 3, department: "cve", level: "500" },
  { code: "CVE 599", title: "Final Year Project", units: 6, department: "cve", level: "500" },

  // Chemical Engineering
  { code: "CHE 301", title: "Chemical Process Principles", units: 3, department: "che", level: "300" },
  { code: "CHE 302", title: "Chemical Engineering Thermodynamics", units: 3, department: "che", level: "300" },
  { code: "CHE 401", title: "Transport Phenomena", units: 3, department: "che", level: "400" },
  { code: "CHE 402", title: "Reactor Design", units: 3, department: "che", level: "400" },
  { code: "CHE 501", title: "Process Control", units: 3, department: "che", level: "500" },
  { code: "CHE 599", title: "Final Year Project", units: 6, department: "che", level: "500" },

  // Accounting
  { code: "ACC 101", title: "Intro to Financial Accounting I", units: 3, department: "acc", level: "100" },
  { code: "ACC 102", title: "Intro to Financial Accounting II", units: 3, department: "acc", level: "100" },
  { code: "ACC 201", title: "Financial Accounting", units: 3, department: "acc", level: "200" },
  { code: "ACC 202", title: "Cost Accounting", units: 3, department: "acc", level: "200" },
  { code: "ACC 301", title: "Advanced Financial Accounting", units: 3, department: "acc", level: "300" },
  { code: "ACC 302", title: "Management Accounting", units: 3, department: "acc", level: "300" },
  { code: "ACC 303", title: "Taxation I", units: 3, department: "acc", level: "300" },
  { code: "ACC 304", title: "Auditing I", units: 3, department: "acc", level: "300" },
  { code: "ACC 401", title: "Public Sector Accounting", units: 3, department: "acc", level: "400" },
  { code: "ACC 402", title: "Advanced Auditing", units: 3, department: "acc", level: "400" },
  { code: "ACC 403", title: "Forensic Accounting", units: 3, department: "acc", level: "400" },
  { code: "ACC 499", title: "Research Project", units: 6, department: "acc", level: "400" },

  // Business Administration
  { code: "BUS 101", title: "Intro to Business", units: 3, department: "bus", level: "100" },
  { code: "BUS 201", title: "Principles of Management", units: 3, department: "bus", level: "200" },
  { code: "BUS 202", title: "Business Communication", units: 2, department: "bus", level: "200" },
  { code: "BUS 301", title: "Marketing Management", units: 3, department: "bus", level: "300" },
  { code: "BUS 302", title: "Human Resource Management", units: 3, department: "bus", level: "300" },
  { code: "BUS 303", title: "Production Management", units: 3, department: "bus", level: "300" },
  { code: "BUS 401", title: "Strategic Management", units: 3, department: "bus", level: "400" },
  { code: "BUS 402", title: "Entrepreneurship Development", units: 3, department: "bus", level: "400" },
  { code: "BUS 499", title: "Research Project", units: 6, department: "bus", level: "400" },

  // Economics
  { code: "ECO 101", title: "Principles of Economics I (Micro)", units: 3, department: "eco", level: "100" },
  { code: "ECO 102", title: "Principles of Economics II (Macro)", units: 3, department: "eco", level: "100" },
  { code: "ECO 201", title: "Microeconomic Theory I", units: 3, department: "eco", level: "200" },
  { code: "ECO 202", title: "Macroeconomic Theory I", units: 3, department: "eco", level: "200" },
  { code: "ECO 203", title: "Statistics for Economists", units: 3, department: "eco", level: "200" },
  { code: "ECO 301", title: "Intermediate Microeconomics", units: 3, department: "eco", level: "300" },
  { code: "ECO 302", title: "Intermediate Macroeconomics", units: 3, department: "eco", level: "300" },
  { code: "ECO 303", title: "Econometrics I", units: 3, department: "eco", level: "300" },
  { code: "ECO 401", title: "Development Economics", units: 3, department: "eco", level: "400" },
  { code: "ECO 402", title: "International Economics", units: 3, department: "eco", level: "400" },
  { code: "ECO 499", title: "Project", units: 6, department: "eco", level: "400" },

  // Mass Communication
  { code: "MAC 101", title: "Intro to Mass Communication", units: 2, department: "mac", level: "100" },
  { code: "MAC 102", title: "Writing for the Mass Media", units: 2, department: "mac", level: "100" },
  { code: "MAC 201", title: "News Writing & Reporting", units: 3, department: "mac", level: "200" },
  { code: "MAC 202", title: "Theories of Mass Communication", units: 3, department: "mac", level: "200" },
  { code: "MAC 203", title: "African Communication Systems", units: 2, department: "mac", level: "200" },
  { code: "MAC 301", title: "Editing & Graphics of Communication", units: 3, department: "mac", level: "300" },
  { code: "MAC 302", title: "Broadcast Journalism", units: 3, department: "mac", level: "300" },
  { code: "MAC 303", title: "Public Relations", units: 3, department: "mac", level: "300" },
  { code: "MAC 304", title: "Advertising", units: 3, department: "mac", level: "300" },
  { code: "MAC 401", title: "Media Law & Ethics", units: 3, department: "mac", level: "400" },
  { code: "MAC 402", title: "Development Communication", units: 3, department: "mac", level: "400" },
  { code: "MAC 499", title: "Research Project", units: 6, department: "mac", level: "400" },

  // Political Science
  { code: "POL 101", title: "Intro to Political Science", units: 3, department: "pol", level: "100" },
  { code: "POL 201", title: "Nigerian Government & Politics", units: 3, department: "pol", level: "200" },
  { code: "POL 202", title: "Intro to Political Analysis", units: 3, department: "pol", level: "200" },
  { code: "POL 301", title: "Political Theory", units: 3, department: "pol", level: "300" },
  { code: "POL 302", title: "Comparative Politics", units: 3, department: "pol", level: "300" },
  { code: "POL 303", title: "International Relations", units: 3, department: "pol", level: "300" },
  { code: "POL 401", title: "Nigerian Foreign Policy", units: 3, department: "pol", level: "400" },
  { code: "POL 499", title: "Project", units: 6, department: "pol", level: "400" },

  // Psychology
  { code: "PSY 101", title: "Intro to Psychology", units: 3, department: "psy", level: "100" },
  { code: "PSY 201", title: "Developmental Psychology", units: 3, department: "psy", level: "200" },
  { code: "PSY 202", title: "Social Psychology", units: 3, department: "psy", level: "200" },
  { code: "PSY 301", title: "Abnormal Psychology", units: 3, department: "psy", level: "300" },
  { code: "PSY 302", title: "Cognitive Psychology", units: 3, department: "psy", level: "300" },
  { code: "PSY 401", title: "Clinical Psychology", units: 3, department: "psy", level: "400" },
  { code: "PSY 499", title: "Project", units: 6, department: "psy", level: "400" },

  // Law
  { code: "LAW 101", title: "Legal Methods", units: 4, department: "law", level: "100" },
  { code: "LAW 102", title: "Nigerian Legal System I", units: 3, department: "law", level: "100" },
  { code: "LAW 201", title: "Constitutional Law I", units: 4, department: "law", level: "200" },
  { code: "LAW 202", title: "Law of Contract I", units: 4, department: "law", level: "200" },
  { code: "LAW 203", title: "Law of Torts I", units: 4, department: "law", level: "200" },
  { code: "LAW 301", title: "Criminal Law", units: 4, department: "law", level: "300" },
  { code: "LAW 302", title: "Equity & Trusts", units: 4, department: "law", level: "300" },
  { code: "LAW 303", title: "Land Law I", units: 4, department: "law", level: "300" },
  { code: "LAW 304", title: "Commercial Law", units: 4, department: "law", level: "300" },
  { code: "LAW 401", title: "Evidence", units: 4, department: "law", level: "400" },
  { code: "LAW 402", title: "Jurisprudence", units: 4, department: "law", level: "400" },
  { code: "LAW 403", title: "Company Law", units: 4, department: "law", level: "400" },
  { code: "LAW 501", title: "Family Law", units: 3, department: "law", level: "500" },
  { code: "LAW 502", title: "Conflict of Laws", units: 3, department: "law", level: "500" },
  { code: "LAW 599", title: "Long Essay", units: 6, department: "law", level: "500" },

  // MBBS
  { code: "ANA 201", title: "Gross Anatomy", units: 4, department: "mbbs", level: "200" },
  { code: "PHS 201", title: "Medical Physiology", units: 4, department: "mbbs", level: "200" },
  { code: "BCM 201", title: "Medical Biochemistry", units: 4, department: "mbbs", level: "200" },
  { code: "PAT 301", title: "General Pathology", units: 4, department: "mbbs", level: "300" },
  { code: "PHA 301", title: "Pharmacology", units: 4, department: "mbbs", level: "300" },
  { code: "MCB 301", title: "Medical Microbiology", units: 4, department: "mbbs", level: "300" },
  { code: "MED 401", title: "Internal Medicine", units: 6, department: "mbbs", level: "400" },
  { code: "SUR 401", title: "Surgery", units: 6, department: "mbbs", level: "400" },
  { code: "OBG 501", title: "Obstetrics & Gynaecology", units: 6, department: "mbbs", level: "500" },
  { code: "PAE 501", title: "Paediatrics", units: 6, department: "mbbs", level: "500" },
  { code: "PSM 601", title: "Community Medicine", units: 6, department: "mbbs", level: "600" },

  // Nursing
  { code: "NSC 201", title: "Foundations of Nursing", units: 3, department: "nsc", level: "200" },
  { code: "NSC 202", title: "Anatomy for Nurses", units: 3, department: "nsc", level: "200" },
  { code: "NSC 301", title: "Medical-Surgical Nursing I", units: 4, department: "nsc", level: "300" },
  { code: "NSC 302", title: "Maternal & Child Health", units: 4, department: "nsc", level: "300" },
  { code: "NSC 401", title: "Mental Health Nursing", units: 3, department: "nsc", level: "400" },
  { code: "NSC 402", title: "Community Health Nursing", units: 4, department: "nsc", level: "400" },
  { code: "NSC 501", title: "Nursing Management", units: 3, department: "nsc", level: "500" },
  { code: "NSC 599", title: "Research Project", units: 6, department: "nsc", level: "500" },

  // Pharmacy
  { code: "PCG 201", title: "Pharmacognosy I", units: 3, department: "pha", level: "200" },
  { code: "PCH 201", title: "Pharmaceutical Chemistry I", units: 3, department: "pha", level: "200" },
  { code: "PCT 301", title: "Pharmaceutics I", units: 3, department: "pha", level: "300" },
  { code: "PCL 301", title: "Pharmacology I", units: 3, department: "pha", level: "300" },
  { code: "PCT 401", title: "Pharmaceutics II", units: 3, department: "pha", level: "400" },
  { code: "PCL 401", title: "Pharmacology II", units: 3, department: "pha", level: "400" },
  { code: "CPH 501", title: "Clinical Pharmacy", units: 4, department: "pha", level: "500" },
  { code: "PHA 599", title: "Project", units: 6, department: "pha", level: "500" },

  // Architecture
  { code: "ARC 101", title: "Intro to Architecture", units: 2, department: "arc", level: "100" },
  { code: "ARC 201", title: "Architectural Design I", units: 4, department: "arc", level: "200" },
  { code: "ARC 202", title: "History of Architecture", units: 2, department: "arc", level: "200" },
  { code: "ARC 301", title: "Architectural Design III", units: 4, department: "arc", level: "300" },
  { code: "ARC 302", title: "Building Construction", units: 3, department: "arc", level: "300" },
  { code: "ARC 401", title: "Architectural Design V", units: 5, department: "arc", level: "400" },
  { code: "ARC 501", title: "Urban Design", units: 3, department: "arc", level: "500" },
  { code: "ARC 599", title: "Thesis", units: 6, department: "arc", level: "500" },

  // English
  { code: "ENG 101", title: "Intro to Literature", units: 2, department: "eng", level: "100" },
  { code: "ENG 102", title: "Intro to English Grammar", units: 2, department: "eng", level: "100" },
  { code: "ENG 201", title: "African Literature", units: 3, department: "eng", level: "200" },
  { code: "ENG 202", title: "Phonetics & Phonology", units: 3, department: "eng", level: "200" },
  { code: "ENG 301", title: "Shakespeare", units: 3, department: "eng", level: "300" },
  { code: "ENG 302", title: "Syntax", units: 3, department: "eng", level: "300" },
  { code: "ENG 401", title: "Literary Criticism", units: 3, department: "eng", level: "400" },
  { code: "ENG 499", title: "Long Essay", units: 6, department: "eng", level: "400" },

  // History
  { code: "HIS 101", title: "Intro to History", units: 3, department: "his", level: "100" },
  { code: "HIS 201", title: "History of Nigeria", units: 3, department: "his", level: "200" },
  { code: "HIS 202", title: "History of West Africa", units: 3, department: "his", level: "200" },
  { code: "HIS 301", title: "African Diaspora", units: 3, department: "his", level: "300" },
  { code: "HIS 401", title: "Diplomatic History", units: 3, department: "his", level: "400" },
  { code: "HIS 499", title: "Long Essay", units: 6, department: "his", level: "400" },

  // Education
  { code: "EDU 101", title: "Intro to Teaching Profession", units: 2, department: "edu", level: "100" },
  { code: "EDU 201", title: "Educational Psychology", units: 3, department: "edu", level: "200" },
  { code: "EDU 301", title: "Curriculum Studies", units: 3, department: "edu", level: "300" },
  { code: "EDU 302", title: "Measurement & Evaluation", units: 3, department: "edu", level: "300" },
  { code: "EDU 401", title: "Teaching Practice", units: 6, department: "edu", level: "400" },
  { code: "EDU 499", title: "Research Project", units: 6, department: "edu", level: "400" },
];

export const COURSES: CatalogueCourse[] = [...DEPT_COURSES, ...GST];

/** Return courses for a department + level (department-specific + GST). */
export function coursesFor(
  departmentId: string,
  level: AcademicLevel,
): CatalogueCourse[] {
  return COURSES.filter(
    (c) =>
      c.level === level &&
      (c.department === departmentId || c.department === "*"),
  );
}
