/* ==========================================================================
   SERVICE CATALOGUE — what the client gets and what they can add, for each website.
   Written for a non-technical reader: short, plain words, one idea per line.

   Selectable services are one checkbox each; their `id` must match a key in PRICING
   (src/config.js) and be unique across both websites (hence `school_` / `tuition_`).
   Each website's sections run: must-have → priced extras → "price after a talk".
   `level` sorts the "price after a talk" items under their headings (see LEVELS).
   Pages, basic features and complimentary items are not checkboxes: they come with core development.
   ========================================================================== */

/** Complimentary from Sonder — shown in blue wherever it appears. */
export const COMPLIMENTARY = [
  { name: 'Website Address (Domain) — Complimentary for the 1st Year', description: 'For example www.yourschool.com — we register it and pay for it' },
  { name: 'Care & Support — Complimentary for 3 Months', description: 'We keep the website running and fix any problem after it goes live' },
]

/** Website look & design — the base of every page, so every website must have it. */
const design = (site) => ({
  id: `${site}_uiux`,
  required: true,
  icon: '🎨',
  name: 'Website Look & Design',
  description: 'How your new website looks — colours, layout and style. Every page is built on this design, so it comes with every website.',
  bonus: 'Banners & graphics included (first design)',
})

const supportAfter = (site) => ({
  id: `${site}_supportAfter3Months`,
  level: 'Monthly',
  icon: '🛠️',
  name: 'Care & Support After the Complimentary 3 Months',
  description: 'We keep looking after the website, fix problems and make small changes for you.',
})

const moreVisitors = (site, who) => ({
  id: `${site}_advancedSEO`,
  level: 'Monthly',
  icon: '📈',
  name: 'More Visitors from Google',
  description: `Bring more ${who} to your website through Google search and Google ads. A monthly service.`,
})

const QUOTED_INTRO = 'Tick anything that interests you. We’ll explain it in person and tell you the price — no commitment.'

