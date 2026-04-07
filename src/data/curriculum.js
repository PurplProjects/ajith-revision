// Full curriculum data for Ajith — Year 7, Brentwood School Essex
// Each subject has topics with revision content and assignments with questions
// Questions are seeded into the database on first load

export const SUBJECTS = [
  {
    id: 'english',
    name: 'English',
    icon: '✏️',
    color: '#378ADD',
    bgColor: '#E6F1FB',
    textColor: '#0C447C',
    description: 'Literature, language and creative writing',
    topics: [
      {
        id: 'english-novel',
        title: 'Modern novel',
        content: [
          {
            heading: 'Set text study',
            points: [
              'Year 7 texts include: Private Peaceful (Morpurgo), Noughts & Crosses (Blackman), The Boy in the Striped Pyjamas (Boyne), Goodnight Mister Tom (Magorian).',
              'Identify the main themes: friendship, war, injustice, loss, identity.',
              'Analyse key characters — how do they change across the novel?',
              'Setting and atmosphere — how does the author use place and time?',
              'Narrative voice — who is telling the story, and why does it matter?',
            ]
          },
          {
            heading: 'PEE paragraphs',
            points: [
              'Point — state your argument clearly in one sentence.',
              'Evidence — quote directly from the text (keep it short).',
              'Explanation — explain what the quote shows and what effect it has on the reader.',
              'Always link back to the question or theme at the end of your paragraph.',
            ]
          },
          {
            heading: 'Context',
            points: [
              'Context means the historical, social or cultural background to the text.',
              'Ask: when was it written? What was happening in the world then?',
              'Link context to meaning — how does it affect the author\'s choices?',
            ]
          }
        ],
        tip: 'Re-read two or three key chapters. Write one PEE paragraph on a theme such as friendship or injustice. Always quote from the text.'
      },
      {
        id: 'english-poetry',
        title: 'Poetry',
        content: [
          {
            heading: 'Reading and annotating',
            points: [
              'Before analysing, identify: speaker, occasion, setting, subject.',
              'Read the poem at least twice before annotating.',
              'Underline unfamiliar words and think about why the poet chose them.',
            ]
          },
          {
            heading: 'Poetic devices',
            points: [
              'Simile — comparison using "like" or "as" (e.g. "brave as a lion").',
              'Metaphor — direct comparison without "like/as" (e.g. "he is a lion").',
              'Personification — giving human qualities to non-human things.',
              'Alliteration — repeated consonant sounds at the start of words.',
              'Onomatopoeia — words that sound like what they describe (crash, buzz).',
              'Sibilance — repeated "s" sounds for a hissing or whispering effect.',
              'Enjambment — a sentence running over from one line into the next.',
            ]
          },
          {
            heading: 'Rhyme and rhythm',
            points: [
              'Rhyme scheme: label end rhymes ABAB, ABCB, AABB, etc.',
              'Free verse has no regular rhyme or rhythm — identify why the poet chose this.',
              'Iambic pentameter: da-DUM repeated 5 times per line (Shakespeare\'s favourite).',
            ]
          },
          {
            heading: 'Tone, mood and atmosphere',
            points: [
              'Tone = the speaker\'s attitude (e.g. bitter, celebratory, melancholic).',
              'Mood = how the poem makes the reader feel.',
              'Look at adjectives, verbs and punctuation to identify both.',
            ]
          },
          {
            heading: 'Comparing poems',
            points: [
              'Use: "Similarly…", "In contrast…", "Both poets…", "However…"',
              'Compare theme, tone, language devices and structure.',
              'Always link comparisons back to the central theme or question.',
            ]
          }
        ],
        tip: 'Choose any poem and annotate it fully. Then write a PEE paragraph on one technique the poet uses. Always explain the effect on the reader — don\'t just name the device.'
      },
      {
        id: 'english-grammar',
        title: 'Grammar & writing',
        content: [
          {
            heading: 'Sentence types',
            points: [
              'Simple — one main clause: "The dog barked."',
              'Compound — two main clauses joined by and/but/or: "The dog barked and ran away."',
              'Complex — a main clause + subordinate clause: "Although it was raining, they played outside."',
              'Using a variety of sentence types improves your writing grade significantly.',
            ]
          },
          {
            heading: 'Punctuation',
            points: [
              'Comma — separates items in a list, or clauses: "After eating, she rested."',
              'Semicolon — links two related main clauses: "It was cold; she wore her coat."',
              'Colon — introduces a list or explanation: "He needed three things: bread, milk, and eggs."',
              'Apostrophe — possession (Tom\'s bag) or contraction (it\'s = it is).',
              'Inverted commas — used for speech and quotations.',
            ]
          },
          {
            heading: 'Writing techniques',
            points: [
              'Persuasive: rhetorical questions, rule of three, direct address ("you"), statistics.',
              'Descriptive: sensory language (sight, sound, smell, touch, taste), metaphors, varied sentence lengths.',
              'Formal register: no contractions, no slang, third person.',
              'Always plan before writing — even a brief bullet list helps structure.',
            ]
          }
        ],
        tip: 'Write a short paragraph (8–10 sentences) describing your bedroom using all five senses. Then write a second paragraph trying to persuade someone to visit Brentwood School.'
      },
      {
        id: 'english-comprehension',
        title: 'Reading comprehension',
        content: [
          {
            heading: 'Key skills',
            points: [
              'Retrieval — find and quote information directly from the text.',
              'Inference — work out meaning that is implied but not stated directly.',
              'Analysis — explain why the writer made a particular language choice.',
              'Evaluation — comment on how effective the writer\'s choices are.',
            ]
          },
          {
            heading: 'Answering questions well',
            points: [
              'Always quote evidence from the text — never just paraphrase.',
              'For inference questions, use "This suggests…" or "This implies…"',
              'For analysis, name the technique, quote it, then explain its effect.',
              'Check how many marks a question is worth — this tells you how much to write.',
            ]
          }
        ],
        tip: 'Find a short news article or magazine extract and practise writing an inference question and a retrieval question about it — then answer them yourself.'
      }
    ],
    assignment: {
      id: 'english-assignment',
      title: 'English assignment',
      questions: [
        {
          id: 'eng-q1',
          type: 'multiple_choice',
          question: 'Which poetic device is used in the phrase "the wind whispered through the willows"?',
          options: [
            'Alliteration and personification',
            'Simile and metaphor',
            'Onomatopoeia and hyperbole',
            'Rhyme and rhythm'
          ],
          correct_index: 0,
          explanation: 'The repeated "w" sound is alliteration. "Whispered" gives the wind a human quality, which is personification.'
        },
        {
          id: 'eng-q2',
          type: 'multiple_choice',
          question: 'In poetry, what does "enjambment" mean?',
          options: [
            'A pause at the end of a line',
            'When a sentence runs over from one line into the next',
            'A repeated sound at the start of words',
            'A line with exactly ten syllables'
          ],
          correct_index: 1,
          explanation: 'Enjambment is when a sentence or phrase continues beyond the end of a line without a pause, creating momentum.'
        },
        {
          id: 'eng-q3',
          type: 'short_answer',
          question: 'Read this extract and write a PEE paragraph about what it reveals about the character. Use Point, Evidence, Explanation.',
          extract: '"He had never once looked back at the village as he walked away, and he did not look back now."',
          placeholder: 'Start with your Point (what this shows about the character), then quote the Evidence, then Explain the effect...'
        },
        {
          id: 'eng-q4',
          type: 'multiple_choice',
          question: 'Which of the following is an example of a complex sentence?',
          options: [
            'The cat sat on the mat.',
            'She ran fast and she won the race.',
            'Although it was raining, they decided to go for a walk.',
            'He ate his dinner.'
          ],
          correct_index: 2,
          explanation: 'A complex sentence has a main clause and a subordinate clause. "Although it was raining" is the subordinate clause.'
        },
        {
          id: 'eng-q5',
          type: 'short_answer',
          question: 'Write two sentences describing a stormy night, using at least two different language techniques. Name the techniques you have used.',
          placeholder: 'Write your two sentences here, then label which techniques you used and why...'
        }
      ]
    }
  },

  {
    id: 'maths',
    name: 'Maths',
    icon: '➕',
    color: '#BA7517',
    bgColor: '#FAEEDA',
    textColor: '#633806',
    description: 'Number, algebra, geometry and statistics',
    topics: [
      {
        id: 'maths-number',
        title: 'Number',
        content: [
          {
            heading: 'Place value and ordering',
            points: [
              'Place value: units, tens, hundreds, thousands, ten-thousands.',
              'Ordering integers and decimals on a number line.',
              'Negative numbers: ordering and four operations with negatives.',
              'Rules: negative × negative = positive, negative × positive = negative.',
            ]
          },
          {
            heading: 'Fractions, decimals, percentages',
            points: [
              'Convert fraction to decimal: divide numerator by denominator.',
              'Convert decimal to percentage: multiply by 100.',
              'Equivalent fractions: multiply/divide top and bottom by the same number.',
              'Adding fractions: find a common denominator first.',
              'Percentage of an amount: divide by 100, then multiply.',
            ]
          },
          {
            heading: 'Factors, multiples and primes',
            points: [
              'Factor: a number that divides exactly into another (factors of 12: 1,2,3,4,6,12).',
              'Multiple: results of multiplying a number (multiples of 4: 4,8,12,16…).',
              'Prime: only divisible by 1 and itself (2,3,5,7,11,13,17,19…).',
              'HCF (Highest Common Factor): largest number dividing into both.',
              'LCM (Lowest Common Multiple): smallest number both divide into.',
              'Index notation: 2³ = 2×2×2 = 8. Square roots: √64 = 8.',
            ]
          }
        ],
        tip: 'Test yourself: write down all prime numbers up to 50 from memory. Then find the HCF and LCM of 12 and 18.'
      },
      {
        id: 'maths-algebra',
        title: 'Algebra',
        content: [
          {
            heading: 'Expressions and simplifying',
            points: [
              'Like terms: only combine terms with the same letter (3x + 2x = 5x, but 3x + 2y cannot be simplified).',
              'Expanding brackets: multiply everything inside by what\'s outside. 3(x+4) = 3x+12.',
              'Substitution: replace letters with numbers. If x=3, then 2x+1 = 7.',
            ]
          },
          {
            heading: 'Solving equations',
            points: [
              'Do the same thing to both sides to keep the equation balanced.',
              'One-step: x + 5 = 12 → x = 7.',
              'Two-step: 3x + 2 = 14 → 3x = 12 → x = 4.',
              'With brackets: 2(x+3) = 10 → 2x+6 = 10 → 2x = 4 → x = 2.',
            ]
          },
          {
            heading: 'Sequences',
            points: [
              'Term-to-term rule: describe what you do to get from one term to the next.',
              'Linear sequences: a constant amount added each time.',
              'nth term formula: if the sequence is 3, 7, 11, 15… the nth term is 4n−1.',
              'Test: substitute n=1,2,3 into your formula to check it works.',
            ]
          }
        ],
        tip: 'Write out 5 equations of increasing difficulty and solve them, showing every step. Check by substituting your answer back in.'
      },
      {
        id: 'maths-geometry',
        title: 'Geometry & measures',
        content: [
          {
            heading: 'Angles',
            points: [
              'Angles on a straight line sum to 180°.',
              'Angles around a point sum to 360°.',
              'Angles in a triangle sum to 180°.',
              'Angles in a quadrilateral sum to 360°.',
              'Vertically opposite angles are equal.',
            ]
          },
          {
            heading: 'Area and perimeter',
            points: [
              'Rectangle: Area = length × width. Perimeter = 2(l+w).',
              'Triangle: Area = ½ × base × height.',
              'Compound shapes: split into rectangles and triangles.',
              'Volume of cuboid: length × width × height.',
              'Surface area: find area of each face and add together.',
            ]
          },
          {
            heading: 'Coordinates and transformations',
            points: [
              'Coordinates: always x then y — "along the corridor, up the stairs".',
              'All four quadrants: x can be negative (left) and y can be negative (down).',
              'Reflection: flip over a mirror line — each point equidistant from the line.',
              'Rotation: state centre, angle and direction (clockwise/anticlockwise).',
              'Translation: describe as a vector — (3, −2) means 3 right, 2 down.',
            ]
          }
        ],
        tip: 'Draw a compound shape, calculate its area by splitting it into rectangles. Then reflect it in the y-axis on a coordinate grid.'
      },
      {
        id: 'maths-statistics',
        title: 'Statistics & probability',
        content: [
          {
            heading: 'Averages and range',
            points: [
              'Mean: add all values, divide by how many there are.',
              'Median: middle value when data is ordered. If even count, average the two middle values.',
              'Mode: most common value (can be more than one).',
              'Range: largest value minus smallest value.',
            ]
          },
          {
            heading: 'Charts and graphs',
            points: [
              'Bar charts: use for discrete/categorical data. Bars must not touch.',
              'Pie charts: total = 360°. Calculate each slice as a fraction of 360.',
              'Frequency tables: tally marks, then add up for frequency.',
            ]
          },
          {
            heading: 'Probability',
            points: [
              'Probability is always between 0 (impossible) and 1 (certain).',
              'P(event) = number of favourable outcomes ÷ total outcomes.',
              'P(not happening) = 1 − P(happening).',
              'List all possible outcomes systematically (sample space).',
            ]
          }
        ],
        tip: 'Find the mean, median, mode and range of this data set: 4, 7, 2, 9, 7, 3, 8. Then calculate the probability of rolling a 5 on a standard die.'
      }
    ],
    assignment: {
      id: 'maths-assignment',
      title: 'Maths assignment',
      questions: [
        {
          id: 'mth-q1',
          type: 'multiple_choice',
          question: 'What is the Highest Common Factor (HCF) of 24 and 36?',
          options: ['4', '6', '12', '72'],
          correct_index: 2,
          explanation: 'Factors of 24: 1,2,3,4,6,8,12,24. Factors of 36: 1,2,3,4,6,9,12,18,36. The highest common factor is 12.'
        },
        {
          id: 'mth-q2',
          type: 'multiple_choice',
          question: 'Solve: 3x + 7 = 22',
          options: ['x = 3', 'x = 5', 'x = 9', 'x = 15'],
          correct_index: 1,
          explanation: '3x + 7 = 22 → 3x = 15 → x = 5. Check: 3(5)+7 = 22 ✓'
        },
        {
          id: 'mth-q3',
          type: 'short_answer',
          question: 'A rectangle has a length of 8cm and a width of 5cm. Calculate: (a) its perimeter, (b) its area. Show your working clearly.',
          placeholder: 'Write your working and answers for both (a) and (b) here...'
        },
        {
          id: 'mth-q4',
          type: 'multiple_choice',
          question: 'The sequence is: 5, 9, 13, 17, 21… What is the nth term formula?',
          options: ['4n + 1', '4n − 1', '5n', '4n + 5'],
          correct_index: 0,
          explanation: 'The common difference is 4, so it starts with 4n. When n=1: 4(1)=4, but the first term is 5, so we add 1. Formula: 4n+1. Check: n=2 → 9 ✓, n=3 → 13 ✓'
        },
        {
          id: 'mth-q5',
          type: 'short_answer',
          question: 'The mean of five numbers is 8. Four of the numbers are 6, 9, 11 and 4. What is the fifth number? Show your working.',
          placeholder: 'Show your full working to find the missing number...'
        }
      ]
    }
  },

  {
    id: 'science',
    name: 'Science',
    icon: '🔬',
    color: '#639922',
    bgColor: '#EAF3DE',
    textColor: '#27500A',
    description: 'Biology, Chemistry and Physics',
    topics: [
      {
        id: 'science-biology',
        title: 'Biology',
        content: [
          {
            heading: 'Cells',
            points: [
              'Animal cell organelles: cell membrane, cytoplasm, nucleus, mitochondria, ribosomes.',
              'Plant cell adds: cell wall (cellulose), chloroplasts, permanent vacuole.',
              'Bacterial cells have no nucleus — DNA floats freely.',
              'Nucleus: contains DNA and controls the cell.',
              'Mitochondria: where respiration happens — releases energy.',
              'Chloroplasts: where photosynthesis happens in plant cells.',
            ]
          },
          {
            heading: 'Organisation',
            points: [
              'Cell → Tissue → Organ → Organ system → Organism.',
              'Tissue: group of similar cells (e.g. muscle tissue).',
              'Organ: several tissues working together (e.g. heart, stomach).',
              'Digestive system: mouth → oesophagus → stomach → small intestine → large intestine.',
            ]
          },
          {
            heading: 'Ecosystems',
            points: [
              'Food chain: shows direction of energy flow (arrow = "eaten by").',
              'Producer → Primary consumer → Secondary consumer → Tertiary consumer.',
              'Producers are always plants — they make food through photosynthesis.',
              'Predator eats prey. Prey is eaten by predator.',
              'If one population changes, explain the knock-on effect through the chain.',
            ]
          }
        ],
        tip: 'Draw and label an animal cell and a plant cell from memory. Then write a food chain with at least 4 organisms and name the producer, primary consumer and predator.'
      },
      {
        id: 'science-chemistry',
        title: 'Chemistry',
        content: [
          {
            heading: 'States of matter',
            points: [
              'Solid: particles close together, regular arrangement, vibrate only.',
              'Liquid: particles close but random, can flow, take shape of container.',
              'Gas: particles far apart, move fast and randomly, fill any container.',
              'Melting point: solid → liquid. Boiling point: liquid → gas.',
              'Condensing: gas → liquid. Freezing: liquid → solid.',
            ]
          },
          {
            heading: 'Elements, compounds and mixtures',
            points: [
              'Element: one type of atom only (e.g. oxygen O, iron Fe).',
              'Compound: two or more elements chemically joined (e.g. water H₂O, CO₂).',
              'Mixture: two or more substances not chemically joined — can be separated.',
              'Separation methods: filtration (insoluble solid from liquid), evaporation (soluble solid from solution), distillation (liquids with different boiling points), chromatography (mixtures of dyes).',
            ]
          },
          {
            heading: 'Acids and alkalis',
            points: [
              'pH scale: 0–14. Below 7 = acid. 7 = neutral. Above 7 = alkali.',
              'Strong acid (pH 1–2): hydrochloric acid, sulfuric acid.',
              'Strong alkali (pH 12–14): sodium hydroxide.',
              'Indicators change colour to show whether a substance is acid/alkali/neutral.',
              'Neutralisation: acid + alkali → salt + water.',
            ]
          }
        ],
        tip: 'Draw the particle arrangements for solid, liquid and gas from memory. Then write out the pH scale and give one example substance for each of: strong acid, weak acid, neutral, weak alkali, strong alkali.'
      },
      {
        id: 'science-physics',
        title: 'Physics',
        content: [
          {
            heading: 'Forces',
            points: [
              'Force is measured in Newtons (N) using a newton-meter.',
              'Gravity pulls objects towards Earth (weight = mass × gravitational field strength).',
              'Friction: opposes motion, acts between surfaces.',
              'Upthrust: upward force from a liquid on an object.',
              'Balanced forces: object stays still or moves at constant speed.',
              'Unbalanced forces: object speeds up, slows down or changes direction.',
            ]
          },
          {
            heading: 'Speed and motion',
            points: [
              'Speed = distance ÷ time (m/s or km/h).',
              'Distance-time graph: slope = speed. Horizontal line = stationary.',
              'Steeper slope = faster speed. Curved line = changing speed.',
            ]
          },
          {
            heading: 'Energy and electricity',
            points: [
              'Energy types: kinetic, gravitational potential, elastic, thermal, chemical, electrical, light, sound.',
              'Energy is conserved — it transfers from one form to another, never disappears.',
              'Series circuit: one path for current. Components share the voltage.',
              'Parallel circuit: multiple paths. Each component gets full voltage.',
              'Current is measured in amps (A) with an ammeter (in series).',
              'Voltage is measured in volts (V) with a voltmeter (in parallel).',
            ]
          }
        ],
        tip: 'Draw a labelled distance-time graph showing: 5 seconds stationary, then 10 seconds of fast movement, then 5 seconds slower. Calculate the speed during each moving section.'
      },
      {
        id: 'science-practical',
        title: 'Practical skills',
        content: [
          {
            heading: 'Scientific method',
            points: [
              'Hypothesis: a testable prediction (e.g. "I think warmer water will dissolve sugar faster").',
              'Independent variable: what you change.',
              'Dependent variable: what you measure.',
              'Control variables: everything you keep the same to make it a fair test.',
              'Repeat measurements and calculate a mean to improve reliability.',
            ]
          },
          {
            heading: 'Recording and presenting data',
            points: [
              'Draw axes with a ruler, label both axes with quantity and unit.',
              'Use a line of best fit (not dot-to-dot) for continuous data.',
              'Identify anomalous results — circle them and do not include in line of best fit.',
              'Conclusion: state what your results show, link back to your hypothesis.',
            ]
          }
        ],
        tip: 'Write a method for this experiment: "Investigating how temperature affects the rate of dissolving sugar in water." Identify the independent, dependent and control variables.'
      }
    ],
    assignment: {
      id: 'science-assignment',
      title: 'Science assignment',
      questions: [
        {
          id: 'sci-q1',
          type: 'multiple_choice',
          question: 'Which organelle is responsible for releasing energy in an animal cell?',
          options: ['Nucleus', 'Cell membrane', 'Mitochondria', 'Chloroplast'],
          correct_index: 2,
          explanation: 'Mitochondria are the site of aerobic respiration, which releases energy from glucose. Chloroplasts are only in plant cells.'
        },
        {
          id: 'sci-q2',
          type: 'multiple_choice',
          question: 'A substance has a pH of 3. Which statement is correct?',
          options: [
            'It is a strong alkali',
            'It is a weak acid',
            'It is neutral',
            'It is a strong acid'
          ],
          correct_index: 3,
          explanation: 'pH 3 is well below 7, making it a strong acid. Weak acids are typically pH 4–6.'
        },
        {
          id: 'sci-q3',
          type: 'short_answer',
          question: 'A car travels 150 metres in 10 seconds. Calculate its speed. Include the formula, working and units in your answer.',
          placeholder: 'Write the formula, substitute values, and state your answer with correct units...'
        },
        {
          id: 'sci-q4',
          type: 'multiple_choice',
          question: 'In a food chain: Grass → Rabbit → Fox. What would happen to the fox population if the rabbit population suddenly decreased?',
          options: [
            'The fox population would increase',
            'The fox population would stay the same',
            'The fox population would decrease',
            'The grass population would decrease'
          ],
          correct_index: 2,
          explanation: 'Foxes depend on rabbits for food. Fewer rabbits means less food for foxes, so the fox population would decrease.'
        },
        {
          id: 'sci-q5',
          type: 'short_answer',
          question: 'Explain the difference between an element, a compound and a mixture. Give one example of each.',
          placeholder: 'Define each term clearly and give a real-world example for each...'
        }
      ]
    }
  },

  {
    id: 'history',
    name: 'History',
    icon: '🏛️',
    color: '#D85A30',
    bgColor: '#FAECE7',
    textColor: '#712B13',
    description: 'World Civilisations and the Tudors',
    topics: [
      {
        id: 'history-civilisations',
        title: 'World Civilisations',
        content: [
          {
            heading: 'Kingdom of Benin',
            points: [
              'Located in modern-day Nigeria, West Africa. Flourished from around 1200 CE.',
              'Famous for intricate bronze plaques and sculptures — evidence of skilled craftspeople.',
              'Strong trading kingdom: traded pepper, ivory and cloth with Europeans.',
              'Ruled by the Oba (king) — powerful, semi-divine ruler.',
              'Benin had a sophisticated city and political structure long before European contact.',
            ]
          },
          {
            heading: 'Mansa Musa and the Mali Empire',
            points: [
              'Mansa Musa ruled Mali (West Africa) c.1312–1337 CE.',
              'Said to be one of the wealthiest people in history — Mali\'s gold and salt trade.',
              'His 1324 pilgrimage to Mecca passed through Egypt with 60,000 men and vast amounts of gold.',
              'He brought Islamic scholars back and built mosques and universities at Timbuktu.',
              'Shows that Africa had advanced civilisations independent of Europe.',
            ]
          },
          {
            heading: 'Baghdad and the Islamic Golden Age',
            points: [
              'Baghdad was founded in 762 CE and became the largest city in the world.',
              'The Abbasid Caliphate oversaw a period of extraordinary scientific progress.',
              'Advances in mathematics (algebra — from the Arabic "al-jabr"), astronomy, medicine, and philosophy.',
              'Scholars translated Greek texts and built on them — preserving and advancing knowledge.',
              'The House of Wisdom in Baghdad was a great centre of learning.',
            ]
          }
        ],
        tip: 'For each civilisation, practise writing a "significance" paragraph: why was this civilisation important? What did it contribute? Why might historians have overlooked it?'
      },
      {
        id: 'history-tudors',
        title: 'The Tudors',
        content: [
          {
            heading: 'Tudor monarchs',
            points: [
              'Henry VII (1485–1509): ended the Wars of the Roses, founded the Tudor dynasty.',
              'Henry VIII (1509–1547): broke with Rome, six wives, established the Church of England.',
              'Edward VI (1547–1553): young Protestant king, died aged 15.',
              'Mary I (1553–1558): Catholic queen, burned Protestants — "Bloody Mary".',
              'Elizabeth I (1558–1603): Protestant, "Virgin Queen", defeat of the Spanish Armada (1588).',
            ]
          },
          {
            heading: 'Break with Rome',
            points: [
              'Henry VIII wanted to divorce Catherine of Aragon — the Pope refused.',
              '1534: Act of Supremacy made Henry head of the Church of England.',
              'Dissolution of the Monasteries — Henry took monastic land and wealth.',
              'This had huge religious, political and social consequences.',
            ]
          },
          {
            heading: 'Tudor society',
            points: [
              'Brentwood\'s History curriculum asks: "Was Tudor society white?" — it was not.',
              'Black Tudors lived in England, working as musicians, servants, sailors and merchants.',
              'Society was hierarchical: monarch → nobility → gentry → merchants → peasants.',
              'Most people were poor — life expectancy around 35–40 years.',
            ]
          }
        ],
        tip: 'Make a timeline of the five Tudor monarchs with one key event per reign. Then write a paragraph explaining why the Break with Rome was significant — think politically, religiously and socially.'
      },
      {
        id: 'history-skills',
        title: 'Historical skills',
        content: [
          {
            heading: 'Key concepts',
            points: [
              'Causation: explaining why something happened — short-term and long-term causes.',
              'Consequence: the results or effects of an event.',
              'Significance: why does this event matter? Use the GREAT criteria — Groundbreaking, Remembered, Exceptional, Affected many, changed Things.',
              'Similarity and difference: comparing people, events or periods.',
              'Continuity and change: what stayed the same, what changed, and how fast?',
            ]
          },
          {
            heading: 'Sources',
            points: [
              'Primary source: created at the time of the event (diary, painting, letter).',
              'Secondary source: created after the event by a historian.',
              'Evaluating a source: consider its origin, purpose and what it shows/doesn\'t show.',
              'No source is completely reliable — consider the author\'s perspective.',
            ]
          },
          {
            heading: 'Writing analytically',
            points: [
              'Use the PEEL structure: Point, Evidence, Explain, Link.',
              'Avoid just listing facts — always explain WHY something happened or mattered.',
              'Use precise historical vocabulary and dates.',
              'End paragraphs by linking back to the question.',
            ]
          }
        ],
        tip: 'Choose one event from Year 7 History (e.g. the Break with Rome). Write a paragraph explaining its significance using at least two pieces of evidence and the PEEL structure.'
      }
    ],
    assignment: {
      id: 'history-assignment',
      title: 'History assignment',
      questions: [
        {
          id: 'his-q1',
          type: 'multiple_choice',
          question: 'Which African kingdom was known for its detailed bronze sculptures and its powerful Oba ruler?',
          options: ['Mali Empire', 'Kingdom of Benin', 'Songhai Empire', 'Kingdom of Kush'],
          correct_index: 1,
          explanation: 'The Kingdom of Benin, in modern-day Nigeria, is famous for its bronze plaques and was ruled by the Oba.'
        },
        {
          id: 'his-q2',
          type: 'multiple_choice',
          question: 'In which year did Henry VIII pass the Act of Supremacy, making himself head of the Church of England?',
          options: ['1509', '1527', '1534', '1547'],
          correct_index: 2,
          explanation: 'The Act of Supremacy was passed in 1534, formally breaking with Rome and establishing Henry VIII as head of the Church of England.'
        },
        {
          id: 'his-q3',
          type: 'short_answer',
          question: 'Why was Mansa Musa\'s pilgrimage to Mecca in 1324 historically significant? Write a PEEL paragraph in your answer.',
          placeholder: 'Point: state your argument. Evidence: use specific facts. Explain: say why it mattered. Link: connect back to the question...'
        },
        {
          id: 'his-q4',
          type: 'multiple_choice',
          question: 'What is a PRIMARY historical source?',
          options: [
            'A book written by a historian 100 years later',
            'A document created at the time of the event being studied',
            'The most important source in a collection',
            'A source that has been checked for accuracy'
          ],
          correct_index: 1,
          explanation: 'A primary source is one created at the time of the event — for example a diary entry, letter, painting or government document from that period.'
        },
        {
          id: 'his-q5',
          type: 'short_answer',
          question: 'Choose ONE Tudor monarch and explain why their reign was significant. Use at least two specific historical facts.',
          placeholder: 'Name your chosen monarch, then explain what made their reign historically important with evidence...'
        }
      ]
    }
  },

  {
    id: 'geography',
    name: 'Geography',
    icon: '🌍',
    color: '#1D9E75',
    bgColor: '#E1F5EE',
    textColor: '#085041',
    description: 'Physical geography, human geography and fieldwork',
    topics: [
      {
        id: 'geography-physical',
        title: 'Physical geography',
        content: [
          {
            heading: 'Rivers',
            points: [
              'Source: where a river begins (usually in hills or mountains).',
              'Mouth: where a river meets the sea.',
              'Erosion processes: hydraulic action, abrasion, attrition, solution.',
              'River features: V-shaped valley (upper), meander (middle), floodplain and delta (lower).',
              'Waterfall formation: hard rock over soft rock — soft rock erodes, creating a plunge pool.',
            ]
          },
          {
            heading: 'Weather and climate',
            points: [
              'Weather: short-term conditions in the atmosphere.',
              'Climate: average weather conditions over 30+ years.',
              'Factors affecting temperature: latitude, altitude, distance from sea, prevailing winds.',
              'UK climate: cool temperate maritime — mild and wet due to proximity to Atlantic.',
            ]
          },
          {
            heading: 'Natural hazards',
            points: [
              'Earthquakes: caused by movement of tectonic plates at plate boundaries.',
              'Volcanoes: found at constructive and destructive plate boundaries.',
              'Rich countries respond better — better buildings, warning systems, emergency services.',
              'Richter scale measures earthquake magnitude (each point = 10× more powerful).',
            ]
          }
        ],
        tip: 'Draw a labelled diagram of a river from source to mouth, showing at least 4 features (e.g. V-shaped valley, waterfall, meander, floodplain, delta). Add a brief explanation of how one feature formed.'
      },
      {
        id: 'geography-human',
        title: 'Human geography',
        content: [
          {
            heading: 'Population',
            points: [
              'World population over 8 billion — growing fastest in LEDCs (Less Economically Developed Countries).',
              'Birth rate: number of births per 1,000 people per year.',
              'Death rate: number of deaths per 1,000 people per year.',
              'Natural increase = birth rate − death rate.',
              'Migration: movement of people — push factors (poverty, conflict) and pull factors (jobs, safety).',
            ]
          },
          {
            heading: 'Development',
            points: [
              'GDP per capita: average income per person — measures economic wealth.',
              'HDI (Human Development Index): combines income, education and life expectancy.',
              'MEDCs (More Economically Developed): high income, better services.',
              'LEDCs: lower income, less development — often in global south.',
              'Development gap: increasing inequality between richest and poorest nations.',
            ]
          },
          {
            heading: 'Urbanisation',
            points: [
              'Urbanisation: increasing proportion of people living in cities.',
              'Fastest in Africa and Asia — rural to urban migration.',
              'Challenges: housing, traffic, pollution, water and sanitation.',
              'Megacities: cities with over 10 million people (e.g. Lagos, Mumbai, Tokyo).',
            ]
          }
        ],
        tip: 'Make a table comparing a MEDC and LEDC of your choice — include GDP per capita, life expectancy, literacy rate and one other development indicator.'
      },
      {
        id: 'geography-skills',
        title: 'Geographical skills',
        content: [
          {
            heading: 'Map skills',
            points: [
              'Grid references: 4-figure (square) and 6-figure (precise point). Always go along then up.',
              'Contour lines: show height — closer together = steeper slope.',
              'Scale: use to calculate real distances from the map.',
              'Compass points: 8 main directions — N, NE, E, SE, S, SW, W, NW.',
            ]
          },
          {
            heading: 'Graphs and data',
            points: [
              'Always label both axes with title and units.',
              'Bar charts: discrete/categorical data.',
              'Line graphs: continuous data showing change over time.',
              'Choropleth maps: shade areas by data value — darker = higher value (usually).',
            ]
          }
        ],
        tip: 'Brentwood Geography includes real fieldwork — beach, local area and London. Practise describing what you would measure and how for a local geography investigation.'
      }
    ],
    assignment: {
      id: 'geography-assignment',
      title: 'Geography assignment',
      questions: [
        {
          id: 'geo-q1',
          type: 'multiple_choice',
          question: 'What is the correct order of a river from start to finish?',
          options: [
            'Mouth → Channel → Source',
            'Source → Tributary → Mouth',
            'Delta → Meander → Source',
            'Waterfall → Source → Mouth'
          ],
          correct_index: 1,
          explanation: 'A river starts at its source (often in mountains), is fed by tributaries, and ends at its mouth where it meets the sea.'
        },
        {
          id: 'geo-q2',
          type: 'multiple_choice',
          question: 'What does HDI measure?',
          options: [
            'How fast a country\'s economy is growing',
            'The total value of goods a country produces',
            'A combination of income, education and life expectancy',
            'The number of people living in cities'
          ],
          correct_index: 2,
          explanation: 'HDI (Human Development Index) is a composite measure combining income per capita, education levels and life expectancy at birth.'
        },
        {
          id: 'geo-q3',
          type: 'short_answer',
          question: 'Explain how a waterfall forms. Use geographical terminology in your answer.',
          placeholder: 'Describe the process step by step, using terms like erosion, hard rock, soft rock, plunge pool, undercutting...'
        },
        {
          id: 'geo-q4',
          type: 'multiple_choice',
          question: 'On a map, contour lines that are very close together indicate:',
          options: [
            'A flat, low-lying area',
            'A steep slope',
            'A river valley',
            'High rainfall'
          ],
          correct_index: 1,
          explanation: 'Contour lines close together mean the land rises sharply over a short distance — a steep slope. Widely spaced contours indicate gentle slopes.'
        },
        {
          id: 'geo-q5',
          type: 'short_answer',
          question: 'Give TWO push factors and TWO pull factors that cause people to migrate from rural to urban areas. Explain each one briefly.',
          placeholder: 'List and explain your two push factors (reasons to leave), then your two pull factors (reasons to move to a city)...'
        }
      ]
    }
  },

  {
    id: 'languages',
    name: 'Languages',
    icon: '🌐',
    color: '#7F77DD',
    bgColor: '#EEEDFE',
    textColor: '#3C3489',
    description: 'French or Spanish + introduction to Latin',
    topics: [
      {
        id: 'languages-vocab',
        title: 'Core vocabulary',
        content: [
          {
            heading: 'Essential topic areas',
            points: [
              'Greetings: Bonjour/Hola, Comment t\'appelles-tu?/¿Cómo te llamas?, Je m\'appelle.../Me llamo...',
              'Numbers 1–100 — essential for dates, times and prices.',
              'Days of the week and months of the year.',
              'Family: mother/mère/madre, father/père/padre, brother/frère/hermano.',
              'School subjects and opinions: J\'aime/Me gusta (I like), Je n\'aime pas/No me gusta (I don\'t like).',
              'Hobbies and free time: jouer au foot, faire du vélo, lire, regarder la télé.',
              'Food and drink vocabulary for café and restaurant situations.',
              'Town and directions: la gare (station), le supermarché, tournez à gauche (turn left).',
            ]
          }
        ],
        tip: 'Write 10 vocabulary words on flashcards each day. Test yourself after 24 hours — forgetting and retrieving is how memory works. Try Quizlet or Anki for digital flashcards.'
      },
      {
        id: 'languages-grammar',
        title: 'Grammar foundations',
        content: [
          {
            heading: 'French grammar',
            points: [
              'All nouns are masculine (le/un) or feminine (la/une) — you must learn the gender with the word.',
              'Adjectives agree: un chat noir (m) / une robe noire (f) — add -e for feminine.',
              'Present tense — être (to be): je suis, tu es, il/elle est, nous sommes, vous êtes, ils/elles sont.',
              'Present tense — avoir (to have): j\'ai, tu as, il a, nous avons, vous avez, ils ont.',
              'Negative: put ne...pas around the verb: Je ne parle pas français.',
            ]
          },
          {
            heading: 'Spanish grammar',
            points: [
              'Nouns: el (m) / la (f). Plural: los / las.',
              'Adjectives follow the noun in Spanish: un chico alto (a tall boy).',
              'Present tense — ser (to be): soy, eres, es, somos, sois, son.',
              'Present tense — tener (to have): tengo, tienes, tiene, tenemos, tenéis, tienen.',
              'Negative: put no before the verb: No hablo español.',
            ]
          },
          {
            heading: 'Latin basics (if studied)',
            points: [
              'Latin has no word for "the" or "a".',
              'Word order is flexible — the ending of a word shows its role.',
              'Nominative case: the subject (who does the action).',
              'Accusative case: the object (who receives the action).',
              '1st conjugation verbs: amare (to love) — amo, amas, amat, amamus, amatis, amant.',
            ]
          }
        ],
        tip: 'Write a short paragraph (6–8 sentences) about yourself in your target language — name, age, family, where you live, what you like doing. This covers most Year 7 grammar in one go.'
      }
    ],
    assignment: {
      id: 'languages-assignment',
      title: 'Languages assignment',
      questions: [
        {
          id: 'lan-q1',
          type: 'multiple_choice',
          question: 'In French, which is the correct way to say "I don\'t speak French"?',
          options: [
            'Je parle pas français',
            'Ne je parle français pas',
            'Je ne parle pas français',
            'Je ne français parle pas'
          ],
          correct_index: 2,
          explanation: 'In French, the negative is formed by placing ne before the verb and pas after it: Je ne parle pas français.'
        },
        {
          id: 'lan-q2',
          type: 'multiple_choice',
          question: 'In Spanish, what is the correct form of ser for "she is"?',
          options: ['soy', 'eres', 'es', 'somos'],
          correct_index: 2,
          explanation: 'The verb ser conjugates as: yo soy, tú eres, él/ella es, nosotros somos, vosotros sois, ellos son.'
        },
        {
          id: 'lan-q3',
          type: 'short_answer',
          question: 'Write 5–6 sentences about yourself in your target language (French or Spanish). Include: your name, age, where you live, one family member, and one hobby.',
          placeholder: 'Write your paragraph in French or Spanish here. Label which language you are using at the start...'
        },
        {
          id: 'lan-q4',
          type: 'multiple_choice',
          question: 'In French, how do you make the adjective "grand" agree with a feminine noun?',
          options: ['grande', 'grands', 'granden', 'no change needed'],
          correct_index: 0,
          explanation: 'Most French adjectives add -e for feminine: grand (m) → grande (f). E.g. un grand garçon / une grande fille.'
        },
        {
          id: 'lan-q5',
          type: 'short_answer',
          question: 'Translate these sentences into your target language: (a) I like football. (b) My brother is tall. (c) I don\'t eat meat.',
          placeholder: 'Write (a), (b) and (c) with your translations. State which language you are using...'
        }
      ]
    }
  },

  {
    id: 'dt-art',
    name: 'DT & Art',
    icon: '🎨',
    color: '#D4537E',
    bgColor: '#FBEAF0',
    textColor: '#72243E',
    description: 'Design & Technology and Art',
    topics: [
      {
        id: 'dt-design',
        title: 'Design & Technology',
        content: [
          {
            heading: 'The design process',
            points: [
              '1. Brief — understand what the problem or need is.',
              '2. Research — investigate existing products, materials, target audience.',
              '3. Ideas — sketch multiple initial ideas (don\'t evaluate yet).',
              '4. Development — choose the best idea and refine it.',
              '5. Model/Prototype — make a working version.',
              '6. Evaluate — test against the brief and suggest improvements.',
            ]
          },
          {
            heading: 'Materials',
            points: [
              'Woods: pine (soft, easy to cut), oak (hard, durable), MDF (manufactured, smooth finish).',
              'Metals: aluminium (lightweight, corrosion-resistant), steel (strong, heavy).',
              'Polymers/Plastics: acrylic (rigid, transparent), polyethylene (flexible, cheap).',
              'Choose materials based on: strength, weight, cost, appearance, sustainability.',
            ]
          },
          {
            heading: 'CAD/CAM and making',
            points: [
              'CAD (Computer-Aided Design): software used to draw/design products digitally.',
              'CAM (Computer-Aided Manufacture): machines (e.g. laser cutter) that cut/make from CAD files.',
              'Laser cutter: cuts and engraves materials — great for precise designs.',
              'Always follow workshop safety rules: tie back hair, wear goggles, no loose clothing.',
            ]
          }
        ],
        tip: 'Review your sketchbook. Practise sketching an everyday object from observation, then annotate it with materials you would use and why.'
      },
      {
        id: 'dt-art',
        title: 'Art',
        content: [
          {
            heading: 'Elements of art',
            points: [
              'Line: marks that define shape and form — thick, thin, curved, straight.',
              'Shape: 2D flat areas — geometric (circle, square) or organic (natural, irregular).',
              'Form: 3D — sphere, cube, cylinder.',
              'Tone: lightness and darkness — shading creates the illusion of 3D form.',
              'Colour: hue (the colour itself), saturation (intensity), value (lightness/darkness).',
              'Texture: actual (you can feel it) or implied (looks textured in 2D).',
              'Pattern: repeating elements.',
            ]
          },
          {
            heading: 'Colour theory',
            points: [
              'Primary colours: red, yellow, blue — cannot be mixed from other colours.',
              'Secondary colours: orange (R+Y), green (Y+B), purple (R+B).',
              'Complementary colours: opposite on the colour wheel — high contrast.',
              'Warm colours (reds, oranges, yellows) appear to come forward.',
              'Cool colours (blues, greens, purples) appear to recede.',
            ]
          },
          {
            heading: 'Sketchbook and annotation',
            points: [
              'Annotation: written notes explaining your artistic choices.',
              'Include: what technique you used, why you chose it, what you\'d change.',
              'Contextual studies: reference the artist/artwork that inspired your work.',
              'Show your process — rough sketches, colour tests, experiments all matter.',
            ]
          }
        ],
        tip: 'Spend 20 minutes drawing an object at home from life. Focus on tone and shading — use hatching or blending. Write two annotation sentences explaining your choices.'
      }
    ],
    assignment: {
      id: 'dt-assignment',
      title: 'DT & Art assignment',
      questions: [
        {
          id: 'dt-q1',
          type: 'multiple_choice',
          question: 'What does CAD stand for in Design & Technology?',
          options: [
            'Computer-Aided Drawing',
            'Computer-Aided Design',
            'Creative Art Direction',
            'Computer Assembly Design'
          ],
          correct_index: 1,
          explanation: 'CAD stands for Computer-Aided Design. It refers to software used to create precise digital designs before manufacturing.'
        },
        {
          id: 'dt-q2',
          type: 'multiple_choice',
          question: 'Which two colours on the colour wheel are complementary to each other?',
          options: [
            'Red and orange',
            'Blue and green',
            'Red and green',
            'Yellow and orange'
          ],
          correct_index: 2,
          explanation: 'Complementary colours sit opposite each other on the colour wheel. Red and green are complementary — they create maximum contrast.'
        },
        {
          id: 'dt-q3',
          type: 'short_answer',
          question: 'A designer is asked to create a lightweight outdoor bench for a school garden. Suggest ONE suitable material and explain why it would be appropriate, considering strength, weather resistance and cost.',
          placeholder: 'Name your chosen material and give a detailed reason for each property mentioned...'
        },
        {
          id: 'dt-q4',
          type: 'multiple_choice',
          question: 'In the design process, what should happen AFTER sketching initial ideas?',
          options: [
            'Write the design brief',
            'Research existing products',
            'Evaluate and choose the best idea to develop further',
            'Build the final product immediately'
          ],
          correct_index: 2,
          explanation: 'The design process goes: Brief → Research → Ideas → Development → Model → Evaluate. After initial ideas, you evaluate and select the best one to develop.'
        },
        {
          id: 'dt-q5',
          type: 'short_answer',
          question: 'Describe how you would use TONE in a drawing to make a sphere appear three-dimensional. What technique would you use and where would you place light and shadow?',
          placeholder: 'Explain the technique (e.g. hatching, blending) and describe where the highlight, mid-tone and shadow would fall...'
        }
      ]
    }
  },

  {
    id: 'music',
    name: 'Music',
    icon: '🎵',
    color: '#BA7517',
    bgColor: '#FAEEDA',
    textColor: '#633806',
    description: 'Listening, performing, composing and music technology',
    topics: [
      {
        id: 'music-elements',
        title: 'Elements of music',
        content: [
          {
            heading: 'The seven elements',
            points: [
              'Pitch: how high or low a note is.',
              'Duration: how long a note lasts (semibreve=4, minim=2, crotchet=1, quaver=½ beat).',
              'Dynamics: volume — pianissimo (pp), piano (p), mezzo-forte (mf), forte (f), fortissimo (ff).',
              'Tempo: speed of the music — largo (very slow), andante (walking pace), allegro (fast).',
              'Timbre: the quality or "colour" of a sound — what makes a trumpet sound different from a violin.',
              'Texture: how many layers/instruments — monophonic (one line), homophonic (melody + chords), polyphonic (many independent lines).',
              'Structure: how the music is organised — verse/chorus, binary (AB), ternary (ABA), rondo (ABACAD).',
            ]
          },
          {
            heading: 'Music notation',
            points: [
              'Treble clef: EGBDF (Every Good Boy Deserves Football) on lines. FACE in spaces.',
              'Time signatures: 4/4 (four crotchet beats per bar), 3/4 (three beats — waltz time).',
              'Bar lines divide music into equal groups of beats.',
              'A rest = silence of a specific duration (crotchet rest, minim rest, etc.).',
            ]
          }
        ],
        tip: 'Write the treble clef note names on every line and space without looking. Then listen to two pieces of music and describe each using at least four of the seven elements.'
      },
      {
        id: 'music-performing',
        title: 'Performing & composing',
        content: [
          {
            heading: 'Performance skills',
            points: [
              'Accuracy: play the correct notes and rhythms.',
              'Fluency: play without stopping, even if you make a small mistake.',
              'Expression: vary your dynamics and tempo for musical effect.',
              'Ensemble skills: listen to others, blend your sound, stay in time.',
              'Brentwood Year 7 Performing Arts Showcase — all students perform publicly.',
            ]
          },
          {
            heading: 'Composing',
            points: [
              'Pentatonic scale: 5 notes — easy to compose with as notes don\'t clash.',
              'Ostinato: a repeating rhythmic or melodic pattern used as a base.',
              'Layering: add instruments/parts gradually to build texture.',
              'Structure your composition — give it a clear beginning, middle and end.',
              'Sibelius and GarageBand are used at Brentwood for music technology.',
            ]
          }
        ],
        tip: 'Practise your current piece for 15 minutes daily — focus on one difficult bar at a time rather than always playing from the start. Record yourself and listen back critically.'
      },
      {
        id: 'music-listening',
        title: 'Listening & appraising',
        content: [
          {
            heading: 'Appraising music',
            points: [
              'Always use musical vocabulary — never say "fast" when you mean "allegro".',
              'Describe: tempo, dynamics, pitch range, timbre, texture and structure.',
              'Identify the instruments or voices you hear.',
              'Explain the effect — how does the music make you feel and why?',
            ]
          },
          {
            heading: 'World music',
            points: [
              'Brentwood studies music from different cultures — listen widely.',
              'African drumming: polyrhythm (multiple rhythms played simultaneously), call and response.',
              'Indian classical music: raga (melodic framework), tala (rhythmic cycle).',
              'Western classical vs pop: formal structure vs verse/chorus; orchestra vs band.',
            ]
          }
        ],
        tip: 'Listen to one piece you haven\'t heard before. Write 4–5 sentences describing it using only musical vocabulary. Identify the structure and at least three elements.'
      }
    ],
    assignment: {
      id: 'music-assignment',
      title: 'Music assignment',
      questions: [
        {
          id: 'mus-q1',
          type: 'multiple_choice',
          question: 'What does "forte" mean in music?',
          options: ['Very quietly', 'At a fast tempo', 'Loudly', 'Slowly and expressively'],
          correct_index: 2,
          explanation: 'Forte (f) means loud. The dynamics from quiet to loud are: pp (pianissimo) → p (piano) → mp → mf → f (forte) → ff (fortissimo).'
        },
        {
          id: 'mus-q2',
          type: 'multiple_choice',
          question: 'A piece of music in 3/4 time has how many beats per bar?',
          options: ['2', '3', '4', '6'],
          correct_index: 1,
          explanation: 'In 3/4 time, the top number (3) tells you there are 3 beats per bar. The bottom number (4) tells you each beat is a crotchet (quarter note).'
        },
        {
          id: 'mus-q3',
          type: 'short_answer',
          question: 'Listen to a piece of music of your choice (any genre). Write a short appraisal (4–6 sentences) describing it using at least FOUR of the seven musical elements.',
          placeholder: 'Name the piece and composer/artist, then describe it using tempo, dynamics, pitch, timbre, texture, structure and duration...'
        },
        {
          id: 'mus-q4',
          type: 'multiple_choice',
          question: 'What is an "ostinato"?',
          options: [
            'A musical instrument from Italy',
            'A repeating rhythmic or melodic pattern',
            'A type of time signature',
            'A loud, dramatic ending to a piece'
          ],
          correct_index: 1,
          explanation: 'An ostinato is a short musical pattern — rhythmic or melodic — that is repeated persistently. It is used as a foundation in composing.'
        },
        {
          id: 'mus-q5',
          type: 'short_answer',
          question: 'Describe the difference between monophonic and polyphonic musical texture. Give a real musical example of each.',
          placeholder: 'Define each term clearly, then give a real example from music you know or have studied...'
        }
      ]
    }
  }
]

// Helper: get a subject by ID
export const getSubject = (id) => SUBJECTS.find(s => s.id === id)

// Helper: get a topic by subject ID and topic ID
export const getTopic = (subjectId, topicId) =>
  getSubject(subjectId)?.topics.find(t => t.id === topicId)

// Helper: flatten all questions for seeding
export const getAllQuestions = () =>
  SUBJECTS.flatMap(s =>
    s.assignment.questions.map(q => ({
      ...q,
      subject_id: s.id,
      assignment_id: s.assignment.id,
      subject_name: s.name,
    }))
  )
