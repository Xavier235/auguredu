export type ExamBankQuestion = {
  q: string;
  options: string[];
  answer: number;
  explanation: string;
  topic: string;
  difficulty: "easy" | "standard" | "hard";
};

export type ExamBankSet = {
  subject: string;
  board: "jamb" | "waec" | "neco";
  questions: ExamBankQuestion[];
};

// Original syllabus-based practice questions modeled on common exam concepts; not copied past papers.
export const EXAM_BANK: ExamBankSet[] = [
  {
    "subject": "Use of English",
    "board": "jamb",
    "questions": [
      {
        "q": "In the sentence below, select the option that is NEAREST IN MEANING to the underlined word.\n\nThe young director's <u>meticulous</u> attention to detail saved the firm from financial losses.",
        "options": [
          "casual",
          "thorough",
          "hasty",
          "stubborn"
        ],
        "answer": 1,
        "explanation": "'Meticulous' means showing great attention to detail or being very careful and precise. 'Thorough' is the nearest in meaning.",
        "topic": "Synonyms",
        "difficulty": "standard"
      },
      {
        "q": "In the sentence below, select the option that is OPPOSITE IN MEANING to the underlined word.\n\nHis <u>ephemeral</u> passion for urban agriculture surprised everyone who expected a lifelong commitment.",
        "options": [
          "transient",
          "permanent",
          "shallow",
          "intense"
        ],
        "answer": 1,
        "explanation": "'Ephemeral' means lasting for a very short time. The exact opposite is 'permanent'.",
        "topic": "Antonyms",
        "difficulty": "standard"
      },
      {
        "q": "Choose the option that best completes the sentence.\n\nNeither the principal nor the teachers _____ present at the emergency briefing yesterday.",
        "options": [
          "was",
          "were",
          "is",
          "are"
        ],
        "answer": 1,
        "explanation": "According to the rule of proximity in grammatical concord, when subjects are joined by 'neither... nor', the verb agrees with the closer subject ('teachers', which is plural past tense: 'were').",
        "topic": "Grammatical Concord",
        "difficulty": "standard"
      },
      {
        "q": "Choose the option that best explains the meaning of the underlined idiom.\n\nWhen preparing for the national examinations, standard students often <u>burn the candle at both ends</u>.",
        "options": [
          "spend money extravagantly",
          "work excessively hard from early morning until late night",
          "waste electricity while studying",
          "study only when forced by instructors"
        ],
        "answer": 1,
        "explanation": "The idiom 'burn the candle at both ends' means to exhaust oneself by working late into the night and getting up early in the morning.",
        "topic": "Idioms and Idiomatic Expressions",
        "difficulty": "hard"
      },
      {
        "q": "Choose the correct preposition to complete the sentence.\n\nAfter a long debate, the executive council finally agreed _____ the proposed reform guidelines.",
        "options": [
          "to",
          "with",
          "on",
          "for"
        ],
        "answer": 0,
        "explanation": "One 'agrees to' a plan, proposal, or recommendation. (One 'agrees with' a person/opinion, and 'agrees on' a topic/decision).",
        "topic": "Prepositions",
        "difficulty": "standard"
      },
      {
        "q": "Choose the option that best completes the sentence.\n\nThe eyewitness gave a _____ account of the incident, leaving out no crucial details.",
        "options": [
          "graphic",
          "vague",
          "ambiguous",
          "sketchy"
        ],
        "answer": 0,
        "explanation": "A 'graphic' account is clear, vivid, and detailed, fitting the context of leaving out no crucial details.",
        "topic": "Lexis and Structure",
        "difficulty": "easy"
      },
      {
        "q": "Select the word that contains the same vowel sound as the one represented by the underlined letter(s) in 'c<u>au</u>ght'.",
        "options": [
          "cat",
          "port",
          "cot",
          "cut"
        ],
        "answer": 1,
        "explanation": "The sound in 'caught' is the long open-mid back rounded vowel /ɔː/, which matches the sound in 'port'.",
        "topic": "Oral English - Vowels",
        "difficulty": "standard"
      },
      {
        "q": "Select the word that contains the same consonant sound as the underlined sound in '<u>th</u>ink'.",
        "options": [
          "this",
          "breath",
          "smooth",
          "father"
        ],
        "answer": 1,
        "explanation": "'Think' contains the voiceless dental fricative /θ/. 'Breath' also ends in /θ/, whereas 'this', 'smooth', and 'father' contain the voiced /ð/.",
        "topic": "Oral English - Consonants",
        "difficulty": "standard"
      },
      {
        "q": "The word in CAPITAL LETTERS has the emphatic stress. Choose the option to which the sentence correctly responds.\n\n'CHIDE bought the blue car yesterday.'",
        "options": [
          "Did Chide sell the blue car yesterday?",
          "Did Chide buy the red car yesterday?",
          "Did Amina buy the blue car yesterday?",
          "Did Chide buy the blue car today?"
        ],
        "answer": 2,
        "explanation": "Emphatic stress on 'CHIDE' highlights that it was Chide, not someone else (like Amina), who bought the car.",
        "topic": "Emphatic Stress",
        "difficulty": "standard"
      },
      {
        "q": "Choose the correct question tag to complete the sentence.\n\nShe barely manages to arrive on time, _____?",
        "options": [
          "doesn't she",
          "does she",
          "isn't it",
          "hasn't she"
        ],
        "answer": 1,
        "explanation": "'Barely' makes the statement semi-negative; therefore, it requires a positive question tag ('does she?').",
        "topic": "Question Tags",
        "difficulty": "hard"
      },
      {
        "q": "Choose the option that best completes the sentence.\n\nIf I _____ the vice-chancellor, I would grant full tuition waivers to indigent scholars.",
        "options": [
          "am",
          "was",
          "were",
          "be"
        ],
        "answer": 2,
        "explanation": "The subjunctive mood uses 'were' for unreal, hypothetical, or contrary-to-fact statements regardless of the singular subject.",
        "topic": "Conditionals and Subjunctive",
        "difficulty": "easy"
      },
      {
        "q": "In the sentence below, select the option that is NEAREST IN MEANING to the underlined word.\n\nThe lecturer's <u>verbose</u> explanation confused the students rather than clarifying the concept.",
        "options": [
          "wordy",
          "concise",
          "brilliant",
          "offensive"
        ],
        "answer": 0,
        "explanation": "'Verbose' means using more words than needed; hence 'wordy' is the closest synonym.",
        "topic": "Synonyms",
        "difficulty": "standard"
      },
      {
        "q": "In the sentence below, select the option that is OPPOSITE IN MEANING to the underlined word.\n\nThe labor union commended the management for their <u>conciliatory</u> approach to dispute resolution.",
        "options": [
          "peacemaking",
          "hostile",
          "polite",
          "compromising"
        ],
        "answer": 1,
        "explanation": "'Conciliatory' means intended to gain goodwill or reduce hostility. Its opposite is 'hostile'.",
        "topic": "Antonyms",
        "difficulty": "standard"
      },
      {
        "q": "Choose the option that best completes the sentence.\n\nAll the _____ gathered during the investigation were handed over to the state prosecutor.",
        "options": [
          "informations",
          "information",
          "pieces of information",
          "informatory"
        ],
        "answer": 2,
        "explanation": "'Information' is an uncountable noun. To pluralize it alongside the plural verb 'were', 'pieces of information' must be used.",
        "topic": "Grammatical Concord",
        "difficulty": "standard"
      },
      {
        "q": "Which of the following words rhymes with 'suite'?",
        "options": [
          "suit",
          "sweet",
          "sweat",
          "slate"
        ],
        "answer": 1,
        "explanation": "'Suite' is pronounced /swiːt/, which is phonetically identical to and rhymes with 'sweet'.",
        "topic": "Oral English - Rhyme",
        "difficulty": "hard"
      },
      {
        "q": "Choose the correct phrasal verb to complete the sentence.\n\nBecause of the sudden downpour, the match referees had to _____ the final round.",
        "options": [
          "put off",
          "put out",
          "put up",
          "put away"
        ],
        "answer": 0,
        "explanation": "'Put off' means to postpone or delay an event.",
        "topic": "Phrasal Verbs",
        "difficulty": "easy"
      },
      {
        "q": "Choose the option that best completes the sentence.\n\nBy the time the medical rescue crew arrived, the victim _____ a significant amount of blood.",
        "options": [
          "lost",
          "has lost",
          "had lost",
          "is losing"
        ],
        "answer": 2,
        "explanation": "When expressing an action completed before another action in the past ('arrived'), the past perfect tense ('had lost') is used.",
        "topic": "Tenses",
        "difficulty": "standard"
      },
      {
        "q": "Select the correct term to complete the sentence in legal register.\n\nThe magistrate granted the defendant _____ set at two million naira with two sureties in like sum.",
        "options": [
          "parole",
          "bail",
          "pardon",
          "acquittal"
        ],
        "answer": 1,
        "explanation": "In legal register, temporary release of an accused person awaiting trial upon security given is called 'bail'.",
        "topic": "Lexis and Register",
        "difficulty": "easy"
      },
      {
        "q": "Choose the option that best completes the sentence.\n\nMany a candidate _____ failed this exam due to poor time management.",
        "options": [
          "have",
          "has",
          "are",
          "were"
        ],
        "answer": 1,
        "explanation": "The structure 'many a' takes a singular countable noun ('candidate') and requires a singular verb ('has').",
        "topic": "Grammatical Concord",
        "difficulty": "hard"
      },
      {
        "q": "In which of the following words is the letter 'k' silent?",
        "options": [
          "Kick",
          "Knowledge",
          "Kettle",
          "Skin"
        ],
        "answer": 1,
        "explanation": "In the word 'knowledge', the initial 'k' followed by 'n' is silent (/ˈnɒl.ɪdʒ/).",
        "topic": "Oral English - Silent Letters",
        "difficulty": "easy"
      }
    ]
  },
  {
    "subject": "Mathematics",
    "board": "jamb",
    "questions": [
      {
        "q": "Evaluate $\\log_2 32 + \\log_3 81 - \\log_5 125$.",
        "options": [
          "4",
          "5",
          "6",
          "7"
        ],
        "answer": 2,
        "explanation": "Using logarithm properties, $\\log_2 32 = 5$, $\\log_3 81 = 4$, and $\\log_5 125 = 3$. Therefore, $5 + 4 - 3 = 6$.",
        "topic": "Logarithms",
        "difficulty": "standard"
      },
      {
        "q": "Simplify $\\sqrt{75} - \\sqrt{12} + \\sqrt{27}$.",
        "options": [
          "$4\\sqrt{3}$",
          "$5\\sqrt{3}$",
          "$6\\sqrt{3}$",
          "$7\\sqrt{3}$"
        ],
        "answer": 2,
        "explanation": "Expressing each in basic surd form gives $5\\sqrt{3} - 2\\sqrt{3} + 3\\sqrt{3} = (5 - 2 + 3)\\sqrt{3} = 6\\sqrt{3}$.",
        "topic": "Surds",
        "difficulty": "easy"
      },
      {
        "q": "A binary operation $\\odot$ on the set of real numbers is defined by $a \\odot b = a + b - ab$. Find the identity element $e$ of this operation.",
        "options": [
          "0",
          "1",
          "-1",
          "2"
        ],
        "answer": 0,
        "explanation": "For identity element $e$, $a \\odot e = a$. So $a + e - ae = a \\implies e(1 - a) = 0 \\implies e = 0$.",
        "topic": "Binary Operations",
        "difficulty": "standard"
      },
      {
        "q": "In a class of 40 students, 25 study Physics, 20 study Chemistry, and 8 study neither subject. How many students study both Physics and Chemistry?",
        "options": [
          "10",
          "12",
          "13",
          "15"
        ],
        "answer": 2,
        "explanation": "The total number of students studying at least one subject is $40 - 8 = 32$. Using $n(P \\cup C) = n(P) + n(C) - n(P \\cap C)$, we get $32 = 25 + 20 - x \\implies x = 45 - 32 = 13$.",
        "topic": "Set Theory",
        "difficulty": "standard"
      },
      {
        "q": "Find the smallest positive integer $x$ satisfying $3x \\equiv 4 \\pmod 5$.",
        "options": [
          "1",
          "2",
          "3",
          "4"
        ],
        "answer": 2,
        "explanation": "Testing values for $x$: $3(1) = 3 \\equiv 3 \\pmod 5$, $3(2) = 6 \\equiv 1 \\pmod 5$, $3(3) = 9 \\equiv 4 \\pmod 5$. Thus, $x = 3$.",
        "topic": "Modular Arithmetic",
        "difficulty": "easy"
      },
      {
        "q": "If $\\alpha$ and $\\beta$ are the roots of the equation $2x^2 - 5x + 3 = 0$, find the value of $\\frac{1}{\\alpha} + \\frac{1}{\\beta}$.",
        "options": [
          "$\\frac{3}{5}$",
          "$\\frac{5}{3}$",
          "$\\frac{2}{5}$",
          "$\\frac{5}{2}$"
        ],
        "answer": 1,
        "explanation": "From the quadratic equation, $\\alpha + \\beta = \\frac{5}{2}$ and $\\alpha\\beta = \\frac{3}{2}$. Hence, $\\frac{1}{\\alpha} + \\frac{1}{\\beta} = \\frac{\\alpha + \\beta}{\\alpha\\beta} = \\frac{5/2}{3/2} = \\frac{5}{3}$.",
        "topic": "Quadratic Equations",
        "difficulty": "standard"
      },
      {
        "q": "Find the remainder when $f(x) = 2x^3 - 3x^2 + x - 5$ is divided by $x - 2$.",
        "options": [
          "-1",
          "1",
          "3",
          "5"
        ],
        "answer": 1,
        "explanation": "By the Remainder Theorem, remainder $R = f(2) = 2(2)^3 - 3(2)^2 + (2) - 5 = 16 - 12 + 2 - 5 = 1$.",
        "topic": "Polynomials",
        "difficulty": "standard"
      },
      {
        "q": "$y$ varies inversely as the square of $x$. If $y = 4$ when $x = 3$, find $y$ when $x = 6$.",
        "options": [
          "1",
          "2",
          "4",
          "9"
        ],
        "answer": 0,
        "explanation": "$y = \\frac{k}{x^2} \\implies 4 = \\frac{k}{3^2} \\implies k = 36$. When $x = 6$, $y = \\frac{36}{6^2} = \\frac{36}{36} = 1$.",
        "topic": "Variation",
        "difficulty": "easy"
      },
      {
        "q": "The 4th and 8th terms of an Arithmetic Progression (AP) are 11 and 23 respectively. Find the first term of the progression.",
        "options": [
          "1",
          "2",
          "3",
          "5"
        ],
        "answer": 1,
        "explanation": "$a + 3d = 11$ and $a + 7d = 23$. Subtracting gives $4d = 12 \\implies d = 3$. Substituting $d = 3$ into the first equation: $a + 3(3) = 11 \\implies a = 2$.",
        "topic": "Sequences and Series",
        "difficulty": "standard"
      },
      {
        "q": "Find the sum to infinity of the geometric series $12 + 4 + \\frac{4}{3} + \\dots$",
        "options": [
          "16",
          "18",
          "20",
          "24"
        ],
        "answer": 1,
        "explanation": "Here $a = 12$ and common ratio $r = \\frac{4}{12} = \\frac{1}{3}$. Using $S_\\infty = \\frac{a}{1 - r}$, $S_\\infty = \\frac{12}{1 - 1/3} = \\frac{12}{2/3} = 18$.",
        "topic": "Sequences and Series",
        "difficulty": "hard"
      },
      {
        "q": "Find the determinant of the matrix $A = \\begin{pmatrix} 3 & -1 \\\\ 4 & 2 \\end{pmatrix}$.",
        "options": [
          "2",
          "6",
          "10",
          "14"
        ],
        "answer": 2,
        "explanation": "$\\det(A) = (3)(2) - (-1)(4) = 6 - (-4) = 10$.",
        "topic": "Matrices",
        "difficulty": "standard"
      },
      {
        "q": "If $\\tan \\theta = \\frac{3}{4}$ and $\\theta$ is an acute angle, find the value of \\cos \\theta + \\sin \\theta.",
        "options": [
          "$\\frac{5}{7}$",
          "$\\frac{7}{5}$",
          "$\\frac{1}{5}$",
          "$\\frac{6}{5}$"
        ],
        "answer": 1,
        "explanation": "Constructing a right-angled triangle with opposite = 3 and adjacent = 4, hypotenuse = $\\sqrt{3^2 + 4^2} = 5$. Thus $\\sin \\theta = \\frac{3}{5}$ and $\\cos \\theta = \\frac{4}{5}$, giving $\\cos \\theta + \\sin \\theta = \\frac{4}{5} + \\frac{3}{5} = \\frac{7}{5}$.",
        "topic": "Trigonometry",
        "difficulty": "standard"
      },
      {
        "q": "Find the gradient of the line perpendicular to the line passing through points $(2, 5)$ and $(6, 13)$.",
        "options": [
          "2",
          "-2",
          "$\\frac{1}{2}$",
          "$-\\frac{1}{2}$"
        ],
        "answer": 3,
        "explanation": "The gradient of the given line is $m_1 = \\frac{13 - 5}{6 - 2} = \\frac{8}{4} = 2$. The perpendicular gradient $m_2 = -\\frac{1}{m_1} = -\\frac{1}{2}$.",
        "topic": "Coordinate Geometry",
        "difficulty": "standard"
      },
      {
        "q": "Find the derivative of $y = (3x^2 - 5)^4$ with respect to $x$.",
        "options": [
          "$12x(3x^2 - 5)^3$",
          "$24x(3x^2 - 5)^3$",
          "$6x(3x^2 - 5)^3$",
          "$24x^2(3x^2 - 5)^3$"
        ],
        "answer": 1,
        "explanation": "Using the chain rule, $\\frac{dy}{dx} = 4(3x^2 - 5)^3 \\cdot \\frac{d}{dx}(3x^2 - 5) = 4(3x^2 - 5)^3 \\cdot (6x) = 24x(3x^2 - 5)^3$.",
        "topic": "Differentiation",
        "difficulty": "standard"
      },
      {
        "q": "Evaluate $\\int_1^3 (3x^2 - 2x + 1) \\, dx$.",
        "options": [
          "18",
          "19",
          "20",
          "22"
        ],
        "answer": 2,
        "explanation": "$\\int_1^3 (3x^2 - 2x + 1) \\, dx = [x^3 - x^2 + x]_1^3 = (3^3 - 3^2 + 3) - (1^3 - 1^2 + 1) = (27 - 9 + 3) - (1) = 21 - 1 = 20$.",
        "topic": "Integration",
        "difficulty": "standard"
      },
      {
        "q": "In a circle with centre $O$, an arc subtends an angle of $120^\\circ$ at the centre. If the radius is $21\\text{ cm}$, calculate the length of the arc. (Take $\\pi = \\frac{22}{7}$).",
        "options": [
          "22 cm",
          "44 cm",
          "66 cm",
          "88 cm"
        ],
        "answer": 1,
        "explanation": "Length of arc $L = \\frac{\\theta}{360^\\circ} \\times 2\\pi r = \\frac{120}{360} \\times 2 \\times \\frac{22}{7} \\times 21 = \\frac{1}{3} \\times 2 \\times 22 \\times 3 = 44\\text{ cm}$.",
        "topic": "Circle Geometry",
        "difficulty": "standard"
      },
      {
        "q": "Two fair dice are rolled together. What is the probability of obtaining a total sum of 8?",
        "options": [
          "$\\frac{1}{6}$",
          "$\\frac{5}{36}$",
          "$\\frac{1}{9}$",
          "$\\frac{7}{36}$"
        ],
        "answer": 1,
        "explanation": "Total sample space size = 36. Favourable outcomes for a sum of 8 are (2,6), (3,5), (4,4), (5,3), and (6,2), giving 5 outcomes. Probability = $\\frac{5}{36}$.",
        "topic": "Probability",
        "difficulty": "easy"
      },
      {
        "q": "The mean of five numbers $4, 7, x, 12, 15$ is $10$. Find the value of $x$.",
        "options": [
          "8",
          "10",
          "12",
          "14"
        ],
        "answer": 2,
        "explanation": "Mean = $\\frac{4 + 7 + x + 12 + 15}{5} = 10 \\implies \\frac{38 + x}{5} = 10 \\implies 38 + x = 50 \\implies x = 12$.",
        "topic": "Statistics",
        "difficulty": "standard"
      },
      {
        "q": "Given vectors $\\vec{a} = 3\\mathbf{i} + 4\\mathbf{j}$ and $\\vec{b} = \\mathbf{i} - 2\\mathbf{j}$, calculate the magnitude of $\\vec{a} + 2\\vec{b}$.",
        "options": [
          "5",
          "$\\sqrt{29}$",
          "13",
          "7"
        ],
        "answer": 0,
        "explanation": "$\\vec{a} + 2\\vec{b} = (3\\mathbf{i} + 4\\mathbf{j}) + 2(\\mathbf{i} - 2\\mathbf{j}) = 5\\mathbf{i} + 0\\mathbf{j}$. The magnitude is $\\sqrt{5^2 + 0^2} = 5$.",
        "topic": "Vectors",
        "difficulty": "standard"
      },
      {
        "q": "A solid cylinder has a radius of $7\\text{ cm}$ and a height of $10\\text{ cm}$. Find its total surface area. (Take $\\pi = \\frac{22}{7}$).",
        "options": [
          "440 cm²",
          "616 cm²",
          "748 cm²",
          "880 cm²"
        ],
        "answer": 2,
        "explanation": "Total surface area $A = 2\\pi r(r + h) = 2 \\times \\frac{22}{7} \\times 7 \\times (7 + 10) = 44 \\times 17 = 748\\text{ cm}^2$.",
        "topic": "Mensuration",
        "difficulty": "hard"
      }
    ]
  },
  {
    "subject": "Physics",
    "board": "jamb",
    "questions": [
      {
        "q": "A body starts from rest and accelerates uniformly at 2.0 m/s² for 5.0 seconds. Calculate the total distance covered by the body during this period.",
        "options": [
          "10 m",
          "25 m",
          "50 m",
          "100 m"
        ],
        "answer": 1,
        "explanation": "Using the equation of motion s = ut + 0.5at², where u = 0 m/s, a = 2.0 m/s², and t = 5.0 s: s = 0 + 0.5 × 2.0 × (5.0)² = 25 m.",
        "topic": "Kinematics",
        "difficulty": "easy"
      },
      {
        "q": "An electric motor lifts a load of mass 50 kg vertically through a height of 12 m in 10 seconds. Calculate the useful power output of the motor. (Take g = 10 m/s²)",
        "options": [
          "600 W",
          "500 W",
          "120 W",
          "60 W"
        ],
        "answer": 0,
        "explanation": "Work done W = mgh = 50 × 10 × 12 = 6000 J. Power P = W / t = 6000 / 10 = 600 W.",
        "topic": "Work, Energy, and Power",
        "difficulty": "standard"
      },
      {
        "q": "A brass rod has an initial length of 100 cm at 20°C. If the linear expansivity of brass is 1.9 × 10⁻⁵ K⁻¹, determine its increase in length when heated to 70°C.",
        "options": [
          "0.0095 cm",
          "0.095 cm",
          "0.95 cm",
          "9.5 cm"
        ],
        "answer": 1,
        "explanation": "Expansion ΔL = L₀ × α × ΔT = 100 × (1.9 × 10⁻⁵) × (70 - 20) = 100 × (1.9 × 10⁻⁵) × 50 = 0.095 cm.",
        "topic": "Thermal Expansion",
        "difficulty": "standard"
      },
      {
        "q": "A fixed mass of gas occupies a volume of 3.0 m³ at 27°C. If the gas is compressed at constant pressure to a volume of 1.0 m³, what will be its new temperature in Kelvin?",
        "options": [
          "900 K",
          "300 K",
          "100 K",
          "90 K"
        ],
        "answer": 2,
        "explanation": "By Charles's Law at constant pressure, V₁/T₁ = V₂/T₂. T₁ = 27 + 273 = 300 K. 3.0 / 300 = 1.0 / T₂, which gives T₂ = 100 K.",
        "topic": "Gas Laws",
        "difficulty": "standard"
      },
      {
        "q": "A light ray travels from glass (refractive index = 1.50) towards air. What is the critical angle for the glass-air interface?",
        "options": [
          "41.8°",
          "48.6°",
          "30.0°",
          "60.0°"
        ],
        "answer": 0,
        "explanation": "The critical angle c is given by sin(c) = 1 / n = 1 / 1.50 = 0.6667. Taking the inverse sine: c = sin⁻¹(0.6667) ≈ 41.8°.",
        "topic": "Refraction of Light",
        "difficulty": "standard"
      },
      {
        "q": "A progressive wave is described by the equation y = 0.05 sin(200πt - 0.5πx), where x and y are in meters and t is in seconds. Calculate the wave speed.",
        "options": [
          "100 m/s",
          "200 m/s",
          "400 m/s",
          "800 m/s"
        ],
        "answer": 2,
        "explanation": "Comparing with the standard wave equation y = A sin(ωt - kx), angular frequency ω = 200π rad/s and wave number k = 0.5π rad/m. Wave speed v = ω / k = (200π) / (0.5π) = 400 m/s.",
        "topic": "Waves",
        "difficulty": "hard"
      },
      {
        "q": "Three resistors of resistances 2 Ω, 3 Ω, and 6 Ω are connected in parallel across a circuit. What is their combined equivalent resistance?",
        "options": [
          "11 Ω",
          "6 Ω",
          "2 Ω",
          "1 Ω"
        ],
        "answer": 3,
        "explanation": "For parallel combination: 1/R_eq = 1/2 + 1/3 + 1/6 = 3/6 + 2/6 + 1/6 = 6/6 = 1 Ω⁻¹. Therefore, R_eq = 1 Ω.",
        "topic": "Current Electricity",
        "difficulty": "easy"
      },
      {
        "q": "Two point charges of +4 μC and +9 μC are separated by a distance of 0.3 m in free space. Calculate the magnitude of the electrostatic force between them. (Take Coulomb constant k = 9.0 × 10⁹ N m²/C²)",
        "options": [
          "0.36 N",
          "3.6 N",
          "36 N",
          "360 N"
        ],
        "answer": 1,
        "explanation": "By Coulomb's law, F = (k × q₁ × q₂) / r² = (9.0 × 10⁹ × 4 × 10⁻⁶ × 9 × 10⁻⁶) / (0.3)² = (0.324) / 0.09 = 3.6 N.",
        "topic": "Electrostatics",
        "difficulty": "standard"
      },
      {
        "q": "An ideal step-down transformer has 500 turns on its primary coil and 50 turns on its secondary coil. If an alternating voltage of 220 V is applied across the primary, what is the output voltage at the secondary?",
        "options": [
          "2200 V",
          "110 V",
          "44 V",
          "22 V"
        ],
        "answer": 3,
        "explanation": "Transformer ratio: V_s / V_p = N_s / N_p ⇒ V_s = 220 × (50 / 500) = 22 V.",
        "topic": "Electromagnetic Induction",
        "difficulty": "easy"
      },
      {
        "q": "A radioactive isotope has a half-life of 4 days. What fraction of the original sample remains undecayed after 16 days?",
        "options": [
          "1/4",
          "1/8",
          "1/16",
          "1/32"
        ],
        "answer": 2,
        "explanation": "Number of half-lives n = 16 / 4 = 4. The remaining fraction is (1/2)⁴ = 1/16.",
        "topic": "Radioactivity",
        "difficulty": "standard"
      },
      {
        "q": "The work function of a certain metal is 3.2 × 10⁻¹⁹ J. Calculate the threshold frequency required for photoelectric emission from this metal. (Take Planck's constant h = 6.63 × 10⁻³⁴ J s)",
        "options": [
          "4.83 × 10¹⁴ Hz",
          "2.12 × 10¹⁴ Hz",
          "1.54 × 10¹⁵ Hz",
          "6.63 × 10¹⁴ Hz"
        ],
        "answer": 0,
        "explanation": "Work function W₀ = h × f₀, so threshold frequency f₀ = W₀ / h = (3.2 × 10⁻¹⁹ J) / (6.63 × 10⁻³⁴ J s) ≈ 4.83 × 10¹⁴ Hz.",
        "topic": "Atomic and Quantum Physics",
        "difficulty": "standard"
      },
      {
        "q": "A car of mass 1000 kg travels round a flat, unbanked circular curve of radius 50 m at a uniform speed of 20 m/s. Calculate the centripetal force acting on the car.",
        "options": [
          "400 N",
          "2000 N",
          "8000 N",
          "10000 N"
        ],
        "answer": 2,
        "explanation": "Centripetal force F = (m × v²) / r = (1000 × 20²) / 50 = (1000 × 400) / 50 = 8000 N.",
        "topic": "Circular Motion",
        "difficulty": "standard"
      },
      {
        "q": "A simple pendulum executes simple harmonic motion with a period of 2.0 s at a location where acceleration due to gravity g = 9.8 m/s². What is the approximate length of the pendulum?",
        "options": [
          "0.25 m",
          "0.50 m",
          "0.99 m",
          "1.98 m"
        ],
        "answer": 2,
        "explanation": "Period T = 2π √(L/g) ⇒ T² = 4π²L / g ⇒ L = (g × T²) / (4π²) = (9.8 × 4) / (4 × 9.87) ≈ 0.99 m.",
        "topic": "Simple Harmonic Motion",
        "difficulty": "standard"
      },
      {
        "q": "A solid block of uniform material with a density of 800 kg/m³ floats freely in water (density = 1000 kg/m³). What fraction of the block's total volume is submerged under water?",
        "options": [
          "1/5",
          "2/5",
          "3/5",
          "4/5"
        ],
        "answer": 3,
        "explanation": "By the law of floatation, fraction submerged = density of solid / density of fluid = 800 / 1000 = 0.8 = 4/5.",
        "topic": "Fluids at Rest",
        "difficulty": "standard"
      },
      {
        "q": "An object is placed 15 cm in front of a thin converging lens of focal length 10 cm. Find the distance of the image formed from the lens and describe its nature.",
        "options": [
          "30 cm, real",
          "30 cm, virtual",
          "6 cm, real",
          "6 cm, virtual"
        ],
        "answer": 0,
        "explanation": "Lens formula: 1/f = 1/u + 1/v ⇒ 1/10 = 1/15 + 1/v ⇒ 1/v = 1/10 - 1/15 = 1/30. Thus v = +30 cm. A positive image distance indicates a real image.",
        "topic": "Lenses",
        "difficulty": "standard"
      },
      {
        "q": "An open organ pipe has a length of 0.85 m. Given that the speed of sound in air is 340 m/s, determine the fundamental frequency produced by the pipe.",
        "options": [
          "100 Hz",
          "200 Hz",
          "400 Hz",
          "680 Hz"
        ],
        "answer": 1,
        "explanation": "For an open organ pipe, the fundamental wavelength λ = 2L = 2 × 0.85 = 1.7 m. Fundamental frequency f = v / λ = 340 / 1.7 = 200 Hz.",
        "topic": "Sound Waves",
        "difficulty": "standard"
      },
      {
        "q": "A galvanometer has an internal resistance of 50 Ω and gives a full-scale deflection for a current of 2.0 mA. What value of multiplier resistor is required to convert it into a voltmeter measuring up to 10 V?",
        "options": [
          "4950 Ω",
          "5000 Ω",
          "5050 Ω",
          "4.95 Ω"
        ],
        "answer": 0,
        "explanation": "Total resistance R_total = V / I_g = 10 / 0.002 = 5000 Ω. Multiplier resistance R_m = R_total - R_g = 5000 - 50 = 4950 Ω.",
        "topic": "Measuring Instruments",
        "difficulty": "hard"
      },
      {
        "q": "An electric immersion heater rated at 1000 W is used to heat 2.0 kg of water from 25°C to 75°C. Assuming zero heat loss to surroundings, how long does this process take? (Specific heat capacity of water = 4200 J kg⁻¹ K⁻¹)",
        "options": [
          "210 s",
          "420 s",
          "840 s",
          "105 s"
        ],
        "answer": 1,
        "explanation": "Heat required Q = mcΔT = 2.0 × 4200 × (75 - 25) = 420,000 J. Time t = Q / P = 420,000 / 1000 = 420 s.",
        "topic": "Quantity of Heat",
        "difficulty": "standard"
      },
      {
        "q": "Two coplanar forces of magnitudes 6 N and 8 N act on a body at right angles to each other. Calculate the magnitude of their resultant force.",
        "options": [
          "2 N",
          "10 N",
          "14 N",
          "48 N"
        ],
        "answer": 1,
        "explanation": "Since the forces act at 90°, the resultant R = √(F₁² + F₂²) = √(6² + 8²) = √(36 + 64) = √100 = 10 N.",
        "topic": "Vectors and Equilibrium",
        "difficulty": "easy"
      },
      {
        "q": "When a pure intrinsic semiconductor is doped with a small amount of a trivalent element such as Boron, what type of material is produced?",
        "options": [
          "n-type semiconductor",
          "p-type semiconductor",
          "Insulator",
          "Superconductor"
        ],
        "answer": 1,
        "explanation": "Doping intrinsic semiconductors with trivalent impurities (3 valence electrons) creates an excess of mobile positive charge carriers (holes), forming a p-type semiconductor.",
        "topic": "Semiconductor Physics",
        "difficulty": "easy"
      }
    ]
  },
  {
    "subject": "Chemistry",
    "board": "jamb",
    "questions": [
      {
        "q": "Calculate the volume of carbon (IV) oxide gas evolved at s.t.p. when 10.0 g of pure calcium trioxocarbonate (IV) is completely decomposed by heat. [Ca = 40, C = 12, O = 16, Molar volume of gas at s.t.p. = 22.4 dm³ mol⁻¹]",
        "options": [
          "1.12 dm³",
          "2.24 dm³",
          "4.48 dm³",
          "22.40 dm³"
        ],
        "answer": 1,
        "explanation": "The decomposition reaction is CaCO₃(s) → CaO(s) + CO₂(g). Molar mass of CaCO₃ = 40 + 12 + (3 × 16) = 100 g mol⁻¹. Moles of CaCO₃ = 10.0 / 100 = 0.10 mol. Since the mole ratio of CaCO₃ to CO₂ is 1:1, 0.10 mol of CO₂ is produced. Volume of CO₂ at s.t.p. = 0.10 mol × 22.4 dm³ mol⁻¹ = 2.24 dm³.",
        "topic": "Stoichiometry and Gas Calculations",
        "difficulty": "standard"
      },
      {
        "q": "Which of the following represents the correct ground-state electronic configuration of a neutral copper atom (atomic number Z = 29)?",
        "options": [
          "1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d⁹",
          "1s² 2s² 2p⁶ 3s² 3p⁶ 4s¹ 3d¹⁰",
          "1s² 2s² 2p⁶ 3s² 3p⁶ 4s⁰ 3d¹⁰",
          "1s² 2s² 2p⁶ 3s² 3p⁵ 4s² 3d¹⁰"
        ],
        "answer": 1,
        "explanation": "Copper exhibits an anomalous electronic configuration due to the extra stability associated with a completely filled d-subshell. An electron from the 4s orbital is promoted to the 3d orbital, giving [Ar] 4s¹ 3d¹⁰ instead of 4s² 3d⁹.",
        "topic": "Atomic Structure",
        "difficulty": "easy"
      },
      {
        "q": "What is the molecular geometry and approximate bond angle around the central atom in an ammonia molecule (NH₃)?",
        "options": [
          "Trigonal planar, 120°",
          "Tetrahedral, 109.5°",
          "Trigonal pyramidal, 107°",
          "Linear, 180°"
        ],
        "answer": 2,
        "explanation": "Ammonia has four electron pairs (three bonding pairs and one lone pair) around the central nitrogen atom. The repulsion between the lone pair and bonding pairs distorts the tetrahedral shape into a trigonal pyramidal geometry with a bond angle reduced from 109.5° to approximately 107°.",
        "topic": "Chemical Bonding",
        "difficulty": "standard"
      },
      {
        "q": "Calculate the pH of a 0.005 mol dm⁻³ solution of tetraoxosulphate (VI) acid (H₂SO₄), assuming complete ionization.",
        "options": [
          "1.0",
          "2.0",
          "2.3",
          "3.0"
        ],
        "answer": 1,
        "explanation": "H₂SO₄ is a diprotic acid that ionizes completely: H₂SO₄ → 2H⁺ + SO₄²⁻. Thus, [H⁺] = 2 × 0.005 mol dm⁻³ = 0.01 mol dm⁻³ (10⁻² mol dm⁻³). pH = -log₁₀[H⁺] = -log₁₀(10⁻²) = 2.0.",
        "topic": "Acids, Bases, and pH",
        "difficulty": "standard"
      },
      {
        "q": "How many coulombs of electricity are required to deposit 0.64 g of copper metal during the electrolysis of aqueous copper (II) tetraoxosulphate (VI)? [Cu = 64, Faraday constant F = 96,500 C mol⁻¹]",
        "options": [
          "965 C",
          "1930 C",
          "3860 C",
          "9650 C"
        ],
        "answer": 1,
        "explanation": "The discharge reaction is Cu²⁺ + 2e⁻ → Cu. Depositing 1 mole (64 g) of Cu requires 2 Faradays of electricity (2 × 96500 C = 193,000 C). Moles of Cu deposited = 0.64 / 64 = 0.01 mol. Quantity of electricity Q = 0.01 mol × 2 × 96,500 C mol⁻¹ = 1,930 C.",
        "topic": "Electrochemistry",
        "difficulty": "hard"
      },
      {
        "q": "For the reversible gas-phase reaction N₂O₄(g) ⇌ 2NO₂(g) (ΔH = +57.2 kJ mol⁻¹), which condition will shift the equilibrium position to the right to produce more NO₂?",
        "options": [
          "Decreasing the reaction temperature",
          "Increasing the total system pressure",
          "Increasing the reaction temperature",
          "Adding a platinum catalyst"
        ],
        "answer": 2,
        "explanation": "The forward reaction is endothermic (ΔH > 0). According to Le Chatelier's principle, increasing the temperature favours the endothermic direction to absorb excess heat, shifting equilibrium to the right and increasing the yield of NO₂.",
        "topic": "Chemical Equilibrium",
        "difficulty": "standard"
      },
      {
        "q": "Given the following standard enthalpy changes of combustion: ΔH_c°[C(s)] = -394 kJ mol⁻¹, ΔH_c°[H₂(g)] = -286 kJ mol⁻¹, and ΔH_c°[CH₄(g)] = -890 kJ mol⁻¹. Calculate the standard enthalpy of formation of methane (CH₄).",
        "options": [
          "-76 kJ mol⁻¹",
          "+76 kJ mol⁻¹",
          "-210 kJ mol⁻¹",
          "+210 kJ mol⁻¹"
        ],
        "answer": 0,
        "explanation": "Formation equation: C(s) + 2H₂(g) → CH₄(g). Using Hess's law: ΔH_f°(CH₄) = ΔH_c°(C) + 2ΔH_c°(H₂) - ΔH_c°(CH₄) = (-394) + 2(-286) - (-890) = -394 - 572 + 890 = -76 kJ mol⁻¹.",
        "topic": "Chemical Energetics",
        "difficulty": "hard"
      },
      {
        "q": "Which separation technique depends directly on differences in the partition or distribution coefficients of solutes between a stationary phase and a mobile phase?",
        "options": [
          "Fractional crystallization",
          "Chromatography",
          "Sublimation",
          "Filtration"
        ],
        "answer": 1,
        "explanation": "Chromatography separates mixtures based on the differential partitioning of components between a stationary phase (e.g., paper, silica) and a mobile phase (e.g., solvent, gas).",
        "topic": "Separation Techniques",
        "difficulty": "easy"
      },
      {
        "q": "Which chemical reagent can be used to distinguish terminal alkynes like ethyne from alkanes like ethane?",
        "options": [
          "Acidified potassium dichromate (VI)",
          "Ammoniacal silver trioxonitrate (V)",
          "Concentrated tetraoxosulphate (VI) acid",
          "Cold dilute sodium hydroxide solution"
        ],
        "answer": 1,
        "explanation": "Ethyne contains acidic terminal hydrogen atoms and reacts with ammoniacal silver trioxonitrate (V) solution (Tollens' reagent) to form a characteristic white precipitate of silver dicarbide (Ag₂C₂). Ethane does not react.",
        "topic": "Organic Chemistry",
        "difficulty": "easy"
      },
      {
        "q": "Across Period 3 of the Periodic Table (from Sodium to Argon), the first ionization energy generally increases primarily due to an increase in:",
        "options": [
          "atomic radius",
          "inner-shell shielding effect",
          "effective nuclear charge",
          "number of principal energy levels"
        ],
        "answer": 2,
        "explanation": "Across a period, protons are added to the nucleus while electrons fill the same principal energy level. This increases the effective nuclear charge, pulling valence electrons tighter to the nucleus and requiring more energy to remove an electron.",
        "topic": "Periodic Table Trends",
        "difficulty": "standard"
      },
      {
        "q": "In the industrial extraction of aluminium metal by the electrolysis of purified alumina (Al₂O₃), molten cryolite (Na₃AlF₆) is added to:",
        "options": [
          "prevent the oxidation of carbon anodes",
          "act as a reducing agent for alumina",
          "lower the melting point of alumina and enhance electrical conductivity",
          "precipitate out iron oxide impurities"
        ],
        "answer": 2,
        "explanation": "Pure alumina has a very high melting point (~2072 °C), making electrolysis costly. Adding molten cryolite lowers the operating temperature to around 950 °C and improves the ionic conductivity of the electrolyte.",
        "topic": "Metals and Extraction",
        "difficulty": "standard"
      },
      {
        "q": "A gaseous compound turns moist red litmus paper blue and produces dense white fumes when brought into contact with a glass rod dipped in concentrated hydrochloric acid. The gas is:",
        "options": [
          "sulphur (IV) oxide",
          "ammonia",
          "chlorine",
          "carbon (II) oxide"
        ],
        "answer": 1,
        "explanation": "Ammonia (NH₃) is the only common alkaline gas; it turns red litmus blue. It reacts with HCl gas to form solid ammonium chloride particles, observed as dense white fumes: NH₃(g) + HCl(g) → NH₄Cl(s).",
        "topic": "Non-Metals and Compounds",
        "difficulty": "standard"
      },
      {
        "q": "The reaction between propanoic acid and ethanol in the presence of a few drops of concentrated H₂SO₄ produces an organic product named:",
        "options": [
          "propyl ethanoate",
          "ethyl propanoate",
          "methyl propanoate",
          "ethoxy propane"
        ],
        "answer": 1,
        "explanation": "Esterification of an organic acid and an alcohol names the alkyl group from the alcohol first, followed by the carboxylate from the acid. Ethanol provides the ethyl group, and propanoic acid provides the propanoate group, forming ethyl propanoate.",
        "topic": "Organic Chemistry",
        "difficulty": "standard"
      },
      {
        "q": "Temporary hardness of water is caused by the presence of dissolved:",
        "options": [
          "calcium tetraoxosulphate (VI)",
          "magnesium chloride",
          "calcium hydrogen trioxocarbonate (IV)",
          "sodium trioxocarbonate (IV)"
        ],
        "answer": 2,
        "explanation": "Temporary water hardness is caused by dissolved calcium and magnesium hydrogen trioxocarbonates (IV), such as Ca(HCO₃)₂, which decompose into insoluble trioxocarbonates upon boiling.",
        "topic": "Environmental Chemistry and Water",
        "difficulty": "easy"
      },
      {
        "q": "What is the oxidation number of manganese in the potassium permanganate compound, KMnO₄?",
        "options": [
          "+2",
          "+4",
          "+6",
          "+7"
        ],
        "answer": 3,
        "explanation": "The sum of oxidation numbers in neutral KMnO₄ is zero: (+1 for K) + Mn + 4(-2 for O) = 0 ⇒ +1 + Mn - 8 = 0 ⇒ Mn = +7.",
        "topic": "Redox Reactions",
        "difficulty": "standard"
      },
      {
        "q": "Which of the following synthetic polymers is synthesized via a condensation polymerization reaction?",
        "options": [
          "Polyethene",
          "Terylene (Polyester)",
          "Polystyrene",
          "Polyvinyl chloride (PVC)"
        ],
        "answer": 1,
        "explanation": "Terylene is formed by condensation polymerization between a dicarboxylic acid and a diol, eliminating small water molecules. Polyethene, polystyrene, and PVC are formed by addition polymerization.",
        "topic": "Polymers and Macromolecules",
        "difficulty": "standard"
      },
      {
        "q": "Under identical temperature and pressure conditions, 50 cm³ of methane (CH₄) gas diffuses through a porous membrane in 20 seconds. How long will it take 50 cm³ of sulphur (IV) oxide (SO₂) gas to diffuse through the same membrane? [CH₄ = 16, SO₂ = 64]",
        "options": [
          "10 seconds",
          "20 seconds",
          "40 seconds",
          "80 seconds"
        ],
        "answer": 2,
        "explanation": "According to Graham's law, diffusion time t is directly proportional to the square root of relative molecular mass M: (t₂ / t₁) = √(M₂ / M₁). (t_SO₂ / 20) = √(64 / 16) = √4 = 2. Therefore, t_SO₂ = 20 × 2 = 40 seconds.",
        "topic": "Gas Laws",
        "difficulty": "standard"
      },
      {
        "q": "When a radioactive nucleus undergoes decay by emitting a single beta particle (β⁻), its mass number (A) and atomic number (Z) change such that:",
        "options": [
          "A decreases by 4, Z decreases by 2",
          "A remains unchanged, Z increases by 1",
          "A increases by 1, Z remains unchanged",
          "A remains unchanged, Z decreases by 1"
        ],
        "answer": 1,
        "explanation": "In beta-minus decay, a neutron transforms into a proton and an electron (beta particle). The total mass number A remains constant, while the atomic number Z increases by 1.",
        "topic": "Nuclear Chemistry",
        "difficulty": "easy"
      },
      {
        "q": "The solubility of a salt Y at 30 °C is 0.50 mol dm⁻³. If 250 cm³ of a saturated solution of salt Y at 30 °C is completely evaporated to dryness, what mass of salt Y will be obtained? [Molar mass of Y = 160 g mol⁻¹]",
        "options": [
          "10.0 g",
          "20.0 g",
          "40.0 g",
          "80.0 g"
        ],
        "answer": 1,
        "explanation": "Volume of solution = 250 / 1000 = 0.25 dm³. Moles of salt Y in solution = 0.50 mol dm⁻³ × 0.25 dm³ = 0.125 mol. Mass recovered = moles × molar mass = 0.125 mol × 160 g mol⁻¹ = 20.0 g.",
        "topic": "Solubility and Solutions",
        "difficulty": "hard"
      },
      {
        "q": "An unknown salt solution produces a white precipitate when aqueous sodium hydroxide is added dropwise, which dissolves in excess sodium hydroxide to give a clear solution. When aqueous ammonia is added dropwise to a fresh portion of the salt solution, a white precipitate forms which also dissolves in excess ammonia. The cation present is:",
        "options": [
          "Al³⁺",
          "Ca²⁺",
          "Zn²⁺",
          "Pb²⁺"
        ],
        "answer": 2,
        "explanation": "Zinc ions (Zn²⁺) form a white precipitate of Zn(OH)₂ with NaOH and NH₃. This precipitate is amphoteric and dissolves in excess NaOH to form zincate [Zn(OH)₄]²⁻, and forms a soluble tetraamminezinc complex [Zn(NH₃)₄]²⁺ in excess NH₃. (Al³⁺ and Pb²⁺ precipitates do not dissolve in excess ammonia).",
        "topic": "Qualitative Analysis",
        "difficulty": "standard"
      }
    ]
  },
  {
    "subject": "Biology",
    "board": "jamb",
    "questions": [
      {
        "q": "Which organelle is responsible for synthesizing ATP during aerobic respiration in eukaryotic cells?",
        "options": [
          "Mitochondrion",
          "Ribosome",
          "Lysosome",
          "Endoplasmic reticulum"
        ],
        "answer": 0,
        "explanation": "The mitochondrion is the powerhouse of the cell, where Krebs cycle and oxidative phosphorylation take place to generate ATP aerobically.",
        "topic": "Cell Biology",
        "difficulty": "easy"
      },
      {
        "q": "Transpiration pull in tall plants is primarily maintained by which combination of physical forces?",
        "options": [
          "Root pressure and osmosis",
          "Active transport and gravity",
          "Cohesion, adhesion, and evaporation",
          "Phloem translocation and guttation"
        ],
        "answer": 2,
        "explanation": "Transpiration stream in xylem vessels relies on cohesion between water molecules, adhesion between water and xylem walls, and evaporation at the stomata.",
        "topic": "Transport in Plants",
        "difficulty": "standard"
      },
      {
        "q": "A major characteristic feature of the Southern Guinea Savannah vegetation zone in Nigeria is the presence of:",
        "options": [
          "Dense impenetrable evergreen rainforest canopy",
          "Deciduous trees with fire-resistant bark and tall grasses",
          "Stunted thorny shrubs and desert sand dunes",
          "Mangrove trees with stilt roots and pneumatophores"
        ],
        "answer": 1,
        "explanation": "The Southern Guinea Savannah features open woodland with tall grasses and fire-resistant, broad-leaved deciduous trees adapted to seasonal bushfires.",
        "topic": "Ecology and Biomes",
        "difficulty": "standard"
      },
      {
        "q": "An enzyme functions optimally at pH 2.0 in the human digestive system. This enzyme is most likely involved in the breakdown of:",
        "options": [
          "Starch in the mouth",
          "Fats in the duodenum",
          "Maltose in the ileum",
          "Proteins in the stomach"
        ],
        "answer": 3,
        "explanation": "Pepsin operates in the highly acidic environment of the stomach (pH 1.5–2.0) to convert proteins into peptides.",
        "topic": "Animal Nutrition",
        "difficulty": "standard"
      },
      {
        "q": "During strenuous exercise, anaerobic respiration in human skeletal muscle cells leads to the accumulation of:",
        "options": [
          "Ethanol and carbon dioxide",
          "Lactic acid",
          "Pyruvic acid and oxygen",
          "Urea and uric acid"
        ],
        "answer": 1,
        "explanation": "When oxygen supply is insufficient, pyruvate produced during glycolysis is reduced to lactic acid in human muscle tissue.",
        "topic": "Respiration",
        "difficulty": "easy"
      },
      {
        "q": "In a monohybrid cross between two heterozygous tall pea plants (Tt x Tt), what is the expected phenotypic ratio of tall to dwarf offspring?",
        "options": [
          "3:1",
          "1:1",
          "1:2:1",
          "9:3:3:1"
        ],
        "answer": 0,
        "explanation": "Crossing Tt x Tt yields genotypes TT, Tt, Tt, and tt, resulting in 3 tall (TT, Tt) to 1 dwarf (tt) phenotypically.",
        "topic": "Genetics",
        "difficulty": "standard"
      },
      {
        "q": "Which region of the mammalian nephron is primarily responsible for the selective reabsorption of glucose and amino acids?",
        "options": [
          "Glomerulus",
          "Proximal convoluted tubule",
          "Loop of Henle",
          "Collecting duct"
        ],
        "answer": 1,
        "explanation": "The proximal convoluted tubule actively reabsorbs nearly all filtered glucose, amino acids, and essential ions back into capillaries.",
        "topic": "Excretion and Homeostasis",
        "difficulty": "standard"
      },
      {
        "q": "Epigeal germination is characterized by the:",
        "options": [
          "Hypocotyl remaining below ground while the epicotyl elongates",
          "Elongation of the hypocotyl pushing cotyledons above the ground",
          "Failure of the seed coat to split open during growth",
          "Direct growth of primary roots upward into the air"
        ],
        "answer": 1,
        "explanation": "In epigeal germination (e.g., cowpea), the hypocotyl elongates rapidly and arches, pulling the cotyledons above the soil surface.",
        "topic": "Plant Growth and Reproduction",
        "difficulty": "standard"
      },
      {
        "q": "Which part of the human brain controls posture, balance, and fine muscular coordination?",
        "options": [
          "Cerebrum",
          "Medulla oblongata",
          "Cerebellum",
          "Hypothalamus"
        ],
        "answer": 2,
        "explanation": "The cerebellum coordinates voluntary motor activities, maintains body posture, equilibrium, and balance.",
        "topic": "Nervous Coordination",
        "difficulty": "easy"
      },
      {
        "q": "Hydrophytes such as water hyacinth possess which structural adaptation to aid buoyancy in aquatic environments?",
        "options": [
          "Thick waxy cuticles and sunken stomata",
          "Extensive deep taproot systems",
          "Needle-like leaves to reduce surface area",
          "Aerenchyma tissue with large air spaces"
        ],
        "answer": 3,
        "explanation": "Aerenchyma tissue provides internal air passages and spongy tissues that lower density and enable floating in aquatic plants.",
        "topic": "Ecological Adaptations",
        "difficulty": "standard"
      },
      {
        "q": "Which blood vessel carries oxygenated blood from the lungs directly into the left atrium of the mammalian heart?",
        "options": [
          "Pulmonary vein",
          "Pulmonary artery",
          "Vena cava",
          "Aorta"
        ],
        "answer": 0,
        "explanation": "The pulmonary vein is an exception among veins as it transports oxygenated blood from lungs into the left atrium.",
        "topic": "Transport in Animals",
        "difficulty": "easy"
      },
      {
        "q": "Organisms belonging to the Kingdom Fungi differ from true plants primarily because fungal cell walls are made of:",
        "options": [
          "Cellulose",
          "Peptidoglycan",
          "Chitin",
          "Lignin"
        ],
        "answer": 2,
        "explanation": "Fungal cell walls consist of chitin, whereas plant cell walls are made of cellulose.",
        "topic": "Classification and Microorganisms",
        "difficulty": "standard"
      },
      {
        "q": "The joint present between the atlas and axis vertebrae, which allows nodding and rotation of the head, is classified as a:",
        "options": [
          "Pivot joint",
          "Hinge joint",
          "Ball-and-socket joint",
          "Gliding joint"
        ],
        "answer": 0,
        "explanation": "The atlanto-axial joint is a pivot joint, permitting rotational movement around a central axis.",
        "topic": "Support and Movement",
        "difficulty": "hard"
      },
      {
        "q": "A deficiency of Antidiuretic Hormone (ADH) secreted by the posterior pituitary gland leads to:",
        "options": [
          "Diabetes mellitus",
          "Goitre",
          "Cretinism",
          "Diabetes insipidus"
        ],
        "answer": 3,
        "explanation": "Lack of ADH prevents water reabsorption in renal tubules, producing large volumes of dilute urine, a condition known as diabetes insipidus.",
        "topic": "Hormonal Control",
        "difficulty": "standard"
      },
      {
        "q": "In an ecosystem, energy flow is unidirectional and decreases at higher trophic levels primarily because:",
        "options": [
          "Organisms convert all ingested energy directly into biomass",
          "Energy is lost as metabolic heat, respiration, and unconsumed matter",
          "Decomposers capture all primary solar energy before producers",
          "Herbivores generate their own energy via chemosynthesis"
        ],
        "answer": 1,
        "explanation": "About 90% of energy is dissipated at each trophic level through respiration, movement, body heat, and indigestible waste.",
        "topic": "Ecology and Food Webs",
        "difficulty": "standard"
      },
      {
        "q": "The positive phototropic bending of a plant shoot tip toward light is caused by auxins:",
        "options": [
          "Accumulating on the illuminated side, inhibiting elongation",
          "Migrating to the shaded side, stimulating cell elongation",
          "Moving into root tissues, suppressing shoot development",
          "Breaking down rapidly on the shaded side of the stem"
        ],
        "answer": 1,
        "explanation": "Auxins migrate away from light to the shaded side, causing cells on that side to elongate faster and curve the shoot toward light.",
        "topic": "Plant Growth and Responses",
        "difficulty": "hard"
      },
      {
        "q": "Which embryonic membrane in amniotic eggs acts as a reservoir for metabolic nitrogenous waste and aids gas exchange?",
        "options": [
          "Amnion",
          "Yolk sac",
          "Allantois",
          "Chorion"
        ],
        "answer": 2,
        "explanation": "The allantois collects uric acid waste products in reptile and bird embryos while working with the chorion for respiratory exchange.",
        "topic": "Animal Reproduction",
        "difficulty": "hard"
      },
      {
        "q": "Jean-Baptiste Lamarck's evolutionary mechanism relied heavily on the concept of:",
        "options": [
          "Survival of the fittest through natural selection",
          "Inheritance of acquired characteristics",
          "Random genetic drift in isolated populations",
          "Differential gene mutation rates"
        ],
        "answer": 1,
        "explanation": "Lamarck proposed that features acquired or developed through use and disuse during an organism's lifetime are inherited by offspring.",
        "topic": "Evolution",
        "difficulty": "standard"
      },
      {
        "q": "If a mother with blood group O (genotype ii) gives birth to a child with blood group A (genotype I^A i), what must be true about the father's blood group genotype?",
        "options": [
          "He must carry at least one I^A allele",
          "He must be homozygous ii",
          "He must be homozygous I^B I^B",
          "He must be homozygous I^B i"
        ],
        "answer": 0,
        "explanation": "The mother can only contribute an 'i' allele. Therefore, the child's 'I^A' allele must come from the father, meaning he possesses at least one I^A allele (blood group A or AB).",
        "topic": "Genetics",
        "difficulty": "hard"
      },
      {
        "q": "Which soil type possesses the highest capillary water retention capacity due to its small pore space?",
        "options": [
          "Sandy soil",
          "Loam soil",
          "Gravelly soil",
          "Clay soil"
        ],
        "answer": 3,
        "explanation": "Clay soil has extremely fine particles (<0.002 mm) creating tiny micropores that retain water tightly against gravity via capillarity.",
        "topic": "Ecology and Soil Science",
        "difficulty": "easy"
      }
    ]
  },
  {
    "subject": "Economics",
    "board": "jamb",
    "questions": [
      {
        "q": "A consumer ranks her preferences for spending ₦5,000 as follows: 1st - Buying a textbook, 2nd - Buying a pair of shoes, 3rd - Attending a music concert. What is the opportunity cost of buying the textbook?",
        "options": [
          "The pair of shoes",
          "The music concert",
          "₦5,000 cash",
          "Both the shoes and the concert"
        ],
        "answer": 0,
        "explanation": "Opportunity cost is defined as the next best alternative foregone. Since the pair of shoes was her second choice, it represents the specific alternative sacrificed when she chose the textbook.",
        "topic": "Basic Economic Concepts",
        "difficulty": "standard"
      },
      {
        "q": "An increase in the market price of tea leads to an increase in the demand for coffee. This indicates that tea and coffee are:",
        "options": [
          "complementary goods",
          "substitute goods",
          "inferior goods",
          "giffen goods"
        ],
        "answer": 1,
        "explanation": "Substitute goods have a positive cross-price elasticity of demand; when the price of one good rises, consumers switch to purchasing its substitute, raising demand for the alternative good.",
        "topic": "Price Determination and Elasticity",
        "difficulty": "easy"
      },
      {
        "q": "When the price of a commodity increases from ₦100 to ₦120, the quantity demanded decreases from 50 units to 40 units. What is the price elasticity of demand?",
        "options": [
          "0.5",
          "1.0",
          "1.5",
          "2.0"
        ],
        "answer": 1,
        "explanation": "Percentage change in quantity demanded = ((40 - 50) / 50) * 100 = -20%. Percentage change in price = ((120 - 100) / 100) * 100 = +20%. Elasticity = |-20% / 20%| = 1.0 (Unitary elasticity).",
        "topic": "Elasticity of Demand",
        "difficulty": "standard"
      },
      {
        "q": "A rational consumer maximizes total utility from consuming a commodity at the point where marginal utility is:",
        "options": [
          "at its peak",
          "equal to total utility",
          "zero",
          "negative"
        ],
        "answer": 2,
        "explanation": "Total utility reaches its maximum point when marginal utility (the extra satisfaction from consuming one more unit) drops to zero.",
        "topic": "Theory of Consumer Behaviour",
        "difficulty": "easy"
      },
      {
        "q": "The Law of Diminishing Returns begins to operate in short-run production when:",
        "options": [
          "total product starts to decrease",
          "marginal product begins to decline",
          "average product reaches zero",
          "fixed input costs double"
        ],
        "answer": 1,
        "explanation": "The law of diminishing returns states that as successive units of a variable factor are added to a fixed factor, marginal product will eventually begin to decline.",
        "topic": "Theory of Production",
        "difficulty": "standard"
      },
      {
        "q": "A firm produces 100 units of output with a Total Cost (TC) of ₦800,000. If Total Fixed Cost (TFC) is ₦300,000, what is the Average Variable Cost (AVC) per unit?",
        "options": [
          "₦3,000",
          "₦5,000",
          "₦8,000",
          "₦11,000"
        ],
        "answer": 1,
        "explanation": "Total Variable Cost (TVC) = TC - TFC = ₦800,000 - ₦300,000 = ₦500,000. Average Variable Cost (AVC) = TVC / Quantity = ₦500,000 / 100 = ₦5,000.",
        "topic": "Theory of Costs",
        "difficulty": "hard"
      },
      {
        "q": "Which of the following characteristics distinguishes monopolistic competition from perfect competition?",
        "options": [
          "Presence of many buyers and sellers",
          "Freedom of entry and exit",
          "Product differentiation",
          "Aim of maximizing profits"
        ],
        "answer": 2,
        "explanation": "In perfect competition, products are homogeneous, whereas in monopolistic competition, products are differentiated through branding, packaging, or quality variations.",
        "topic": "Market Structures",
        "difficulty": "standard"
      },
      {
        "q": "The maximum amount of share capital that a company is legally allowed to raise as stated in its Memorandum of Association is known as:",
        "options": [
          "issued capital",
          "called-up capital",
          "paid-up capital",
          "authorized capital"
        ],
        "answer": 3,
        "explanation": "Authorized (or registered/nominal) capital is the maximum limit of capital a firm is licensed by law to issue to shareholders.",
        "topic": "Business Enterprises",
        "difficulty": "easy"
      },
      {
        "q": "Given Gross Domestic Product (GDP) at market prices = ₦500 billion, Net Factor Income from Abroad = -₦20 billion, Indirect Taxes = ₦40 billion, and Subsidies = ₦10 billion. Calculate the Gross National Product (GNP) at market prices.",
        "options": [
          "₦450 billion",
          "₦480 billion",
          "₦520 billion",
          "₦530 billion"
        ],
        "answer": 1,
        "explanation": "GNP at market prices = GDP at market prices + Net Factor Income from Abroad = ₦500 billion + (-₦20 billion) = ₦480 billion.",
        "topic": "National Income Accounting",
        "difficulty": "hard"
      },
      {
        "q": "If the Central Bank of Nigeria sets the Cash Reserve Ratio at 20%, what is the theoretical maximum credit expansion achievable from an initial deposit of ₦100,000 in the banking system?",
        "options": [
          "₦200,000",
          "₦400,000",
          "₦500,000",
          "₦1,000,000"
        ],
        "answer": 2,
        "explanation": "Credit Multiplier = 1 / Cash Reserve Ratio = 1 / 0.20 = 5. Maximum deposit expansion = Initial Deposit * Multiplier = ₦100,000 * 5 = ₦500,000.",
        "topic": "Money and Banking",
        "difficulty": "standard"
      },
      {
        "q": "A tax system in which high-income earners pay a smaller proportion of their income as tax compared to low-income earners is described as:",
        "options": [
          "progressive",
          "proportional",
          "regressive",
          "specific"
        ],
        "answer": 2,
        "explanation": "A regressive tax takes a larger percentage of income from low-income earners than from high-income earners.",
        "topic": "Public Finance",
        "difficulty": "easy"
      },
      {
        "q": "Cost-push inflation is primarily triggered by an increase in:",
        "options": [
          "consumer discretionary spending",
          "the velocity of circulation of money",
          "the prices of raw materials and labor",
          "total government expenditure"
        ],
        "answer": 2,
        "explanation": "Cost-push inflation occurs when production costs increase (e.g., higher wages, expensive imported inputs), driving producers to raise selling prices to maintain profit margins.",
        "topic": "Inflation and Unemployment",
        "difficulty": "standard"
      },
      {
        "q": "If a country's Export Price Index stands at 120 while its Import Price Index is 150, what is its Terms of Trade?",
        "options": [
          "80",
          "125",
          "130",
          "180"
        ],
        "answer": 0,
        "explanation": "Terms of Trade = (Export Price Index / Import Price Index) * 100 = (120 / 150) * 100 = 0.8 * 100 = 80.",
        "topic": "International Trade",
        "difficulty": "standard"
      },
      {
        "q": "A country has 40 million children (0–14 years), 50 million working-age adults (15–64 years), and 10 million elderly people (65+ years). Calculate the dependency ratio.",
        "options": [
          "50%",
          "80%",
          "100%",
          "120%"
        ],
        "answer": 2,
        "explanation": "Dependency Ratio = ((Number of Dependents (0-14 + 65+)) / Working-Age Population (15-64)) * 100 = ((40 million + 10 million) / 50 million) * 100 = (50 / 50) * 100 = 100%.",
        "topic": "Population and Human Resources",
        "difficulty": "hard"
      },
      {
        "q": "In a socialist economy, fundamental economic questions regarding resource allocation are decided mainly by:",
        "options": [
          "the price mechanism",
          "private market operators",
          "the central planning authority",
          "consumer demand forces"
        ],
        "answer": 2,
        "explanation": "In a socialist (command) economy, state agencies or central planning authorities direct production, distribution, and pricing.",
        "topic": "Economic Systems",
        "difficulty": "easy"
      },
      {
        "q": "Which of the following financial instruments is predominantly traded in the money market?",
        "options": [
          "Corporate Debentures",
          "Government Development Stocks",
          "Treasury Bills",
          "Ordinary Shares"
        ],
        "answer": 2,
        "explanation": "Treasury Bills are short-term debt instruments (maturity less than a year) traded in the money market, whereas debentures, stocks, and shares belong to the capital market.",
        "topic": "Financial Institutions and Markets",
        "difficulty": "standard"
      },
      {
        "q": "Which stage of economic integration involves eliminating trade barriers among member nations and adopting a uniform external tariff schedule for non-member nations?",
        "options": [
          "Free Trade Area",
          "Customs Union",
          "Common Market",
          "Economic Union"
        ],
        "answer": 1,
        "explanation": "A Customs Union goes beyond a Free Trade Area by establishing a Common External Tariff (CET) against non-member states.",
        "topic": "International Economic Organizations",
        "difficulty": "standard"
      },
      {
        "q": "The concept of the kinked demand curve in oligopolistic markets is used to explain:",
        "options": [
          "price rigidity",
          "unlimited entry of firms",
          "homogeneous product pricing",
          "perfect factor mobility"
        ],
        "answer": 0,
        "explanation": "The kinked demand curve assumes rivals match price cuts but ignore price increases, leading to price stickiness or rigidity around the kink.",
        "topic": "Market Structures",
        "difficulty": "hard"
      },
      {
        "q": "The traditional land tenure system in Nigeria hampers modern agricultural investment primarily because it causes:",
        "options": [
          "high land fertility",
          "land fragmentation and insecurity of land ownership",
          "over-mechanization of farmlands",
          "unrestricted credit access"
        ],
        "answer": 1,
        "explanation": "Customary land tenure often splits land into tiny, scattered plots across generations, making large-scale mechanized farming difficult and collateralization impossible.",
        "topic": "Agriculture in Nigeria",
        "difficulty": "easy"
      },
      {
        "q": "A budget deficit occurs when government planned:",
        "options": [
          "revenue exceeds planned expenditure",
          "expenditure exceeds planned revenue",
          "exports exceed total imports",
          "borrowing equals tax receipts"
        ],
        "answer": 1,
        "explanation": "A budget deficit is realized when total government expenditures outstrip its total expected revenues within a fiscal year.",
        "topic": "Public Finance",
        "difficulty": "easy"
      }
    ]
  },
  {
    "subject": "Government",
    "board": "jamb",
    "questions": [
      {
        "q": "Internal sovereignty in political science refers to the power of a state to",
        "options": [
          "exercise supreme and absolute authority over its domestic territory and population",
          "defend its territorial borders against foreign aggression and invasion",
          "participate in international conferences without external approval",
          "amend its constitution through executive order without judicial review"
        ],
        "answer": 0,
        "explanation": "Internal sovereignty is the absolute authority of a state to make and enforce laws over all individuals and associations within its geographical borders.",
        "topic": "Basic Concepts in Government",
        "difficulty": "easy"
      },
      {
        "q": "Which of the following is a defining structural characteristic of a unitary system of government?",
        "options": [
          "Dual citizenship for citizens living in regional territories",
          "Supreme political authority concentrated in a single central government",
          "Constitutionally guaranteed sovereignty for sub-national political units",
          "Equal legislative authority shared between central and provincial councils"
        ],
        "answer": 1,
        "explanation": "In a unitary system, power is supreme at the central level; any authority possessed by local or regional bodies is delegated to them by the central government and can be altered or revoked.",
        "topic": "Structures and Types of Government",
        "difficulty": "standard"
      },
      {
        "q": "The 1946 Richards Constitution was historically significant in Nigeria's political development because it",
        "options": [
          "introduced full executive responsibility for Nigerian ministers",
          "established universal adult suffrage across all administrative regions",
          "introduced the official concept of regionalism in Nigerian governance",
          "created a bicameral federal legislature in Lagos"
        ],
        "answer": 2,
        "explanation": "The Richards Constitution created three administrative regions (North, West, and East), establishing the foundations of regionalism in Nigeria's constitutional history.",
        "topic": "Constitutional Development in Nigeria",
        "difficulty": "standard"
      },
      {
        "q": "The traditional political organization of the pre-colonial Igbo society was predominantly structured as",
        "options": [
          "a centralized divine monarchy",
          "a decentralized and acephalous political arrangement",
          "a feudal administrative system headed by territorial emirs",
          "a constitutional monarchy headed by an absolute ruler"
        ],
        "answer": 1,
        "explanation": "Pre-colonial Igbo society lacked a centralized authority or monarch, functioning as a decentralized (acephalous) system governed through village assemblies, elders (Ofo title holders), age grades, and secret societies.",
        "topic": "Pre-Colonial Political Systems in Nigeria",
        "difficulty": "easy"
      },
      {
        "q": "The authority of the judiciary to declare acts of the legislature null and void if they violate the constitution is an application of",
        "options": [
          "executive privilege",
          "delegated legislation",
          "checks and balances",
          "political socialization"
        ],
        "answer": 2,
        "explanation": "Judicial review allows the judicial branch to inspect executive actions and legislative laws, serving as a primary check and balance against constitutional overreach.",
        "topic": "Organs of Government",
        "difficulty": "easy"
      },
      {
        "q": "In a simple majority electoral system (First-Past-The-Post), a candidate is declared elected if they",
        "options": [
          "secure more than fifty percent of the total votes cast",
          "obtain the highest number of valid votes cast among all contestants",
          "win the majority of votes in at least two-thirds of electoral wards",
          "obtain a two-thirds majority of the total votes recorded"
        ],
        "answer": 1,
        "explanation": "Under the simple majority (plurality) system, the candidate who secures the highest count of valid votes wins, regardless of whether they achieve an absolute majority (over 50%).",
        "topic": "Elections and Electoral Processes",
        "difficulty": "standard"
      },
      {
        "q": "A pressure group that emerges spontaneously in response to a sudden crisis or emotional event without organized leadership is classified as an",
        "options": [
          "institutional pressure group",
          "associative pressure group",
          "anomic pressure group",
          "ideological pressure group"
        ],
        "answer": 2,
        "explanation": "Anomic pressure groups form spontaneously during sudden situations of political or social tension (such as riots or demonstrations) and lack organized, permanent leadership structure.",
        "topic": "Political Parties and Pressure Groups",
        "difficulty": "hard"
      },
      {
        "q": "British Indirect Rule encountered severe resistance and administrative difficulties in Eastern Nigeria primarily due to the",
        "options": [
          "dominance of Islamic legal codes in rural areas",
          "creation and imposition of Warrant Chiefs who lacked traditional authority",
          "strong opposition from educated elite political parties in rural villages",
          "refusal of Christian missionaries to support tax collection exercises"
        ],
        "answer": 1,
        "explanation": "Because Eastern Nigeria lacked centralized monarchies, the British created Warrant Chiefs to enforce policy and collect taxes, which led to widespread resentment because these chiefs had no traditional legitimacy among the people.",
        "topic": "Colonial Administration in Nigeria",
        "difficulty": "standard"
      },
      {
        "q": "Federalism was formally introduced as the constitutional structure of government in Nigeria under the",
        "options": [
          "Clifford Constitution of 1922",
          "Macpherson Constitution of 1951",
          "Lyttelton Constitution of 1954",
          "Independence Constitution of 1960"
        ],
        "answer": 2,
        "explanation": "The 1954 Lyttelton Constitution formally established federalism in Nigeria by redistributing powers between the central government and the regional governments via exclusive and concurrent legislative lists.",
        "topic": "Constitutional Development in Nigeria",
        "difficulty": "standard"
      },
      {
        "q": "The primary motivation behind the founding of the Economic Community of West African States (ECOWAS) in 1975 was to",
        "options": [
          "promote economic integration and sub-regional cooperation",
          "form a joint West African standing army for external defense",
          "accelerate total decolonization across Southern Africa",
          "regulate crude oil extraction quotas for member states"
        ],
        "answer": 0,
        "explanation": "ECOWAS was formed in 1975 under the Treaty of Lagos primarily to foster economic cooperation, trade, and regional integration among West African nations.",
        "topic": "International Organizations",
        "difficulty": "easy"
      },
      {
        "q": "The principle of civil service anonymity implies that public servants",
        "options": [
          "are exempt from standard civil litigation and tax laws",
          "can openly campaign for political parties while remaining in office",
          "hold permanent office irrespective of government performance",
          "are protected from public blame or praise for official policies executed on behalf of ministers"
        ],
        "answer": 3,
        "explanation": "Civil service anonymity dictates that political heads (Ministers/Commissioners) take public credit or blame for policy decisions, while civil servants operate behind the scenes without public exposure or political partisanship.",
        "topic": "Public Administration and Civil Service",
        "difficulty": "standard"
      },
      {
        "q": "The concept of 'Afrocentricity' in Nigerian foreign policy dictates that",
        "options": [
          "Nigeria must trade exclusively with African countries",
          "African interests and diplomatic issues receive priority in policy decisions",
          "Nigeria exercises direct colonial oversight over smaller African states",
          "foreign aid from non-African nations must be rejected completely"
        ],
        "answer": 1,
        "explanation": "Afrocentricity (Africa as the centerpiece of foreign policy) means Nigeria prioritizes African unity, decolonization, regional stability, and economic development in its international affairs.",
        "topic": "Nigeria's Foreign Policy",
        "difficulty": "standard"
      },
      {
        "q": "According to A.V. Dicey's formulation of the Rule of Law, 'equality before the law' means that",
        "options": [
          "laws apply equally to all citizens regardless of status, wealth, or position",
          "every citizen is guaranteed equal income and economic property by the state",
          "all citizens enjoy equal representation in the national legislature",
          "judges must be elected through popular elections by all citizens"
        ],
        "answer": 0,
        "explanation": "Equality before the law asserts that no person is above the law and that all individuals, regardless of social rank or official status, are subject to the same ordinary laws enforced by ordinary courts.",
        "topic": "Basic Concepts in Government",
        "difficulty": "easy"
      },
      {
        "q": "In the pre-colonial Hausa-Fulani administrative system, the official directly responsible for administering a district and collecting taxes was the",
        "options": [
          "Waziri",
          "Hakimi",
          "Dagaci",
          "Madawaki"
        ],
        "answer": 1,
        "explanation": "Under the Hausa-Fulani emirate arrangement, the Emir ruled through district heads known as Hakimi (who collected taxes such as Haraji and Jangali), while village heads were known as Dagaci.",
        "topic": "Pre-Colonial Political Systems in Nigeria",
        "difficulty": "hard"
      },
      {
        "q": "A core objective of the 1976 Local Government Reforms in Nigeria was the implementation of",
        "options": [
          "a uniform, single-tier system of local government nationwide",
          "local administrative councils controlled entirely by traditional rulers",
          "complete financial autonomy for local government units from state funds",
          "divisional police units commanded directly by local council chairmen"
        ],
        "answer": 0,
        "explanation": "The 1976 Local Government Reforms standardized local administration across Nigeria by introducing a uniform, single-tier system, making local governments the official third tier of federal governance.",
        "topic": "Local Government System in Nigeria",
        "difficulty": "standard"
      },
      {
        "q": "In a parliamentary cabinet system, the doctrine of collective responsibility requires that",
        "options": [
          "the supreme court must ratify all policy proposals from the cabinet",
          "opposition parties share equal cabinet positions with the ruling party",
          "individual ministers may openly vote against government policies in parliament",
          "all cabinet ministers must publicly accept and defend decisions made by the cabinet"
        ],
        "answer": 3,
        "explanation": "Collective responsibility mandates that all cabinet ministers must publicly support government decisions reached by the cabinet or resign if they cannot support them.",
        "topic": "Structures and Types of Government",
        "difficulty": "standard"
      },
      {
        "q": "Under the 1999 Constitution of the Federal Republic of Nigeria, a foreign national can acquire Nigerian citizenship through",
        "options": [
          "conquest and treaty agreement",
          "military service and executive nomination",
          "naturalization and registration",
          "executive decree and birth only"
        ],
        "answer": 2,
        "explanation": "The 1999 Nigerian Constitution provides three methods of citizenship: by birth, by registration, and by naturalization. Non-citizens can acquire citizenship through registration (e.g., non-Nigerian women married to Nigerian men) or naturalization.",
        "topic": "Citizenship and Rights",
        "difficulty": "easy"
      },
      {
        "q": "A major characteristic of military governance in Nigeria was the",
        "options": [
          "total elimination of statutory public corporations",
          "strict enforcement of civil liberties and fundamental rights",
          "maintenance of an elected bicameral national assembly",
          "concentration of legislative and executive powers in a ruling military council"
        ],
        "answer": 3,
        "explanation": "Military regimes in Nigeria suspended parts of the constitution, dissolved democratic legislatures, and fused executive and legislative powers within supreme military councils (e.g., SMC, AFRC, or PRC), ruling by decrees.",
        "topic": "Political Developments in Nigeria",
        "difficulty": "standard"
      },
      {
        "q": "The symbolic head of the Commonwealth of Nations is the",
        "options": [
          "Secretary-General of the United Nations",
          "British Monarch",
          "President of the European Union",
          "Prime Minister of Great Britain"
        ],
        "answer": 1,
        "explanation": "The British Monarch serves as the symbolic Head of the Commonwealth of Nations, representing the voluntary association of independent member countries (mostly former territories of the British Empire).",
        "topic": "International Organizations",
        "difficulty": "easy"
      },
      {
        "q": "The constitutional right of eligible citizens to participate in elections by voting is referred to as",
        "options": [
          "franchise",
          "plebiscite",
          "initiative",
          "referendum"
        ],
        "answer": 0,
        "explanation": "Franchise (or suffrage) is the legal right granted to qualified citizens to vote in political elections.",
        "topic": "Elections and Electoral Processes",
        "difficulty": "easy"
      }
    ]
  },
  {
    "subject": "Literature in English",
    "board": "jamb",
    "questions": [
      {
        "q": "A situation in a play where the audience possesses crucial information that the characters on stage are unaware of is known as",
        "options": [
          "dramatic irony",
          "situational irony",
          "verbal irony",
          "cosmic irony"
        ],
        "answer": 0,
        "explanation": "Dramatic irony occurs when the audience or reader knows important details about a plot or situation that the characters themselves do not know.",
        "topic": "Dramatic Devices",
        "difficulty": "easy"
      },
      {
        "q": "A standard Shakespearean (English) sonnet traditionally consists of",
        "options": [
          "three quatrains and a heroic couplet",
          "an octave and a sestet",
          "four tercets and a couplet",
          "two sestets and a refrain"
        ],
        "answer": 0,
        "explanation": "A Shakespearean sonnet comprises 14 lines arranged into three 4-line stanzas (quatrains) followed by a final 2-line stanza (couplet), with the rhyme scheme abab cdcd efef gg.",
        "topic": "Poetic Forms",
        "difficulty": "easy"
      },
      {
        "q": "When a character speaks their innermost thoughts aloud while alone on stage, the literary device used is",
        "options": [
          "monologue",
          "aside",
          "soliloquy",
          "prologue"
        ],
        "answer": 2,
        "explanation": "A soliloquy is a dramatic speech delivered by a character alone on stage, revealing their private thoughts and feelings to the audience.",
        "topic": "Dramatic Devices",
        "difficulty": "easy"
      },
      {
        "q": "The phrase 'deafening silence' is an example of",
        "options": [
          "paradox",
          "oxymoron",
          "hyperbole",
          "antithesis"
        ],
        "answer": 1,
        "explanation": "An oxymoron juxtaposes two contradictory or opposite terms directly beside each other, as in 'deafening silence'.",
        "topic": "Figures of Speech",
        "difficulty": "easy"
      },
      {
        "q": "A narrative technique where the narrator knows all the thoughts, feelings, and motivations of every character is described as",
        "options": [
          "first-person limited",
          "third-person omniscient",
          "second-person objective",
          "third-person limited"
        ],
        "answer": 1,
        "explanation": "The third-person omniscient point of view features an all-knowing narrator who has insight into the minds and emotions of all characters.",
        "topic": "Narrative Techniques",
        "difficulty": "standard"
      },
      {
        "q": "Read the excerpt below:\n'The dark, leaden clouds hung low over the desolate graveyard, weeping silent tears upon the cold headstones.'\nWhat is the predominant mood created in this passage?",
        "options": [
          "Nostalgic and hopeful",
          "Sombre and melancholic",
          "Angry and chaotic",
          "Suspicious and tense"
        ],
        "answer": 1,
        "explanation": "Words like 'dark', 'leaden', 'desolate', 'weeping', and 'cold headstones' evoke a gloomy, sorrowful, sombre, and melancholic mood.",
        "topic": "Literary Appreciation",
        "difficulty": "standard"
      },
      {
        "q": "In classical tragic drama, the protagonist's fatal flaw or misjudgment that leads to their downfall is referred to as",
        "options": [
          "nemesis",
          "catharsis",
          "anagnorisis",
          "hamartia"
        ],
        "answer": 3,
        "explanation": "Hamartia is the Greek literary term for a tragic flaw, error in judgment, or weakness in a tragic hero that brings about their ruin.",
        "topic": "Dramatic Devices",
        "difficulty": "standard"
      },
      {
        "q": "In the sentence 'The Crown announced a new royal decree yesterday', the word 'Crown' represents the monarch through which figure of speech?",
        "options": [
          "Synecdoche",
          "Metonymy",
          "Personification",
          "Apostrophe"
        ],
        "answer": 1,
        "explanation": "Metonymy replaces the name of a thing with the name of something else closely associated with it (e.g., 'Crown' for royalty or monarch).",
        "topic": "Figures of Speech",
        "difficulty": "hard"
      },
      {
        "q": "The repetition of internal vowel sounds within closely positioned words in a line of poetry is called",
        "options": [
          "alliteration",
          "consonance",
          "assonance",
          "cacophony"
        ],
        "answer": 2,
        "explanation": "Assonance is the repetition of identical or similar vowel sounds within nearby words (e.g., 'mellow wedding bells').",
        "topic": "Poetic Devices",
        "difficulty": "easy"
      },
      {
        "q": "The emotional release or cleansing of pity and fear experienced by the audience at the resolution of a tragedy is termed",
        "options": [
          "hamartia",
          "peripeteia",
          "catharsis",
          "denouement"
        ],
        "answer": 2,
        "explanation": "Catharsis refers to the purging or purification of emotions (specifically pity and fear) felt by the audience during a tragedy.",
        "topic": "Dramatic Devices",
        "difficulty": "standard"
      },
      {
        "q": "The Francophone African intellectual and literary movement of the 1930s to 1950s that celebrated Black cultural identity and rejected French assimilation was known as",
        "options": [
          "Pan-Africanism",
          "Negritude",
          "Afrofuturism",
          "Indigenization"
        ],
        "answer": 1,
        "explanation": "Negritude was a literary and ideological movement developed by Francophone Black intellectuals (such as Aimé Césaire and Léopold Sédar Senghor) to affirm Black cultural heritage and oppose French colonial assimilation.",
        "topic": "African Literature Concepts",
        "difficulty": "standard"
      },
      {
        "q": "A speaker addressing an absent person, an abstract concept, or an inanimate object as though it were living and present is employing",
        "options": [
          "personification",
          "apostrophe",
          "allusion",
          "invocation"
        ],
        "answer": 1,
        "explanation": "Apostrophe is a speech device where a speaker directly addresses an absent person, an abstract quality (like Death or Love), or an object.",
        "topic": "Figures of Speech",
        "difficulty": "hard"
      },
      {
        "q": "A novel that focuses primarily on the psychological, moral, and social development of a protagonist from youth to maturity is classified as a",
        "options": [
          "picaresque novel",
          "epistolary novel",
          "bildungsroman",
          "gothic novel"
        ],
        "answer": 2,
        "explanation": "A Bildungsroman is a coming-of-age novel concerned with the formative years and personal growth of the main character.",
        "topic": "Prose Forms and Genres",
        "difficulty": "standard"
      },
      {
        "q": "Consider the following lines:\n'The woods are lovely, dark and deep, / But I have promises to keep, / And miles to go before I sleep.'\nWhat is the rhyme scheme of these three lines?",
        "options": [
          "a-b-a",
          "a-a-a",
          "a-b-b",
          "a-a-b"
        ],
        "answer": 1,
        "explanation": "The end words are 'deep', 'keep', and 'sleep', which all rhyme with one another, making the rhyme scheme a-a-a.",
        "topic": "Poetic Devices",
        "difficulty": "easy"
      },
      {
        "q": "A short, lighthearted scene placed between tragic episodes in a play to momentarily relieve tension for the audience is called",
        "options": [
          "satire",
          "farce",
          "comic relief",
          "slapstick"
        ],
        "answer": 2,
        "explanation": "Comic relief is an amusing scene, incident, or speech introduced in a serious or tragic work to alleviate emotional intensity.",
        "topic": "Dramatic Devices",
        "difficulty": "easy"
      },
      {
        "q": "The expression 'All hands on deck' uses which figure of speech by using a part ('hands') to represent the whole ('workers/sailors')?",
        "options": [
          "Metonymy",
          "Synecdoche",
          "Litotes",
          "Hyperbole"
        ],
        "answer": 1,
        "explanation": "Synecdoche is a figure of speech in which a part of something is used to refer to the whole (or vice versa).",
        "topic": "Figures of Speech",
        "difficulty": "standard"
      },
      {
        "q": "The deliberate use of a negative statement to emphasize an affirmative meaning, such as saying 'He is no fool' to mean 'He is very smart', is called",
        "options": [
          "litotes",
          "irony",
          "euphemism",
          "antithesis"
        ],
        "answer": 0,
        "explanation": "Litotes is a form of understatement that uses double negatives or a negated opposite to express a positive assertion.",
        "topic": "Figures of Speech",
        "difficulty": "hard"
      },
      {
        "q": "When a line of poetry continues onto the next line without any terminal punctuation mark, carrying the sense over the line break, it exhibits",
        "options": [
          "caesura",
          "end-stopping",
          "enjambment",
          "anaphora"
        ],
        "answer": 2,
        "explanation": "Enjambment (or a run-on line) occurs when a poetic sentence or thought flows across a line break without pausing at end punctuation.",
        "topic": "Poetic Devices",
        "difficulty": "standard"
      },
      {
        "q": "A novel constructed entirely out of documents such as letters, diary entries, or newspaper articles is called an",
        "options": [
          "epistolary novel",
          "allegorical novel",
          "historical novel",
          "pastoral novel"
        ],
        "answer": 0,
        "explanation": "An epistolary novel is written in the form of letters, correspondence, or personal records.",
        "topic": "Prose Forms and Genres",
        "difficulty": "easy"
      },
      {
        "q": "In drama, the critical moment of recognition or discovery when a tragic protagonist realizes the truth of their situation or identity is known as",
        "options": [
          "peripeteia",
          "anagnorisis",
          "denouement",
          "deus ex machina"
        ],
        "answer": 1,
        "explanation": "Anagnorisis is the moment in a play when a character makes a vital discovery, moving from ignorance to knowledge.",
        "topic": "Dramatic Devices",
        "difficulty": "hard"
      }
    ]
  },
  {
    "subject": "English Language",
    "board": "waec",
    "questions": [
      {
        "q": "The principal insisted that every student ___ present at the assembly hall before 8:00 a.m.",
        "options": [
          "is",
          "be",
          "was",
          "are"
        ],
        "answer": 1,
        "explanation": "Verbs expressing demands or insistences (like 'insisted that') take the mandative subjunctive mood, which requires the base form of the verb ('be').",
        "topic": "Grammar and Concord",
        "difficulty": "hard"
      },
      {
        "q": "Neither the teacher nor his students ___ aware of the sudden change in the examination timetable.",
        "options": [
          "was",
          "were",
          "is",
          "has been"
        ],
        "answer": 1,
        "explanation": "When subjects are joined by 'neither... nor', the verb agrees with the subject closest to it ('students', which is plural).",
        "topic": "Subject-Verb Agreement",
        "difficulty": "standard"
      },
      {
        "q": "You hardly ever visit your grandparents these days, ___?",
        "options": [
          "don't you",
          "do you",
          "did you",
          "can't you"
        ],
        "answer": 1,
        "explanation": "The word 'hardly' makes the statement negative; therefore, the question tag must be positive ('do you').",
        "topic": "Question Tags",
        "difficulty": "standard"
      },
      {
        "q": "The suspect was acquitted ___ all charges due to a lack of sufficient evidence.",
        "options": [
          "from",
          "of",
          "off",
          "with"
        ],
        "answer": 1,
        "explanation": "The verb 'acquitted' takes the preposition 'of' when referring to legal charges.",
        "topic": "Prepositions",
        "difficulty": "standard"
      },
      {
        "q": "Choose the option nearest in meaning to the underlined word: The minister's **ephemeral** popularity waned quickly after the reform failed.",
        "options": [
          "short-lived",
          "enormous",
          "remarkable",
          "permanent"
        ],
        "answer": 0,
        "explanation": "'Ephemeral' means lasting for a very short time, making 'short-lived' the closest synonym.",
        "topic": "Synonyms",
        "difficulty": "standard"
      },
      {
        "q": "Choose the option opposite in meaning to the underlined word: The newly appointed manager is known to be remarkably **frugal** in handling office supplies.",
        "options": [
          "prudent",
          "extravagant",
          "stingy",
          "cautious"
        ],
        "answer": 1,
        "explanation": "'Frugal' means economical or sparing; its direct opposite is 'extravagant' (wasteful).",
        "topic": "Antonyms",
        "difficulty": "easy"
      },
      {
        "q": "The committee decided to ___ the meeting until next Tuesday to allow key members to attend.",
        "options": [
          "call off",
          "put off",
          "take off",
          "turn off"
        ],
        "answer": 1,
        "explanation": "'Put off' means to postpone to a later time, whereas 'call off' means to cancel completely.",
        "topic": "Phrasal Verbs",
        "difficulty": "easy"
      },
      {
        "q": "Choose the option that has the same vowel sound as the one represented by the underlined letter(s): pl**um**b",
        "options": [
          "comb",
          "cup",
          "tomb",
          "fool"
        ],
        "answer": 1,
        "explanation": "'Plumb' is pronounced /plʌm/ (the 'b' is silent). The short vowel sound /ʌ/ matches the vowel sound in 'cup' /kʌp/.",
        "topic": "Oral English - Vowels",
        "difficulty": "hard"
      },
      {
        "q": "Choose the option that has the same consonant sound as the one represented by the underlined letter(s): **ch**asm",
        "options": [
          "church",
          "chemist",
          "chef",
          "charity"
        ],
        "answer": 1,
        "explanation": "'Chasm' is pronounced with the initial consonant sound /k/, which matches the sound in 'chemist'.",
        "topic": "Oral English - Consonants",
        "difficulty": "standard"
      },
      {
        "q": "To 'burn the candle at both ends' means to ___",
        "options": [
          "waste financial resources recklessly",
          "work continuously from early morning until late at night",
          "cause unnecessary conflicts at work",
          "set fire to personal property"
        ],
        "answer": 1,
        "explanation": "The idiom 'burn the candle at both ends' means to overwork oneself by going to bed late and getting up early.",
        "topic": "Idioms and Figures of Speech",
        "difficulty": "easy"
      },
      {
        "q": "If the rain ___ stopped earlier, we would have gone to the stadium for the match.",
        "options": [
          "has",
          "had",
          "would have",
          "was"
        ],
        "answer": 1,
        "explanation": "Third conditional structures require the past perfect tense ('had + past participle') in the condition clause.",
        "topic": "Conditional Clauses",
        "difficulty": "standard"
      },
      {
        "q": "The scientist ___ research led to the breakthrough was honoured with a national award.",
        "options": [
          "who",
          "whom",
          "whose",
          "which"
        ],
        "answer": 2,
        "explanation": "'Whose' is the possessive relative pronoun used to indicate ownership or association with the noun 'research'.",
        "topic": "Relative Pronouns",
        "difficulty": "easy"
      },
      {
        "q": "Scarcely ___ the examination hall when the siren sounded.",
        "options": [
          "the candidates entered",
          "had the candidates entered",
          "did the candidates entered",
          "the candidates had entered"
        ],
        "answer": 1,
        "explanation": "When negative or restrictive adverbs like 'Scarcely' begin a sentence, subject-auxiliary inversion ('had the candidates entered') is required.",
        "topic": "Sentence Inversion",
        "difficulty": "hard"
      },
      {
        "q": "The bride wore a ___ dress for her wedding ceremony.",
        "options": [
          "beautiful white silk",
          "white beautiful silk",
          "silk white beautiful",
          "beautiful silk white"
        ],
        "answer": 0,
        "explanation": "Standard adjective ordering puts opinion ('beautiful') before colour ('white'), followed by material ('silk').",
        "topic": "Order of Adjectives",
        "difficulty": "standard"
      },
      {
        "q": "Choose the option nearest in meaning to the underlined word: The auditor presented a **meticulous** report on the company's financial records.",
        "options": [
          "hasty",
          "thorough",
          "careless",
          "vague"
        ],
        "answer": 1,
        "explanation": "'Meticulous' means showing great attention to detail; very careful and precise, which aligns best with 'thorough'.",
        "topic": "Synonyms",
        "difficulty": "easy"
      },
      {
        "q": "Choose the option that shows the correct primary stress placement for the word: **photograph**",
        "options": [
          "PHO-to-graph",
          "pho-TO-graph",
          "pho-to-GRAPH",
          "PHO-TO-graph"
        ],
        "answer": 0,
        "explanation": "The primary stress in the noun 'photograph' falls on the first syllable: /ˈfəʊ.tə.ɡrɑːf/.",
        "topic": "Oral English - Stress",
        "difficulty": "standard"
      },
      {
        "q": "Choose the option that rhymes with the word: **sew**",
        "options": [
          "dew",
          "go",
          "few",
          "law"
        ],
        "answer": 1,
        "explanation": "'Sew' is pronounced /səʊ/, which rhymes with 'go' /ɡəʊ/.",
        "topic": "Oral English - Rhyme",
        "difficulty": "standard"
      },
      {
        "q": "The defense attorney requested an ___ to allow more time to consult with his client.",
        "options": [
          "adjournment",
          "acquittal",
          "injunction",
          "appeal"
        ],
        "answer": 0,
        "explanation": "In legal vocabulary, an 'adjournment' refers to a temporary postponement or break in court proceedings.",
        "topic": "Lexis and Register",
        "difficulty": "standard"
      },
      {
        "q": "My elder sister prefers reading novels ___ watching television in her free time.",
        "options": [
          "than",
          "to",
          "instead",
          "rather than"
        ],
        "answer": 1,
        "explanation": "The verb 'prefer' naturally collocates with the preposition 'to' when comparing two activities.",
        "topic": "Prepositions and Grammar",
        "difficulty": "easy"
      },
      {
        "q": "Choose the option opposite in meaning to the underlined word: The witness gave a very **coherent** explanation during cross-examination.",
        "options": [
          "logical",
          "confused",
          "clear",
          "persuasive"
        ],
        "answer": 1,
        "explanation": "'Coherent' means logical, clear, and well-structured; its opposite is 'confused' or 'incoherent'.",
        "topic": "Antonyms",
        "difficulty": "standard"
      }
    ]
  },
  {
    "subject": "Agricultural Science",
    "board": "waec",
    "questions": [
      {
        "q": "Which of the following soil components has the highest cation exchange capacity (CEC)?",
        "options": [
          "Coarse sand",
          "Fine sand",
          "Organic matter (humus)",
          "Silt"
        ],
        "answer": 2,
        "explanation": "Humus has a high density of negative surface charges and a large surface area, giving it a much higher cation exchange capacity than sand or silt.",
        "topic": "Soil Science",
        "difficulty": "standard"
      },
      {
        "q": "A primary tillage implement designed to cut, lift, invert compact soil layers, and bury weeds is the:",
        "options": [
          "Disc harrow",
          "Mouldboard plough",
          "Ridger",
          "Spring-tine cultivator"
        ],
        "answer": 1,
        "explanation": "The mouldboard plough cuts, lifts, completely turns over (inverts) the soil slice, and buries surface vegetation during primary land preparation.",
        "topic": "Farm Power and Machinery",
        "difficulty": "easy"
      },
      {
        "q": "Groundnut plants naturally enrich soil fertility through symbiotic nitrogen fixation associated with bacteria of the genus:",
        "options": [
          "Nitrosomonas",
          "Rhizobium",
          "Azotobacter",
          "Nitrobacter"
        ],
        "answer": 1,
        "explanation": "Rhizobium bacteria live in the root nodules of leguminous crops like groundnuts, fixing atmospheric nitrogen into forms usable by plants.",
        "topic": "Crop Production",
        "difficulty": "standard"
      },
      {
        "q": "In ruminant cattle, the stomach compartment where true enzymatic digestion occurs (equivalent to the non-ruminant stomach) is the:",
        "options": [
          "Rumen",
          "Reticulum",
          "Omasum",
          "Abomasum"
        ],
        "answer": 3,
        "explanation": "The abomasum is known as the true stomach because gastric juices and digestive enzymes are secreted here to break down proteins and micro-organisms.",
        "topic": "Animal Nutrition and Physiology",
        "difficulty": "standard"
      },
      {
        "q": "If a 10% increase in the market price of cocoa beans leads to a 15% increase in the quantity of cocoa beans supplied, the price elasticity of supply is:",
        "options": [
          "0.67 and inelastic",
          "1.50 and elastic",
          "1.00 and unit elastic",
          "0.50 and inelastic"
        ],
        "answer": 1,
        "explanation": "Price Elasticity of Supply = % change in quantity supplied / % change in price = 15% / 10% = 1.50. Since the elasticity value is greater than 1, supply is elastic.",
        "topic": "Agricultural Economics",
        "difficulty": "hard"
      },
      {
        "q": "Which of the following agricultural extension methods is classified as a mass media teaching method?",
        "options": [
          "Method demonstration",
          "Farm and home visits",
          "Radio broadcasts",
          "Result demonstration"
        ],
        "answer": 2,
        "explanation": "Radio broadcasts reach large audiences over widespread geographical areas simultaneously without direct personal contact, making it a mass contact extension method.",
        "topic": "Agricultural Extension",
        "difficulty": "easy"
      },
      {
        "q": "The agricultural land-use system of growing food crops simultaneously with forest tree species on the same piece of land is called the:",
        "options": [
          "Taungya system",
          "Afforestation",
          "Deforestation",
          "Monoculture"
        ],
        "answer": 0,
        "explanation": "The Taungya system allows farmers to cultivate arable food crops alongside young timber trees until the forest canopy closes.",
        "topic": "Forestry",
        "difficulty": "standard"
      },
      {
        "q": "Black pod disease of cocoa is caused by which group of plant pathogens?",
        "options": [
          "Bacterium",
          "Fungus",
          "Virus",
          "Nematode"
        ],
        "answer": 1,
        "explanation": "Black pod disease of cocoa is caused by fungal pathogens belonging to the genus Phytophthora (e.g., Phytophthora palmivora).",
        "topic": "Crop Protection",
        "difficulty": "standard"
      },
      {
        "q": "Which internal parasite in livestock requires a mud snail (Lymnaea spp.) as an intermediate host to complete its life cycle?",
        "options": [
          "Tapeworm",
          "Liver fluke",
          "Roundworm",
          "Hookworm"
        ],
        "answer": 1,
        "explanation": "The liver fluke (Fasciola hepatica) undergoes developmental stages inside fresh-water mud snails before encysting on pasture vegetation eaten by livestock.",
        "topic": "Animal Health",
        "difficulty": "easy"
      },
      {
        "q": "Soil erosion caused by surface runoff removing a thin, relatively uniform layer of topsoil over a broad flat or gently sloping field is called:",
        "options": [
          "Rill erosion",
          "Gully erosion",
          "Sheet erosion",
          "Splash erosion"
        ],
        "answer": 2,
        "explanation": "Sheet erosion is the gradual, uniform stripping of a thin upper layer of topsoil across a wide surface by flowing rainwater.",
        "topic": "Soil Science",
        "difficulty": "hard"
      },
      {
        "q": "An asset or property pledged by a farmer to a financial institution to secure a loan is referred to as:",
        "options": [
          "Capital",
          "Collateral",
          "Subsidy",
          "Interest"
        ],
        "answer": 1,
        "explanation": "Collateral is physical asset or security offered by a borrower to a lender to guarantee loan repayment.",
        "topic": "Agricultural Economics",
        "difficulty": "standard"
      },
      {
        "q": "Which irrigation method delivers water directly to the plant root zone in slow, controlled drops, minimizing evaporation losses?",
        "options": [
          "Sprinkler irrigation",
          "Drip irrigation",
          "Flood irrigation",
          "Furrow irrigation"
        ],
        "answer": 1,
        "explanation": "Drip (trickle) irrigation applies water precisely and slowly to crop root zones using specialized emitters, minimizing water wastage through evaporation or runoff.",
        "topic": "Crop Production",
        "difficulty": "standard"
      },
      {
        "q": "The duration between successful fertilization and parturition (birth) in livestock is known as the:",
        "options": [
          "Oestrous cycle",
          "Lactation period",
          "Gestation period",
          "Incubation period"
        ],
        "answer": 2,
        "explanation": "Gestation period is the period during which female livestock carry developing foetuses in their uterus from conception to birth.",
        "topic": "Animal Reproduction",
        "difficulty": "standard"
      },
      {
        "q": "Which of the following materials is primarily applied to agricultural land to neutralize soil acidity and increase pH?",
        "options": [
          "Ammonium sulphate",
          "Calcium carbonate (Agricultural lime)",
          "Urea",
          "Single superphosphate"
        ],
        "answer": 1,
        "explanation": "Calcium carbonate (limestone) neutralizes excess hydrogen ions in acid soils, thereby raising the soil pH to a level suitable for crop growth.",
        "topic": "Soil Science",
        "difficulty": "easy"
      },
      {
        "q": "In fish pond management, the primary purpose of applying lime to the pond bottom before stocking is to:",
        "options": [
          "Kill all fish parasites permanently",
          "Increase water turbidity",
          "Neutralize water acidity and promote plankton growth",
          "Reduce dissolved oxygen concentration"
        ],
        "answer": 2,
        "explanation": "Liming pond soil and water reduces acidity, stabilizes pH levels, and makes nutrients available to promote phytoplankton growth, which serves as natural fish food.",
        "topic": "Aquaculture",
        "difficulty": "standard"
      },
      {
        "q": "Parasitic weeds like Striga hermonthica (Witchweed) damage host cereal crops mainly by:",
        "options": [
          "Shading host plant leaves completely",
          "Attaching to host roots to extract water and mineral nutrients",
          "Releasing toxic gases into host leaf stomata",
          "Blocking root respiration by soil compaction"
        ],
        "answer": 1,
        "explanation": "Striga is an obligate root parasite that attaches haustoria directly to host crop roots to divert nutrients, water, and photosynthates from the host.",
        "topic": "Crop Protection",
        "difficulty": "hard"
      },
      {
        "q": "A farmer measures a rectangular plot of land measuring 200 metres in length and 100 metres in width. What is the area of this land in hectares?",
        "options": [
          "0.2 hectares",
          "2.0 hectares",
          "20.0 hectares",
          "200.0 hectares"
        ],
        "answer": 1,
        "explanation": "Area in square metres = 200 m × 100 m = 20,000 m². Since 1 hectare = 10,000 m², the area in hectares = 20,000 / 10,000 = 2.0 hectares.",
        "topic": "Farm Engineering",
        "difficulty": "standard"
      },
      {
        "q": "Feedstuffs containing high crude fibre content (greater than 18%) and low total digestible nutrients are classified as:",
        "options": [
          "Concentrates",
          "Roughages",
          "Supplements",
          "Feed additives"
        ],
        "answer": 1,
        "explanation": "Roughages are bulky feeds (such as hay, straw, and silage) characterized by high crude fibre (>18%) and lower overall digestibility compared to concentrates.",
        "topic": "Animal Nutrition",
        "difficulty": "standard"
      },
      {
        "q": "Which of the following is an example of a biotic factor influencing agricultural production?",
        "options": [
          "Soil pH and texture",
          "Ambient temperature and humidity",
          "Crop pests, parasites, and soil microorganisms",
          "Solar radiation and topography"
        ],
        "answer": 2,
        "explanation": "Biotic factors comprise living components of an agricultural environment, including crop pests, livestock parasites, predators, and beneficial microorganisms.",
        "topic": "Agro-ecology",
        "difficulty": "easy"
      },
      {
        "q": "Rotational grazing is a pasture management system in which:",
        "options": [
          "Animals are permanently housed and fed cut grass indoors",
          "Pastureland is divided into paddocks and grazed sequentially",
          "Animals graze a single field continuously all year",
          "Food crops and pasture grass are alternated every season"
        ],
        "answer": 1,
        "explanation": "Rotational grazing involves dividing a pasture into smaller fenced plots (paddocks); livestock graze one paddock at a time while others rest and recover.",
        "topic": "Pasture Management",
        "difficulty": "standard"
      }
    ]
  },
  {
    "subject": "Commerce",
    "board": "waec",
    "questions": [
      {
        "q": "Which of the following activities falls directly under the category of extractive industry?",
        "options": [
          "Textile manufacturing",
          "Iron ore mining",
          "Automobile assembly",
          "House construction"
        ],
        "answer": 1,
        "explanation": "Extractive industry involves drawing raw materials directly from natural resources like land, air, or water. Mining iron ore is a direct extraction process.",
        "topic": "Occupation and Industry",
        "difficulty": "easy"
      },
      {
        "q": "A middleman who takes legal title to goods, stores them in large quantities, and sells in smaller quantities to retailers is a",
        "options": [
          "broker",
          "merchant wholesaler",
          "commission agent",
          "factor"
        ],
        "answer": 1,
        "explanation": "A merchant wholesaler purchases goods directly, assumes ownership (title), stores them in bulk, and resells smaller lots to retailers.",
        "topic": "Home Trade",
        "difficulty": "standard"
      },
      {
        "q": "Which commercial document is issued by a seller to a buyer to rectify an undercharge in a previously sent invoice?",
        "options": [
          "Credit note",
          "Debit note",
          "Advice note",
          "Proforma invoice"
        ],
        "answer": 1,
        "explanation": "A debit note is dispatched by a seller to notify a buyer that their account has been debited to correct an undercharge or omission.",
        "topic": "Documents Used in Home Trade",
        "difficulty": "standard"
      },
      {
        "q": "In a general partnership, the liability of the partners is described as unlimited because",
        "options": [
          "their financial contributions are fixed by law",
          "their private assets can be used to settle business debts",
          "they can only lose the precise amount of capital invested",
          "the business possesses a separate legal identity from its owners"
        ],
        "answer": 1,
        "explanation": "Unlimited liability means partners are personally responsible for all business debts; their private personal property can be attached if business assets fail to cover liabilities.",
        "topic": "Business Units",
        "difficulty": "standard"
      },
      {
        "q": "A primary distinguishing feature of a Public Limited Company (PLC) compared to a Private Limited Company (Ltd) in Nigeria is that a PLC",
        "options": [
          "can freely offer its shares to the general public",
          "is owned entirely by the Federal Government",
          "must have a minimum of two shareholders and no maximum limit",
          "does not require registration with the Corporate Affairs Commission"
        ],
        "answer": 0,
        "explanation": "PLCs are legally permitted to offer their securities to the general public, whereas Private Limited Companies are prohibited by law from making public share offers.",
        "topic": "Business Units",
        "difficulty": "standard"
      },
      {
        "q": "The principle of insurance which states that an insured person should be restored to their pre-loss financial position without making a profit is called",
        "options": [
          "insurable interest",
          "utmost good faith",
          "indemnity",
          "subrogation"
        ],
        "answer": 2,
        "explanation": "Indemnity ensures that compensation restores the policyholder to their exact financial standing prior to the loss, preventing financial gain from claims.",
        "topic": "Insurance",
        "difficulty": "easy"
      },
      {
        "q": "If an international quotation is specified as 'C.I.F. Lagos', it implies that the quoted price covers the cost of goods plus",
        "options": [
          "customs duties and local taxes only",
          "insurance premiums and freight charges to Lagos",
          "port clearance and handling fees in Lagos",
          "inland transport costs within Nigeria"
        ],
        "answer": 1,
        "explanation": "C.I.F. stands for Cost, Insurance, and Freight. The seller's price includes the goods' value, marine insurance, and freight charges up to the destination port (Lagos).",
        "topic": "Foreign Trade Terms",
        "difficulty": "standard"
      },
      {
        "q": "A trader purchased goods for ₦450,000, paid ₦30,000 for transport to store, and sold all the goods for ₦600,000. If operating expenses were ₦40,000, calculate the net profit.",
        "options": [
          "₦80,000",
          "₦120,000",
          "₦150,000",
          "₦170,000"
        ],
        "answer": 0,
        "explanation": "Cost of Goods Sold = ₦450,000 + ₦30,000 = ₦480,000. Gross Profit = ₦600,000 - ₦480,000 = ₦120,000. Net Profit = Gross Profit - Operating Expenses = ₦120,000 - ₦40,000 = ₦80,000.",
        "topic": "Commercial Calculations",
        "difficulty": "hard"
      },
      {
        "q": "The financial market segment where existing or second-hand corporate and government securities are traded is the",
        "options": [
          "primary market",
          "money market",
          "secondary market",
          "commodity market"
        ],
        "answer": 2,
        "explanation": "The secondary market deals with trading previously issued stocks and bonds among investors, unlike the primary market where new issues originate.",
        "topic": "Capital Market and Stock Exchange",
        "difficulty": "standard"
      },
      {
        "q": "Which function of money directly resolves the problem of double coincidence of wants associated with trade by barter?",
        "options": [
          "Store of value",
          "Medium of exchange",
          "Unit of account",
          "Standard for deferred payment"
        ],
        "answer": 1,
        "explanation": "Money serves as a universally accepted medium of exchange, eliminating the requirement that trading partners must simultaneously desire each other's goods.",
        "topic": "Money and Banking",
        "difficulty": "easy"
      },
      {
        "q": "When the Central Bank of Nigeria sells treasury bills to commercial banks in the open market, its primary objective is to",
        "options": [
          "expand commercial bank credit and increase money supply",
          "reduce commercial bank reserves and contract money supply",
          "lower the cash reserve ratio of commercial banks",
          "decrease interest rates paid on savings accounts"
        ],
        "answer": 1,
        "explanation": "Selling government securities via Open Market Operations (OMO) absorbs excess reserves from commercial banks, curbing their ability to create credit and contracting money supply.",
        "topic": "Central Banking and Monetary Policy",
        "difficulty": "hard"
      },
      {
        "q": "In Nigeria, the government agency responsible for certifying and regulating foods, drugs, and chemical products is",
        "options": [
          "FCCPC",
          "NAFDAC",
          "SON",
          "NCS"
        ],
        "answer": 1,
        "explanation": "NAFDAC (National Agency for Food and Drug Administration and Control) regulates and controls the quality, manufacture, importation, and distribution of foods, drugs, cosmetics, and chemicals.",
        "topic": "Consumer Protection",
        "difficulty": "easy"
      },
      {
        "q": "Which mode of transport is most suitable for moving urgent, high-value, low-weight cargo across international borders?",
        "options": [
          "Rail transport",
          "Sea transport",
          "Air transport",
          "Pipeline transport"
        ],
        "answer": 2,
        "explanation": "Air transport offers maximum speed, making it the ideal choice for high-value, time-critical, and low-weight international freight.",
        "topic": "Transportation",
        "difficulty": "easy"
      },
      {
        "q": "A secure warehouse where dutiable imported goods are stored under customs supervision until the required import duties are fully paid is a",
        "options": [
          "private warehouse",
          "manufacturer's warehouse",
          "bonded warehouse",
          "wholesale warehouse"
        ],
        "answer": 2,
        "explanation": "A bonded warehouse is supervised by customs authorities to store imported goods on which customs duties are pending payment.",
        "topic": "Warehousing",
        "difficulty": "standard"
      },
      {
        "q": "A legally binding agreement entered into between two or more competent parties with legal intent is a",
        "options": [
          "tender",
          "offer",
          "contract",
          "prospectus"
        ],
        "answer": 2,
        "explanation": "A contract is an agreement enforceable by law, created when an offer, acceptance, consideration, and capacity to contract are present.",
        "topic": "Elements of Commercial Law",
        "difficulty": "easy"
      },
      {
        "q": "Under the Sale of Goods legal framework, the Latin doctrine 'Caveat Emptor' translates to",
        "options": [
          "let the seller beware",
          "let the buyer beware",
          "goods sold cannot be returned",
          "ownership passes upon physical delivery"
        ],
        "answer": 1,
        "explanation": "'Caveat emptor' means 'let the buyer beware', placing responsibility on the buyer to inspect goods for quality and defects prior to purchase.",
        "topic": "Elements of Commercial Law",
        "difficulty": "standard"
      },
      {
        "q": "Which document serves as evidence of a contract of carriage, receipt of goods, and document of title for goods shipped by sea?",
        "options": [
          "Certificate of origin",
          "Bill of lading",
          "Consular invoice",
          "Delivery order"
        ],
        "answer": 1,
        "explanation": "A Bill of Lading acts as a legal document of title, proof of shipment contract, and a formal receipt issued by the ocean carrier.",
        "topic": "Foreign Trade Documents",
        "difficulty": "standard"
      },
      {
        "q": "The modern automated exchange of structured business documents electronically between independent computer systems is known as",
        "options": [
          "Electronic Data Interchange (EDI)",
          "Courier service",
          "Franking machine",
          "Telegram"
        ],
        "answer": 0,
        "explanation": "Electronic Data Interchange (EDI) facilitates direct computer-to-computer transmission of standard business documents like orders and invoices.",
        "topic": "Communication in Commerce",
        "difficulty": "standard"
      },
      {
        "q": "A retail business has Current Assets of ₦1,200,000, Stock (Inventory) of ₦300,000, and Current Liabilities of ₦600,000. Calculate its quick (acid-test) ratio.",
        "options": [
          "2.0 : 1",
          "1.5 : 1",
          "1.0 : 1",
          "0.5 : 1"
        ],
        "answer": 1,
        "explanation": "Quick Ratio = (Current Assets - Stock) / Current Liabilities = (₦1,200,000 - ₦300,000) / ₦600,000 = ₦900,000 / ₦600,000 = 1.5 : 1.",
        "topic": "Commercial Calculations",
        "difficulty": "hard"
      },
      {
        "q": "The transfer of public ownership and management control of state-owned enterprises to private enterprise is known as",
        "options": [
          "commercialization",
          "nationalization",
          "privatization",
          "indigenization"
        ],
        "answer": 2,
        "explanation": "Privatization involves transferring public ownership, equity, or control of government-run entities to private individuals or corporate bodies.",
        "topic": "Business Structure and Development",
        "difficulty": "standard"
      }
    ]
  },
  {
    "subject": "Financial Accounting",
    "board": "waec",
    "questions": [
      {
        "q": "Which source document is issued by a seller to a buyer when returned goods are accepted?",
        "options": [
          "Debit note",
          "Credit note",
          "Invoice",
          "Receipt"
        ],
        "answer": 1,
        "explanation": "A credit note is issued by a vendor to a customer to confirm that returned goods have been accepted and that the customer's account has been credited.",
        "topic": "Subsidiary Books",
        "difficulty": "easy"
      },
      {
        "q": "A business has a bank balance per cash book of ₦45,000 (credit). Unpresented cheques total ₦12,000 while uncredited deposits amount to ₦8,500. What is the balance as per the bank statement?",
        "options": [
          "₦41,500 debit",
          "₦41,500 credit",
          "₦48,500 debit",
          "₦48,500 credit"
        ],
        "answer": 0,
        "explanation": "Starting with a cash book overdraft of ₦45,000 (credit), adding unpresented cheques (+₦12,000) and deducting uncredited deposits (-₦8,500) gives an overdraft of ₦41,500, which appears as a debit balance on the bank statement.",
        "topic": "Bank Reconciliation Statement",
        "difficulty": "standard"
      },
      {
        "q": "Equipment costing ₦800,000 has an estimated residual value of ₦80,000 and a useful life of 5 years. Using the straight-line method, what is the net book value at the end of Year 2?",
        "options": [
          "₦512,000",
          "₦480,000",
          "₦520,000",
          "₦656,000"
        ],
        "answer": 0,
        "explanation": "Annual depreciation = (₦800,000 - ₦80,000) / 5 = ₦144,000. Accumulated depreciation for 2 years = ₦288,000. Net Book Value = ₦800,000 - ₦288,000 = ₦512,000.",
        "topic": "Depreciation",
        "difficulty": "standard"
      },
      {
        "q": "A payment of ₦35,000 for motor vehicle repairs was incorrectly debited to the Motor Vehicles Account. What type of error occurred and how is it corrected?",
        "options": [
          "Error of principle; Debit Repairs Account, Credit Motor Vehicles Account",
          "Error of commission; Debit Motor Vehicles Account, Credit Repairs Account",
          "Error of omission; Debit Cash Account, Credit Repairs Account",
          "Error of original entry; Debit Repairs Account, Credit Cash Account"
        ],
        "answer": 0,
        "explanation": "Recording revenue expenditure in a capital expenditure account is an error of principle. To correct it, debit Repairs and Maintenance Account and credit Motor Vehicles Account.",
        "topic": "Correction of Errors",
        "difficulty": "hard"
      },
      {
        "q": "Which of the following items is posted to the credit side of a Sales Ledger Control Account?",
        "options": [
          "Credit sales",
          "Dishonoured cheques",
          "Returns inwards",
          "Interest charged on overdue accounts"
        ],
        "answer": 2,
        "explanation": "Returns inwards reduce total trade debtors, so they are posted to the credit side of the Sales Ledger Control Account.",
        "topic": "Control Accounts",
        "difficulty": "standard"
      },
      {
        "q": "The installation expense of a newly acquired production machine is treated as:",
        "options": [
          "Revenue expenditure",
          "Capital expenditure",
          "Deferred expenditure",
          "Capital receipt"
        ],
        "answer": 1,
        "explanation": "All costs incurred to bring a non-current asset into operation, including installation charges, constitute capital expenditure.",
        "topic": "Capital and Revenue Expenditure",
        "difficulty": "easy"
      },
      {
        "q": "A sole trader provides the following figures: Opening Capital: ₦150,000; Closing Capital: ₦210,000; Additional Capital Introduced: ₦40,000; Drawings: ₦25,000. What is the net profit for the year?",
        "options": [
          "₦45,000",
          "₦35,000",
          "₦85,000",
          "₦20,000"
        ],
        "answer": 0,
        "explanation": "Profit = Closing Capital + Drawings - Opening Capital - Additional Capital = ₦210,000 + ₦25,000 - ₦150,000 - ₦40,000 = ₦45,000.",
        "topic": "Incomplete Records",
        "difficulty": "standard"
      },
      {
        "q": "Where no partnership agreement exists, which rule applies according to the Partnership Act?",
        "options": [
          "Partners earn 5% annual salary on contributed capital",
          "Interest on partners' capital is paid at 10% per annum",
          "Profits and losses are shared equally among partners",
          "Interest on drawings is charged at 5% per annum"
        ],
        "answer": 2,
        "explanation": "Under the Partnership Act, in the absence of a partnership deed, profits and losses are shared equally, and no partner is entitled to a salary or interest on capital.",
        "topic": "Partnership Accounts",
        "difficulty": "standard"
      },
      {
        "q": "Ade and Bola share partnership profits in the ratio 3:2. Net profit before adjustments is ₦500,000. Interest on capitals: Ade ₦30,000, Bola ₦20,000. Bola's annual salary is ₦50,000. What is Ade's share of residual profit?",
        "options": [
          "₦240,000",
          "₦160,000",
          "₦300,000",
          "₦200,000"
        ],
        "answer": 0,
        "explanation": "Residual Profit = ₦500,000 - (₦50,000 total interest on capital + ₦50,000 salary) = ₦400,000. Ade's share = (3/5) × ₦400,000 = ₦240,000.",
        "topic": "Partnership Accounts",
        "difficulty": "hard"
      },
      {
        "q": "A limited liability company issues 500,000 ordinary shares of ₦1.00 each at a price of ₦1.20 per share. What amount is credited to the Share Premium Account?",
        "options": [
          "₦500,000",
          "₦600,000",
          "₦100,000",
          "₦20,000"
        ],
        "answer": 2,
        "explanation": "Share premium per share = ₦1.20 - ₦1.00 = ₦0.20. Total share premium = 500,000 × ₦0.20 = ₦100,000.",
        "topic": "Company Accounts",
        "difficulty": "standard"
      },
      {
        "q": "In a manufacturing account, prime cost consists of direct raw materials consumed, direct wages, and:",
        "options": [
          "Factory overheads",
          "Direct expenses",
          "Administrative expenses",
          "Depreciation of factory plant"
        ],
        "answer": 1,
        "explanation": "Prime Cost = Direct Materials Consumed + Direct Labour + Direct Expenses.",
        "topic": "Manufacturing Accounts",
        "difficulty": "standard"
      },
      {
        "q": "Extracts from a factory ledger show: Opening stock of raw materials ₦40,000; Purchases of raw materials ₦220,000; Carriage inwards on raw materials ₦15,000; Closing stock of raw materials ₦35,000. What is the cost of raw materials consumed?",
        "options": [
          "₦240,000",
          "₦225,000",
          "₦210,000",
          "₦255,000"
        ],
        "answer": 0,
        "explanation": "Cost of raw materials consumed = Opening Stock + Purchases + Carriage Inwards - Closing Stock = ₦40,000 + ₦220,000 + ₦15,000 - ₦35,000 = ₦240,000.",
        "topic": "Manufacturing Accounts",
        "difficulty": "hard"
      },
      {
        "q": "In the final accounts of a non-profit organisation, an excess of income over expenditure is:",
        "options": [
          "Added to the Accumulated Fund",
          "Deducted from the Accumulated Fund",
          "Transferred to the Capital Account as Net Profit",
          "Paid out as dividends to members"
        ],
        "answer": 0,
        "explanation": "A surplus (excess of income over expenditure) in a non-profit organization is added to the Accumulated Fund in the Statement of Financial Position.",
        "topic": "Non-Profit Organisations",
        "difficulty": "easy"
      },
      {
        "q": "A social club received total subscription receipts of ₦180,000 in the year. Subscriptions owing at the start of the year were ₦15,000, subscriptions received in advance at year-end were ₦10,000, and subscriptions owing at year-end were ₦22,000. What is the subscription income for the Income and Expenditure Account?",
        "options": [
          "₦177,000",
          "₦197,000",
          "₦163,000",
          "₦173,000"
        ],
        "answer": 0,
        "explanation": "Subscriptions Income = Receipts (₦180,000) - Opening Accrual (₦15,000) - Closing Advance (₦10,000) + Closing Accrual (₦22,000) = ₦177,000.",
        "topic": "Non-Profit Organisations",
        "difficulty": "hard"
      },
      {
        "q": "Given Net Sales of ₦600,000, Gross Profit of ₦150,000, and Net Profit of ₦60,000, what is the Net Profit Margin?",
        "options": [
          "10%",
          "25%",
          "40%",
          "15%"
        ],
        "answer": 0,
        "explanation": "Net Profit Margin = (Net Profit / Net Sales) × 100 = (₦60,000 / ₦600,000) × 100 = 10%.",
        "topic": "Financial Ratio Analysis",
        "difficulty": "standard"
      },
      {
        "q": "A trading firm has Current Assets of ₦300,000, including Inventory of ₦120,000. Current Liabilities total ₦150,000. What is the firm's Quick (Acid-Test) Ratio?",
        "options": [
          "1.2 : 1",
          "2.0 : 1",
          "0.8 : 1",
          "1.5 : 1"
        ],
        "answer": 0,
        "explanation": "Quick Ratio = (Current Assets - Stock) / Current Liabilities = (₦300,000 - ₦120,000) / ₦150,000 = ₦180,000 / ₦150,000 = 1.2 : 1.",
        "topic": "Financial Ratio Analysis",
        "difficulty": "standard"
      },
      {
        "q": "Which accounting concept dictates that revenue should be recognized when goods or services are delivered, regardless of when cash is received?",
        "options": [
          "Realization concept",
          "Matching concept",
          "Materiality concept",
          "Consistency concept"
        ],
        "answer": 0,
        "explanation": "The realization concept states that revenue is recognized when earning activities are complete and legal title passes, not necessarily when cash is received.",
        "topic": "Accounting Concepts and Conventions",
        "difficulty": "easy"
      },
      {
        "q": "Trade Debtors at 31 December stand at ₦200,000. The Provision for Doubtful Debts Account has an existing credit balance of ₦8,000. If provision is to be maintained at 5% of debtors, what entry is made in the Profit and Loss Account?",
        "options": [
          "Credit ₦2,000 to Profit and Loss Account",
          "Debit ₦2,000 to Profit and Loss Account",
          "Debit ₦10,000 to Profit and Loss Account",
          "Credit ₦8,000 to Profit and Loss Account"
        ],
        "answer": 1,
        "explanation": "New provision required = 5% of ₦200,000 = ₦10,000. Existing provision = ₦8,000. The required increase of ₦2,000 is an expense debited to the Profit and Loss Account.",
        "topic": "Adjustments to Final Accounts",
        "difficulty": "hard"
      },
      {
        "q": "Under an imprest petty cash system, a petty cashier starts with a cash float of ₦50,000. Total expenses paid during the month equal ₦38,500. How much is reimbursed to restore the float?",
        "options": [
          "₦38,500",
          "₦11,500",
          "₦50,000",
          "₦88,500"
        ],
        "answer": 0,
        "explanation": "Under the imprest system, the exact total of expenses disbursed (₦38,500) is reimbursed to return the petty cash balance to its original float amount.",
        "topic": "Petty Cash Book & Imprest System",
        "difficulty": "standard"
      },
      {
        "q": "In accordance with standard accounting rules, closing inventory must be valued at the:",
        "options": [
          "Lower of cost and net realizable value",
          "Higher of cost and net realizable value",
          "Cost price only",
          "Net realizable value only"
        ],
        "answer": 0,
        "explanation": "Under the prudence concept, closing inventory is valued at the lower of cost and net realizable value (NRV).",
        "topic": "Final Accounts of Sole Trader",
        "difficulty": "easy"
      }
    ]
  }
];
