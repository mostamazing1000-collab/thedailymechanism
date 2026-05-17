// ── MECHANISM POOLS ───────────────────────────────────
// Each pool has its own mechanisms. Each day, one from each pool is selected
// by cycling through with the day index. This means Easy/Medium/Hard are always
// three DIFFERENT mechanisms on any given day.

const EASY_MECHANISMS = [
  {
    id: "e1",
    title: "Aspirin blocks COX-1 and stops platelet clumping",
    category: "pharmacology",
    tags: ["NSAIDs", "platelets", "pain relief"],
    emoji: "💊",
    clue: "This common painkiller permanently disables an enzyme in platelets, stopping them from sticking together.",
    steps: [
      "Aspirin donates an acetyl group to COX-1, an enzyme inside platelets that normally makes thromboxane A₂ (TXA₂).",
      "TXA₂ is the chemical signal that tells platelets to clump together. With COX-1 blocked, no TXA₂ is made.",
      "Platelets can't make new COX-1 (they have no nucleus), so the effect lasts the entire platelet lifespan — 7 to 10 days."
    ],
    summary: "Aspirin permanently blocks COX-1 → no TXA₂ → platelets can't aggregate for 7–10 days.",
    clinical: "Low-dose aspirin (75 mg) is used daily to prevent heart attacks and strokes. Patients stop it 7–10 days before surgery. The dry cough side effect belongs to ACEi, not aspirin — a common exam trap.",
    memory_hook: "Aspirin superglues the enzyme shut. Platelets can't unsuperglue it, so they're stuck being non-sticky for life.",
    solution: "Aspirin irreversibly inhibits COX-1 by acetylating Ser530, preventing TXA₂ synthesis and platelet aggregation for the platelet's entire 7–10 day lifespan."
  },
  {
    id: "e2",
    title: "Beta-blockers slow the heart by blocking adrenaline",
    category: "pharmacology",
    tags: ["heart rate", "adrenaline", "hypertension"],
    emoji: "❤️",
    clue: "These drugs sit in the same receptor that adrenaline uses to speed the heart up — but they don't activate it.",
    steps: [
      "Adrenaline (and noradrenaline) bind β₁ receptors on the heart to increase heart rate and force of contraction.",
      "Beta-blockers (e.g. bisoprolol, atenolol) bind the same β₁ receptors but do nothing when they bind — they just block the seat.",
      "With adrenaline locked out, heart rate slows, force of contraction drops, and blood pressure falls."
    ],
    summary: "Beta-blockers occupy β₁ receptors without activating them → block adrenaline → slower heart, lower BP.",
    clinical: "Used in hypertension, heart failure, post-MI, and arrhythmias. Never stop them abruptly — rebound tachycardia can be dangerous. β₁-selective drugs (bisoprolol) are safer in asthmatics.",
    memory_hook: "Beta-blockers are bouncers who stand in the doorway but don't let anyone in — including adrenaline.",
    solution: "Beta-blockers competitively antagonise β₁ adrenergic receptors, preventing catecholamine binding and reducing heart rate (negative chronotropy) and contractility (negative inotropy)."
  },
  {
    id: "e3",
    title: "Statins lower cholesterol by blocking its production in the liver",
    category: "pharmacology",
    tags: ["cholesterol", "liver", "cardiovascular"],
    emoji: "🫀",
    clue: "These drugs block the first major step in the liver's cholesterol factory, forcing it to pull cholesterol from the blood instead.",
    steps: [
      "The liver makes cholesterol using an enzyme called HMG-CoA reductase. This is the rate-limiting (slowest, most important) step.",
      "Statins (e.g. atorvastatin) look like the enzyme's natural substrate and block its active site — competitive inhibition.",
      "With less cholesterol being made internally, the liver puts more LDL receptors on its surface and pulls LDL cholesterol out of the bloodstream."
    ],
    summary: "Statins block HMG-CoA reductase → liver makes less cholesterol → liver upregulates LDL receptors → blood LDL falls.",
    clinical: "Take statins at night — the liver makes most cholesterol nocturnally. Key side effect: myopathy (muscle ache). Rarely rhabdomyolysis. Check CK if muscle pain develops.",
    memory_hook: "Statins shut down the liver's cholesterol factory. The liver then has to shop from the blood supply (LDL) to get what it needs.",
    solution: "Statins competitively inhibit HMG-CoA reductase, the rate-limiting enzyme of the mevalonate pathway, reducing hepatic cholesterol synthesis and upregulating LDL receptors to lower plasma LDL."
  },
  {
    id: "e4",
    title: "SSRIs keep serotonin in the synapse for longer",
    category: "pharmacology",
    tags: ["depression", "serotonin", "brain"],
    emoji: "🧠",
    clue: "These antidepressants block the vacuum cleaner of the synapse, so the happy chemical lingers longer.",
    steps: [
      "When a serotonin neuron fires, serotonin (5-HT) is released into the synapse. Normally a transporter called SERT quickly sucks it back up.",
      "SSRIs (e.g. fluoxetine, sertraline) block SERT — serotonin stays in the synapse and keeps stimulating the next neuron.",
      "This doesn't work instantly. Over 2–6 weeks, the brain adjusts its receptor numbers and sensitivity, producing the antidepressant effect."
    ],
    summary: "SSRIs block SERT → serotonin stays in synapse longer → more 5-HT signalling. Effect takes 2–6 weeks to develop.",
    clinical: "Warn patients the drug takes weeks to work — this is a major reason for non-compliance. Stopping abruptly causes discontinuation syndrome (flu-like symptoms). Serotonin syndrome risk if combined with MAOIs or tramadol.",
    memory_hook: "SERT is the synapse vacuum cleaner. SSRIs unplug it — serotonin piles up. But the brain needs weeks to redecorate.",
    solution: "SSRIs block the serotonin reuptake transporter (SERT), increasing synaptic 5-HT concentration. The delayed clinical effect reflects receptor downregulation and autoreceptor desensitisation over 2–6 weeks."
  },
  {
    id: "e5",
    title: "Penicillin kills bacteria by wrecking their cell wall",
    category: "pharmacology",
    tags: ["antibiotics", "bacteria", "cell wall"],
    emoji: "🦠",
    clue: "This antibiotic disguises itself as a building block of the bacterial wall, then sabotages the construction workers.",
    steps: [
      "Bacteria build their cell wall by cross-linking peptidoglycan chains using enzymes called penicillin-binding proteins (PBPs).",
      "Penicillin's beta-lactam ring mimics the end of a peptidoglycan strand. PBPs bind it eagerly — and get permanently inactivated.",
      "Without cross-linking, the cell wall falls apart under osmotic pressure. The bacterium swells and bursts."
    ],
    summary: "Penicillin mimics peptidoglycan → inactivates PBPs → no cell wall cross-linking → bacterium lyses.",
    clinical: "Only kills dividing bacteria (they need to be actively building wall). Resistance via beta-lactamase enzymes — countered by clavulanic acid (e.g. co-amoxiclav). Allergy is IgE-mediated — ask before prescribing.",
    memory_hook: "Penicillin is a wolf in sheep's clothing — pretends to be a wall brick, then permanently breaks the bricklayer's hands.",
    solution: "Penicillin's beta-lactam ring acylates the active site serine of PBPs, irreversibly inhibiting peptidoglycan cross-linking, causing cell wall weakness and bacteriolysis in actively dividing bacteria."
  },
  {
    id: "e6",
    title: "The sodium-potassium pump keeps nerve cells ready to fire",
    category: "biochemistry",
    tags: ["membrane", "ions", "nerve"],
    emoji: "⚡",
    clue: "Every cell membrane has a tiny engine that constantly pumps 3 ions out and 2 ions in, using one unit of fuel each time.",
    steps: [
      "The Na⁺/K⁺-ATPase uses 1 ATP to pump 3 sodium ions (Na⁺) OUT of the cell and 2 potassium ions (K⁺) IN.",
      "This keeps Na⁺ high outside and K⁺ high inside. The unequal charge exchange (3 out vs 2 in) also makes the inside slightly negative.",
      "This electrochemical gradient (the resting potential, ~−70 mV in neurons) is essential for action potentials — every nerve impulse depends on it."
    ],
    summary: "Na⁺/K⁺-ATPase: 3 Na⁺ out, 2 K⁺ in, 1 ATP used. Creates the resting potential that nerves and muscles depend on.",
    clinical: "Digoxin inhibits this pump in heart muscle, raising intracellular Na⁺ → less Na⁺/Ca²⁺ exchange → more Ca²⁺ → stronger contractions. Used in heart failure. Narrow therapeutic window — toxicity causes arrhythmias.",
    memory_hook: "3 out, 2 in — always. The cell spends 30% of its energy on this pump alone because it's that important.",
    solution: "The Na⁺/K⁺-ATPase hydrolyses ATP to pump 3 Na⁺ out and 2 K⁺ in per cycle, establishing the electrochemical gradients (high extracellular Na⁺, high intracellular K⁺) that underpin the resting membrane potential."
  },
  {
    id: "e7",
    title: "Insulin tells muscle and fat cells to absorb glucose",
    category: "biochemistry",
    tags: ["diabetes", "glucose", "signalling"],
    emoji: "🍭",
    clue: "A hormone produced after eating triggers tiny glucose-carrying doors to move from inside the cell to its surface.",
    steps: [
      "Insulin binds its receptor on muscle and fat cells, activating a signalling cascade: insulin receptor → IRS-1 → PI3K → Akt.",
      "Activated Akt causes vesicles containing GLUT4 transporters to fuse with the cell membrane — GLUT4 appears on the surface.",
      "Glucose floods into the cell through GLUT4. Blood glucose falls. In type 2 diabetes, the IRS-1/PI3K step is resistant to insulin."
    ],
    summary: "Insulin → receptor → PI3K → Akt → GLUT4 moves to membrane → glucose enters cell. Pathway impaired in type 2 diabetes.",
    clinical: "Exercise also promotes GLUT4 translocation via AMPK — independent of insulin. This is why exercise improves insulin sensitivity even in type 2 diabetics.",
    memory_hook: "GLUT4 is a parked delivery truck inside the cell. Insulin is the dispatcher who sends it to the loading dock (cell surface) to accept glucose deliveries.",
    solution: "Insulin activates its receptor tyrosine kinase → IRS-1 → PI3K → PIP3 → Akt, which phosphorylates AS160, releasing GLUT4 vesicles to fuse with the plasma membrane and facilitate facilitated diffusion of glucose."
  },
  {
    id: "e8",
    title: "Haemoglobin loads oxygen in the lungs and drops it in tissues",
    category: "biochemistry",
    tags: ["oxygen transport", "lungs", "cooperativity"],
    emoji: "🔴",
    clue: "This protein's S-shaped binding curve means it greedily picks up oxygen in one place and efficiently drops it off in another.",
    steps: [
      "Haemoglobin has 4 subunits. In the T (tense) state, O₂ affinity is low. When one O₂ binds, it shifts the whole molecule toward the R (relaxed) state.",
      "Each O₂ that binds makes the next subunit more willing to bind — this cooperativity creates the characteristic S-shaped (sigmoidal) dissociation curve.",
      "In tissues (high CO₂, low pH, high temperature), the curve shifts right (Bohr effect) — Hb releases O₂ more readily. In lungs, it shifts left — Hb loads up eagerly."
    ],
    summary: "Hb cooperativity → sigmoidal curve. Bohr effect: acidic/hot/high CO₂ shifts curve right → O₂ unloaded in tissues.",
    clinical: "Fetal Hb (HbF) has γ subunits — it binds 2,3-DPG less, so its curve is left-shifted. HbF steals O₂ from maternal blood across the placenta. This is why premature babies don't need as much supplemental O₂ as you'd expect.",
    memory_hook: "Haemoglobin is a team player — the first O₂ makes room for the others. And in tired, hot, acidic tissues it lets go, like a sweaty hand releasing a grip.",
    solution: "Cooperativity between Hb subunits produces a sigmoidal O₂ dissociation curve. The Bohr effect (↑CO₂, ↓pH, ↑temperature, ↑2,3-DPG) right-shifts the curve, reducing O₂ affinity and promoting delivery to metabolically active tissues."
  },
  {
    id: "e9",
    title: "DNA replication needs a primer before it can start",
    category: "biochemistry",
    tags: ["DNA", "replication", "genetics"],
    emoji: "🧬",
    clue: "The main enzyme that copies DNA has one critical limitation — it cannot start from scratch and always needs a short RNA starter.",
    steps: [
      "Helicase unwinds the double helix. But DNA polymerase III cannot begin a new strand — it can only extend an existing one.",
      "Primase lays down a short RNA primer (8–12 nucleotides) to give pol III a starting point. Pol III then extends in the 5'→3' direction.",
      "DNA pol I later removes the RNA primer and fills the gap with DNA. Ligase seals the remaining nick."
    ],
    summary: "Helicase unwinds → primase adds RNA primer → pol III extends → pol I removes primer → ligase seals. Pol III can only extend, never initiate.",
    clinical: "Many antibiotics target bacterial DNA machinery. Fluoroquinolones inhibit bacterial DNA gyrase (topoisomerase that relieves supercoiling ahead of the fork) — a bacterial-specific target.",
    memory_hook: "DNA pol III is a writer who can only continue a sentence already started — primase writes the first word so pol III can finish the paragraph.",
    solution: "DNA primase synthesises a short RNA primer complementary to the template, providing a free 3'-OH for DNA polymerase III to extend. Pol I (5'→3' exonuclease) removes primers, Pol I fills gaps, ligase seals nicks."
  },
  {
    id: "e10",
    title: "The action potential: sodium in, potassium out",
    category: "biochemistry",
    tags: ["nerves", "ion channels", "membrane potential"],
    emoji: "⚡",
    clue: "A nerve impulse travels along a neuron as a wave of one ion rushing in, then another rushing out.",
    steps: [
      "A stimulus depolarises the membrane. Voltage-gated Na⁺ channels open → Na⁺ floods in → membrane shoots to +40 mV.",
      "Na⁺ channels automatically inactivate within 1 ms (refractory period). Voltage-gated K⁺ channels open slowly → K⁺ flows out → membrane repolarises.",
      "K⁺ channels close slowly, causing brief hyperpolarisation. The Na⁺/K⁺-ATPase then restores the original ion gradients."
    ],
    summary: "Action potential: Na⁺ in (depolarisation) → Na⁺ channels inactivate → K⁺ out (repolarisation) → brief hyperpolarisation → ATPase restores gradients.",
    clinical: "Local anaesthetics (lidocaine) block voltage-gated Na⁺ channels. They preferentially bind the inactivated state — rapidly firing pain neurons are blocked more effectively than resting ones (use-dependent block).",
    memory_hook: "Na⁺ kicks the door open, K⁺ pulls it shut, and the door briefly swings past closed. Then the pump resets everything.",
    solution: "Membrane depolarisation activates voltage-gated Na⁺ channels (Na⁺ influx, rising phase), which rapidly inactivate. Delayed K⁺ channel opening causes K⁺ efflux (repolarisation). Brief afterhyperpolarisation precedes return to resting potential via Na⁺/K⁺-ATPase."
  },
  {
    id: "e11",
    title: "ACE inhibitors lower blood pressure through the RAAS",
    category: "pharmacology",
    tags: ["blood pressure", "kidney", "RAAS"],
    emoji: "🫁",
    clue: "These drugs block the enzyme that converts an inactive hormone into a powerful blood vessel constrictor.",
    steps: [
      "ACE (angiotensin-converting enzyme) converts angiotensin I → angiotensin II, a potent vasoconstrictor that also triggers aldosterone release.",
      "ACEi (ramipril, lisinopril) bind the ACE active site and block this conversion. Less angiotensin II → vasodilation and less aldosterone.",
      "Less aldosterone → less Na⁺/water retention → lower blood volume → lower BP. ACE also breaks down bradykinin — ACEi let it accumulate → dry cough."
    ],
    summary: "ACEi block ACE → less angiotensin II → vasodilation + less aldosterone → lower BP. Bradykinin accumulation causes the dry cough.",
    clinical: "First-line in hypertension, especially with diabetes. Contraindicated in bilateral renal artery stenosis and pregnancy. If cough is intolerable, switch to an ARB (losartan) — blocks the angiotensin II receptor instead, no bradykinin effect.",
    memory_hook: "ACEi demolishes the bridge between angiotensin I and II. Without the bridge, all of angiotensin II's downstream effects collapse.",
    solution: "ACE inhibitors block angiotensin-converting enzyme, reducing angiotensin II production. This causes vasodilation, reduced aldosterone secretion, and natriuresis, lowering blood pressure. Bradykinin accumulation from reduced ACE degradation causes the characteristic dry cough."
  },
  {
    id: "e12",
    title: "Glycolysis: glucose is broken into pyruvate for energy",
    category: "biochemistry",
    tags: ["energy", "glucose", "metabolism"],
    emoji: "⚡",
    clue: "In the cytoplasm, one sugar molecule is split in two through 10 steps, producing a small amount of energy and two 3-carbon products.",
    steps: [
      "Glycolysis occurs in the cytoplasm. Glucose (6C) is phosphorylated twice (using 2 ATP) and split into two molecules of glyceraldehyde-3-phosphate.",
      "Each G3P is oxidised, producing 2 NADH and 2 ATP each. Total yield: 4 ATP made minus 2 invested = net 2 ATP, plus 2 NADH.",
      "The end product is 2 pyruvate. In oxygen, pyruvate enters the mitochondria for the Krebs cycle. Without oxygen, it becomes lactate."
    ],
    summary: "Glycolysis: 1 glucose → 2 pyruvate + net 2 ATP + 2 NADH. Occurs in cytoplasm, no oxygen needed.",
    clinical: "Cancer cells use glycolysis even in oxygen (Warburg effect) — less efficient but faster, providing biosynthetic precursors. Lactate build-up in shock causes metabolic acidosis — a key clinical sign.",
    memory_hook: "Glycolysis is the body's emergency generator — low output but works without power (oxygen). 10 steps to halve a sugar and pocket 2 ATP.",
    solution: "Glycolysis converts one glucose to two pyruvate via 10 enzymatic steps in the cytoplasm, with a net yield of 2 ATP and 2 NADH. The rate-limiting step is PFK-1, regulated by ATP/AMP ratio and insulin/glucagon signalling."
  }
];