export const SITES = [
  {
    id: 'school',
    number: '1',
    kind: 'School Website',
    name: 'Vivek Vidyalay',
    objective: 'A modern website that makes parents trust the school and brings in more admissions.',
    pages: [
      { name: 'Home', description: 'The first page parents see — school photos, highlights and admission button' },
      { name: 'About the School', description: 'History, mission and values' },
      { name: 'Principal’s Message', description: 'A welcome note with the principal’s photo' },
      { name: 'Management & Trust', description: 'Trustees and leadership team' },
      { name: 'Academics', description: 'Classes, subjects and how you teach' },
      { name: 'Admissions', description: 'How to apply, documents needed and fees' },
      { name: 'Facilities', description: 'Classrooms, labs, library, playground and buses' },
      { name: 'Teachers & Staff', description: 'Your teachers and their qualifications' },
      { name: 'Photo & Video Gallery', description: 'School events and activities' },
      { name: 'News & Notices', description: 'Circulars and important updates' },
      { name: 'Events Calendar', description: 'Annual day, sports day, festivals and exams' },
      { name: 'Achievements', description: 'Results, awards and sports wins' },
      { name: 'Downloads', description: 'Forms, syllabus, timetables and calendars' },
      { name: 'For Parents', description: 'School timings, uniform and rules' },
      { name: 'Jobs at the School', description: 'Teacher and staff vacancies' },
      { name: 'Contact Us', description: 'Address, map, phone and message form' },
      { name: 'Common Questions', description: 'Answers to what parents usually ask' },
      { name: 'Rules & Official Information', description: 'Privacy policy and school board details' },
    ],
    basic: [
      { name: 'Admission Enquiry Form', description: 'Parents send their details in one tap' },
      { name: 'Notice Board', description: 'Your staff add and remove notices themselves' },
      { name: 'Photo Gallery', description: 'Your staff add school photos themselves' },
      { name: 'WhatsApp Button', description: 'Parents message the school in one tap' },
      { name: 'English, Gujarati & Hindi', description: 'Parents can read the website in their language' },
      { name: 'Facebook, Instagram & YouTube', description: 'Your social media shown on the website' },
      { name: 'Admission Season Pages', description: 'Your staff can make a new page for each admission season' },
    ],
    sections: [
      {
        id: 'school-musthave',
        letter: 'A',
        title: 'Must Have',
        intro: 'This comes with every website.',
        groups: [design('school')],
      },
      {
        id: 'school-recommended',
        letter: 'B',
        title: 'Recommended Extras',
        intro: 'Small price, big difference. Most schools take all three.',
        recommended: true,
        groups: [
          {
            id: 'school_branding',
            icon: '🏷️',
            name: 'New Logo & School Colours',
            description: 'A fresh, professional logo that parents remember — for the website, banners, ID cards and letters.',
            bonus: 'Colour & logo guide included',
          },
          {
            id: 'school_contentWriting',
            icon: '✍️',
            name: 'We Write All the Words',
            description: 'Just tell us about your school. We write clear, attractive text for every page — no work for your staff.',
          },
          {
            id: 'school_localSEO',
            icon: '📍',
            name: 'Show Up on Google Maps',
            description: 'When parents nearby search “school near me”, your school appears with photos, address and phone number.',
          },
        ],
      },
      {
        id: 'school-quoted',
        letter: 'C',
        title: 'More Features — Price After a Quick Talk',
        intro: QUOTED_INTRO,
        groups: [
          { id: 'school_eventsDocuments', level: 'Standard', icon: '📅', name: 'Event Sign-ups & Downloads', description: 'Parents sign up for school events and download forms from the website.' },
          { id: 'school_adminDashboard', level: 'Standard', icon: '📥', name: 'One Inbox for All Enquiries', description: 'See every message and admission enquiry in one place.' },
          { id: 'school_onlineAdmissions', level: 'Advanced', icon: '📝', name: 'Full Admission Form Online', description: 'Parents fill the complete admission form and upload documents from home.' },
          { id: 'school_portals', level: 'Advanced', icon: '👨‍👩‍👧', name: 'Login for Parents, Students & Teachers', description: 'Each person gets their own login to see homework and class updates.' },
          { id: 'school_academicRecords', level: 'Advanced', icon: '📊', name: 'Attendance & Report Cards Online', description: 'Parents see attendance and download report cards.' },
          { id: 'school_feePayment', level: 'Advanced', icon: '💳', name: 'Pay School Fees Online', description: 'Parents pay fees from their phone and get a receipt.' },
          { id: 'school_smartCommunication', level: 'Advanced', icon: '🔔', name: 'Automatic Messages & Chat Helper', description: 'Parents get SMS / email updates and instant answers to common questions.' },
          { id: 'school_erp', level: 'Custom', icon: '🔗', name: 'Connect Your School Software', description: 'Link the website to the school software you already use.' },
          { id: 'school_customFeature', level: 'Custom', icon: '✨', name: 'Something Else You Want', description: 'Tell us in the note box below.' },
          moreVisitors('school', 'parents'),
          supportAfter('school'),
        ],
      },
    ],
  },
  {
    id: 'tuition',
    number: '2',
    kind: 'Tuition Classes Website',
    name: 'Krupanidhi English Academy',
    objective: 'A website that shows your courses and results, and brings in more student enquiries.',
    pages: [
      { name: 'Home', description: 'Why choose you, top courses, reviews and enquiry button' },
      { name: 'About the Academy', description: 'Your story and teaching style' },
      { name: 'All Courses', description: 'Every course and batch in one place' },
      { name: 'A Page for Each Course', description: 'Syllabus, duration, fees and join button' },
      { name: 'Teachers', description: 'Your teachers and their experience' },
      { name: 'Admissions', description: 'How to join and which batches are open' },
      { name: 'Results', description: 'Student marks and success stories' },
      { name: 'Student Reviews', description: 'What students and parents say' },
      { name: 'Study Material', description: 'Notes and sample papers to download' },
      { name: 'Tips & Articles', description: 'Exam tips and learning advice' },
      { name: 'Photo Gallery', description: 'Classes, events and activities' },
      { name: 'Common Questions', description: 'Answers about classes, fees and timings' },
      { name: 'Contact & Location', description: 'Map, phone and WhatsApp button' },
      { name: 'Rules & Policies', description: 'Privacy, terms and refunds' },
    ],
    pageNotes: [
      'Events & workshops and batch timetable pages — your staff can add these any time.',
      'We can also make the batch timetable page for you, at no extra cost — just ask.',
    ],
    basic: [
      { name: 'Admission Enquiry Form', description: 'Students send their name, phone and course in one tap' },
      { name: 'WhatsApp Buttons', description: 'One for each course, so students message you directly' },
      { name: 'Free Demo Class Booking', description: 'Students ask for a free trial class' },
      { name: 'Study Material Library', description: 'Notes and papers students can download' },
      { name: 'Facebook, Instagram & YouTube', description: 'Your social media shown on the website' },
      { name: 'Course & Offer Pages', description: 'Your staff can make a page for a new batch or offer' },
    ],
    sections: [
      {
        id: 'tuition-musthave',
        letter: 'A',
        title: 'Must Have',
        intro: 'This comes with every website.',
        groups: [design('tuition')],
      },
      {
        id: 'tuition-recommended',
        letter: 'B',
        title: 'Recommended Extras',
        intro: 'Small price, big difference. Most academies take all three.',
        recommended: true,
        groups: [
          {
            id: 'tuition_branding',
            icon: '🏷️',
            name: 'New Logo & Academy Colours',
            description: 'A fresh, professional logo that students remember — for the website, banners, posters and social media.',
            bonus: 'Colour & logo guide included',
          },
          {
            id: 'tuition_contentWriting',
            icon: '✍️',
            name: 'We Write All the Words',
            description: 'Just tell us about your courses. We write clear, attractive text for every page — no work for your staff.',
          },
          {
            id: 'tuition_localSEO',
            icon: '📍',
            name: 'Show Up on Google Maps',
            description: 'When students nearby search “English classes near me”, your academy appears with photos, address and phone number.',
          },
        ],
      },
      {
        id: 'tuition-quoted',
        letter: 'C',
        title: 'More Features — Price After a Quick Talk',
        intro: QUOTED_INTRO,
        groups: [
          { id: 'tuition_courseManager', level: 'Standard', icon: '🗓️', name: 'Change Courses & Batch Timings Yourself', description: 'Your staff update courses, fees and timings without calling us.' },
          { id: 'tuition_liveClasses', level: 'Standard', icon: '🎥', name: 'Live Online Classes', description: 'Join links for Zoom or Google Meet classes on the website.' },
          { id: 'tuition_crm', level: 'Standard', icon: '📇', name: 'Save Every Enquiry in Your Student-tracking Software', description: 'Each enquiry goes straight into the software you use to follow up students.' },
          { id: 'tuition_multilingual', level: 'Standard', icon: '🗣️', name: 'Website in Hindi & Gujarati Too', description: 'Students and parents read the website in their language.' },
          { id: 'tuition_enrolmentPayments', level: 'Advanced', icon: '💳', name: 'Join a Batch & Pay Fees Online', description: 'Students pick a batch and pay from their phone.' },
          { id: 'tuition_leadFollowUp', level: 'Advanced', icon: '📞', name: 'Follow-up Helper for Enquiries', description: 'See all enquiries, remind your team to call back, and send automatic WhatsApp / SMS updates.' },
          { id: 'tuition_learningPortal', level: 'Advanced', icon: '💻', name: 'Online Classroom for Students', description: 'Students log in to watch recorded lessons and use study material.' },
          { id: 'tuition_assessments', level: 'Advanced', icon: '📋', name: 'Online Tests, Homework & Progress Reports', description: 'Students take tests and submit homework; parents see progress and attendance.' },
          { id: 'tuition_aiAssistant', level: 'Custom', icon: '🤖', name: 'Smart Chat Helper for Students', description: 'Answers students’ questions about courses, any time.' },
          { id: 'tuition_customFeature', level: 'Custom', icon: '✨', name: 'Something Else You Want', description: 'Tell us in the note box below.' },
          moreVisitors('tuition', 'students'),
          supportAfter('tuition'),
        ],
      },
    ],
  },
]

