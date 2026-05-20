// Data for My Third Space
// Order: females first (starting Joe), then males (starting Rahul)
window.TRAINERS = [
  // — Female coaches —
  { id: "joe",     name: "Joe",     role: "Hypertrophy & Strength", tone: "espresso", bio: "Block-periodised hypertrophy. Muscle you can actually use.", specialties: ["Hypertrophy", "Strength", "Recovery"], initials: "JO", cert: "Strength · Hypertrophy", ptEligible: true },
  { id: "deb",     name: "Deb",     role: "Strength & Recovery", tone: "walnut", bio: "Post-rehab strength and long-term recovery planning.", specialties: ["Strength", "Recovery", "Hyrox Prep"], initials: "DB", cert: "Strength · Recovery", ptEligible: true },
  { id: "deepika", name: "Deepika", role: "Hyrox & Conditioning", tone: "terra", bio: "Zone 2 devotee turned Hyrox specialist. Endurance with structure.", specialties: ["Hyrox Prep", "Strength", "Conditioning"], initials: "DE", cert: "Hyrox · Strength", ptEligible: true },
  { id: "lee",     name: "Lee",     role: "Hypertrophy & Strength", tone: "sage", bio: "Form first, always. The coach who makes the last rep look like the first.", specialties: ["Hypertrophy", "Strength", "Recovery"], initials: "LE", cert: "Hypertrophy · Strength", ptEligible: true },
  // — Male coaches —
  { id: "rahul",   name: "Rahul",   role: "Strength & Hyrox Prep", tone: "walnut", bio: "Competition-tested Hyrox coach. Builds engines that don't quit in round four.", specialties: ["Strength", "Hyrox Prep", "Conditioning"], initials: "RA", cert: "Strength · Hyrox · Recovery", ptEligible: true },
  { id: "aakash",  name: "Aakash",  role: "Strength & Recovery", tone: "clay", bio: "Old-school strength with new-school recovery protocols.", specialties: ["Strength", "Recovery", "Mobility"], initials: "AK", cert: "Strength · Recovery", ptEligible: true },
  { id: "tarun",   name: "Tarun",   role: "Hyrox & Hypertrophy", tone: "clay", bio: "Hybrid athlete programming — size, speed, stamina.", specialties: ["Hyrox Prep", "Hypertrophy", "Strength"], initials: "TR", cert: "Hyrox · Hypertrophy", ptEligible: true },
  { id: "santo",   name: "Santo",   role: "Strength & Hypertrophy", tone: "espresso", bio: "Classical strength training with a bodybuilder's eye for detail.", specialties: ["Strength", "Hypertrophy", "Conditioning"], initials: "SA", cert: "Strength · Hypertrophy", ptEligible: true },
  // — Pilates & Yoga specialists (group classes only) —
  { id: "pilates", name: "Anisha",  role: "Pilates & Mobility", tone: "sand", bio: "Clinical Pilates for posture, core control, and post-injury returns.", specialties: ["Pilates", "Mobility", "Recovery"], initials: "AN", cert: "Pilates · Mobility", ptEligible: false },
  { id: "shahbaz", name: "Shahbaz", role: "Yoga & Breathwork", tone: "sage", bio: "Traditional hatha and vinyasa. Breath-led practice for strength that lasts.", specialties: ["Yoga", "Breathwork", "Mobility"], initials: "SH", cert: "Yoga · Breathwork", ptEligible: false },
];
window.PT_TRAINERS = window.TRAINERS.filter(t => t.ptEligible);

// Instagram posts from @my.thirdspace (representative)
window.IG_POSTS = [
  { tone: "walnut", cap: "Strength isn't loud. It's consistent. @shwetashetty leading this morning's 6:30 strength block.", likes: 342, tag: "STRENGTH" },
  { tone: "sage", cap: "Breath before barbell. Our breathwork workshop last Saturday with visiting practitioner @arjan.", likes: 218, tag: "BREATHWORK" },
  { tone: "terra", cap: "Ice bath → sauna → ice bath. The contrast is the point. Open all week for drop-ins.", likes: 489, tag: "RECOVERY" },
  { tone: "sand", cap: "Body Composition Analysis day. Numbers don't lie, but they don't judge either.", likes: 156, tag: "ASSESSMENT" },
  { tone: "clay", cap: "Sunday running club. 8km easy through Cubbon, coffee at Koshy's. Every Sunday, 7AM.", likes: 602, tag: "COMMUNITY" },
  { tone: "espresso", cap: "\"I came for weight loss. I stayed for a body I actually trust.\" — Meera, 3 yrs with us.", likes: 871, tag: "MEMBER STORY" },
  { tone: "walnut", cap: "Kids' gymnastics Saturday. The joy of moving, before anyone tells them it should hurt.", likes: 293, tag: "KIDS" },
  { tone: "sage", cap: "In-house cafe update: new seasonal menu with @thekenkolife. Order at the counter, pick up after class.", likes: 347, tag: "KENKO × M3S" },
  { tone: "terra", cap: "Couple PT with @ria.kapoor. One hour, two people, zero phones.", likes: 184, tag: "COUPLE PT" },
];

