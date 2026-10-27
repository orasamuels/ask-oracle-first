import type { CATEGORIES } from "./test-setup";

export interface Question {
  id: string;
  category: (typeof CATEGORIES)[number];
  prompt: string;
  options: [string, string, string, string];
  /** Index (0–3) of the correct option. */
  answer: number;
  explanation?: string;
}

type Row = [string, [string, string, string, string], number, string?];

const BANK: Record<(typeof CATEGORIES)[number], Row[]> = {
  English: [
    ["Which word is a synonym of “benevolent”?", ["Kind", "Hostile", "Lazy", "Fragile"], 0, "Benevolent means well-meaning and kindly."],
    ["Choose the correctly spelled word.", ["Accomodate", "Acommodate", "Accommodate", "Acomodate"], 2, "“Accommodate” has double c and double m."],
    ["What is the plural of “criterion”?", ["Criterions", "Criteria", "Criterias", "Criterion"], 1],
    ["Which sentence is grammatically correct?", ["She don't like tea.", "She doesn't likes tea.", "She doesn't like tea.", "She not like tea."], 2],
    ["What is the antonym of “scarce”?", ["Rare", "Abundant", "Limited", "Sparse"], 1],
    ["In “The cat slept soundly”, which word is an adverb?", ["cat", "slept", "soundly", "The"], 2, "“Soundly” describes how the cat slept."],
    ["Which figure of speech is “The wind whispered through the trees”?", ["Simile", "Personification", "Hyperbole", "Alliteration"], 1, "A human action (whispering) is given to the wind."],
    ["Choose the correct form: “Neither of the boys ___ here.”", ["are", "were", "is", "be"], 2, "“Neither” takes a singular verb."],
    ["Which word means “to make something less severe”?", ["Aggravate", "Mitigate", "Escalate", "Instigate"], 1],
    ["Which is a compound sentence?", ["I ran.", "I ran, and she walked.", "Running fast.", "Because I ran."], 1, "Two independent clauses joined by “and”."],
  ],
  Mathematics: [
    ["What is 12 × 13?", ["144", "156", "169", "136"], 1],
    ["What is the square root of 225?", ["15", "25", "14", "21"], 0],
    ["Solve: 3x + 5 = 20", ["x = 3", "x = 5", "x = 6", "x = 15"], 1, "3x = 15, so x = 5."],
    ["What is 25% of 240?", ["48", "60", "65", "40"], 1],
    ["The angles of a triangle add up to:", ["90°", "180°", "270°", "360°"], 1],
    ["What is the next prime number after 13?", ["15", "16", "17", "19"], 2],
    ["What is the area of a circle with radius 3 (in terms of π)?", ["6π", "9π", "3π", "12π"], 1, "Area = πr² = 9π."],
    ["What is 2⁵?", ["10", "25", "32", "64"], 2],
    ["What is the value of 7! / 5! ?", ["42", "35", "12", "56"], 0, "7 × 6 = 42."],
    ["What is 3/4 as a decimal?", ["0.34", "0.75", "0.7", "0.43"], 1],
  ],
  Physics: [
    ["What is the SI unit of force?", ["Joule", "Watt", "Newton", "Pascal"], 2],
    ["Approximately how fast does light travel in a vacuum?", ["300,000 km/s", "30,000 km/s", "3,000 km/s", "3,000,000 km/s"], 0],
    ["Which of Newton's laws states F = ma?", ["First", "Second", "Third", "None"], 1],
    ["What is the SI unit of electrical resistance?", ["Volt", "Ampere", "Ohm", "Coulomb"], 2],
    ["Near Earth's surface, acceleration due to gravity is about:", ["9.8 m/s²", "98 m/s²", "0.98 m/s²", "1.6 m/s²"], 0],
    ["Which type of energy does a moving object have?", ["Potential", "Kinetic", "Nuclear", "Chemical"], 1],
    ["Sound cannot travel through:", ["Water", "Steel", "Air", "A vacuum"], 3, "Sound needs a medium to travel."],
    ["What is the unit of frequency?", ["Hertz", "Tesla", "Henry", "Farad"], 0],
    ["Ohm's law relates voltage, current and:", ["Power", "Resistance", "Mass", "Charge"], 1, "V = IR."],
    ["The bending of light as it passes between media is called:", ["Reflection", "Diffraction", "Refraction", "Dispersion"], 2],
  ],
  Chemistry: [
    ["What is the chemical symbol for gold?", ["Go", "Gd", "Au", "Ag"], 2],
    ["What is the chemical formula of water?", ["H₂O", "HO₂", "H₂O₂", "OH"], 0],
    ["What is the pH of pure water at 25 °C?", ["0", "7", "10", "14"], 1],
    ["Which gas makes up most of Earth's atmosphere?", ["Oxygen", "Carbon dioxide", "Nitrogen", "Argon"], 2, "Nitrogen is about 78%."],
    ["What is the atomic number of carbon?", ["6", "12", "8", "14"], 0],
    ["Table salt is the compound:", ["KCl", "NaCl", "CaCO₃", "NaOH"], 1],
    ["Which particle carries a negative charge?", ["Proton", "Neutron", "Electron", "Nucleus"], 2],
    ["Elements in the last column of the periodic table are called:", ["Halogens", "Noble gases", "Alkali metals", "Metalloids"], 1],
    ["Which element has the symbol Fe?", ["Fluorine", "Iron", "Lead", "Francium"], 1],
    ["A solution with pH 2 is:", ["Neutral", "Strongly basic", "Acidic", "Weakly basic"], 2],
  ],
  Biology: [
    ["Which organelle is known as the powerhouse of the cell?", ["Nucleus", "Ribosome", "Mitochondrion", "Golgi body"], 2],
    ["What molecule carries genetic information in most organisms?", ["RNA", "DNA", "ATP", "Protein"], 1],
    ["Plants make food through:", ["Respiration", "Photosynthesis", "Digestion", "Fermentation"], 1],
    ["How many chambers does the human heart have?", ["2", "3", "4", "5"], 2],
    ["Which blood cells fight infection?", ["Red blood cells", "White blood cells", "Platelets", "Plasma"], 1],
    ["What is the largest organ of the human body?", ["Liver", "Brain", "Skin", "Lungs"], 2],
    ["Which gas do plants absorb for photosynthesis?", ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"], 2],
    ["How many chromosomes are in a typical human body cell?", ["23", "46", "44", "48"], 1],
    ["Insulin is produced by the:", ["Liver", "Pancreas", "Kidney", "Stomach"], 1],
    ["Which is NOT a type of blood vessel?", ["Artery", "Vein", "Capillary", "Alveolus"], 3, "Alveoli are air sacs in the lungs."],
  ],
  "Computer Science": [
    ["What does CPU stand for?", ["Central Processing Unit", "Computer Personal Unit", "Central Program Utility", "Core Processing Unit"], 0],
    ["What is binary 1010 in decimal?", ["8", "10", "12", "5"], 1],
    ["Which data structure follows Last In, First Out?", ["Queue", "Stack", "Array", "Tree"], 1],
    ["How many bits are in a byte?", ["4", "8", "16", "32"], 1],
    ["What does HTML stand for?", ["HyperText Markup Language", "High Transfer Machine Language", "Hyperlink Text Mode Language", "Home Tool Markup Language"], 0],
    ["The average time complexity of binary search is:", ["O(n)", "O(n²)", "O(log n)", "O(1)"], 2],
    ["Which of these is NOT a programming language?", ["Python", "Java", "HTTP", "Rust"], 2, "HTTP is a protocol."],
    ["RAM is a type of:", ["Permanent storage", "Volatile memory", "Input device", "Processor"], 1, "RAM loses its contents when power is off."],
    ["What does “SQL” mainly work with?", ["Images", "Relational databases", "Networks", "Spreadsheets only"], 1],
    ["Which logic gate outputs true only when both inputs are true?", ["OR", "XOR", "AND", "NOT"], 2],
  ],
  History: [
    ["In which year did World War II end?", ["1918", "1939", "1945", "1950"], 2],
    ["Who was the first President of the United States?", ["Thomas Jefferson", "Abraham Lincoln", "George Washington", "John Adams"], 2],
    ["The Berlin Wall fell in:", ["1985", "1989", "1991", "1979"], 1],
    ["Which ancient civilisation built the pyramids of Giza?", ["Romans", "Greeks", "Egyptians", "Persians"], 2],
    ["Nigeria gained independence from Britain in:", ["1957", "1960", "1963", "1970"], 1],
    ["Who was the first person to walk on the Moon?", ["Buzz Aldrin", "Yuri Gagarin", "Neil Armstrong", "John Glenn"], 2, "Apollo 11, 1969."],
    ["World War I began in:", ["1905", "1914", "1918", "1939"], 1],
    ["Nelson Mandela became President of South Africa in:", ["1990", "1994", "1999", "1985"], 1],
    ["The French Revolution began in:", ["1776", "1789", "1815", "1848"], 1],
    ["Which empire was ruled by Julius Caesar's successors, starting with Augustus?", ["Ottoman", "Roman", "Mongol", "Byzantine"], 1],
  ],
  Geography: [
    ["What is the capital of Australia?", ["Sydney", "Melbourne", "Canberra", "Perth"], 2],
    ["Which is the largest ocean?", ["Atlantic", "Indian", "Arctic", "Pacific"], 3],
    ["Mount Everest lies on the border of Nepal and:", ["India", "China", "Bhutan", "Pakistan"], 1],
    ["Which is the largest continent by area?", ["Africa", "Asia", "North America", "Europe"], 1],
    ["What is the capital of Nigeria?", ["Lagos", "Abuja", "Kano", "Ibadan"], 1],
    ["The Sahara Desert is located in:", ["Asia", "Africa", "Australia", "South America"], 1],
    ["Which country has the largest land area?", ["Canada", "China", "USA", "Russia"], 3],
    ["The Amazon River flows mainly through:", ["Argentina", "Brazil", "Peru", "Colombia"], 1],
    ["What is the capital of Japan?", ["Osaka", "Kyoto", "Tokyo", "Hiroshima"], 2],
    ["The Equator passes through which of these countries?", ["Kenya", "Egypt", "Nigeria", "South Africa"], 0],
  ],
  Economics: [
    ["What does GDP stand for?", ["Gross Domestic Product", "General Domestic Price", "Gross Development Plan", "Global Domestic Product"], 0],
    ["A general rise in prices over time is called:", ["Deflation", "Inflation", "Recession", "Stagnation"], 1],
    ["When demand rises and supply stays the same, price usually:", ["Falls", "Rises", "Stays the same", "Becomes zero"], 1],
    ["A market with only one seller is a:", ["Monopoly", "Oligopoly", "Perfect competition", "Monopsony"], 0],
    ["The central bank of the United States is the:", ["Bank of America", "Federal Reserve", "US Treasury", "World Bank"], 1],
    ["The value of the next best alternative given up is called:", ["Sunk cost", "Opportunity cost", "Marginal cost", "Fixed cost"], 1],
    ["A tax on imported goods is called a:", ["Subsidy", "Tariff", "Quota", "Dividend"], 1],
    ["Two consecutive quarters of falling GDP is commonly called a:", ["Boom", "Recession", "Recovery", "Surplus"], 1],
    ["Which is a factor of production?", ["Money", "Labour", "Profit", "Price"], 1, "The factors are land, labour, capital and enterprise."],
    ["When a government spends more than it collects, it runs a:", ["Surplus", "Deficit", "Balance", "Dividend"], 1],
  ],
  "Current Affairs and Verified Historical Knowledge": [
    ["The United Nations was founded in:", ["1919", "1945", "1950", "1961"], 1],
    ["The euro was introduced as a currency (non-cash) in:", ["1995", "1999", "2002", "2008"], 1, "Notes and coins followed in 2002."],
    ["The African Union replaced the Organisation of African Unity in:", ["1963", "1994", "2002", "2010"], 2],
    ["The World Health Organization declared COVID-19 a pandemic in:", ["2019", "2020", "2021", "2022"], 1],
    ["The United Kingdom formally left the European Union in:", ["2016", "2018", "2020", "2022"], 2, "The vote was in 2016; exit was 31 January 2020."],
    ["Where is the headquarters of the United Nations?", ["Geneva", "New York City", "Paris", "Brussels"], 1],
    ["The first iPhone was released in:", ["2005", "2007", "2009", "2010"], 1],
    ["The International Space Station's first crew arrived in:", ["1998", "2000", "2004", "2011"], 1],
    ["ECOWAS stands for Economic Community of:", ["West African States", "Eastern African States", "World African States", "West Asian States"], 0],
    ["The Paris Agreement on climate change was adopted in:", ["2009", "2015", "2018", "2021"], 1],
  ],
  "Logical Reasoning": [
    ["What comes next: 2, 4, 8, 16, ?", ["18", "24", "32", "20"], 2, "Each number doubles."],
    ["If all roses are flowers and some flowers fade quickly, then:", ["All roses fade quickly", "Some roses fade quickly", "No conclusion about roses fading follows", "No roses fade"], 2],
    ["What comes next: 1, 1, 2, 3, 5, 8, ?", ["11", "12", "13", "14"], 2, "Fibonacci: 5 + 8 = 13."],
    ["Book is to reading as fork is to:", ["Drawing", "Eating", "Writing", "Stirring"], 1],
    ["If A > B and B > C, then:", ["C > A", "A > C", "A = C", "Cannot tell"], 1],
    ["Which is the odd one out?", ["Apple", "Banana", "Carrot", "Mango"], 2, "Carrot is a vegetable."],
    ["What comes next: Z, X, V, T, ?", ["S", "R", "Q", "P"], 1, "Skip one letter backwards each time."],
    ["If today is Monday, what day is it 10 days from now?", ["Wednesday", "Thursday", "Friday", "Tuesday"], 1],
    ["A clock shows 3:00. What is the angle between the hands?", ["45°", "60°", "90°", "120°"], 2],
    ["Five machines make five widgets in five minutes. How long do 100 machines take to make 100 widgets?", ["100 minutes", "5 minutes", "20 minutes", "1 minute"], 1, "Each machine makes one widget in five minutes."],
  ],
  "General Knowledge": [
    ["How many continents are there?", ["5", "6", "7", "8"], 2],
    ["Which planet is known as the Red Planet?", ["Venus", "Mars", "Jupiter", "Mercury"], 1],
    ["Who painted the Mona Lisa?", ["Michelangelo", "Raphael", "Leonardo da Vinci", "Van Gogh"], 2],
    ["How many days are in a leap year?", ["364", "365", "366", "367"], 2],
    ["Which is the largest planet in our solar system?", ["Saturn", "Jupiter", "Neptune", "Earth"], 1],
    ["What is the freezing point of water in Celsius?", ["0 °C", "32 °C", "-10 °C", "100 °C"], 0],
    ["Who wrote “Romeo and Juliet”?", ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"], 1],
    ["How many sides does a hexagon have?", ["5", "6", "7", "8"], 1],
    ["Which instrument has 88 keys?", ["Guitar", "Violin", "Piano", "Flute"], 2],
    ["Who wrote “Things Fall Apart”?", ["Wole Soyinka", "Chinua Achebe", "Ngũgĩ wa Thiong'o", "Chimamanda Adichie"], 1],
  ],
};

export const QUESTIONS: Question[] = Object.entries(BANK).flatMap(([category, rows]) =>
  rows.map(([prompt, options, answer, explanation], i) => ({
    id: `${category.slice(0, 4).toLowerCase()}-${i + 1}`,
    category: category as Question["category"],
    prompt,
    options,
    answer,
    ...(explanation ? { explanation } : {}),
  })),
);

export const questionsFor = (category: Question["category"]) => QUESTIONS.filter((q) => q.category === category);