/** Core website development — one price per website, shown in each website's section. */
export const CORE = {
  title: 'Your Complete Website',
  technical: [
    { name: 'Works on Every Phone, Tablet & Computer', description: 'Looks right on any screen' },
    { name: 'Easy Control Panel', description: 'Change text and photos yourself — no technical skill needed' },
    { name: 'Safe & Secure Website', description: 'The lock sign 🔒 in the browser, so visitors trust it' },
    { name: 'Call, WhatsApp & Email Buttons', description: 'Plus a Google Map so people can find you' },
    { name: 'Ready for Google Search', description: 'Basic setup so people can find your website' },
    { name: 'Opens Fast', description: 'Visitors don’t have to wait' },
    { name: 'Fully Tested & Made Live by Us', description: 'We check everything and put it online' },
  ],
}

/** PRICING key of a website's core development price, e.g. "school_core". */
export const coreKey = (siteId) => `${siteId}_core`

/** Groups shown in a website's core block: big counters on top, the full list in a dropdown. */
export const coreSections = (site) => [
  { icon: '📄', count: site.pages.length, label: 'Website Pages', items: site.pages, notes: site.pageNotes },
  { icon: '⭐', count: site.basic.length, label: 'Ready-Made Features', items: site.basic },
  { icon: '⚙️', count: CORE.technical.length, label: 'Setup & Launch Jobs', items: CORE.technical },
  { icon: '🎁', count: COMPLIMENTARY.length, label: 'Complimentary', items: COMPLIMENTARY, complimentary: true },
]

/** Total number of things a website's core price covers. */
export const coreTotal = (site) => coreSections(site).reduce((t, s) => t + s.count, 0)

/** Every selectable service of one website, in page order. */
export const siteGroups = (site) => site.sections.flatMap((s) => s.groups)

export const ALL_GROUPS = SITES.flatMap((site) => siteGroups(site).map((g) => ({ ...g, siteId: site.id })))

/** Headings for the "price after a talk" items, in order. */
export const LEVELS = [
  { level: 'Standard', title: 'Handy Extras' },
  { level: 'Advanced', title: 'Bigger Online Systems' },
  { level: 'Custom', title: 'Special Requests' },
  { level: 'Monthly', title: 'Monthly Services' },
]