// Kenko Life menu — the ONLY place menu data lives.
// To update: edit this object. No component / JSX change needed.
window.KENKO_MENU = {
  categories: [
    {
      id: "smoothies",
      name: "Smoothies",
      tag: "GLUTEN FREE",
      tagColor: "#7B8B6F",
      items: [
        { id: "sm_peanut_monk",   name: "The Peanut Monk",        desc: "Whey Protein, Banana, Peanut Butter, Coffee, Milk, Dates",  macros: "592 Kcal · 37.8g Protein · 54.3g Carbs · 25g Fat",   price: 350, tags: ["High Protein"],         veg: false },
        { id: "sm_kesar_banana",  name: "Kesar Banana Bliss",     desc: "Whey Protein, Banana, Sea Salt, Honey",                     macros: "448.6 Kcal · 33.9g Protein · 49g Carbs · 13g Fat",   price: 360, tags: ["High Protein"],         veg: false },
        { id: "sm_cold_press",    name: "The Cold Press Barista", desc: "Coffee Protein Powder, Coffee, Banana, Milk, Cinnamon",     macros: "325 Kcal · 39.4g Protein · 23.4g Carbs · 16g Fat",   price: 360, tags: ["Vegan", "Kefir"],       veg: true  },
      ],
    },
    {
      id: "bowls",
      name: "Bowls & Paninis",
      tag: null,
      items: [
        { id: "bw_turkish_eggs",  name: "Turkish Eggs",               desc: "Soft egg with creamy Greek yoghurt, chilli butter, fresh herbs", macros: "546 Kcal · 27g Protein · 62.4g Carbs · 18.4g Fat",   price: 330, tags: ["Vegetarian"],   veg: true  },
        { id: "bw_granola",       name: "Granola Bowl",               desc: "Crunchy house-made granola with honeyed yoghurt and fresh fruit", macros: "117 Kcal · 3.6g Protein · 19g Carbs · 5g Fat",      price: 330, tags: ["Vegan"],        veg: true  },
        { id: "bw_peri_chicken",  name: "Peri Peri Sando — Chicken",  desc: "Fresh bread, Peri Peri flavoured chicken protein, house slaw",    macros: "677 Kcal · 34.6g Protein · 62.4g Carbs · 36.5g Fat", price: 330, tags: ["High Protein"], veg: false },
        { id: "bw_peri_veg",      name: "Peri Peri Sando — Veg",      desc: "Fresh bread, Peri Peri flavoured plant protein, house slaw",      macros: "576 Kcal · 54.8g Protein · 58.4g Carbs",            price: 310, tags: ["Vegetarian"],   veg: true  },
        { id: "bw_pesto_chicken", name: "Pesto Sando — Chicken",      desc: "Toasted bread, pesto chicken, fresh greens",                      macros: "825 Kcal · 39.6g Protein · 55.7g Carbs · 35g Fat",   price: 330, tags: ["High Protein"], veg: false },
        { id: "bw_pesto_veg",     name: "Pesto Sando — Veg",          desc: "Toasted bread, pesto plant protein, fresh greens",                macros: "625 Kcal · 59.7g Protein · 51.7g Carbs · 32.9g Fat", price: 310, tags: ["Vegetarian"],   veg: true  },
        { id: "bw_mango_chia",    name: "Mango Chia Bowl",            desc: "Coconut chia bowl with fresh mango purée, toasted nuts",          macros: "515 Kcal · 8.7g Protein · 75g Carbs · 20g Fat",     price: 350, tags: ["Gluten Free", "Vegan"], veg: true },
        { id: "bw_avo_toast",     name: "Smashed Avocado Toast",      desc: "Smashed avocado and soft egg on dukkah-dusted sourdough",         macros: "541 Kcal · 27.9g Protein · 71.4g Carbs · 30.6g Fat", price: 370, tags: ["Vegetarian"],   veg: true  },
      ],
    },
    {
      id: "desserts",
      name: "Desserts",
      tag: "GLUTEN FREE",
      tagColor: "#7B8B6F",
      items: [
        { id: "ds_protein_laddu",     name: "Protein Laddu",     desc: "Power-packed protein laddu with nuts, seeds, and natural dates", macros: "81 Kcal · 5g Protein · 4g Carbs · 5g Fat",          price: 80,  tags: ["Vegan"],        veg: true },
        { id: "ds_chickpea_brownie",  name: "Chickpea Brownie",  desc: "Fudgy chickpea brownie with dark chocolate",                     macros: "196.5 Kcal · 17.6g Protein · 13.3g Carbs · 8.1g Fat", price: 200, tags: ["High Protein"], veg: true },
        { id: "ds_nutty_praline",     name: "Nutty Praline Bar", desc: "Rich date and roasted nut praline bar",                          macros: "240.6 Kcal · 3.6g Protein · 45.7g Carbs",            price: 230, tags: ["Vegan"],        veg: true },
      ],
    },
    {
      id: "juices",
      name: "Juices",
      tag: null,
      items: [
        { id: "jc_golden_hour",     name: "Golden Hour",     desc: "Fresh cold-pressed juice with turmeric, ginger, and citrus", macros: null, price: 220, tags: ["Vegan"], veg: true },
        { id: "jc_pineapple_press", name: "Pineapple Press", desc: "Fresh cold-pressed pineapple, ginger, mint",                 macros: null, price: 230, tags: ["Vegan"], veg: true },
        { id: "jc_beet_reset",      name: "Beet Reset",      desc: "Beetroot, carrot, apple, ginger cold press",                 macros: null, price: 260, tags: ["Vegan"], veg: true },
        { id: "jc_indigo_storm",    name: "Indigo Storm",    desc: "Butterfly pea, lime, coconut water, sea salt",               macros: null, price: 350, tags: ["Vegan"], veg: true },
      ],
    },
    {
      id: "coffee",
      name: "Coffee",
      tag: null,
      items: [
        { id: "cf_espresso",     name: "Espresso",      desc: "Single or double shot espresso",              macros: null, price: 125, tags: ["Hot", "Cold"], veg: true },
        { id: "cf_cortado",      name: "Cortado",       desc: "Espresso with a small amount of warm milk",   macros: null, price: 200, tags: ["Hot", "Cold"], veg: true },
        { id: "cf_cold_brew",    name: "Cold Brew",     desc: "12-hour slow-steeped cold brew",              macros: null, price: 220, tags: ["Cold"],        veg: true },
        { id: "cf_cappuccino",   name: "Cappuccino",    desc: "Espresso with steamed milk and thick foam",   macros: null, price: 220, tags: ["Hot", "Cold"], veg: true },
        { id: "cf_french_press", name: "French Press",  desc: "Full-bodied immersion brew, served in a press", macros: null, price: 200, tags: ["Hot"],        veg: true },
        { id: "cf_mocha",        name: "Mocha",         desc: "Espresso with chocolate and steamed milk",    macros: null, price: 240, tags: ["Hot", "Cold"], veg: true },
        { id: "cf_latte",        name: "Latte",         desc: "Espresso with steamed milk and light froth",  macros: null, price: 240, tags: ["Hot", "Cold"], veg: true },
        { id: "cf_pour_over",    name: "Pour Over",     desc: "Single origin, precision slow pour",          macros: null, price: 250, tags: ["Hot", "Cold"], veg: true },
      ],
    },
    {
      id: "addons",
      name: "Add-ons",
      tag: null,
      items: [
        { id: "ao_oat_milk",    name: "Oat Milk Swap",    desc: "Replace dairy milk with oat milk",    macros: null, price: 40, tags: ["Vegan"], veg: true },
        { id: "ao_almond_milk", name: "Almond Milk Swap", desc: "Replace dairy milk with almond milk", macros: null, price: 40, tags: ["Vegan"], veg: true },
      ],
    },
  ],
};

