export const mathsRevision = {
  subjectId: 'maths',

  teacherNote: {
    teacher: 'Mrs R K Dryden — Maths',
    message: 'Non-calculator exam. Use DrFrost to watch videos and practise key skill and exam style questions. Work through the revision list topic by topic — do not skip any section.',
  },

  topics: [
    {
      id: 'maths-number',
      title: 'Number Skills',
      color: '#BA7517',
      cards: [
        // Addition & Subtraction
        { q: 'Calculate 3,847 + 2,956', a: '6,803 — line up digits by place value, carry where needed.' },
        { q: 'Calculate 5,003 − 1,847', a: '3,156 — use column subtraction, borrow from the next column when needed.' },
        { q: 'What is 12.4 + 9.87?', a: '22.27 — line up the decimal points before adding.' },
        { q: 'What is 10.5 − 3.76?', a: '6.74 — line up decimal points and borrow as needed.' },
        // Multiplication & Division
        { q: 'Calculate 47 × 23', a: '1,081 — use long multiplication: 47×20=940, 47×3=141, total=1,081.' },
        { q: 'Calculate 312 ÷ 6', a: '52 — short division: 31÷6=5r1, bring down 2, 12÷6=2.' },
        { q: 'What is 3.6 × 4?', a: '14.4 — multiply 36×4=144, then place decimal to give 14.4.' },
        { q: 'What is 8.4 ÷ 0.4?', a: '21 — multiply both by 10 to get 84÷4=21.' },
        // Powers & Square Roots
        { q: 'What is 5²?', a: '25 — 5 squared means 5×5=25.' },
        { q: 'What is 3³?', a: '27 — 3 cubed means 3×3×3=27.' },
        { q: 'What is √49?', a: '7 — because 7×7=49.' },
        { q: 'What is √144?', a: '12 — because 12×12=144.' },
        { q: 'What is 2⁵?', a: '32 — 2×2×2×2×2=32.' },
        { q: 'What does the index (power) tell you?', a: 'How many times to multiply the base by itself. E.g. 4³ means 4×4×4.' },
        // BIDMAS
        { q: 'What does BIDMAS stand for?', a: 'Brackets, Indices, Division, Multiplication, Addition, Subtraction — the order of operations.' },
        { q: 'Calculate: 3 + 4 × 2', a: '11 — multiplication before addition: 4×2=8, then 3+8=11.' },
        { q: 'Calculate: (3 + 4) × 2', a: '14 — brackets first: 3+4=7, then 7×2=14.' },
        { q: 'Calculate: 2³ + 4 × 3 − 1', a: '19 — indices first: 2³=8, then 4×3=12, then 8+12−1=19.' },
        { q: 'Calculate: 20 ÷ (2+3) × 2', a: '8 — brackets first: 2+3=5, then 20÷5=4, then 4×2=8.' },
        // Factors, Multiples, Primes
        { q: 'What is a factor?', a: 'A number that divides exactly into another number. Factors of 12: 1,2,3,4,6,12.' },
        { q: 'What is a multiple?', a: 'A number in the times table of another. Multiples of 4: 4,8,12,16,20...' },
        { q: 'What is a prime number?', a: 'A number with exactly two factors: 1 and itself. Examples: 2,3,5,7,11,13,17,19,23.' },
        { q: 'Is 1 a prime number?', a: 'No — 1 has only one factor (itself), so it is not prime.' },
        { q: 'List all prime numbers up to 20.', a: '2, 3, 5, 7, 11, 13, 17, 19.' },
        { q: 'What are the factors of 36?', a: '1, 2, 3, 4, 6, 9, 12, 18, 36.' },
        // Prime Factorisation, HCF & LCM
        { q: 'What is prime factorisation?', a: 'Writing a number as a product of its prime factors. E.g. 24 = 2×2×2×3 = 2³×3.' },
        { q: 'Write 60 as a product of prime factors.', a: '60 = 2²×3×5. Use a factor tree: 60→2×30→2×2×15→2×2×3×5.' },
        { q: 'What is the HCF of 12 and 18?', a: 'HCF = 6. Factors of 12: 1,2,3,4,6,12. Factors of 18: 1,2,3,6,9,18. Highest common: 6.' },
        { q: 'What is the LCM of 4 and 6?', a: 'LCM = 12. Multiples of 4: 4,8,12... Multiples of 6: 6,12... Lowest common: 12.' },
        { q: 'What does HCF stand for and when do you use it?', a: 'Highest Common Factor — the largest number that divides into both. Used for simplifying fractions and sharing into groups.' },
        { q: 'What does LCM stand for and when do you use it?', a: 'Lowest Common Multiple — the smallest number both divide into. Used for adding fractions with different denominators.' },
        // Estimation & Rounding
        { q: 'Round 3,847 to the nearest hundred.', a: '3,800 — the tens digit is 4, so round down.' },
        { q: 'Round 0.0673 to 2 significant figures.', a: '0.067 — first significant figure is 6, second is 7, next digit is 3 so round down.' },
        { q: 'Round 4.567 to 2 decimal places.', a: '4.57 — look at the third decimal place (7), round up.' },
        { q: 'Estimate 38.2 × 5.9', a: '≈ 40×6 = 240 — round each number to 1 significant figure first.' },
        { q: 'Estimate 197 ÷ 4.1', a: '≈ 200÷4 = 50.' },
        // Negative Numbers
        { q: 'Calculate: −3 + 7', a: '4 — start at −3, move 7 right on the number line.' },
        { q: 'Calculate: −5 − 3', a: '−8 — start at −5, move 3 further left.' },
        { q: 'Calculate: −4 × 3', a: '−12 — negative × positive = negative.' },
        { q: 'Calculate: −6 × −2', a: '12 — negative × negative = positive.' },
        { q: 'Calculate: −12 ÷ 4', a: '−3 — negative ÷ positive = negative.' },
        { q: 'What are the rules for multiplying/dividing negatives?', a: 'Same signs → positive. Different signs → negative. E.g. −×− = +, +×− = −.' },
      ],
    },
    {
      id: 'maths-algebra',
      title: 'Algebra',
      color: '#7C3AED',
      cards: [
        // Basic Rules
        { q: 'What does 3a mean?', a: '3×a — the number and letter are multiplied. Always write the number before the letter.' },
        { q: 'Simplify: a + a + a', a: '3a — three lots of a.' },
        { q: 'Simplify: 3a + 2b − a + 4b', a: '2a + 6b — collect like terms (a terms together, b terms together).' },
        { q: 'What are like terms?', a: 'Terms with the same variable and power. E.g. 3x and 5x are like terms. 3x and 3x² are NOT.' },
        // Substitution
        { q: 'If a=3, b=2, find 4a + b', a: '4(3)+2 = 12+2 = 14.' },
        { q: 'If x=−2, find x²+3x', a: '(−2)²+3(−2) = 4−6 = −2.' },
        { q: 'If p=4, q=3, find 2p−q²', a: '2(4)−(3)² = 8−9 = −1.' },
        // Writing Expressions & Formulae
        { q: 'Write an expression for "5 more than x"', a: 'x + 5' },
        { q: 'Write an expression for "3 lots of y, take away 4"', a: '3y − 4' },
        { q: 'Write a formula for the perimeter P of a rectangle with length l and width w.', a: 'P = 2l + 2w or P = 2(l+w)' },
        { q: 'Write an expression for "n sweets shared equally between 4 people"', a: 'n/4 or n÷4' },
        // Simplifying & Expanding
        { q: 'Simplify: 5x + 3y − 2x + y', a: '3x + 4y' },
        { q: 'Expand: 3(x + 4)', a: '3x + 12 — multiply each term inside the bracket by 3.' },
        { q: 'Expand: 5(2x − 3)', a: '10x − 15' },
        { q: 'Expand: −2(x + 4)', a: '−2x − 8 — negative outside changes all signs inside.' },
        { q: 'Expand and simplify: 3(x+2) + 2(x−1)', a: '3x+6+2x−2 = 5x+4' },
        // Solving Linear Equations
        { q: 'Solve: x + 5 = 12', a: 'x = 7 — subtract 5 from both sides.' },
        { q: 'Solve: 3x = 18', a: 'x = 6 — divide both sides by 3.' },
        { q: 'Solve: 2x + 3 = 11', a: 'x = 4 — subtract 3: 2x=8, divide by 2: x=4.' },
        { q: 'Solve: 5x − 2 = 13', a: 'x = 3 — add 2: 5x=15, divide by 5: x=3.' },
        { q: 'Solve: 3(x+2) = 18', a: 'x = 4 — expand: 3x+6=18, subtract 6: 3x=12, divide: x=4.' },
        { q: 'Solve: 4x + 1 = 2x + 9', a: 'x = 4 — subtract 2x: 2x+1=9, subtract 1: 2x=8, divide: x=4.' },
        // Sequences & nth term
        { q: 'What is the nth term of: 3, 7, 11, 15...?', a: '4n − 1. Common difference is 4, so 4n. When n=1: 4(1)=4, but term is 3, so subtract 1.' },
        { q: 'What is the nth term of: 5, 8, 11, 14...?', a: '3n + 2. Common difference is 3. When n=1: 3(1)=3, but term is 5, so add 2.' },
        { q: 'Find the 10th term of the sequence with nth term 4n−1.', a: '4(10)−1 = 39.' },
        { q: 'Is 50 in the sequence with nth term 3n+2?', a: 'Solve 3n+2=50 → 3n=48 → n=16. Yes, it is the 16th term.' },
        { q: 'How do you find the nth term of an arithmetic sequence?', a: 'Find the common difference d — this is the coefficient of n. Then adjust: nth term = dn + (first term − d).' },
      ],
    },
    {
      id: 'maths-ratio',
      title: 'Ratio, Proportion & Rates',
      color: '#059669',
      cards: [
        // Ratio
        { q: 'Simplify the ratio 12:8', a: '3:2 — divide both by HCF of 4.' },
        { q: 'Simplify the ratio 15:25:10', a: '3:5:2 — divide all by HCF of 5.' },
        { q: 'Share £60 in the ratio 2:3', a: '£24 and £36. Total parts=5. Each part=£60÷5=£12. So 2×£12=£24, 3×£12=£36.' },
        { q: 'Share 40 sweets in the ratio 3:5', a: '15 and 25. Total parts=8. Each part=40÷8=5. So 3×5=15, 5×5=25.' },
        // Proportion
        { q: 'If 5 pens cost £3.50, how much do 8 cost?', a: '£5.60. 1 pen = £3.50÷5 = £0.70. 8 pens = 8×£0.70 = £5.60.' },
        { q: 'What is direct proportion?', a: 'When two quantities increase or decrease together at the same rate. If one doubles, the other doubles.' },
        { q: 'A recipe for 4 people needs 300g of flour. How much for 6 people?', a: '450g. Per person = 300÷4 = 75g. For 6 = 6×75 = 450g.' },
        { q: 'What is the unitary method?', a: 'Find the value for 1 unit first, then multiply. E.g. cost of 1 item, then multiply by quantity needed.' },
        // Measurement
        { q: 'Convert 3.5 km to metres.', a: '3,500 m — multiply by 1,000.' },
        { q: 'Convert 450 cm to metres.', a: '4.5 m — divide by 100.' },
        { q: 'Convert 2.4 kg to grams.', a: '2,400 g — multiply by 1,000.' },
        { q: 'Convert 3 hours 20 minutes to minutes.', a: '200 minutes — 3×60+20=200.' },
        // Scale, Plans & Maps
        { q: 'A map has scale 1:50,000. A distance on the map is 4 cm. What is the real distance?', a: '2 km. Real distance = 4×50,000 = 200,000 cm = 2,000 m = 2 km.' },
        { q: 'What does a scale of 1:25,000 mean?', a: '1 cm on the map represents 25,000 cm (250 m) in real life.' },
        { q: 'Two cities are 15 km apart. On a 1:500,000 map, how far apart are they?', a: '3 cm. 15 km = 1,500,000 cm. 1,500,000÷500,000 = 3 cm.' },
        // Speed, Distance, Time
        { q: 'What is the formula for speed?', a: 'Speed = Distance ÷ Time. Units: m/s, km/h, mph.' },
        { q: 'A car travels 120 km in 2 hours. What is its speed?', a: '60 km/h. Speed = 120÷2 = 60.' },
        { q: 'A cyclist travels at 15 km/h for 3 hours. How far?', a: '45 km. Distance = Speed × Time = 15×3 = 45.' },
        { q: 'A train travels 200 km at 80 km/h. How long does it take?', a: '2.5 hours. Time = Distance÷Speed = 200÷80 = 2.5.' },
        { q: 'Convert 2.5 hours to hours and minutes.', a: '2 hours 30 minutes — 0.5×60=30 minutes.' },
      ],
    },
    {
      id: 'maths-geometry',
      title: 'Geometry',
      color: '#2563EB',
      cards: [
        // Quadrilaterals & Triangles
        { q: 'Name the properties of a square.', a: '4 equal sides, 4 right angles, 2 pairs of parallel sides, diagonals bisect at 90°.' },
        { q: 'Name the properties of a parallelogram.', a: '2 pairs of parallel sides, opposite sides equal, opposite angles equal. No right angles.' },
        { q: 'What is a rhombus?', a: 'A parallelogram with all 4 sides equal. Opposite angles equal, diagonals bisect at right angles.' },
        { q: 'What is a trapezium?', a: 'A quadrilateral with exactly one pair of parallel sides.' },
        { q: 'Name 3 types of triangle.', a: 'Equilateral (3 equal sides/angles), Isosceles (2 equal sides/angles), Scalene (no equal sides/angles).' },
        { q: 'What is a right-angled triangle?', a: 'A triangle with one angle of exactly 90°.' },
        // Angles
        { q: 'Angles on a straight line sum to...?', a: '180°' },
        { q: 'Angles around a point sum to...?', a: '360°' },
        { q: 'Angles in a triangle sum to...?', a: '180°' },
        { q: 'Angles in a quadrilateral sum to...?', a: '360°' },
        { q: 'What are vertically opposite angles?', a: 'Angles formed opposite each other when two lines cross. They are always equal.' },
        { q: 'What are alternate angles?', a: 'Angles on opposite sides of a transversal crossing parallel lines — they are equal (Z angles).' },
        { q: 'What are co-interior angles?', a: 'Angles on the same side of a transversal between parallel lines — they add up to 180° (C angles).' },
        { q: 'What are corresponding angles?', a: 'Angles in the same position at each intersection of a transversal with parallel lines — they are equal (F angles).' },
        { q: 'What is the sum of interior angles of a pentagon?', a: '540°. Formula: (n−2)×180 = (5−2)×180 = 540°.' },
        { q: 'What is the formula for the sum of interior angles of a polygon with n sides?', a: '(n−2) × 180°' },
        { q: 'What is the exterior angle of a regular hexagon?', a: '60°. Exterior angle = 360°÷6 = 60°.' },
        // Perimeter & Area
        { q: 'Area of a rectangle with length 8 cm and width 5 cm?', a: '40 cm². Area = length × width = 8×5.' },
        { q: 'Area of a triangle with base 10 cm and height 6 cm?', a: '30 cm². Area = ½×base×height = ½×10×6.' },
        { q: 'Area of a parallelogram with base 7 cm and height 4 cm?', a: '28 cm². Area = base×height = 7×4.' },
        { q: 'Area of a trapezium with parallel sides 5 cm and 9 cm, height 4 cm?', a: '28 cm². Area = ½×(a+b)×h = ½×(5+9)×4 = ½×14×4.' },
        { q: 'Circumference of a circle with diameter 10 cm?', a: '31.4 cm. C = π×d = π×10 ≈ 31.4.' },
        { q: 'Area of a circle with radius 6 cm?', a: '113.1 cm². A = π×r² = π×36 ≈ 113.1.' },
        { q: 'What is the difference between radius and diameter?', a: 'Diameter = 2 × radius. Diameter goes all the way across the circle through the centre.' },
        { q: 'How do you find the area of a compound shape?', a: 'Split into simple shapes (rectangles, triangles etc.), find the area of each, then add (or subtract) them together.' },
      ],
    },
    {
      id: 'maths-statistics',
      title: 'Statistics & Probability',
      color: '#D85A30',
      cards: [
        // Averages
        { q: 'How do you find the mean?', a: 'Add all values together, then divide by how many there are.' },
        { q: 'Find the mean of: 4, 7, 2, 9, 7, 3, 8', a: '(4+7+2+9+7+3+8)÷7 = 40÷7 ≈ 5.7' },
        { q: 'How do you find the median?', a: 'Put values in order, find the middle value. If two middle values, find their mean.' },
        { q: 'Find the median of: 3, 7, 2, 9, 4', a: 'Ordered: 2,3,4,7,9. Middle value = 4.' },
        { q: 'What is the mode?', a: 'The most common value. There can be more than one mode, or no mode.' },
        { q: 'What is the range?', a: 'Largest value − smallest value. Measures the spread of data.' },
        // Tally & Frequency
        { q: 'What is a tally chart used for?', a: 'Recording data as it is collected. Each mark represents one item, every 5th mark crosses the previous 4 (gate pattern).' },
        { q: 'What is frequency?', a: 'How many times something occurs. The total of the tally marks for each category.' },
        // Probability
        { q: 'What is the probability scale?', a: 'From 0 (impossible) to 1 (certain). Probabilities are always between 0 and 1.' },
        { q: 'What is the formula for probability?', a: 'P(event) = number of favourable outcomes ÷ total number of outcomes.' },
        { q: 'A bag has 3 red and 7 blue balls. P(red)?', a: 'P(red) = 3/10 — 3 favourable outcomes out of 10 total.' },
        { q: 'What are mutually exclusive events?', a: 'Events that cannot happen at the same time. E.g. rolling a 3 AND a 5 on one die.' },
        { q: 'If P(A) = 0.3, what is P(not A)?', a: '0.7 — P(not A) = 1 − P(A). Probabilities of all outcomes sum to 1.' },
        { q: 'What is a sample space diagram?', a: 'A grid showing all possible outcomes of two events. Used to find probabilities systematically.' },
        { q: 'Two coins are flipped. List the sample space.', a: 'HH, HT, TH, TT. P(two heads) = 1/4.' },
        { q: 'What is a tree diagram used for?', a: 'Showing all possible outcomes of two or more events in sequence. Multiply along branches, add between branches.' },
        { q: 'P(A and B) using a tree diagram — how do you calculate it?', a: 'Multiply the probabilities along the branches: P(A) × P(B).' },
      ],
    },
  ],

  resources: [
    {
      title: 'DrFrost Maths — Login',
      description: 'Recommended by Mrs Dryden. Watch videos and practise key skill and exam style questions. Contact mjc@brentwood.essex.sch.uk if you need your login details.',
      url: 'https://www.drfrost.org/dashboard#',
      icon: '❄️',
      type: 'platform',
    },
    {
      title: 'BBC Bitesize — KS3 Maths',
      description: 'Full revision covering number, algebra, geometry, ratio and statistics with worked examples and quizzes.',
      url: 'https://www.bbc.co.uk/bitesize/subjects/zqhs34j',
      icon: '🎓',
      type: 'website',
    },
    {
      title: 'Corbettmaths — Videos & Worksheets',
      description: 'Free videos and practice questions for every topic on the revision list.',
      url: 'https://corbettmaths.com',
      icon: '📐',
      type: 'website',
    },
    {
      title: 'Maths Genie — Exam Style Questions',
      description: 'Free exam style questions and solutions organised by topic — ideal for working through the revision list.',
      url: 'https://www.mathsgenie.co.uk',
      icon: '✏️',
      type: 'website',
    },
  ],
}
