const shuffle = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

export const generateMockExam = (allQuestions) => {
  // 1. Load used IDs
  let usedIds = JSON.parse(localStorage.getItem('n5_used_ids')) || [];
  let availableQuestions = allQuestions.filter(q => !usedIds.includes(q.id));

  // 2. Prevent crashing if pool is low
  if (availableQuestions.length < 60) {
    console.warn("Question pool nearly exhausted. Resetting history.");
    availableQuestions = [...allQuestions];
    usedIds = []; 
  }

  // 3. Strict picking algorithm
  const pick = (filterFn, targetCount, isPassage = false) => {
    const pool = availableQuestions.filter(filterFn);
    
    if (!isPassage) {
      const selected = shuffle(pool).slice(0, targetCount);
      selected.forEach(q => usedIds.push(q.id));
      return selected;
    } else {
      // Group by passage
      const groups = {};
      pool.forEach(q => {
        const p = q.passage || "no_passage";
        if (!groups[p]) groups[p] = [];
        groups[p].push(q);
      });

      const shuffledGroups = shuffle(Object.values(groups));
      const selected = [];
      let currentCount = 0;

      // STRICT FILLER: Ensures it never overfills past the targetCount
      for (const group of shuffledGroups) {
        if (currentCount + group.length <= targetCount) {
          selected.push(...group);
          currentCount += group.length;
        }
        if (currentCount === targetCount) break;
      }
      
      selected.forEach(q => usedIds.push(q.id));
      return selected;
    }
  };

  // --- SECTION 1: VOCABULARY (Target: 22) ---
  const t1 = pick(q => q.exam_type === "definition" && q.category === "kanji" && q.subcategory === "reading", 7);
  const t2 = pick(q => q.exam_type === "orthography", 6);
  const t3 = pick(q => q.exam_type === "vocab_fillin", 5);
  const t4 = pick(q => q.exam_type === "paraphrase", 4);

  // --- SECTION 2: GRAMMAR + READING (Target: 32) ---
  const t5 = pick(q => q.exam_type === "definition" && q.category === "grammar" && !["sentence_composition", "text_grammar"].includes(q.subcategory), 10);
  const t6 = pick(q => q.exam_type === "sentence_composition", 5);
  const t7 = pick(q => q.exam_type === "text_grammar", 5, true); 
  const t8 = pick(q => q.exam_type === "definition" && q.category === "reading" && ["short_text", "signs", "schedule", "advertisement", "menu"].includes(q.subcategory), 4);
  const t9 = pick(q => q.exam_type === "reading_medium", 5, true); 
  const t10 = pick(q => q.exam_type === "info_retrieval", 3);

  const section1 = [...t1, ...t2, ...t3, ...t4];
  const section2 = [...t5, ...t6, ...t7, ...t8, ...t9, ...t10];
  const fullExam = [...section1, ...section2];

  localStorage.setItem('n5_used_ids', JSON.stringify(usedIds));

  return {
    questions: fullExam,
    sec1Length: section1.length,
    sec2Length: section2.length
  };
};