// Kenko order config — edit these when going live.
window.KENKO_CONFIG = {
  whatsappNumber: "919880000000",   // ← replace with real Kenko WhatsApp number
  petpoojaWebhook: "",              // ← replace with Petpooja webhook URL when live
  closingTime: { h: 21, m: 0 },     // 9:00 PM
  pickupSlotMinutes: 15,
  currency: "₹",
};

// BCA sample data from user's Tanita MC-780 scan
window.BCA_HISTORY = [
  { date: "Oct 2025", weight: 98.2, fatPct: 24.8, muscle: 68.1, visceral: 14, bmi: 29.3, metabolicAge: 34 },
  { date: "Dec 2025", weight: 96.5, fatPct: 23.5, muscle: 68.8, visceral: 13, bmi: 28.8, metabolicAge: 32 },
  { date: "Feb 2026", weight: 95.1, fatPct: 22.7, muscle: 69.3, visceral: 12, bmi: 28.4, metabolicAge: 30 },
  { date: "Apr 2026", weight: 94.1, fatPct: 21.9, muscle: 69.7, visceral: 12, bmi: 28.1, metabolicAge: 28 },
];

window.CONTACT = {
  address: "HAL 2nd Stage, Indiranagar, Bengaluru 560008",
  phone: "+91 81239 01143",
  email: "hello@mythirdspace.fit",
  instagram: "@my.thirdspace",
  hours: [
    { d: "Mon – Fri", t: "5:30 AM – 9:30 PM" },
    { d: "Saturday", t: "7:00 AM – 6:00 PM" },
    { d: "Sunday", t: "9:00 AM – 6:00 PM" },
  ],
};