const MEDIUM_MECHANISMS = [
  {
    id: "m1",
    title: "Warfarin inhibits VKOR, blocking vitamin K recycling",
    category: "pharmacology",
    tags: ["anticoagulation", "vitamin K", "clotting factors"],
    emoji: "🩹",
    clue: "Category: pharmacology. Tags: anticoagulation, vitamin K, clotting factors. This oral anticoagulant works by starving clotting factors of their essential cofactor.",
    steps: [
      "Clotting factors II, VII, IX, X require gamma-carboxylation to become active — this uses vitamin K (reduced form, KH₂) as a cofactor.",
      "During carboxylation, KH₂ is oxidised to vitamin K epoxide. VKOR (vitamin K epoxide reductase) normally recycles it back to KH₂.",
      "Warfarin inhibits VKOR → KH₂ depleted → factors can't be gamma-carboxylated → they remain inactive → anticoagulation."
    ],
    summary: "Warfarin blocks VKOR → vitamin K can't be recycled → clotting factors II, VII, IX, X inactive → anticoagulation.",
    clinical: "Factor VII has the shortest half-life (~6h) so PT/INR rises first. Effect delayed days — existing factors must clear. Many food/drug interactions. Reversed with vitamin K or FFP. DOACs now preferred in most settings.",
    memory_hook: "Warfarin starves the clotting factory of its fuel (vitamin K). The factors are made but can't be stamped 'active'.",
    solution: "Warfarin inhibits vitamin K epoxide reductase (VKOR), preventing recycling of vitamin K epoxide to the active KH₂ form. This depletes the cofactor required for γ-carboxylation of clotting factors II, VII, IX, and X, reducing their activity."
  },
  {
    id: "m2",
    title: "Metformin activates AMPK to reduce liver glucose output",
    category: "pharmacology",
    tags: ["type 2 diabetes", "liver", "AMPK"],
    emoji: "🍬",
    clue: "Category: pharmacology. Tags: type 2 diabetes, liver, AMPK. The world's most prescribed diabetes drug works by tricking the liver into thinking it's low on energy.",
    steps: [
      "Metformin inhibits mitochondrial complex I in liver cells → less ATP produced → AMP:ATP ratio rises.",
      "High AMP activates AMPK — the cell's master energy sensor. AMPK acts as if the cell is starving.",
      "AMPK inhibits TORC2, a co-activator of gluconeogenic genes → liver makes less glucose from scratch → lower fasting blood glucose."
    ],
    summary: "Metformin → ↓ complex I → ↑ AMP:ATP → activates AMPK → ↓ hepatic gluconeogenesis → lower fasting glucose. No hypoglycaemia risk alone.",
    clinical: "First-line in T2DM. Unlike sulfonylureas, it doesn't stimulate insulin → no hypoglycaemia. Contraindicated in eGFR <30 (lactic acidosis risk). Also under research as an anti-ageing drug.",
    memory_hook: "Metformin whispers 'you're starving' to the liver. The liver stops making sugar to conserve resources — even though the body has plenty.",
    solution: "Metformin inhibits mitochondrial complex I, raising the AMP:ATP ratio and activating AMPK. AMPK phosphorylates and inhibits TORC2, suppressing transcription of gluconeogenic enzymes (PEPCK, G6Pase), reducing hepatic glucose output."
  },
  {
    id: "m3",
    title: "PPIs irreversibly block the gastric proton pump",
    category: "pharmacology",
    tags: ["stomach acid", "proton pump", "prodrug"],
    emoji: "🫃",
    clue: "Category: pharmacology. Tags: stomach acid, proton pump, prodrug. These acid-suppressing drugs are inactive until they reach the acidic environment where they're needed.",
    steps: [
      "Parietal cells secrete acid via H⁺/K⁺-ATPase (the proton pump) in their secretory canaliculus — an acidic compartment.",
      "PPIs (omeprazole, lansoprazole) are prodrugs. They're absorbed and reach the acidic canaliculus, where they're converted to active sulfenamide metabolites.",
      "The active form covalently bonds to cysteine residues on the proton pump → irreversible inhibition → new pumps must be synthesised before acid returns."
    ],
    summary: "PPIs → activated in acidic parietal cell canaliculus → covalent bond to proton pump → irreversible acid suppression.",
    clinical: "Take 30–60 min before meals when pumps are active. Long-term use risks: hypomagnesaemia, B12 deficiency, C. diff, bone density loss. Hugely overprescribed — always review the indication.",
    memory_hook: "PPIs are like stealth missiles — harmless until they hit the acid environment target, then they detonate and permanently kill the pump.",
    solution: "PPIs are prodrugs activated by protonation in the acidic secretory canaliculus of parietal cells, forming a sulfenamide that forms a covalent disulfide bond with H⁺/K⁺-ATPase cysteine residues, irreversibly inhibiting acid secretion."
  },
  {
    id: "m4",
    title: "Heparin amplifies antithrombin III by 1000-fold",
    category: "pharmacology",
    tags: ["anticoagulation", "antithrombin", "thrombin"],
    emoji: "💉",
    clue: "Category: pharmacology. Tags: anticoagulation, antithrombin, thrombin. This injectable anticoagulant doesn't act directly — it supercharges the body's own clot-stopping protein.",
    steps: [
      "Antithrombin III (ATIII) naturally neutralises thrombin and factor Xa — but slowly.",
      "Heparin binds ATIII and causes a conformational change that increases its activity by 1,000-fold — clotting factors are neutralised almost instantly.",
      "Low-molecular-weight heparins (LMWH, e.g. enoxaparin) are too short to bridge ATIII to thrombin — they only inhibit factor Xa, giving more predictable dosing."
    ],
    summary: "Heparin + ATIII → 1000× faster neutralisation of thrombin and Xa. LMWH only inhibits Xa. Reversed by protamine.",
    clinical: "Unfractionated heparin monitored by APTT. LMWH needs no monitoring in most patients. HIT (heparin-induced thrombocytopenia) is paradoxically prothrombotic — stop all heparin immediately if suspected.",
    memory_hook: "ATIII is a slow security guard. Heparin gives it an espresso and a loudhailer — suddenly neutralising clotting factors 1,000 times faster.",
    solution: "Heparin binds antithrombin III via a specific pentasaccharide sequence, inducing a conformational change that accelerates ATIII's inhibition of thrombin (IIa) and factor Xa by ~1000-fold. LMWH lacks the full chain to bridge ATIII to thrombin, selectively inhibiting Xa."
  },
  {
    id: "m5",
    title: "Glucocorticoids suppress inflammation by blocking phospholipase A₂",
    category: "pharmacology",
    tags: ["steroids", "anti-inflammatory", "arachidonic acid"],
    emoji: "💊",
    clue: "Category: pharmacology. Tags: steroids, anti-inflammatory, arachidonic acid. These powerful anti-inflammatories work further upstream than NSAIDs — cutting off ALL inflammatory lipid mediators at their source.",
    steps: [
      "Steroids enter cells and bind glucocorticoid receptors (GRs). The GR-steroid complex moves to the nucleus and acts as a transcription factor.",
      "It upregulates the gene for lipocortin-1, a protein that inhibits phospholipase A₂.",
      "Phospholipase A₂ normally releases arachidonic acid from membrane phospholipids — the precursor for ALL prostaglandins, thromboxanes, and leukotrienes. Blocking it eliminates all of them at once."
    ],
    summary: "Steroids → GR → nucleus → ↑ lipocortin-1 → ↓ phospholipase A₂ → ↓ arachidonic acid → ↓ ALL eicosanoids. Broader than NSAIDs.",
    clinical: "NSAIDs cut one branch (COX). Steroids cut the trunk (phospholipase A₂). More powerful — but immunosuppression, hyperglycaemia, osteoporosis, adrenal suppression with long-term use.",
    memory_hook: "NSAIDs prune one branch of the inflammation tree. Steroids cut the trunk — more powerful but more collateral damage.",
    solution: "Glucocorticoids bind cytoplasmic GRs, translocate to the nucleus, and upregulate lipocortin-1 (annexin A1), which inhibits phospholipase A₂. This prevents arachidonic acid release, blocking production of all prostaglandins, thromboxanes, and leukotrienes."
  },
  {
    id: "m6",
    title: "Krebs cycle: acetyl-CoA is burned to charge NADH batteries",
    category: "biochemistry",
    tags: ["mitochondria", "ATP", "oxidative phosphorylation"],
    emoji: "🔋",
    clue: "Category: biochemistry. Tags: mitochondria, ATP, oxidative phosphorylation. This mitochondrial cycle doesn't make much ATP directly — its real job is charging electron carriers for the real ATP factory downstream.",
    steps: [
      "Acetyl-CoA (2C) condenses with oxaloacetate (4C) to form citrate (6C). Through a series of oxidative steps, the cycle releases 2 CO₂ per turn.",
      "Each turn produces 3 NADH, 1 FADH₂, and 1 GTP. The oxaloacetate is regenerated — ready for the next acetyl-CoA.",
      "NADH and FADH₂ carry electrons to the electron transport chain (complexes I–IV), where their energy drives ATP synthase. ~10 ATP equivalents per turn."
    ],
    summary: "Krebs cycle: 1 acetyl-CoA → 2 CO₂ + 3 NADH + 1 FADH₂ + 1 GTP per turn. NADH/FADH₂ fuel the ETC for most ATP.",
    clinical: "Thiamine (B1) deficiency impairs pyruvate dehydrogenase and α-ketoglutarate dehydrogenase — two key Krebs enzymes. Causes Wernicke's encephalopathy. NEVER give IV glucose before thiamine in at-risk patients.",
    memory_hook: "The Krebs cycle is a charging station, not a power plant. It charges NADH and FADH₂ batteries for the ETC power plant next door.",
    solution: "The Krebs cycle oxidises acetyl-CoA in the mitochondrial matrix, producing 3 NADH, 1 FADH₂, 1 GTP, and 2 CO₂ per turn. NADH and FADH₂ donate electrons to the ETC at complexes I and II respectively, driving oxidative phosphorylation."
  },
  {
    id: "m7",
    title: "Complement cascade: antibody activates C1, triggering pathogen lysis",
    category: "biochemistry",
    tags: ["immunology", "complement", "innate immunity"],
    emoji: "🛡️",
    clue: "Category: biochemistry. Tags: immunology, complement, innate immunity. Antibody binding to a pathogen sets off a cascade of protein activations that ends with a molecular drill punching holes in the pathogen's membrane.",
    steps: [
      "IgG or IgM antibodies bound to a pathogen surface bind C1q, activating C1r and C1s → C1 complex active.",
      "C1s cleaves C4 and C2 → forms C4b2a (C3 convertase), which cleaves C3 into C3a (inflammation) and C3b (opsonisation). Massively amplified.",
      "C3b joins the convertase → C5 convertase → C5a (chemoattractant) + C5b → membrane attack complex (MAC) → punches holes → pathogen lyses."
    ],
    summary: "Ab + C1 → C3 convertase → C3b (opsonisation) + C3a → C5 convertase → MAC → lysis. Each step amplifies the signal enormously.",
    clinical: "C3 deficiency → recurrent encapsulated bacterial infections. C5–C9 deficiency → specifically vulnerable to Neisseria (meningococcus/gonorrhoea). PNH — GPI anchor deficiency means complement attacks the patient's own RBCs.",
    memory_hook: "Complement is a demolition crew called by antibody. C1 calls C3, C3 calls C5, C5 builds the drill. Each call is amplified — one antibody can trigger thousands of drills.",
    solution: "The classical complement pathway is initiated by C1q binding to antibody-antigen complexes, activating C1r/C1s, which cleave C4 and C2 to form the C3 convertase (C4b2a). C3 cleavage generates C3b (opsonin) and C3a (anaphylatoxin), and feeds into the C5 convertase and terminal MAC (C5b-9)."
  },
  {
    id: "m8",
    title: "Nucleophilic substitution (SN2): one step, back-side attack",
    category: "chemistry",
    tags: ["organic chemistry", "SN2", "nucleophile"],
    emoji: "⚗️",
    clue: "Category: chemistry. Tags: organic chemistry, SN2, nucleophile. In this one-step reaction, an attacking group approaches from the back as the leaving group departs — like a molecular umbrella inversion.",
    steps: [
      "A nucleophile (electron-rich species, e.g. OH⁻, CN⁻) attacks the electrophilic carbon bearing the leaving group (e.g. Br⁻) from the BACK — 180° from the leaving group.",
      "In a single concerted step, the new bond forms as the old bond breaks. The carbon undergoes Walden inversion — like an umbrella flipping inside out.",
      "Rate depends on both nucleophile and substrate concentration (bimolecular). Best with primary alkyl halides and strong nucleophiles. Tertiary substrates are too hindered."
    ],
    summary: "SN2: one concerted step, back-side attack, Walden inversion, rate = k[nucleophile][substrate]. Favoured at primary carbons.",
    clinical: "SN2 chemistry underpins alkylating agents in chemotherapy (e.g. cyclophosphamide) — they form reactive species that attack the back-side of DNA bases, cross-linking strands and halting cancer cell replication.",
    memory_hook: "SN2 is a drive-by — nucleophile sweeps in from behind in one smooth move as the leaving group exits from the front. Umbrella flips, done.",
    solution: "SN2 reactions proceed via a concerted bimolecular mechanism: the nucleophile attacks the electrophilic carbon anti-periplanar to the leaving group, passing through a pentacoordinate transition state with Walden inversion of configuration. Rate = k[Nu][RX]."
  },
  {
    id: "m9",
    title: "Beta-oxidation: fatty acids are disassembled 2 carbons at a time",
    category: "biochemistry",
    tags: ["lipid metabolism", "mitochondria", "energy"],
    emoji: "🔥",
    clue: "Category: biochemistry. Tags: lipid metabolism, mitochondria, energy. Long fat molecules are snipped from the end two carbons at a time, each snip charging an electron carrier and producing a unit of fuel.",
    steps: [
      "Fatty acids are activated to acyl-CoA in the cytoplasm, then transported into mitochondria as acyl-carnitine via the carnitine shuttle — the rate-limiting step.",
      "In the matrix, each cycle of beta-oxidation removes 2 carbons as acetyl-CoA and produces 1 NADH + 1 FADH₂.",
      "For palmitate (16C): 7 cycles → 8 acetyl-CoA + 7 NADH + 7 FADH₂ → ~106 ATP. Fat is far more energy-dense than carbohydrate."
    ],
    summary: "Fatty acid → acyl-CoA → carnitine shuttle → mitochondria → beta-oxidation: 2C removed per cycle as acetyl-CoA + NADH + FADH₂.",
    clinical: "Carnitine deficiency → fatty acids can't enter mitochondria → severe hypoglycaemia + myopathy. Medium-chain fatty acids bypass the shuttle (used in MCT supplements for metabolic disorders).",
    memory_hook: "Beta-oxidation is a paper shredder for fat — feeding a long chain in and getting 2-carbon confetti (acetyl-CoA) plus energy out with every pass.",
    solution: "Fatty acids undergo beta-oxidation in the mitochondrial matrix after transport via the carnitine shuttle (rate-limiting). Each cycle produces 1 acetyl-CoA, 1 NADH, and 1 FADH₂ by sequential oxidation at the beta-carbon, shortening the chain by 2 carbons."
  },
  {
    id: "m10",
    title: "Morphine activates μ-opioid receptors to silence pain neurons",
    category: "pharmacology",
    tags: ["pain", "opioids", "GPCR"],
    emoji: "😴",
    clue: "Category: pharmacology. Tags: pain, opioids, GPCR. This classic painkiller mimics the body's own endorphins and silences pain neurons through a Gi-coupled receptor.",
    steps: [
      "Morphine binds μ-opioid receptors (Gi-coupled GPCRs) in the brain, spinal cord, and periphery — mimicking endogenous endorphins.",
      "Gi activation → inhibits adenylyl cyclase → ↓ cAMP → K⁺ channels open (hyperpolarisation) + Ca²⁺ channels close.",
      "Result: reduced neurotransmitter release from pain neurons and decreased postsynaptic excitability → analgesia. Same brainstem receptors cause respiratory depression — the main overdose risk."
    ],
    summary: "Morphine → μ-opioid receptor (Gi) → ↓ cAMP, hyperpolarisation → silenced pain neurons. Respiratory depression from brainstem receptors.",
    clinical: "Tolerance from receptor internalisation — escalating doses needed. Naloxone (competitive antagonist) reverses overdose rapidly. Physical dependence ≠ addiction — an important distinction.",
    memory_hook: "Morphine flips pain neurons into silent mode: opens K⁺ exit, closes Ca²⁺ entry, cuts the cAMP intercom. The neuron can't shout anymore.",
    solution: "Morphine binds Gi-coupled μ-opioid receptors, inhibiting adenylyl cyclase (↓cAMP), opening inwardly rectifying K⁺ channels (hyperpolarisation), and inhibiting voltage-gated Ca²⁺ channels, collectively reducing neuronal excitability and neurotransmitter release in pain pathways."
  },
  {
    id: "m11",
    title: "Dopamine pathways explain antipsychotic effects and side effects",
    category: "pharmacology",
    tags: ["psychiatry", "dopamine", "schizophrenia"],
    emoji: "🧠",
    clue: "Category: pharmacology. Tags: psychiatry, dopamine, schizophrenia. A single receptor-blocking mechanism in four brain pathways explains both the benefits and the side effects of antipsychotic drugs.",
    steps: [
      "Four dopamine pathways: mesolimbic (reward/psychosis), mesocortical (cognition), nigrostriatal (movement), tuberoinfundibular (prolactin).",
      "In schizophrenia, the mesolimbic pathway is overactive (positive symptoms). Antipsychotics are D2 receptor antagonists — they block dopamine everywhere.",
      "Blocking mesolimbic D2 → ↓ positive symptoms (therapeutic). Blocking nigrostriatal D2 → extrapyramidal side effects (Parkinsonism). Blocking tuberoinfundibular → raised prolactin."
    ],
    summary: "Antipsychotics block D2 receptors. Therapeutic: ↓ mesolimbic overactivity. Side effects: nigrostriatal (EPS) + tuberoinfundibular (↑ prolactin). Atypicals also block 5-HT2A to reduce EPS.",
    clinical: "Atypical antipsychotics (clozapine, olanzapine) additionally block 5-HT2A, allowing more dopamine in the nigrostriatal pathway → less EPS. Clozapine most effective but requires weekly FBC (agranulocytosis risk).",
    memory_hook: "D2 blockers fire a shotgun at all four dopamine pathways. Atypicals try to be sniper rifles — adding 5-HT2A blockade to spare the motor pathway.",
    solution: "Antipsychotics block D2 receptors across all dopamine pathways. Therapeutic effects arise from mesolimbic D2 blockade (reducing hyperdopaminergia causing positive symptoms). Adverse effects include EPS (nigrostriatal D2 blockade), hyperprolactinaemia (tuberoinfundibular), and negative/cognitive symptom worsening (mesocortical)."
  },
  {
    id: "m12",
    title: "Electrophilic aromatic substitution on benzene",
    category: "chemistry",
    tags: ["organic chemistry", "benzene", "electrophile"],
    emoji: "⚗️",
    clue: "Category: chemistry. Tags: organic chemistry, benzene, electrophile. Benzene is unusually reluctant to add across its double bonds — instead it substitutes, preserving its stable ring.",
    steps: [
      "A strong electrophile (E⁺, e.g. NO₂⁺ in nitration, Br⁺ from Br₂/FeBr₃) attacks the electron-rich π system of benzene, forming an arenium ion (carbocation intermediate).",
      "The arenium ion is stabilised by delocalisation across the ring but is no longer aromatic (one sp3 carbon). A proton is then lost to restore aromaticity.",
      "The overall result is substitution (not addition) — the aromatic ring is preserved. Substituents on the ring direct further substitution: electron-donating groups direct ortho/para; electron-withdrawing groups direct meta."
    ],
    summary: "EAS: E⁺ attacks benzene π system → arenium ion → loss of H⁺ restores aromaticity → substitution product. Ring stability drives the mechanism.",
    clinical: "EAS is the basis of synthesising many drugs — sulfonamide antibiotics, paracetamol (acetaminophen), aspirin, and local anaesthetics all involve aromatic rings modified by EAS chemistry in their synthesis.",
    memory_hook: "Benzene is too precious to give up its aromaticity for mere addition. It lets the electrophile in, kicks out a proton instead, and keeps its stability intact.",
    solution: "Electrophilic aromatic substitution proceeds via generation of E⁺ (e.g. NO₂⁺ from HNO₃/H₂SO₄), electrophilic attack on benzene π electrons forming a σ-complex (arenium ion/Wheland intermediate), followed by deprotonation to restore aromaticity. The net result is substitution, preserving the aromatic system."
  }
];

  ,{
    id: "m13",
    title: "SN2 reaction: backside attack with Walden inversion",
    category: "chemistry",
    tags: ["SN2", "nucleophile", "organic chemistry", "inversion"],
    emoji: "⚗️",
    clue: "Category: chemistry. Tags: SN2, nucleophile, inversion. A one-step reaction where an attacking group approaches from exactly the opposite side to the leaving group — like an umbrella flipping.",
    diagram: `<div class="mech-diagram"><svg viewBox="0 0 480 160" xmlns="http://www.w3.org/2000/svg" style="width:100%;display:block"><defs><marker id="sn2a" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#0F7B6C"/></marker><marker id="sn2b" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#C4412A"/></marker></defs><text x="4" y="14" font-size="10" fill="#6B6760" font-family="monospace">REACTANT</text><text x="10" y="90" font-size="13" fill="#0F7B6C" font-weight="bold" font-family="monospace">Nu:⁻</text><line x1="46" y1="86" x2="78" y2="86" stroke="#0F7B6C" stroke-width="2" marker-end="url(#sn2a)"/><circle cx="94" cy="86" r="15" fill="#FDF0DC" stroke="#C4720A" stroke-width="2"/><text x="88" y="91" font-size="12" font-family="monospace" fill="#C4720A">C</text><line x1="109" y1="86" x2="138" y2="86" stroke="#C4412A" stroke-width="2" marker-end="url(#sn2b)"/><text x="141" y="91" font-size="12" fill="#C4412A" font-family="monospace">Br⁻</text><line x1="94" y1="71" x2="94" y2="48" stroke="#1A1A18" stroke-width="1.5"/><text x="86" y="44" font-size="11" font-family="monospace">CH₃</text><line x1="82" y1="96" x2="65" y2="112" stroke="#1A1A18" stroke-width="1.5" stroke-dasharray="4,2"/><text x="55" y="126" font-size="11" font-family="monospace">H</text><line x1="106" y1="96" x2="122" y2="112" stroke="#1A1A18" stroke-width="1.5"/><text x="124" y="126" font-size="11" font-family="monospace">H</text><text x="170" y="92" font-size="20" fill="#6B6760">→</text><text x="198" y="14" font-size="10" fill="#6B6760" font-family="monospace">TRANSITION STATE [‡]</text><text x="198" y="90" font-size="11" fill="#0F7B6C" font-family="monospace">Nu</text><line x1="215" y1="86" x2="232" y2="86" stroke="#0F7B6C" stroke-width="1.5" stroke-dasharray="4,3"/><circle cx="248" cy="86" r="15" fill="#FDF0DC" stroke="#C4720A" stroke-width="2" stroke-dasharray="5,3"/><text x="242" y="91" font-size="12" font-family="monospace" fill="#C4720A">C</text><text x="237" y="68" font-size="10" fill="#C4720A" font-family="monospace">δ⁻</text><line x1="263" y1="86" x2="280" y2="86" stroke="#C4412A" stroke-width="1.5" stroke-dasharray="4,3"/><text x="283" y="90" font-size="11" fill="#C4412A" font-family="monospace">Br</text><line x1="248" y1="71" x2="248" y2="50" stroke="#1A1A18" stroke-width="1.5"/><text x="242" y="46" font-size="11" font-family="monospace">CH₃</text><line x1="234" y1="86" x2="216" y2="86" stroke="#1A1A18" stroke-width="1"/><text x="204" y="86" font-size="11" font-family="monospace">H</text><text x="330" y="92" font-size="20" fill="#6B6760">→</text><text x="358" y="14" font-size="10" fill="#6B6760" font-family="monospace">PRODUCT (inverted)</text><circle cx="390" cy="86" r="15" fill="#D4EDE9" stroke="#0F7B6C" stroke-width="2"/><text x="384" y="91" font-size="12" font-family="monospace" fill="#0F7B6C">C</text><line x1="405" y1="86" x2="424" y2="86" stroke="#0F7B6C" stroke-width="2"/><text x="426" y="91" font-size="12" fill="#0F7B6C" font-family="monospace">Nu</text><line x1="390" y1="71" x2="390" y2="50" stroke="#1A1A18" stroke-width="1.5"/><text x="384" y="46" font-size="11" font-family="monospace">CH₃</text><line x1="378" y1="97" x2="362" y2="112" stroke="#1A1A18" stroke-width="1.5"/><text x="352" y="126" font-size="11" font-family="monospace">H</text><line x1="402" y1="97" x2="416" y2="112" stroke="#1A1A18" stroke-width="1.5" stroke-dasharray="4,2"/><text x="418" y="126" font-size="11" font-family="monospace">H</text><text x="358" y="148" font-size="10" fill="#C4412A" font-family="monospace">← Walden inversion (umbrella flip)</text></svg></div>`,
    steps: [
      "The nucleophile (Nu:⁻, e.g. OH⁻ or CN⁻) approaches the electrophilic carbon from the back — exactly 180° opposite the leaving group (e.g. Br⁻).",
      "In a single concerted step, the new Nu–C bond forms as the C–Br bond breaks. The carbon passes through a flat pentacoordinate transition state — like an umbrella mid-flip.",
      "The three remaining substituents invert through the plane — Walden inversion. Product has opposite stereochemistry at that carbon. Rate = k[Nu][substrate] — bimolecular."
    ],
    summary: "SN2: one step, backside attack, Walden inversion, rate = k[Nu][RX]. Best at primary carbons — tertiary too hindered.",
    clinical: "Alkylating chemotherapy agents (cyclophosphamide, melphalan) use SN2-like chemistry to cross-link DNA strands in cancer cells, blocking replication.",
    memory_hook: "SN2 is a drive-by — the nucleophile sweeps in from behind in one smooth move. Carbon flips like an umbrella in the wind. No waiting, no intermediates.",
    solution: "SN2 is a concerted bimolecular mechanism: nucleophilic attack anti-periplanar to the leaving group via a trigonal bipyramidal transition state, with simultaneous bond formation and breaking. Complete Walden inversion of configuration results. Rate = k[Nu][RX]."
  },
  {
    id: "m14",
    title: "NaBH4 reduces a ketone to a secondary alcohol",
    category: "chemistry",
    tags: ["carbonyl", "nucleophilic addition", "reduction", "NaBH4", "hydride"],
    emoji: "⚗️",
    clue: "Category: chemistry. Tags: carbonyl, hydride, reduction. A borohydride reagent delivers a hydride ion to the electrophilic carbonyl carbon, breaking the C=O pi bond and converting a ketone to an alcohol.",
    diagram: `<div class="mech-diagram"><svg viewBox="0 0 460 155" xmlns="http://www.w3.org/2000/svg" style="width:100%;display:block"><defs><marker id="bha" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#0F7B6C"/></marker><marker id="bhb" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#C4412A"/></marker></defs><text x="4" y="14" font-size="10" fill="#6B6760" font-family="monospace">Ketone + NaBH₄</text><text x="8" y="70" font-size="13" font-family="monospace">CH₃</text><line x1="42" y1="66" x2="62" y2="66" stroke="#1A1A18" stroke-width="2"/><circle cx="74" cy="66" r="13" fill="#FDF0DC" stroke="#C4720A" stroke-width="1.5"/><text x="68" y="71" font-size="12" font-family="monospace" fill="#C4720A">C</text><line x1="74" y1="53" x2="74" y2="34" stroke="#C4412A" stroke-width="2"/><line x1="79" y1="53" x2="79" y2="34" stroke="#C4412A" stroke-width="2"/><text x="68" y="30" font-size="12" font-family="monospace" fill="#C4412A">O</text><text x="84" y="27" font-size="10" font-family="monospace" fill="#C4412A">δ⁻</text><text x="68" y="82" font-size="9" font-family="monospace" fill="#C4720A">δ⁺</text><line x1="87" y1="66" x2="108" y2="66" stroke="#1A1A18" stroke-width="2"/><text x="110" y="71" font-size="13" font-family="monospace">CH₃</text><text x="60" y="118" font-size="13" font-family="monospace" fill="#0F7B6C" font-weight="bold">H⁻</text><line x1="72" y1="109" x2="74" y2="82" stroke="#0F7B6C" stroke-width="2" marker-end="url(#bha)"/><path d="M 74 54 Q 67 42 74 32" stroke="#C4412A" stroke-width="1.5" fill="none" stroke-dasharray="3,2" marker-end="url(#bhb)"/><text x="152" y="70" font-size="18" fill="#6B6760">→</text><text x="180" y="14" font-size="10" fill="#6B6760" font-family="monospace">Alkoxide intermediate</text><text x="178" y="70" font-size="13" font-family="monospace">CH₃</text><line x1="212" y1="66" x2="232" y2="66" stroke="#1A1A18" stroke-width="2"/><circle cx="246" cy="66" r="13" fill="#E8E4F8" stroke="#4A3BAA" stroke-width="1.5"/><text x="240" y="71" font-size="12" font-family="monospace" fill="#4A3BAA">C</text><line x1="246" y1="53" x2="246" y2="34" stroke="#4A3BAA" stroke-width="2"/><text x="238" y="30" font-size="12" font-family="monospace" fill="#4A3BAA">O⁻</text><line x1="246" y1="79" x2="246" y2="98" stroke="#0F7B6C" stroke-width="2"/><text x="240" y="112" font-size="12" font-family="monospace" fill="#0F7B6C">H</text><line x1="259" y1="66" x2="278" y2="66" stroke="#1A1A18" stroke-width="2"/><text x="280" y="71" font-size="13" font-family="monospace">CH₃</text><text x="310" y="58" font-size="14" fill="#6B6760">+H₂O</text><text x="318" y="72" font-size="16" fill="#6B6760">→</text><text x="348" y="14" font-size="10" fill="#6B6760" font-family="monospace">Alcohol product</text><text x="348" y="70" font-size="13" font-family="monospace">CH₃</text><line x1="382" y1="66" x2="400" y2="66" stroke="#1A1A18" stroke-width="2"/><circle cx="414" cy="66" r="13" fill="#D4EDE9" stroke="#0F7B6C" stroke-width="1.5"/><text x="408" y="71" font-size="12" font-family="monospace" fill="#0F7B6C">C</text><line x1="414" y1="53" x2="414" y2="34" stroke="#0F7B6C" stroke-width="2"/><text x="406" y="30" font-size="12" font-family="monospace" fill="#0F7B6C">OH</text><line x1="414" y1="79" x2="414" y2="98" stroke="#1A1A18" stroke-width="2"/><text x="408" y="112" font-size="12" font-family="monospace">H</text><line x1="427" y1="66" x2="446" y2="66" stroke="#1A1A18" stroke-width="2"/><text x="448" y="71" font-size="13" font-family="monospace">CH₃</text><text x="4" y="140" font-size="10" fill="#6B6760" font-family="monospace">H⁻ attacks δ⁺ carbon → C=O π bond breaks → O⁻ formed → protonation → secondary alcohol</text></svg></div>`,
    steps: [
      "NaBH₄ delivers a hydride ion (H⁻) — a nucleophile. It attacks the electrophilic (δ⁺) carbonyl carbon from below, pushed by the electron-rich boron.",
      "The C=O π bond breaks heterolytically. Oxygen takes both electrons → becomes O⁻ (alkoxide). Carbon is now tetrahedral (sp3) with a new C–H bond.",
      "Aqueous workup: water protonates the alkoxide (O⁻ + H₂O → OH) → secondary alcohol formed. Aldehydes give primary alcohols by the same mechanism."
    ],
    summary: "NaBH₄: H⁻ attacks carbonyl carbon → C=O π bond breaks → alkoxide → protonation → alcohol. Ketones → 2° alcohols; aldehydes → 1° alcohols.",
    clinical: "Biological NADPH acts as the cellular hydride donor in the same way — carbonyl reductase enzymes use NADPH to reduce drug ketone groups in the liver, converting e.g. cortisone to cortisol.",
    memory_hook: "H⁻ is electron-rich, the carbonyl carbon is electron-poor — opposites attract. H⁻ dives in, oxygen grabs the electrons, add water and you have an alcohol.",
    solution: "Nucleophilic addition of hydride (H⁻ from NaBH₄) to the carbonyl carbon's π* LUMO breaks the C=O π bond, generating a tetrahedral alkoxide intermediate. Aqueous workup protonates the alkoxide to give the alcohol. Net: C=O reduced to CHOH."
  }

];

