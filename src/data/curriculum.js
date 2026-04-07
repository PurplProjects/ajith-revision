// Subjects metadata and revision content
// Questions are in questions/*.js and imported below

import { englishQuestions } from './questions/english'
import { mathsQuestions } from './questions/maths'
import { biologyQuestions } from './questions/biology'
import { chemistryQuestions } from './questions/chemistry'
import { physicsQuestions } from './questions/physics'
import { historyQuestions } from './questions/history'
import { geographyQuestions } from './questions/geography'
import { spanishQuestions } from './questions/spanish'
import { latinQuestions } from './questions/latin'
import { mandarinQuestions } from './questions/mandarin'

export const SUBJECTS = [
  {
    id: 'english', name: 'English', icon: '✏️',
    color: '#378ADD', bgColor: '#E6F1FB', textColor: '#0C447C',
    description: 'Literature, language and creative writing',
    topics: [
      { id: 'english-novel', title: 'Modern novel', content: [
        { heading: 'Set text study', points: [
          'Year 7 texts include: Private Peaceful, Noughts & Crosses, The Boy in the Striped Pyjamas, Goodnight Mister Tom.',
          'Identify the main themes: friendship, war, injustice, loss, identity.',
          'Analyse key characters — how do they change across the novel?',
          'Setting and atmosphere — how does the author use place and time?',
          'Narrative voice — who is telling the story and why does it matter?',
        ]},
        { heading: 'PEE paragraphs', points: [
          'Point — state your argument clearly in one sentence.',
          'Evidence — quote directly from the text (keep it short).',
          'Explanation — explain what the quote shows and its effect on the reader.',
          'Always link back to the question or theme at the end.',
        ]},
      ], tip: 'Re-read two key chapters. Write one PEE paragraph on a theme such as friendship or injustice.' },
      { id: 'english-poetry', title: 'Poetry', content: [
        { heading: 'Poetic devices', points: [
          'Simile — comparison using "like" or "as".',
          'Metaphor — direct comparison without like/as.',
          'Personification — giving human qualities to non-human things.',
          'Alliteration — repeated consonant sounds at the start of words.',
          'Onomatopoeia — words that sound like what they describe.',
          'Enjambment — a sentence running over from one line to the next.',
        ]},
        { heading: 'Structure and form', points: [
          'Rhyme scheme: label end rhymes ABAB, ABCB, AABB.',
          'Free verse — no regular rhyme or rhythm.',
          'Tone = the speaker\'s attitude. Mood = how the reader feels.',
        ]},
      ], tip: 'Annotate a poem fully then write a PEE paragraph on one technique.' },
      { id: 'english-grammar', title: 'Grammar & writing', content: [
        { heading: 'Sentence types', points: [
          'Simple — one main clause.',
          'Compound — two main clauses joined by and/but/or.',
          'Complex — main clause + subordinate clause.',
        ]},
        { heading: 'Punctuation', points: [
          'Comma — separates items or clauses.',
          'Semicolon — links two related main clauses.',
          'Colon — introduces a list or explanation.',
          'Apostrophe — possession or contraction.',
        ]},
      ], tip: 'Write a descriptive paragraph using all five senses and three different sentence types.' },
      { id: 'english-comprehension', title: 'Reading comprehension', content: [
        { heading: 'Key skills', points: [
          'Retrieval — find and quote information directly.',
          'Inference — work out implied meaning.',
          'Analysis — explain why the writer made a language choice.',
          'Evaluation — comment on how effective the choices are.',
        ]},
      ], tip: 'Find a short article and write one retrieval and one inference question, then answer both.' },
    ],
  },
  {
    id: 'maths', name: 'Maths', icon: '➕',
    color: '#BA7517', bgColor: '#FAEEDA', textColor: '#633806',
    description: 'Number, algebra, geometry and statistics',
    topics: [
      { id: 'maths-number', title: 'Number', content: [
        { heading: 'Fractions, decimals, percentages', points: [
          'Convert fraction to decimal: divide numerator by denominator.',
          'Convert decimal to percentage: multiply by 100.',
          'Percentage of an amount: divide by 100, then multiply.',
          'HCF: largest number dividing into both. LCM: smallest number both divide into.',
        ]},
      ], tip: 'Find HCF and LCM of 12 and 18. Write all prime numbers to 50.' },
      { id: 'maths-algebra', title: 'Algebra', content: [
        { heading: 'Expressions and equations', points: [
          'Collect like terms: 3x + 2x = 5x.',
          'Expand brackets: 3(x+4) = 3x+12.',
          'Solve equations: do the same to both sides.',
          'nth term of a sequence: find the common difference.',
        ]},
      ], tip: 'Solve 5 equations of increasing difficulty, showing all steps.' },
      { id: 'maths-geometry', title: 'Geometry', content: [
        { heading: 'Angles and shapes', points: [
          'Angles on a straight line sum to 180°.',
          'Angles in a triangle sum to 180°.',
          'Area of rectangle = length × width.',
          'Area of triangle = ½ × base × height.',
          'Volume of cuboid = length × width × height.',
        ]},
      ], tip: 'Draw a compound shape and calculate its area by splitting into rectangles.' },
      { id: 'maths-statistics', title: 'Statistics & probability', content: [
        { heading: 'Averages', points: [
          'Mean: add all values, divide by how many.',
          'Median: middle value when ordered.',
          'Mode: most common value.',
          'Range: largest minus smallest.',
          'Probability: P(event) = favourable outcomes ÷ total outcomes.',
        ]},
      ], tip: 'Find mean, median, mode and range of: 4, 7, 2, 9, 7, 3, 8.' },
    ],
  },
  {
    id: 'biology', name: 'Biology', icon: '🧬',
    color: '#1D9E75', bgColor: '#E1F5EE', textColor: '#085041',
    description: 'Cells, organisation, ecosystems and reproduction',
    topics: [
      { id: 'biology-cells', title: 'Cells', content: [
        { heading: 'Cell structures', points: [
          'Animal cell: membrane, cytoplasm, nucleus, mitochondria, ribosomes.',
          'Plant cell adds: cell wall, chloroplasts, permanent vacuole.',
          'Nucleus controls the cell and contains DNA.',
          'Mitochondria: site of respiration — releases energy.',
          'Chloroplasts: site of photosynthesis.',
        ]},
      ], tip: 'Draw and label animal and plant cells from memory.' },
      { id: 'biology-organisation', title: 'Organisation', content: [
        { heading: 'Levels of organisation', points: [
          'Cell → Tissue → Organ → Organ system → Organism.',
          'Digestive system: mouth → oesophagus → stomach → small intestine → large intestine.',
          'Each organ has a specific function within its system.',
        ]},
      ], tip: 'Draw the digestive system and label each organ with its function.' },
      { id: 'biology-ecosystems', title: 'Ecosystems', content: [
        { heading: 'Food chains and webs', points: [
          'Arrow in food chain = "eaten by" — shows energy flow.',
          'Producer → Primary consumer → Secondary consumer → Tertiary consumer.',
          'Producers are always plants.',
          'If one population changes, the whole chain is affected.',
        ]},
      ], tip: 'Write a food chain with 4 organisms and explain what happens if one is removed.' },
      { id: 'biology-reproduction', title: 'Reproduction', content: [
        { heading: 'Types of reproduction', points: [
          'Sexual reproduction: involves two parents, produces variation.',
          'Asexual reproduction: one parent, offspring identical (clones).',
          'Advantages of sexual: variation helps adaptation.',
          'Advantages of asexual: faster, no partner needed.',
        ]},
      ], tip: 'Compare sexual and asexual reproduction in a table with three differences.' },
    ],
  },
  {
    id: 'chemistry', name: 'Chemistry', icon: '⚗️',
    color: '#7F77DD', bgColor: '#EEEDFE', textColor: '#3C3489',
    description: 'States of matter, elements, compounds and reactions',
    topics: [
      { id: 'chemistry-states', title: 'States of matter', content: [
        { heading: 'Particle model', points: [
          'Solid: close together, regular arrangement, vibrate only.',
          'Liquid: close but random, can flow.',
          'Gas: far apart, move fast and randomly.',
          'Melting: solid → liquid. Boiling: liquid → gas.',
          'Condensing: gas → liquid. Freezing: liquid → solid.',
        ]},
      ], tip: 'Draw particle diagrams for solid, liquid and gas from memory.' },
      { id: 'chemistry-elements', title: 'Elements & compounds', content: [
        { heading: 'Pure substances and mixtures', points: [
          'Element: one type of atom only.',
          'Compound: two or more elements chemically joined.',
          'Mixture: substances not chemically joined — can be separated.',
          'Filtration: insoluble solid from liquid.',
          'Distillation: liquids with different boiling points.',
          'Chromatography: mixtures of dyes.',
        ]},
      ], tip: 'Give an example of an element, compound and mixture with a reason for each.' },
      { id: 'chemistry-acids', title: 'Acids & alkalis', content: [
        { heading: 'pH scale', points: [
          'pH 0–6: acid. pH 7: neutral. pH 8–14: alkali.',
          'Strong acids: pH 1–2 (hydrochloric, sulfuric).',
          'Strong alkalis: pH 12–14 (sodium hydroxide).',
          'Indicators change colour to show pH.',
          'Neutralisation: acid + alkali → salt + water.',
        ]},
      ], tip: 'Write the pH scale and give one example at each end.' },
      { id: 'chemistry-separation', title: 'Separation techniques', content: [
        { heading: 'Methods', points: [
          'Filtration: separates insoluble solid from liquid.',
          'Evaporation: removes water to leave dissolved solid.',
          'Distillation: separates liquids by boiling point.',
          'Chromatography: separates dissolved substances by how far they travel.',
        ]},
      ], tip: 'Explain which technique you would use to get salt from salt water and why.' },
    ],
  },
  {
    id: 'physics', name: 'Physics', icon: '⚡',
    color: '#D85A30', bgColor: '#FAECE7', textColor: '#712B13',
    description: 'Forces, motion, energy, electricity and waves',
    topics: [
      { id: 'physics-forces', title: 'Forces', content: [
        { heading: 'Types and effects of forces', points: [
          'Force measured in Newtons (N) using a newton-meter.',
          'Gravity: pulls objects towards Earth.',
          'Friction: opposes motion between surfaces.',
          'Upthrust: upward force from liquid on an object.',
          'Balanced forces: object stays still or moves at constant speed.',
          'Unbalanced forces: object accelerates or decelerates.',
        ]},
      ], tip: 'Identify balanced and unbalanced forces in three everyday situations.' },
      { id: 'physics-motion', title: 'Speed & motion', content: [
        { heading: 'Calculating speed', points: [
          'Speed = distance ÷ time (m/s or km/h).',
          'Distance-time graph: slope = speed. Horizontal = stationary.',
          'Steeper slope = faster speed.',
        ]},
      ], tip: 'Draw a distance-time graph: 5s stationary, 10s fast, 5s slower. Calculate speed each section.' },
      { id: 'physics-energy', title: 'Energy', content: [
        { heading: 'Energy types and transfers', points: [
          'Types: kinetic, gravitational potential, elastic, thermal, chemical, electrical, light, sound.',
          'Energy is conserved — transfers between forms, never disappears.',
          'Useful energy vs wasted energy (heat).',
        ]},
      ], tip: 'Trace the energy transfers when a torch is switched on.' },
      { id: 'physics-electricity', title: 'Electricity', content: [
        { heading: 'Circuits', points: [
          'Series circuit: one path. Components share the voltage.',
          'Parallel circuit: multiple paths. Each component gets full voltage.',
          'Current measured in amps (A) with ammeter in series.',
          'Voltage measured in volts (V) with voltmeter in parallel.',
        ]},
      ], tip: 'Draw a series and a parallel circuit with two bulbs each. Label current and voltage.' },
      { id: 'physics-waves', title: 'Light & sound', content: [
        { heading: 'Wave properties', points: [
          'Light travels in straight lines. Reflects off smooth surfaces.',
          'Refraction: light bends when it changes medium (e.g. air to glass).',
          'Sound: caused by vibrations. Travels as a wave.',
          'Pitch: frequency of vibration. Loudness: amplitude.',
          'Sound cannot travel through a vacuum.',
        ]},
      ], tip: 'Draw a ray diagram for reflection in a plane mirror with correct angles.' },
    ],
  },
  {
    id: 'history', name: 'History', icon: '🏛️',
    color: '#D85A30', bgColor: '#FAECE7', textColor: '#712B13',
    description: 'World Civilisations, the Tudors and historical skills',
    topics: [
      { id: 'history-civilisations', title: 'World Civilisations', content: [
        { heading: 'Key civilisations', points: [
          'Benin: West Africa, famous for bronze art, powerful Oba ruler.',
          'Mansa Musa: ruler of Mali c.1312, one of the wealthiest people in history.',
          'Baghdad: Islamic Golden Age — advances in maths, medicine, astronomy.',
          'These civilisations were sophisticated long before European contact.',
        ]},
      ], tip: 'Write a significance paragraph for one civilisation using two pieces of evidence.' },
      { id: 'history-tudors', title: 'The Tudors', content: [
        { heading: 'Tudor monarchs', points: [
          'Henry VII (1485): ended Wars of the Roses, founded Tudor dynasty.',
          'Henry VIII (1509): Break with Rome, six wives, Church of England.',
          'Edward VI (1547): Protestant king, died aged 15.',
          'Mary I (1553): Catholic, burned Protestants.',
          'Elizabeth I (1558): Protestant, defeated Spanish Armada 1588.',
        ]},
      ], tip: 'Make a timeline of the five Tudors with one key event per reign.' },
      { id: 'history-skills', title: 'Historical skills', content: [
        { heading: 'Concepts', points: [
          'Causation: why did something happen?',
          'Consequence: what were the effects?',
          'Significance: why does it matter?',
          'Primary source: created at the time.',
          'Secondary source: created later by a historian.',
        ]},
      ], tip: 'Write a PEEL paragraph answering: "Why was Henry VIII\'s Break with Rome significant?"' },
    ],
  },
  {
    id: 'geography', name: 'Geography', icon: '🌍',
    color: '#1D9E75', bgColor: '#E1F5EE', textColor: '#085041',
    description: 'Physical and human geography, maps and fieldwork',
    topics: [
      { id: 'geography-rivers', title: 'Rivers', content: [
        { heading: 'River features', points: [
          'Source: where a river begins. Mouth: where it meets the sea.',
          'Erosion: hydraulic action, abrasion, attrition, solution.',
          'Features: V-shaped valley, waterfall, meander, floodplain, delta.',
          'Waterfall: hard rock over soft rock — soft erodes, creating plunge pool.',
        ]},
      ], tip: 'Draw a labelled river from source to mouth showing 4 features.' },
      { id: 'geography-climate', title: 'Climate & weather', content: [
        { heading: 'Key concepts', points: [
          'Weather: short-term. Climate: average over 30+ years.',
          'Factors: latitude, altitude, distance from sea, prevailing winds.',
          'UK: cool temperate maritime — mild and wet.',
          'Earthquakes at plate boundaries. Richter scale measures magnitude.',
        ]},
      ], tip: 'Explain why London is milder than Moscow despite similar latitude.' },
      { id: 'geography-human', title: 'Human geography', content: [
        { heading: 'Population and development', points: [
          'Birth rate: births per 1,000 people per year.',
          'Natural increase = birth rate − death rate.',
          'HDI: combines income, education and life expectancy.',
          'Urbanisation: growing proportion living in cities.',
          'Push factors (poverty) vs pull factors (jobs) drive migration.',
        ]},
      ], tip: 'Compare a MEDC and LEDC using GDP, life expectancy and literacy rate.' },
      { id: 'geography-maps', title: 'Map skills', content: [
        { heading: 'Reading maps', points: [
          '4-figure grid reference: go along then up.',
          '6-figure: more precise point location.',
          'Contour lines close together = steep slope.',
          'Scale: calculate real distances from map.',
        ]},
      ], tip: 'Practice giving 6-figure grid references and interpreting contour patterns.' },
    ],
  },
  {
    id: 'spanish', name: 'Spanish', icon: '🇪🇸',
    color: '#D85A30', bgColor: '#FAECE7', textColor: '#712B13',
    description: 'Vocabulary, grammar, verbs and translation',
    topics: [
      { id: 'spanish-vocab', title: 'Vocabulary', content: [
        { heading: 'Core topic areas', points: [
          'Greetings: Hola, Buenos días, ¿Cómo te llamas? Me llamo...',
          'Numbers 1–100, days of the week, months.',
          'Family: madre, padre, hermano, hermana, abuelo.',
          'School subjects and opinions: Me gusta / No me gusta.',
          'Food and drink: la comida, el agua, la leche.',
        ]},
      ], tip: '10 vocabulary flashcards per day — test yourself after 24 hours.' },
      { id: 'spanish-grammar', title: 'Grammar', content: [
        { heading: 'Key grammar rules', points: [
          'Nouns: el (m) / la (f). Plural: los / las.',
          'Adjectives follow the noun: un chico alto.',
          'Adjective agreement: alto (m) / alta (f).',
          'Negative: put no before the verb: No hablo español.',
        ]},
      ], tip: 'Write 6 sentences about yourself covering name, age, family and hobbies.' },
      { id: 'spanish-verbs', title: 'Verbs', content: [
        { heading: 'Key verb conjugations', points: [
          'Ser (to be): soy, eres, es, somos, sois, son.',
          'Tener (to have): tengo, tienes, tiene, tenemos, tenéis, tienen.',
          'Ir (to go): voy, vas, va, vamos, vais, van.',
          'Gustar (to like): me gusta / me gustan.',
        ]},
      ], tip: 'Conjugate ser, tener and ir from memory, then use each in a sentence.' },
      { id: 'spanish-translation', title: 'Translation', content: [
        { heading: 'Translation strategies', points: [
          'Read the whole sentence before translating.',
          'Check verb tense — present, past or future?',
          'Watch for "false friends" — words that look like English but mean something different.',
          'Use context to work out unknown words.',
        ]},
      ], tip: 'Translate 5 sentences into Spanish and 5 from Spanish to English.' },
    ],
  },
  {
    id: 'latin', name: 'Latin', icon: '🏺',
    color: '#888780', bgColor: '#F1EFE8', textColor: '#444441',
    description: 'Cambridge Latin Course — cases, verbs and translation',
    topics: [
      { id: 'latin-nouns', title: 'Nouns & cases', content: [
        { heading: 'The case system', points: [
          'Latin has no word for "the" or "a".',
          'Nominative: the subject — who does the action.',
          'Accusative: the object — who receives the action.',
          'Genitive: possession — "of" (e.g. puellae = of the girl).',
          'Dative: indirect object — "to/for".',
          'Ablative: "by/with/from".',
        ]},
      ], tip: 'Write the nominative and accusative of: puella, servus, canis.' },
      { id: 'latin-verbs', title: 'Verbs', content: [
        { heading: '1st conjugation present tense', points: [
          'amare (to love): amo, amas, amat, amamus, amatis, amant.',
          'portare (to carry): porto, portas, portat, portamus, portatis, portant.',
          'The ending tells you who is doing the action.',
          '2nd conjugation: -eo endings — video, vides, videt...',
        ]},
      ], tip: 'Conjugate amare and videre from memory, then translate 3 sentences.' },
      { id: 'latin-translation', title: 'Translation', content: [
        { heading: 'Translation method', points: [
          'Find the verb first — it tells you the action.',
          'Find the nominative (subject) — who does it.',
          'Find the accusative (object) — who receives it.',
          'Word order is flexible in Latin — endings matter more than position.',
          'Cambridge Latin Course characters: Caecilius, Metella, Quintus, Grumio.',
        ]},
      ], tip: 'Translate: "Caecilius in tablino laborat. Metella in atrio sedet."' },
      { id: 'latin-culture', title: 'Roman culture', content: [
        { heading: 'Life in Roman Pompeii', points: [
          'Pompeii: Roman town buried by Vesuvius eruption in 79 AD.',
          'Roman house: atrium (entrance hall), tablinum (study), triclinium (dining room).',
          'Roles: paterfamilias (male head), slaves, freedmen.',
          'Roman society was highly stratified — senators, equites, plebs, slaves.',
        ]},
      ], tip: 'Draw a labelled plan of a Roman house with the correct room names.' },
    ],
  },
  {
    id: 'mandarin', name: 'Mandarin', icon: '🇨🇳',
    color: '#D85A30', bgColor: '#FAECE7', textColor: '#712B13',
    description: 'Tones, Pinyin, vocabulary and basic sentences',
    topics: [
      { id: 'mandarin-tones', title: 'Tones & Pinyin', content: [
        { heading: 'The four tones', points: [
          '1st tone (ˉ): high and level — mā (mother).',
          '2nd tone (ˊ): rising — máo (hair).',
          '3rd tone (ˇ): falls then rises — mǎ (horse).',
          '4th tone (ˋ): falling sharply — mà (to scold).',
          'Neutral tone: short and unstressed — ma (question particle).',
          'Same syllable, different tone = completely different word.',
        ]},
      ], tip: 'Practise saying: mā, máo, mǎ, mà. Record yourself and compare.' },
      { id: 'mandarin-vocab', title: 'Core vocabulary', content: [
        { heading: 'Essential words', points: [
          'Greetings: 你好 Nǐ hǎo (hello), 谢谢 Xièxiè (thank you), 再见 Zàijiàn (goodbye).',
          'Numbers: 一 yī, 二 èr, 三 sān, 四 sì, 五 wǔ, 六 liù, 七 qī, 八 bā, 九 jiǔ, 十 shí.',
          'Family: 妈妈 māmā (mum), 爸爸 bàba (dad), 哥哥 gēgē (older brother).',
          'Colours: 红 hóng (red), 蓝 lán (blue), 绿 lǜ (green), 白 bái (white), 黑 hēi (black).',
        ]},
      ], tip: 'Write the numbers 1–10 in characters and Pinyin from memory.' },
      { id: 'mandarin-characters', title: 'Characters', content: [
        { heading: 'Basic characters', points: [
          'Chinese is written in characters — each represents a syllable/meaning.',
          '人 rén (person), 大 dà (big), 小 xiǎo (small), 山 shān (mountain), 水 shuǐ (water).',
          'Radicals: components that give a hint to meaning or pronunciation.',
          'Stroke order matters — always follow the correct sequence.',
        ]},
      ], tip: 'Practise writing: 人, 大, 小, 山, 水. Look up the stroke order for each.' },
      { id: 'mandarin-sentences', title: 'Basic sentences', content: [
        { heading: 'Sentence patterns', points: [
          'Subject + Verb + Object: 我 吃 饭 Wǒ chī fàn (I eat rice).',
          '我叫... Wǒ jiào... (My name is...)',
          '我是... Wǒ shì... (I am...)',
          '你好吗? Nǐ hǎo ma? (How are you?) 我很好 Wǒ hěn hǎo (I am very well).',
          'Question particle 吗 ma turns a statement into a yes/no question.',
        ]},
      ], tip: 'Write 5 sentences about yourself in Pinyin: name, age, family, nationality, hobby.' },
    ],
  },
]

export const getSubject = (id) => SUBJECTS.find(s => s.id === id)
export const getTopic = (subjectId, topicId) => getSubject(subjectId)?.topics.find(t => t.id === topicId)

export const getAllQuestions = () => [
  ...englishQuestions,
  ...mathsQuestions,
  ...biologyQuestions,
  ...chemistryQuestions,
  ...physicsQuestions,
  ...historyQuestions,
  ...geographyQuestions,
  ...spanishQuestions,
  ...latinQuestions,
  ...mandarinQuestions,
]
