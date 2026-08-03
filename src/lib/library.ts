// Augur Nigerian University Library
// Readable, exam-focused study material grouped by faculty/department and level.
// Each item is read inside the app and verified with a short comprehension check.

export type LibraryQuiz = { q: string; options: string[]; answer: number };

export type LibraryItem = {
  id: string;
  title: string;
  courseCode: string;
  department: string;
  faculty: string;
  level: "100" | "200" | "300" | "400";
  minutes: number;
  xp: number;
  premium: boolean;
  summary: string;
  sections: { heading: string; body: string }[];
  quiz: LibraryQuiz[];
};

export const FACULTIES = [
  "Science",
  "Engineering",
  "Social Sciences",
  "Arts",
  "Management Sciences",
  "Law",
  "Medicine & Health Sciences",
  "Education",
] as const;

export const LIBRARY: LibraryItem[] = [
  {
    id: "gst101-use-of-english",
    title: "Use of English: Comprehension, Summary & Register",
    courseCode: "GST 101",
    department: "General Studies",
    faculty: "Arts",
    level: "100",
    minutes: 8,
    xp: 25,
    premium: false,
    summary:
      "The GST 101 core: reading for meaning, writing accurate summaries, and using the right register in Nigerian university writing.",
    sections: [
      {
        heading: "Reading for meaning",
        body: "Comprehension in GST 101 is tested at three levels. Literal comprehension asks what the passage says — names, dates, stated reasons. Inferential comprehension asks what the passage implies; the answer is never printed word-for-word, you assemble it from clues. Evaluative comprehension asks you to judge the writer's tone, purpose or bias. Nigerian examiners love inferential questions, so train yourself to underline signal words: however, therefore, in spite of, consequently. These words carry the logic of the passage, and the logic is what is being examined.",
      },
      {
        heading: "Summary writing",
        body: "A summary must be shorter, faithful and in your own words. The standard method is: read once for the whole, read again marking topic sentences, delete examples and repetition, then rewrite each retained idea in one clause. Never introduce an opinion that is not in the passage, and never copy three or more consecutive words from the original unless they are technical terms. Marks are usually awarded per idea point, not per sentence, so a compact answer that captures five ideas beats an elegant answer that captures three.",
      },
      {
        heading: "Register and formal usage",
        body: "Register is the variety of language appropriate to a situation. A laboratory report, a letter to a Vice-Chancellor and a WhatsApp message to a coursemate use three different registers. In examinations you are expected to write formal academic English: no contractions (cannot, not can't), no slang, no Nigerian Pidgin, and no direct translation of local idiom. Watch the classic Nigerian usage errors — 'discuss about' (discuss), 'reply me' (reply to me), 'off the light' (switch off the light), 'I am coming' when you are leaving.",
      },
      {
        heading: "How it is examined",
        body: "A typical GST 101 paper carries an unseen passage with eight comprehension questions, a summary task of about 90 words, a lexis-and-structure section on synonyms in context, and an essay. Time management matters more than knowledge here: allocate roughly a third of your time to the passage, a third to the summary and lexis, and a third to the essay, and keep five minutes at the end to correct concord and spelling — the cheapest marks in the paper.",
      },
    ],
    quiz: [
      {
        q: "Which comprehension level requires you to assemble an answer that is not printed in the passage?",
        options: ["Literal", "Inferential", "Mechanical", "Phonological"],
        answer: 1,
      },
      {
        q: "In summary writing, marks are usually awarded for:",
        options: ["Each sentence written", "Each idea point captured", "Length of the answer", "Use of big words"],
        answer: 1,
      },
      {
        q: "Which of these is correct formal usage?",
        options: ["Discuss about the topic", "Reply me quickly", "Please reply to my letter", "Off the light"],
        answer: 2,
      },
    ],
  },
  {
    id: "mth101-limits-and-differentiation",
    title: "Limits, Continuity and Differentiation from First Principles",
    courseCode: "MTH 101",
    department: "Mathematics",
    faculty: "Science",
    level: "100",
    minutes: 10,
    xp: 30,
    premium: false,
    summary: "The 100-level calculus block every science and engineering student is examined on in the first semester.",
    sections: [
      {
        heading: "The idea of a limit",
        body: "The limit of f(x) as x approaches a is the value f(x) settles towards as x gets arbitrarily close to a — whether or not f(a) itself exists. This distinction is the whole point. The function (x² − 4)/(x − 2) is undefined at x = 2, yet its limit there is 4, because factorising gives (x + 2) for every x ≠ 2. Standard techniques are: direct substitution first; if you get 0/0, factorise, rationalise the surd, or divide through by the highest power of x for limits at infinity.",
      },
      {
        heading: "Continuity",
        body: "A function is continuous at x = a when three conditions hold together: f(a) exists, the limit as x → a exists, and the two are equal. Failing any one gives a discontinuity — removable (a hole you could plug), jump (left and right limits differ, common in piecewise definitions) or infinite (an asymptote). Examiners nearly always set a piecewise function with an unknown constant and ask you to find the value that makes it continuous: equate the left-hand and right-hand limits and solve.",
      },
      {
        heading: "Differentiation from first principles",
        body: "The derivative is f′(x) = lim(h→0) [f(x + h) − f(x)] / h. For f(x) = x², expanding gives (x² + 2xh + h² − x²)/h = 2x + h, and letting h → 0 gives 2x. Nigerian first-semester papers almost always carry one compulsory first-principles question, usually on x², 1/x, or √x, so drill those three until the algebra is automatic. Only after that do the shortcut rules apply: power rule, product rule (uv)′ = u′v + uv′, quotient rule, and the chain rule dy/dx = dy/du · du/dx.",
      },
      {
        heading: "Applications you will be tested on",
        body: "Three applications recur: tangents and normals (the tangent gradient at a point is f′ at that point, the normal gradient is its negative reciprocal), rates of change (differentiate with respect to time), and stationary points (set f′(x) = 0, then use the sign of f″(x) — positive means minimum, negative means maximum). For maxima-minima word problems, write the quantity to be optimised as a function of one variable using the constraint before differentiating.",
      },
    ],
    quiz: [
      {
        q: "The limit of (x² − 4)/(x − 2) as x approaches 2 is:",
        options: ["0", "Undefined", "4", "2"],
        answer: 2,
      },
      {
        q: "For continuity at x = a, which is NOT required?",
        options: ["f(a) exists", "The limit at a exists", "f is differentiable at a", "The limit equals f(a)"],
        answer: 2,
      },
      {
        q: "At a stationary point where f″(x) < 0, the point is a:",
        options: ["Minimum", "Maximum", "Point of inflection", "Discontinuity"],
        answer: 1,
      },
    ],
  },
  {
    id: "csc201-data-structures",
    title: "Data Structures: Arrays, Stacks, Queues and Linked Lists",
    courseCode: "CSC 201",
    department: "Computer Science",
    faculty: "Science",
    level: "200",
    minutes: 9,
    xp: 30,
    premium: false,
    summary: "Core 200-level data structures with the complexity analysis Nigerian CSC papers keep asking for.",
    sections: [
      {
        heading: "Arrays and their cost",
        body: "An array stores elements contiguously, so element i is found in constant time by computing base + i × size. That makes access O(1), but insertion or deletion in the middle is O(n) because everything after the point must shift. Arrays are also fixed in size in most languages, which is why dynamic arrays double their capacity and copy — giving amortised O(1) appends.",
      },
      {
        heading: "Stacks: last in, first out",
        body: "A stack supports push, pop and peek, all O(1). It underpins function-call management (the call stack), undo features, bracket matching, and conversion between infix, postfix and prefix notation — the last being a favourite examination question. To evaluate a postfix expression, scan left to right, push operands, and on meeting an operator pop two operands, apply, and push the result. The final item on the stack is the answer.",
      },
      {
        heading: "Queues: first in, first out",
        body: "A queue supports enqueue at the rear and dequeue at the front. Implemented naively over an array, dequeuing wastes space, so we use a circular queue where indices wrap with modulo arithmetic: rear = (rear + 1) % capacity. Variants include the priority queue, where the element with the best key leaves first, and the deque, which allows insertion and removal at both ends. Queues model scheduling, printer spooling and breadth-first search.",
      },
      {
        heading: "Linked lists",
        body: "A linked list stores each element in a node with a pointer to the next node. Insertion and deletion are O(1) once you hold the relevant node, but access is O(n) because you must traverse from the head. Singly linked lists move one way; doubly linked lists carry a previous pointer, enabling backward traversal at the cost of extra memory; circular lists have the last node point to the first. Classic examination tasks: reverse a singly linked list iteratively, and detect a cycle with the slow/fast pointer technique.",
      },
    ],
    quiz: [
      {
        q: "Accessing an element by index in an array is:",
        options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
        answer: 0,
      },
      {
        q: "A circular queue avoids wasted space by using:",
        options: ["Recursion", "Modulo arithmetic on indices", "Hashing", "Binary search"],
        answer: 1,
      },
      {
        q: "Which structure is used to evaluate a postfix expression?",
        options: ["Queue", "Stack", "Graph", "Heap"],
        answer: 1,
      },
    ],
  },
  {
    id: "acc101-double-entry",
    title: "Principles of Accounting: Double Entry and the Trial Balance",
    courseCode: "ACC 101",
    department: "Accounting",
    faculty: "Management Sciences",
    level: "100",
    minutes: 8,
    xp: 25,
    premium: false,
    summary: "From the accounting equation to preparing a trial balance that actually balances.",
    sections: [
      {
        heading: "The accounting equation",
        body: "Assets = Capital + Liabilities. Every transaction preserves this identity, which is why bookkeeping is called double entry: each transaction is recorded twice, once as a debit and once as a credit of equal value. Buying goods on credit increases an asset (inventory) and increases a liability (payables) — the equation still holds.",
      },
      {
        heading: "Debit and credit rules",
        body: "Debit what comes in, credit what goes out for real accounts. Debit the receiver, credit the giver for personal accounts. Debit expenses and losses, credit incomes and gains for nominal accounts. A quick memory aid used across Nigerian universities is DEAD CLIC: Debits increase Expenses, Assets and Drawings; Credits increase Liabilities, Income and Capital.",
      },
      {
        heading: "From journal to ledger to trial balance",
        body: "Transactions are first recorded in the books of original entry (general journal, sales day book, purchases day book, cash book), then posted to ledger accounts, then balanced off. The trial balance lists every ledger balance in debit and credit columns; the totals must agree. Agreement is necessary but not sufficient — errors of omission, commission, principle, original entry, complete reversal and compensating errors all leave a trial balance in balance while the books are still wrong.",
      },
      {
        heading: "Adjustments before final accounts",
        body: "Before preparing the statement of profit or loss you must adjust for accruals (expenses incurred but unpaid), prepayments (paid in advance), depreciation (commonly straight-line: cost less residual value divided by useful life, or reducing balance), bad debts written off, and allowance for doubtful debts. Each adjustment has both a profit-or-loss effect and a statement-of-financial-position effect — losing one half is the most common examination error.",
      },
    ],
    quiz: [
      {
        q: "The accounting equation states that:",
        options: [
          "Assets = Capital + Liabilities",
          "Assets = Capital − Liabilities",
          "Capital = Assets + Liabilities",
          "Liabilities = Assets + Capital",
        ],
        answer: 0,
      },
      {
        q: "Which error would still allow the trial balance to agree?",
        options: ["Posting only one side", "Error of principle", "Wrong addition of one column", "Omitting a credit entry"],
        answer: 1,
      },
      {
        q: "Under DEAD CLIC, credits increase:",
        options: ["Expenses", "Assets", "Income", "Drawings"],
        answer: 2,
      },
    ],
  },
  {
    id: "bio101-cell-biology",
    title: "Cell Biology: Structure, Transport and Division",
    courseCode: "BIO 101",
    department: "Biology",
    faculty: "Science",
    level: "100",
    minutes: 8,
    xp: 25,
    premium: false,
    summary: "Cell organelles, membrane transport, and the mitosis/meiosis comparison examiners reuse every session.",
    sections: [
      {
        heading: "Prokaryotic and eukaryotic cells",
        body: "Prokaryotes (bacteria) have no membrane-bound nucleus or organelles, carry circular DNA in a nucleoid, and use 70S ribosomes. Eukaryotes have a true nucleus, membrane-bound organelles and 80S ribosomes. Plant cells add a cellulose cell wall, chloroplasts and a large central vacuole; animal cells have centrioles and lysosomes prominently.",
      },
      {
        heading: "Organelles and their functions",
        body: "Mitochondria carry out aerobic respiration and are called the powerhouse because they generate ATP. Rough endoplasmic reticulum, studded with ribosomes, synthesises and transports protein; smooth ER handles lipid synthesis and detoxification. The Golgi apparatus modifies, packages and exports. Lysosomes contain hydrolytic enzymes for digestion of worn-out organelles. The nucleus stores DNA and controls the cell.",
      },
      {
        heading: "Movement across the membrane",
        body: "The membrane is a fluid mosaic of a phospholipid bilayer with embedded proteins. Diffusion moves particles down a concentration gradient without energy. Osmosis is diffusion of water across a semi-permeable membrane, from high to low water potential. Facilitated diffusion uses channel or carrier proteins but no ATP. Active transport moves substances against the gradient and requires ATP — the sodium-potassium pump is the standard example. Bulk transport uses endocytosis and exocytosis.",
      },
      {
        heading: "Mitosis versus meiosis",
        body: "Mitosis produces two genetically identical diploid daughter cells and serves growth and repair; the stages are prophase, metaphase, anaphase, telophase. Meiosis involves two divisions, produces four genetically varied haploid cells, and serves gamete formation. Variation arises from crossing over at prophase I and independent assortment at metaphase I. If a question mentions chiasmata or bivalents, it is meiosis.",
      },
    ],
    quiz: [
      {
        q: "Which organelle is chiefly responsible for ATP production?",
        options: ["Golgi apparatus", "Mitochondrion", "Lysosome", "Nucleolus"],
        answer: 1,
      },
      {
        q: "Movement of substances against a concentration gradient using ATP is:",
        options: ["Osmosis", "Diffusion", "Facilitated diffusion", "Active transport"],
        answer: 3,
      },
      {
        q: "Crossing over that produces genetic variation occurs during:",
        options: ["Prophase I of meiosis", "Metaphase of mitosis", "Telophase II", "Interphase"],
        answer: 0,
      },
    ],
  },
  {
    id: "eco101-demand-supply",
    title: "Demand, Supply and Elasticity in the Nigerian Economy",
    courseCode: "ECO 101",
    department: "Economics",
    faculty: "Social Sciences",
    level: "100",
    minutes: 8,
    xp: 25,
    premium: false,
    summary: "Market equilibrium and elasticity, illustrated with Nigerian fuel, food and transport examples.",
    sections: [
      {
        heading: "Demand and its determinants",
        body: "The law of demand states that, other things being equal, the quantity demanded of a good falls as its price rises. A change in price causes movement along the demand curve; a change in any other determinant — income, price of substitutes and complements, taste, population, expectations — shifts the whole curve. In Nigeria, a rise in the pump price of petrol shifts the demand curve for road transport-dependent goods, a shift, not a movement.",
      },
      {
        heading: "Supply and equilibrium",
        body: "Supply rises with price because higher prices cover higher marginal costs and attract new producers. Equilibrium occurs where quantity demanded equals quantity supplied; above it there is a surplus that pushes price down, below it a shortage that pushes price up. Government intervention distorts this: a price ceiling below equilibrium (rent control) creates persistent shortage and black markets; a price floor above equilibrium (minimum wage, guaranteed crop prices) creates surplus.",
      },
      {
        heading: "Elasticity",
        body: "Price elasticity of demand is the percentage change in quantity demanded divided by the percentage change in price. Demand is elastic when the value exceeds one, inelastic when below one. Necessities such as garri and kerosene are inelastic; luxuries and goods with close substitutes are elastic. This matters for revenue: raising price increases total revenue only when demand is inelastic. Income elasticity distinguishes normal goods (positive) from inferior goods (negative), and cross elasticity distinguishes substitutes (positive) from complements (negative).",
      },
      {
        heading: "Applying it in examinations",
        body: "Most ECO 101 questions combine a diagram with a short explanation. Always label axes (price on the vertical, quantity on the horizontal), mark the initial and new equilibrium, and state clearly whether you are describing a shift or a movement. Where a Nigerian policy example is asked for — subsidy removal, import ban on rice, minimum wage — link the policy to the curve it shifts and then to the welfare effect on consumers and producers.",
      },
    ],
    quiz: [
      {
        q: "A change in consumer income causes:",
        options: ["A movement along the demand curve", "A shift of the demand curve", "No effect", "A change in supply only"],
        answer: 1,
      },
      {
        q: "A price ceiling set below equilibrium typically causes:",
        options: ["Surplus", "Shortage", "Equilibrium", "Higher supply"],
        answer: 1,
      },
      {
        q: "Raising the price of a good increases total revenue when demand is:",
        options: ["Elastic", "Unitary", "Inelastic", "Perfectly elastic"],
        answer: 2,
      },
    ],
  },
  {
    id: "phy101-mechanics",
    title: "Mechanics: Motion, Newton's Laws and Momentum",
    courseCode: "PHY 101",
    department: "Physics",
    faculty: "Science",
    level: "100",
    minutes: 9,
    xp: 30,
    premium: false,
    summary: "Kinematics equations, Newton's laws and conservation of momentum with worked exam framing.",
    sections: [
      {
        heading: "Kinematics",
        body: "For uniform acceleration the three equations are v = u + at, s = ut + ½at², and v² = u² + 2as. Choose the equation that avoids the quantity you neither know nor want. Take one direction as positive and keep it consistent; for a body thrown upward, g is negative in that convention. At maximum height the velocity is zero but the acceleration is still g — a favourite trick question.",
      },
      {
        heading: "Newton's laws",
        body: "The first law defines inertia: a body remains at rest or in uniform motion unless acted on by a resultant force. The second gives F = ma, more generally force equals rate of change of momentum. The third states that action and reaction are equal, opposite, and act on different bodies — which is why they never cancel each other out. For connected bodies and pulleys, draw a free-body diagram for each mass and write F = ma separately before solving simultaneously.",
      },
      {
        heading: "Momentum and impulse",
        body: "Momentum p = mv. Impulse is force multiplied by time and equals the change in momentum, which explains crumple zones and follow-through in sport. In a closed system total momentum is conserved: m₁u₁ + m₂u₂ = m₁v₁ + m₂v₂. In a perfectly elastic collision kinetic energy is also conserved; in an inelastic collision the bodies stick together and kinetic energy is lost as heat and sound, though momentum still holds.",
      },
      {
        heading: "Work, energy and power",
        body: "Work is force times displacement in the direction of the force. Kinetic energy is ½mv² and gravitational potential energy is mgh. The work-energy theorem states that net work equals the change in kinetic energy. Power is work per unit time, measured in watts. Where friction is present, mechanical energy is not conserved; account for the energy lost as heat rather than assuming conservation.",
      },
    ],
    quiz: [
      {
        q: "At the maximum height of a body thrown vertically upward:",
        options: ["Velocity and acceleration are zero", "Velocity is zero, acceleration is g", "Both equal g", "Velocity is g"],
        answer: 1,
      },
      {
        q: "Newton's third law pairs never cancel because they:",
        options: ["Are unequal", "Act on different bodies", "Act at different times", "Are not forces"],
        answer: 1,
      },
      {
        q: "In an inelastic collision, which quantity is conserved?",
        options: ["Kinetic energy only", "Momentum only", "Both", "Neither"],
        answer: 1,
      },
    ],
  },
  {
    id: "law201-nigerian-legal-system",
    title: "The Nigerian Legal System: Sources and Court Hierarchy",
    courseCode: "LAW 201",
    department: "Law",
    faculty: "Law",
    level: "200",
    minutes: 8,
    xp: 30,
    premium: false,
    summary: "Sources of Nigerian law and the structure of the courts, from Magistrates to the Supreme Court.",
    sections: [
      {
        heading: "Sources of Nigerian law",
        body: "Nigerian law draws from the Constitution (supreme, by section 1(3) any inconsistent law is void to the extent of the inconsistency), legislation of the National and State Assemblies, English law received into Nigeria, customary law, Islamic law, and judicial precedent. Customary law is enforced only if it passes the validity tests: it must not be repugnant to natural justice, equity and good conscience, must not be incompatible with any written law, and must not be contrary to public policy.",
      },
      {
        heading: "Court hierarchy",
        body: "The Supreme Court sits at the apex, followed by the Court of Appeal, then the Federal High Court, the High Court of a State and of the FCT, the National Industrial Court, Sharia Courts of Appeal and Customary Courts of Appeal. Below these are Magistrates' Courts, District Courts, Area Courts and Customary Courts. Superior courts of record are those listed in section 6(5) of the 1999 Constitution as amended.",
      },
      {
        heading: "Judicial precedent",
        body: "The doctrine of stare decisis binds lower courts to the ratio decidendi — the legal reasoning essential to the decision — of higher courts. Obiter dicta, statements made by the way, are persuasive but not binding. The Supreme Court may depart from its own previous decisions where they were reached per incuriam or would perpetuate injustice, a power it exercises sparingly.",
      },
      {
        heading: "Answering law questions",
        body: "Use the IRAC structure: Issue, Rule, Application, Conclusion. State the legal issue narrowly, cite the rule with authority (statute section or decided case), apply the rule to the specific facts you were given rather than restating the law, and conclude decisively. Marks in Nigerian law faculties are concentrated in the application stage, which is exactly the stage most students shorten.",
      },
    ],
    quiz: [
      {
        q: "Which court is the apex court in Nigeria?",
        options: ["Court of Appeal", "Federal High Court", "Supreme Court", "National Industrial Court"],
        answer: 2,
      },
      {
        q: "The binding part of a judgment is the:",
        options: ["Obiter dictum", "Ratio decidendi", "Headnote", "Dissent"],
        answer: 1,
      },
      {
        q: "Customary law is unenforceable if it is:",
        options: ["Unwritten", "Repugnant to natural justice", "Old", "Local to one ethnic group"],
        answer: 1,
      },
    ],
  },
  {
    id: "eee201-circuit-theory",
    title: "Circuit Theory: Network Theorems and AC Analysis",
    courseCode: "EEE 201",
    department: "Electrical & Electronics Engineering",
    faculty: "Engineering",
    level: "200",
    minutes: 10,
    xp: 35,
    premium: true,
    summary: "Kirchhoff, Thevenin, Norton and AC phasors — the analysis toolkit for 200-level engineering.",
    sections: [
      {
        heading: "Kirchhoff's laws",
        body: "KCL states that the algebraic sum of currents at a node is zero — charge does not accumulate. KVL states that the algebraic sum of voltages around any closed loop is zero — energy is conserved. Nodal analysis applies KCL and solves for node voltages, and is efficient when current sources dominate; mesh analysis applies KVL and solves for loop currents, and is efficient with voltage sources. Count nodes and meshes first and pick the method with fewer unknowns.",
      },
      {
        heading: "Thevenin and Norton equivalents",
        body: "Any linear two-terminal network can be replaced by a voltage source V_th in series with R_th, or equivalently a current source I_n in parallel with R_n, where V_th = I_n × R_n and R_th = R_n. To find R_th, deactivate independent sources — short voltage sources, open current sources — and look back into the terminals. Maximum power is transferred to a load when R_load equals R_th, and the efficiency at that point is only 50 per cent.",
      },
      {
        heading: "AC and phasors",
        body: "For sinusoidal steady state, represent voltages and currents as phasors and elements as impedances: resistor R, inductor jωL, capacitor 1/(jωC). Current lags voltage by 90° in a pure inductor and leads by 90° in a pure capacitor; the memory aid is CIVIL. In a series RLC circuit, impedance is R + j(X_L − X_C), and resonance occurs when X_L = X_C, giving minimum impedance, maximum current and unity power factor at ω = 1/√(LC).",
      },
      {
        heading: "Power in AC circuits",
        body: "Real power P = VI cos φ in watts, reactive power Q = VI sin φ in volt-amperes reactive, and apparent power S = VI in volt-amperes, with S² = P² + Q². The power factor cos φ measures how much of the supplied capacity does useful work. Industrial loads are inductive and so lag; adding shunt capacitance corrects the power factor, reducing current and line losses — the standard design calculation in Nigerian distribution networks.",
      },
    ],
    quiz: [
      {
        q: "Kirchhoff's current law is a statement of the conservation of:",
        options: ["Energy", "Charge", "Momentum", "Flux"],
        answer: 1,
      },
      {
        q: "Maximum power transfer to a load occurs when:",
        options: ["R_load = 0", "R_load = R_th", "R_load is infinite", "R_load = 2R_th"],
        answer: 1,
      },
      {
        q: "At series RLC resonance, the circuit impedance is:",
        options: ["Maximum", "Zero reactance, minimum impedance", "Purely inductive", "Purely capacitive"],
        answer: 1,
      },
    ],
  },
  {
    id: "mcb301-microbiology",
    title: "Medical Microbiology: Pathogens, Immunity and Antibiotics",
    courseCode: "MCB 301",
    department: "Microbiology",
    faculty: "Medicine & Health Sciences",
    level: "300",
    minutes: 10,
    xp: 35,
    premium: true,
    summary: "Bacterial classification, host defence and antimicrobial resistance in a Nigerian clinical context.",
    sections: [
      {
        heading: "Classifying bacteria",
        body: "Gram staining separates bacteria by cell-wall structure: Gram-positive organisms retain crystal violet because of a thick peptidoglycan layer and appear purple; Gram-negative organisms have a thin layer plus an outer lipopolysaccharide membrane, lose the stain and counterstain pink with safranin. That outer membrane is also why Gram-negative organisms resist many antibiotics. Further classification uses shape (cocci, bacilli, spirilla), oxygen requirement, and biochemical tests such as catalase and coagulase.",
      },
      {
        heading: "Pathogenesis",
        body: "Virulence factors determine whether colonisation becomes disease: adhesins for attachment, capsules to resist phagocytosis, exotoxins secreted by living cells (tetanus, cholera), and endotoxin, the lipid A of Gram-negative LPS released on lysis and responsible for septic shock. Infectious dose, portal of entry and host immune status together decide the outcome, which is why malnutrition and untreated HIV substantially worsen ordinary infections.",
      },
      {
        heading: "Host defence",
        body: "Innate immunity is immediate and non-specific: skin and mucosal barriers, lysozyme, complement, phagocytes, natural killer cells, inflammation and fever. Adaptive immunity is slower, specific and remembers: B lymphocytes produce antibodies (humoral) and T lymphocytes coordinate and kill infected cells (cell-mediated). IgM appears first in infection and IgG dominates the secondary response — the basis of serological interpretation in laboratory reports.",
      },
      {
        heading: "Antibiotics and resistance",
        body: "Antibiotics act by inhibiting cell-wall synthesis (penicillins, cephalosporins), protein synthesis (aminoglycosides, tetracyclines, macrolides), nucleic acid synthesis (quinolones, rifampicin) or folate metabolism (sulphonamides). Resistance arises through enzymatic inactivation such as beta-lactamase, target modification such as MRSA's altered PBP2a, efflux pumps and reduced permeability, and spreads on plasmids by conjugation. Over-the-counter sale and incomplete courses have made resistance a major Nigerian public-health problem; culture and sensitivity testing before prescribing is the corrective.",
      },
    ],
    quiz: [
      {
        q: "Gram-positive bacteria appear purple because they have:",
        options: ["An outer LPS membrane", "A thick peptidoglycan layer", "Flagella", "No cell wall"],
        answer: 1,
      },
      {
        q: "Endotoxin responsible for septic shock is associated with:",
        options: ["Gram-positive exotoxins", "Lipid A of Gram-negative LPS", "Fungal spores", "Viral capsids"],
        answer: 1,
      },
      {
        q: "MRSA resistance arises mainly from:",
        options: ["Efflux pumps only", "Altered penicillin-binding protein", "Loss of ribosomes", "Spore formation"],
        answer: 1,
      },
    ],
  },
  {
    id: "edu201-teaching-methods",
    title: "Educational Psychology: Learning Theories and Lesson Planning",
    courseCode: "EDU 201",
    department: "Education",
    faculty: "Education",
    level: "200",
    minutes: 8,
    xp: 25,
    premium: false,
    summary: "Behaviourist, cognitive and constructivist theories, plus writing objectives that can actually be measured.",
    sections: [
      {
        heading: "Behaviourism",
        body: "Behaviourists explain learning as a change in observable behaviour produced by stimuli and consequences. Pavlov's classical conditioning pairs a neutral stimulus with an unconditioned one; Skinner's operant conditioning strengthens behaviour through reinforcement and weakens it through punishment. Positive reinforcement adds a pleasant consequence, negative reinforcement removes an unpleasant one — both increase behaviour, a distinction examiners test repeatedly.",
      },
      {
        heading: "Cognitive and constructivist views",
        body: "Piaget described four stages — sensorimotor, preoperational, concrete operational and formal operational — with learning driven by assimilation and accommodation. Vygotsky emphasised the social context and the zone of proximal development, the gap between what a learner can do alone and with guidance, bridged by scaffolding. Bruner argued for discovery learning and the spiral curriculum, revisiting topics at increasing depth.",
      },
      {
        heading: "Objectives and Bloom's taxonomy",
        body: "A behavioural objective states what the learner will do, under what condition, and to what standard: 'given ten quadratic equations, the student will solve at least eight correctly within twenty minutes'. Bloom's cognitive domain runs from remembering and understanding through applying and analysing to evaluating and creating. Use action verbs that can be observed — list, calculate, compare, design — and avoid unmeasurable verbs such as understand, know or appreciate.",
      },
      {
        heading: "Lesson planning and evaluation",
        body: "A standard Nigerian lesson plan carries the topic, class and duration, previous knowledge, behavioural objectives, instructional materials, presentation in steps, learner activities, evaluation and assignment. Evaluation must map directly onto the stated objectives: formative assessment during the lesson to guide teaching, summative assessment at the end to grade attainment. A plan whose evaluation tests something the objectives never claimed loses marks in teaching practice.",
      },
    ],
    quiz: [
      {
        q: "Negative reinforcement:",
        options: [
          "Decreases behaviour by adding punishment",
          "Increases behaviour by removing an unpleasant stimulus",
          "Has no effect on behaviour",
          "Is the same as extinction",
        ],
        answer: 1,
      },
      {
        q: "The zone of proximal development was proposed by:",
        options: ["Piaget", "Skinner", "Vygotsky", "Bloom"],
        answer: 2,
      },
      {
        q: "Which verb is suitable for a measurable behavioural objective?",
        options: ["Understand", "Appreciate", "Know", "Calculate"],
        answer: 3,
      },
    ],
  },
  {
    id: "pol201-nigerian-government",
    title: "Nigerian Government & Politics: Federalism and the 1999 Constitution",
    courseCode: "POL 201",
    department: "Political Science",
    faculty: "Social Sciences",
    level: "200",
    minutes: 9,
    xp: 30,
    premium: false,
    summary: "Federal structure, separation of powers and the recurring debates in Nigerian constitutional practice.",
    sections: [
      {
        heading: "Federalism in Nigeria",
        body: "Nigeria operates a federal system in which powers are shared between the federal government and 36 states plus the FCT. The 1999 Constitution divides competence into the Exclusive Legislative List, reserved to the National Assembly, and the Concurrent List, shared with the States, with residual matters left to the States. Where a State law conflicts with a valid federal law on a concurrent matter, the doctrine of covering the field renders the State law inoperative to the extent of the inconsistency.",
      },
      {
        heading: "Separation of powers",
        body: "Legislative power vests in the National Assembly, executive power in the President, and judicial power in the courts, with checks and balances: legislative approval of appointments and budgets, executive veto subject to a two-thirds override, and judicial review of both. In practice the Nigerian executive is dominant, largely because of control over revenue allocation and security agencies.",
      },
      {
        heading: "Revenue allocation and resource control",
        body: "Federally collected revenue flows into the Federation Account and is shared vertically between the three tiers and horizontally among states using criteria including equality, population, internally generated revenue effort, landmass and terrain. Section 162(2) provides a derivation principle of not less than 13 per cent for natural-resource-producing states, which sits at the centre of the resource-control debate in the Niger Delta.",
      },
      {
        heading: "Recurring examination themes",
        body: "Expect questions on the merits and demerits of federalism for a plural society, the Federal Character principle and its tension with merit, state creation agitations, local government autonomy, and constitutional amendment procedure under section 9, which requires a two-thirds majority in the National Assembly and approval by at least 24 State Houses of Assembly. Support every argument with a constitutional section or a concrete Nigerian example.",
      },
    ],
    quiz: [
      {
        q: "Matters not listed in the Exclusive or Concurrent Lists are:",
        options: ["Federal", "Residual, for the States", "Void", "Reserved for local government"],
        answer: 1,
      },
      {
        q: "The derivation principle guarantees resource-producing states not less than:",
        options: ["5%", "10%", "13%", "20%"],
        answer: 2,
      },
      {
        q: "Amending the Constitution under section 9 requires approval of at least:",
        options: ["12 State Assemblies", "18 State Assemblies", "24 State Assemblies", "All 36 State Assemblies"],
        answer: 2,
      },
    ],
  },
];

export const LIBRARY_DEPARTMENTS = Array.from(new Set(LIBRARY.map((i) => i.department))).sort();

export function getLibraryItem(id: string) {
  return LIBRARY.find((i) => i.id === id) ?? null;
}

export function estimatedWords(item: LibraryItem) {
  return item.sections.reduce((n, s) => n + (s.body.match(/\S+/g)?.length ?? 0), 0);
}