const HARD_MECHANISMS = [
  {
    id: "h1",
    title: "Nitric oxide activates soluble guanylyl cyclase to cause vasodilation",
    category: "biochemistry",
    tags: ["NO", "cGMP", "vascular smooth muscle", "signalling"],
    emoji: "🫀",
    clue: "Tags: NO, cGMP, vascular smooth muscle, signalling. Endothelium-derived gas molecules diffuse freely into adjacent smooth muscle and activate an enzyme that produces a second messenger causing relaxation.",
    steps: [
      "Endothelial cells produce NO via eNOS (stimulated by shear stress, acetylcholine, bradykinin). NO diffuses freely into adjacent vascular smooth muscle.",
      "NO binds the haem group of soluble guanylyl cyclase (sGC), activating it to convert GTP → cGMP.",
      "cGMP activates PKG → phosphorylates MLCK (reducing its activity), activates K⁺ channels, and activates Ca²⁺ pumps → ↓ intracellular Ca²⁺ → smooth muscle relaxation → vasodilation."
    ],
    summary: "Endothelium → eNOS → NO → activates sGC → cGMP → PKG → ↓ MLCK activity, ↓ Ca²⁺ → smooth muscle relaxes → vasodilation.",
    clinical: "GTN (glyceryl trinitrate) is a NO donor — rapid vasodilation in angina. Sildenafil inhibits PDE5 (the enzyme that breaks down cGMP) → cGMP builds up → prolonged smooth muscle relaxation → erectile dysfunction treatment and pulmonary hypertension.",
    memory_hook: "NO is the body's own vasodilator message. GTN floods the system with the same message. Sildenafil stops the message from being turned off — it lingers.",
    solution: "Endothelial-derived NO activates soluble guanylyl cyclase by binding its haem iron, catalysing GTP → cGMP synthesis. Elevated cGMP activates PKG, which phosphorylates MLCK (reducing myosin light chain phosphorylation), K⁺ channels (hyperpolarisation), and SERCA (Ca²⁺ reuptake), collectively lowering [Ca²⁺]i and causing smooth muscle relaxation."
  },
  {
    id: "h2",
    title: "p53 halts the cell cycle at G1/S via p21 and CDK2 inhibition",
    category: "biochemistry",
    tags: ["cell cycle", "cancer", "tumour suppressor", "CDKs"],
    emoji: "🔬",
    clue: "Tags: cell cycle, cancer, tumour suppressor, CDKs. The genome's guardian protein detects DNA damage and applies the brakes before a cell can copy its damaged DNA.",
    steps: [
      "DNA damage activates ATM/ATR kinases → phosphorylate p53 → p53 stabilised (normally degraded by MDM2) and activated as a transcription factor.",
      "p53 upregulates p21 (CDKN1A), a CDK inhibitor. p21 inhibits cyclin E/CDK2 — the complex that phosphorylates Rb to release E2F transcription factors needed for S phase entry.",
      "Rb remains hypophosphorylated → sequesters E2F → S phase genes not transcribed → cell cycle arrested at G1/S. If damage is irreparable, p53 induces apoptosis via BAX and PUMA."
    ],
    summary: "DNA damage → ATM → p53 stabilisation → ↑ p21 → inhibits CDK2 → Rb stays active → E2F sequestered → G1/S arrest. Irreparable damage → p53-mediated apoptosis.",
    clinical: "TP53 is mutated in >50% of human cancers — the most common cancer mutation. Li-Fraumeni syndrome: germline p53 mutation → early onset multiple cancers. MDM2 amplification (alternative to p53 mutation) also abrogates the checkpoint.",
    memory_hook: "p53 is the quality inspector. DNA damage → inspector arrives → applies p21 brakes → factory (cell cycle) stops. If damage is too bad, p53 calls for demolition (apoptosis).",
    solution: "DNA damage activates ATM/ATR, which phosphorylate and stabilise p53 by disrupting MDM2-mediated ubiquitination. p53 transactivates CDKN1A (p21), which inhibits cyclin E–CDK2, preventing RB phosphorylation. Hypophosphorylated RB sequesters E2F transcription factors, blocking S phase gene expression and arresting the cell at G1/S."
  },
  {
    id: "h3",
    title: "Nucleophilic addition to carbonyls: cyanohydrin formation",
    category: "chemistry",
    tags: ["organic chemistry", "carbonyl", "nucleophilic addition", "cyanide"],
    emoji: "⚗️",
    clue: "Tags: organic chemistry, carbonyl, nucleophilic addition, cyanide. A carbon-nitrogen triple bond adds across a carbon-oxygen double bond — the carbon attacks, the oxygen is protonated.",
    steps: [
      "Cyanide ion (CN⁻) is a nucleophile. It attacks the electrophilic carbonyl carbon of an aldehyde or ketone from below/above the plane of the C=O.",
      "The π bond of C=O breaks heterolytically. The oxygen gains a negative charge (alkoxide ion), and the CN is now bonded to the former carbonyl carbon.",
      "The alkoxide is protonated (by solvent or added acid) to give the hydroxyl group. Product is a cyanohydrin — one carbon longer than the starting carbonyl."
    ],
    summary: "CN⁻ attacks carbonyl carbon → C=O π bond breaks → alkoxide formed → protonation → cyanohydrin. Net: carbon chain extended by 1C with new OH and CN groups.",
    clinical: "Cyanohydrin chemistry is the basis of the Strecker amino acid synthesis. Cyanide poisoning (from hydrogen cyanide, amygdalin in bitter almonds) inhibits cytochrome c oxidase (complex IV) by binding its haem iron — the same affinity for iron that makes CN⁻ a good nucleophile in carbonyl chemistry.",
    memory_hook: "CN⁻ is electron-rich at carbon — it dives onto the electron-poor carbonyl carbon like a key into a lock. The oxygen takes the electrons, gets protonated, and a new carbon-carbon bond is forged.",
    solution: "Nucleophilic addition: CN⁻ attacks the electrophilic carbonyl carbon, breaking the C=O π bond and forming a tetrahedral alkoxide intermediate stabilised by the developing C–CN bond. Subsequent protonation of the alkoxide gives the cyanohydrin product, extending the carbon chain by one with vicinal OH and CN functionality."
  },
  {
    id: "h4",
    title: "Calcium/calmodulin activates MLCK to contract smooth muscle",
    category: "biochemistry",
    tags: ["calcium signalling", "smooth muscle", "calmodulin", "MLCK"],
    emoji: "💪",
    clue: "Tags: calcium signalling, smooth muscle, calmodulin, MLCK. A rise in intracellular calcium triggers a relay through a calcium-sensing protein and a kinase before muscle finally contracts.",
    steps: [
      "A signal (e.g. noradrenaline on α₁ receptors via Gq) triggers IP₃ production → IP₃ opens ER Ca²⁺ channels → cytoplasmic Ca²⁺ rises from ~100 nM to ~1 µM.",
      "4 Ca²⁺ ions bind calmodulin, causing a conformational change → active Ca²⁺-calmodulin complex.",
      "Ca²⁺-calmodulin binds and activates MLCK (myosin light chain kinase) → phosphorylates myosin regulatory light chain → myosin-actin cross-bridge cycling → smooth muscle contraction."
    ],
    summary: "Signal → IP₃ → Ca²⁺ release → Ca²⁺-calmodulin complex → activates MLCK → myosin phosphorylated → smooth muscle contracts.",
    clinical: "Calcium channel blockers (amlodipine, nifedipine) prevent Ca²⁺ entry into vascular smooth muscle → less MLCK activation → vasodilation → lower BP. Also reduce cardiac contractility. Used in hypertension and angina.",
    memory_hook: "Ca²⁺ is the go signal. Calmodulin is the translator. MLCK is the foreman. Only when all three work together does the muscle crew start pulling.",
    solution: "Agonist-mediated Gq activation generates IP₃, which opens IP₃R Ca²⁺ channels on the sarcoplasmic reticulum. Elevated [Ca²⁺]i (>500 nM) saturates calmodulin's EF-hand motifs, producing a conformational change that activates MLCK. MLCK phosphorylates serine-19 of the myosin regulatory light chain, enabling cross-bridge cycling and smooth muscle contraction."
  },
  {
    id: "h5",
    title: "The complement membrane attack complex (MAC) lyses pathogens",
    category: "biochemistry",
    tags: ["immunology", "complement", "MAC", "terminal pathway"],
    emoji: "🛡️",
    clue: "Tags: immunology, complement, MAC, terminal pathway. The final stage of complement activation assembles a protein pore in the pathogen membrane — a molecular drill made of five different proteins.",
    steps: [
      "C5 convertase cleaves C5 → C5a (potent anaphylatoxin and chemoattractant) + C5b (binds to pathogen surface).",
      "C5b recruits C6, C7, C8 sequentially. C5b678 inserts into the lipid bilayer of the pathogen, initiating pore formation.",
      "Multiple C9 molecules (12–18) polymerise around the C5b678 complex → complete MAC → transmembrane pore → uncontrolled ion flux → osmotic lysis of the pathogen."
    ],
    summary: "C5 convertase → C5b + C5a. C5b recruits C6,7,8 → membrane insertion → C9 polymerises → MAC pore → pathogen lysis.",
    clinical: "Eculizumab is a monoclonal antibody that blocks C5 cleavage — preventing MAC formation. Used in PNH (paroxysmal nocturnal haemoglobinuria) and atypical HUS. Patients on eculizumab have dramatically increased risk of Neisseria meningitidis — must be vaccinated.",
    memory_hook: "C5b lays the foundation. C6, C7, C8 build the walls. C9 is the wrecking crew — 18 of them stack up and punch a permanent hole through the enemy's wall.",
    solution: "C5b (generated by C5 convertase) sequentially recruits C6 and C7 (forming a hydrophobic complex that inserts into the membrane), then C8 (triggering partial membrane penetration and C9 recruitment). C9 undergoes polymerisation (poly-C9) to complete the MAC, forming a 10 nm amphipathic pore that disrupts membrane integrity and causes osmotic lysis."
  },
  {
    id: "h6",
    title: "Benzene diazonium coupling produces azo dyes",
    category: "chemistry",
    tags: ["organic chemistry", "diazonium", "electrophilic aromatic substitution", "azo"],
    emoji: "⚗️",
    clue: "Tags: organic chemistry, diazonium, electrophilic aromatic substitution, azo. A nitrogen-containing electrophile attacks an activated aromatic ring, forming a coloured nitrogen-nitrogen double bond linkage.",
    steps: [
      "A primary arylamine (ArNH₂) is treated with NaNO₂/HCl at 0–5°C → forms a diazonium salt (ArN₂⁺). Diazonium ions are unstable above 5°C — hence the cold temperature.",
      "The diazonium ion (weak electrophile) attacks an electron-rich aromatic compound (activated by OH or NR₂ groups, directing ortho/para) via electrophilic aromatic substitution.",
      "An azo compound (Ar–N=N–Ar') is formed. The extended conjugated system across the azo bridge causes strong colour — hence use as dyes and in histological stains."
    ],
    summary: "ArNH₂ + NaNO₂/HCl at 0°C → ArN₂⁺ (diazonium). ArN₂⁺ + activated ArH → Ar–N=N–Ar' (azo compound). Colour from extended conjugation.",
    clinical: "The Ehrlich reagent (p-dimethylaminobenzaldehyde with diazonium chemistry) detects urobilinogen in urine dipsticks. Many pharmaceutical dyes and histological stains (e.g. Congo red for amyloid) use azo chemistry. Sulfonamide antibiotics are synthesised via diazonium intermediates.",
    memory_hook: "Cold NaNO₂ turns an amine into a spring-loaded nitrogen electrophile (diazonium). It snaps onto an electron-rich ring, forming a coloured nitrogen bridge. Keep it cold or it self-destructs.",
    solution: "Diazotisation of ArNH₂ with NaNO₂/HCl at 0–5°C generates ArN₂⁺ via nitrosation and dehydration. The diazonium cation undergoes electrophilic aromatic substitution on highly activated rings (phenols, arylamines), coupling at the para/ortho position to give azo compounds (Ar–N=N–Ar') with extended chromophores responsible for their intense colour."
  },
  {
    id: "h7",
    title: "Thyroid hormone synthesis: iodination and coupling on thyroglobulin",
    category: "biochemistry",
    tags: ["endocrinology", "thyroid", "TPO", "iodine"],
    emoji: "🦋",
    clue: "Tags: endocrinology, thyroid, TPO, iodine. A large glycoprotein inside thyroid follicles serves as the scaffold on which iodine is added to tyrosines and then coupled to make the final hormones.",
    steps: [
      "Thyroid follicular cells take up iodide via the Na⁺/I⁻ symporter (NIS). Thyroid peroxidase (TPO) oxidises I⁻ to I₂ and organifies it onto tyrosine residues of thyroglobulin (Tg) → MIT and DIT.",
      "TPO then catalyses coupling: MIT + DIT → T3, DIT + DIT → T4 — all while the tyrosines remain within Tg.",
      "TSH stimulates endocytosis of Tg → lysosomes cleave T3 and T4, which are secreted into blood. T4 is a prohormone — peripheral deiodinase converts it to the active T3 in target tissues."
    ],
    summary: "NIS takes up I⁻ → TPO organifies onto Tg → coupling → T3/T4 within Tg → endocytosis → release. T4 → active T3 peripherally.",
    clinical: "Carbimazole blocks TPO → used in hyperthyroidism. Amiodarone contains 37% iodine by weight → causes both hyper- and hypothyroidism. Radioiodine (¹³¹I) is taken up by NIS → destroys thyroid tissue.",
    memory_hook: "Thyroglobulin is the dough. Iodine is the seasoning. TPO is the chef who seasons then bakes (couples) it. T4 is the loaf; T3 is the slice you actually eat.",
    solution: "Iodide uptake via NIS is followed by TPO-mediated oxidation and organification onto thyroglobulin tyrosines, forming monoiodotyrosine (MIT) and diiodotyrosine (DIT). TPO also catalyses oxidative coupling of MIT+DIT→T3 and DIT+DIT→T4 within Tg. Tg endocytosis and lysosomal proteolysis releases T3/T4; T4 is deiodinated to active T3 by type 1/2 deiodinases in peripheral tissues."
  },
  {
    id: "h8",
    title: "The RAAS: renin-angiotensin-aldosterone cascade in full",
    category: "biochemistry",
    tags: ["kidney", "blood pressure", "renin", "aldosterone"],
    emoji: "🫁",
    clue: "Tags: kidney, blood pressure, renin, aldosterone. Low blood pressure triggers a kidney enzyme to start a cascade that ultimately raises BP through vasoconstriction and salt retention.",
    steps: [
      "Low renal perfusion pressure → juxtaglomerular cells release renin (a protease) → cleaves angiotensinogen (liver) → angiotensin I (10 amino acids, inactive).",
      "ACE (in lung endothelium and elsewhere) cleaves angiotensin I → angiotensin II (8 amino acids, highly active). Ang II binds AT1 receptors → vasoconstriction + adrenal cortex releases aldosterone.",
      "Aldosterone binds mineralocorticoid receptors in the collecting duct → ↑ Na⁺ reabsorption + ↑ K⁺ and H⁺ excretion → water follows Na⁺ → ↑ blood volume → ↑ BP."
    ],
    summary: "Low BP → renin → angiotensinogen → Ang I → (ACE) → Ang II → vasoconstriction + aldosterone → Na⁺/water retention → ↑ BP.",
    clinical: "ACEi block at the ACE step. ARBs block AT1 receptors. Spironolactone (aldosterone antagonist) blocks the end of the cascade. Each drug class has different side effect profile but targets the same cascade at a different point.",
    memory_hook: "RAAS is a chain reaction starting in the kidney: renin strikes the match → ACE fans the flame → angiotensin II starts the fire → aldosterone burns salt (retains it) → blood pressure rises.",
    solution: "Reduced renal perfusion pressure stimulates renin secretion from juxtaglomerular cells. Renin cleaves hepatic angiotensinogen to Ang I, which ACE (predominantly in pulmonary endothelium) converts to Ang II. Ang II stimulates AT1Rs causing systemic vasoconstriction and adrenal aldosterone synthesis, which acts on MRs in the cortical collecting duct to upregulate ENaC and Na⁺/K⁺-ATPase, increasing Na⁺ reabsorption and water retention."
  }
  ,{
    id: "h9",
    title: "Benzene nitration via electrophilic aromatic substitution",
    category: "chemistry",
    tags: ["benzene", "nitration", "EAS", "nitronium ion", "arenium ion"],
    emoji: "⚗️",
    clue: "Tags: benzene, nitration, EAS, nitronium ion, arenium ion. Mixed acid generates a potent electrophile that attacks benzene — but the ring recovers by expelling a proton rather than adding across the double bond.",
    diagram: `<div class="mech-diagram"><svg viewBox="0 0 520 195" xmlns="http://www.w3.org/2000/svg" style="width:100%;display:block"><defs><marker id="ea1" markerWidth="7" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#0F7B6C"/></marker><marker id="ea2" markerWidth="7" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#C4412A"/></marker></defs><text x="4" y="13" font-size="10" fill="#6B6760" font-family="monospace">Step 1: HNO₃ + H₂SO₄ → NO₂⁺ (nitronium ion)</text><text x="4" y="28" font-size="11" font-family="monospace" fill="#1A1A18">HNO₃ + 2H₂SO₄ </text><text x="122" y="28" font-size="13" fill="#6B6760">→ </text><text x="138" y="28" font-size="12" font-family="monospace" fill="#C4412A" font-weight="bold">NO₂⁺</text><text x="168" y="28" font-size="11" font-family="monospace" fill="#6B6760"> + H₃O⁺ + 2HSO₄⁻</text><text x="4" y="48" font-size="10" fill="#6B6760" font-family="monospace">Step 2: NO₂⁺ attacks benzene π system (rate-limiting)</text><polygon points="62,95 84,80 106,95 106,122 84,137 62,122" fill="#FDF0DC" stroke="#C4720A" stroke-width="2"/><line x1="70" y1="86" x2="82" y2="82" stroke="#C4720A" stroke-width="2"/><line x1="97" y1="86" x2="106" y2="95" stroke="#C4720A" stroke-width="2"/><line x1="64" y1="121" x2="76" y2="133" stroke="#C4720A" stroke-width="2"/><text x="78" y="73" font-size="11" font-family="monospace">H</text><text x="26" y="87" font-size="12" font-family="monospace" fill="#C4412A" font-weight="bold">NO₂⁺</text><line x1="56" y1="85" x2="64" y2="91" stroke="#C4412A" stroke-width="1.5" marker-end="url(#ea2)"/><path d="M 67 88 Q 52 78 44 80" stroke="#0F7B6C" stroke-width="1.5" fill="none" marker-end="url(#ea1)"/><text x="128" y="108" font-size="18" fill="#6B6760">→</text><text x="158" y="48" font-size="10" fill="#6B6760" font-family="monospace">Arenium ion (Wheland intermediate)</text><polygon points="195,95 217,80 239,95 239,122 217,137 195,122" fill="#FAEBE7" stroke="#C4412A" stroke-width="2" stroke-dasharray="4,2"/><text x="211" y="73" font-size="11" font-family="monospace">H</text><line x1="196" y1="100" x2="176" y2="92" stroke="#C4412A" stroke-width="2"/><text x="148" y="95" font-size="12" font-family="monospace" fill="#C4412A">NO₂</text><text x="222" y="112" font-size="13" font-family="monospace" fill="#C4412A">⊕</text><text x="158" y="155" font-size="10" fill="#C4412A" font-family="monospace">sp3 C — not aromatic!</text><text x="272" y="108" font-size="18" fill="#6B6760">→</text><text x="300" y="48" font-size="10" fill="#6B6760" font-family="monospace">Step 3: deprotonation restores aromaticity</text><polygon points="335,95 357,80 379,95 379,122 357,137 335,122" fill="#D4EDE9" stroke="#0F7B6C" stroke-width="2"/><circle cx="357" cy="108" r="13" fill="none" stroke="#0F7B6C" stroke-width="1.5"/><line x1="336" y1="100" x2="316" y2="92" stroke="#0F7B6C" stroke-width="2"/><text x="284" y="95" font-size="12" font-family="monospace" fill="#0F7B6C">NO₂</text><text x="390" y="90" font-size="10" font-family="monospace" fill="#6B6760">HSO₄⁻</text><text x="390" y="104" font-size="10" fill="#6B6760" font-family="monospace">removes H⁺</text><text x="300" y="155" font-size="10" fill="#0F7B6C" font-family="monospace">Nitrobenzene — aromatic ✓</text><text x="4" y="178" font-size="10" fill="#6B6760" font-family="monospace">Substitution NOT addition — benzene too stable to remain sp3. H⁺ loss restores aromaticity.</text></svg></div>`,
    steps: [
      "HNO₃ + H₂SO₄ → NO₂⁺ (nitronium ion) — the electrophile. H₂SO₄ protonates HNO₃ which loses water to form the linear, electron-poor NO₂⁺.",
      "NO₂⁺ attacks benzene's π electrons → Wheland intermediate (arenium ion / σ-complex). One carbon becomes sp3 — aromaticity temporarily lost. This is the slow, rate-limiting step.",
      "HSO₄⁻ removes the proton from the sp3 carbon → π system restored → nitrobenzene. The driving force is recovery of aromatic stabilisation energy (~150 kJ/mol). Substitution not addition."
    ],
    summary: "HNO₃/H₂SO₄ → NO₂⁺ attacks benzene → arenium ion (rate-limiting) → deprotonation restores aromaticity → nitrobenzene. Always substitution.",
    clinical: "Nitro groups are reduced in vivo to amines. This is the basis of paracetamol, sulfonamide antibiotics, and many local anaesthetics — all synthesised via nitration then reduction of aromatic rings.",
    memory_hook: "Benzene would rather lose a cheap hydrogen than its precious aromaticity. So it substitutes — never adds. The ring is worth protecting at all costs.",
    solution: "EAS nitration: H₂SO₄ generates NO₂⁺ by protonating HNO₃ (→ H₂NO₃⁺ → NO₂⁺ + H₂O). NO₂⁺ attacks benzene π electrons forming the arenium ion (rate-limiting, kH/kD = 1, no KIE). Deprotonation by HSO₄⁻ restores aromaticity. Substitution is thermodynamically favoured by recovery of aromatic resonance stabilisation."
  },
  {
    id: "h10",
    title: "Acid chloride reacts with amine to form an amide (peptide) bond",
    category: "chemistry",
    tags: ["acyl substitution", "amide", "acid chloride", "nucleophilic acyl substitution", "peptide bond"],
    emoji: "⚗️",
    clue: "Tags: acyl substitution, amide, acid chloride, peptide bond. A nitrogen nucleophile attacks a highly reactive carbonyl, expelling chloride to form the most stable carbonyl derivative — the bond that holds every protein together.",
    diagram: `<div class="mech-diagram"><svg viewBox="0 0 480 165" xmlns="http://www.w3.org/2000/svg" style="width:100%;display:block"><defs><marker id="nas1" markerWidth="7" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#0F7B6C"/></marker><marker id="nas2" markerWidth="7" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#C4412A"/></marker></defs><text x="4" y="13" font-size="10" fill="#6B6760" font-family="monospace">Nucleophilic Acyl Substitution: acid chloride + amine → amide</text><text x="4" y="50" font-size="12" font-family="monospace">R</text><line x1="16" y1="46" x2="34" y2="46" stroke="#1A1A18" stroke-width="2"/><circle cx="46" cy="46" r="12" fill="#FDF0DC" stroke="#C4720A" stroke-width="1.5"/><text x="40" y="51" font-size="12" font-family="monospace" fill="#C4720A">C</text><line x1="46" y1="34" x2="46" y2="18" stroke="#C4412A" stroke-width="2"/><line x1="51" y1="34" x2="51" y2="18" stroke="#C4412A" stroke-width="2"/><text x="40" y="14" font-size="12" font-family="monospace" fill="#C4412A">O</text><text x="55" y="11" font-size="9" font-family="monospace" fill="#C4412A">δ⁻</text><line x1="58" y1="46" x2="76" y2="46" stroke="#C4412A" stroke-width="2"/><text x="78" y="51" font-size="12" font-family="monospace" fill="#C4412A">Cl</text><text x="42" y="62" font-size="9" font-family="monospace" fill="#C4720A">δ⁺</text><text x="108" y="51" font-size="13" fill="#6B6760">+</text><text x="124" y="51" font-size="12" font-family="monospace" fill="#0F7B6C" font-weight="bold">R'NH₂</text><path d="M 134 44 Q 104 28 66 36" stroke="#0F7B6C" stroke-width="1.5" fill="none" marker-end="url(#nas1)"/><text x="170" y="51" font-size="18" fill="#6B6760">→</text><text x="198" y="13" font-size="10" fill="#6B6760" font-family="monospace">Tetrahedral intermediate</text><text x="198" y="50" font-size="12" font-family="monospace">R</text><line x1="210" y1="46" x2="226" y2="46" stroke="#1A1A18" stroke-width="2"/><circle cx="240" cy="46" r="13" fill="#E8E4F8" stroke="#4A3BAA" stroke-width="2"/><text x="234" y="51" font-size="12" font-family="monospace" fill="#4A3BAA">C</text><line x1="240" y1="33" x2="240" y2="16" stroke="#4A3BAA" stroke-width="2"/><text x="232" y="12" font-size="12" font-family="monospace" fill="#4A3BAA">O⁻</text><line x1="253" y1="46" x2="272" y2="46" stroke="#C4412A" stroke-width="1.5" stroke-dasharray="3,2"/><text x="274" y="51" font-size="11" font-family="monospace" fill="#C4412A">Cl⁻</text><line x1="240" y1="59" x2="240" y2="76" stroke="#0F7B6C" stroke-width="2"/><text x="232" y="90" font-size="11" font-family="monospace" fill="#0F7B6C">NHR'</text><text x="200" y="112" font-size="10" fill="#4A3BAA" font-family="monospace">sp3 carbon — Cl⁻ leaving</text><text x="316" y="51" font-size="18" fill="#6B6760">→</text><text x="348" y="13" font-size="10" fill="#6B6760" font-family="monospace">Amide (peptide bond)</text><text x="348" y="50" font-size="12" font-family="monospace">R</text><line x1="360" y1="46" x2="376" y2="46" stroke="#1A1A18" stroke-width="2"/><circle cx="390" cy="46" r="13" fill="#D4EDE9" stroke="#0F7B6C" stroke-width="2"/><text x="384" y="51" font-size="12" font-family="monospace" fill="#0F7B6C">C</text><line x1="390" y1="33" x2="390" y2="16" stroke="#0F7B6C" stroke-width="2"/><line x1="395" y1="33" x2="395" y2="16" stroke="#0F7B6C" stroke-width="2"/><text x="384" y="12" font-size="12" font-family="monospace" fill="#0F7B6C">O</text><line x1="403" y1="46" x2="422" y2="46" stroke="#0F7B6C" stroke-width="2"/><text x="424" y="51" font-size="12" font-family="monospace" fill="#0F7B6C">NHR'</text><text x="348" y="72" font-size="10" fill="#0F7B6C" font-family="monospace">resonance-stabilised</text><text x="4" y="138" font-size="10" fill="#6B6760" font-family="monospace">Amide C–N has partial double bond character (N lone pair donates into C=O). Planar. Very stable.</text><text x="4" y="154" font-size="10" fill="#0F7B6C" font-family="monospace">This IS the peptide bond — backbone of every protein in your body.</text></svg></div>`,
    steps: [
      "The amine (R'NH₂) lone pair attacks the electrophilic carbonyl carbon of the acid chloride. Cl is an excellent leaving group and withdraws electrons from C, making it very δ⁺.",
      "A tetrahedral intermediate forms — carbon is sp3 with O⁻, NHR', R, and Cl⁻ leaving. The C=O π bond breaks heterolytically, oxygen takes the electrons.",
      "Cl⁻ departs → C=O reforms → amide. The N lone pair donates into C=O (resonance) giving the C–N partial double bond character — planarity and exceptional stability. This is the peptide bond."
    ],
    summary: "Amine nucleophile attacks acid chloride → tetrahedral intermediate → Cl⁻ leaves → amide (peptide bond). N lone pair resonance makes amide uniquely stable and planar.",
    clinical: "Every peptide drug and all proteins contain this bond. Proteases hydrolyse it — HIV protease inhibitors (saquinavir) mimic the tetrahedral intermediate to block this. Beta-lactam antibiotics contain a strained amide ring whose strain drives reactivity with PBPs.",
    memory_hook: "N dives in, Cl leaves, C=O reforms — but now N is attached and donates back into C=O. The amide is a molecule in two minds: C=O or C–N⁺? That resonance is what makes it so stable.",
    solution: "Nucleophilic acyl substitution: addition of R'NH₂ to the acid chloride carbonyl (rate-limiting for less reactive substrates) generates a tetrahedral intermediate. Elimination of Cl⁻ restores the C=O. The amide product shows n→π* resonance delocalisation (N lone pair into carbonyl π*), conferring partial C–N double bond character, planarity, and resistance to nucleophilic attack (~100 kJ/mol more stable than the acid chloride)."
  }

];

// ── DAILY SELECTION ───────────────────────────────────
// Each day picks one mechanism from each pool by day index
const LAUNCH_DATE = new Date('2026-05-16T00:00:00');

function getDayIndex() {
  const today = new Date();
  today.setHours(0,0,0,0);
  return Math.floor((today - LAUNCH_DATE) / (1000*60*60*24));
}

function getTodaysMechanismByPool(pool) {
  const idx = ((getDayIndex() % pool.length) + pool.length) % pool.length;
  return pool[idx];
}

function getTodaysMechanism() { return getTodaysMechanismByPool(EASY_MECHANISMS); }
function getTodaysEasy()   { return getTodaysMechanismByPool(EASY_MECHANISMS);   }
function getTodaysMedium() { return getTodaysMechanismByPool(MEDIUM_MECHANISMS); }
function getTodaysHard()   { return getTodaysMechanismByPool(HARD_MECHANISMS);   }

function getMechanismById(id) {
  return [...EASY_MECHANISMS, ...MEDIUM_MECHANISMS, ...HARD_MECHANISMS].find(m => m.id === id);
}

function getAvailableMechanisms() {
  return EASY_MECHANISMS; // For archive/learn page — use easy pool as primary
}