window.SERVICES = [
  {
    id: "approach", kind: "Comprehensive Approach", tone: "walnut",
    tagline: "Before we move, we measure.",
    items: ["1-1 Consultation", "Blood Test", "Body Composition Analysis", "Fitness Assessment", "Personalized Nutrition Plan"],
    desc: "A 360° baseline so every minute you train is aimed, not guessed. We start with biomarkers and end with a plan you'll actually follow.",
  },
  {
    id: "pt", kind: "Personal Training", tone: "espresso",
    tagline: "Your coach, your hour.",
    items: ["1-on-1 Programming", "Form Correction", "Progressive Overload", "Recovery Protocols", "Weekly Check-ins"],
    desc: "Deliberate, private sessions with a coach who knows your knees, your sleep, and your goals for the next ten years.",
  },
  {
    id: "group", kind: "Group Workouts", tone: "sand",
    tagline: "Move with your people.",
    items: ["Yoga", "Pilates", "Running Club", "Strength & Conditioning"],
    desc: "Small groups, big accountability. Six classes a day, capped at twenty, so the coach still knows your name.",
  },
  {
    id: "work", kind: "Workshops", tone: "sage",
    tagline: "New skills, old wisdom.",
    items: ["Dance", "Gymnastics", "Expert Sessions", "Martial Arts", "Calisthenics", "Breathwork", "And more"],
    desc: "Monthly deep dives with visiting practitioners. Leave with something your body didn't know yesterday.",
  },
  {
    id: "recover", kind: "Recovery & Mind", tone: "terra",
    tagline: "The work between the work.",
    items: ["Infrared Sauna", "Cold Plunge", "Guided Meditation", "Sleep Coaching", "Mobility Flow"],
    desc: "Your nervous system is the app; we help you close the tabs. Drop-in recovery any time the studio is open.",
  },
];

// Booking — next 10 days
function generateSlots() {
  const days = [];
  const today = new Date(2026, 3, 17); // Apr 17 2026
  const times = ["06:30", "07:30", "09:00", "10:30", "17:00", "18:30", "19:30"];
  for (let i = 0; i < 70; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const slots = [];
    times.forEach((t) => {
      // vary availability pseudo-deterministically
      // Only PT-eligible coaches are offered in the booking grid
      window.PT_TRAINERS.forEach((tr) => {
        const seed = (i * 31 + t.charCodeAt(0) + tr.id.charCodeAt(0)) % 10;
        if (seed > 3) slots.push({ time: t, trainerId: tr.id });
      });
    });
    days.push({
      date: d,
      iso: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString("en-US", { weekday: "short" }),
      day: d.getDate(),
      month: d.toLocaleDateString("en-US", { month: "short" }),
      slots,
    });
  }
  return days;
}
window.BOOKING_DAYS = generateSlots();

window.TESTIMONIALS = [
  { q: "I came for weight loss. I stayed for a body I actually trust.", by: "Meera P.", role: "Member, 3 yrs" },
  { q: "The only gym where the coach asks how you slept before how much you lifted.", by: "Karan S.", role: "Member, 1 yr" },
  { q: "Shwetambari changed how I think about aging. I lift weights to play with my grandkids.", by: "Anita V.", role: "Member, 5 yrs" },
];
