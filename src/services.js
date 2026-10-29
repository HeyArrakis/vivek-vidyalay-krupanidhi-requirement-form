/* ==========================================================================
   SERVICE CATALOGUE — what the client gets and what they can add, for each website.
   Selectable services are one checkbox each; their `id` must match a key in PRICING
   (src/config.js) and be unique across both websites (hence `school_` / `tuition_`).
   `includes` lists what a combined service covers — shown as text, priced once.
   `level` sorts feature bundles into Standard / Advanced / Custom.
   Pages and basic features are not checkboxes: they are part of core development.
   ========================================================================== */

/** Complimentary support — shown as a note under each website, nothing to tick. */
const complimentarySupport = {
  title: 'Maintenance & Technical Support',
  label: 'Complimentary for 3 months',
  text: 'Free for the first 3 months after launch.',
  notes: [
    'During the 3 months, any additions, deletions or changes beyond maintenance and technical checks are charged separately, based on the work.',
  ],
}

export const SITES = [
  {
    id: 'school',
    number: '1',
    kind: 'School Website',
    name: 'Vivek Vidyalay',
    objective: 'Build credibility, showcase the school, attract admissions and communicate clearly with parents and students.',
    pages: [
      { name: 'Home Page', description: 'Hero banner, school introduction, key highlights, admissions button and announcements' },
      { name: 'About School', description: 'History, mission, vision, values and background' },
      { name: 'Principal’s Message', description: 'Principal’s profile, welcome message and photograph' },
      { name: 'Management & Trust', description: 'Trustees, management committee and leadership profiles' },
      { name: 'Academics', description: 'Curriculum, grades, subjects and teaching approach' },
      { name: 'Admissions', description: 'Procedure, eligibility, documents, fee information and enquiry button' },
      { name: 'Facilities & Infrastructure', description: 'Classrooms, labs, library, playground and transport' },
      { name: 'Faculty & Staff', description: 'Teacher profiles, qualifications and departments' },
      { name: 'Gallery', description: 'Categorised photos and videos of school life' },
      { name: 'News & Announcements', description: 'News, circulars, notices and updates' },
      { name: 'Events & Calendar', description: 'Annual functions, competitions, celebrations and academic events' },
      { name: 'Achievements', description: 'Results, awards, sports and student achievements' },
      { name: 'Downloads', description: 'Syllabus, timetables, forms, circulars and academic calendars' },
      { name: 'Parent Resources', description: 'Timings, uniform guidelines, policies and parent information' },
      { name: 'Careers', description: 'Teaching and non-teaching vacancies' },
      { name: 'Contact Us', description: 'Address, map, contact details and enquiry form' },
      { name: 'FAQ', description: 'Common questions from parents and applicants' },
      { name: 'Policies & Disclosures', description: 'Privacy policy, mandatory disclosures and affiliation details' },
    ],
    basic: [
      { name: 'Online Admission Enquiry', description: 'Parents send an enquiry; the school receives their details instantly' },
      { name: 'Notice Board', description: 'Your staff add, edit and remove notices themselves' },
      { name: 'Photo Gallery Manager', description: 'Your staff upload and organise school photos' },
      { name: 'WhatsApp Chat', description: 'One-tap WhatsApp button for parents' },
      { name: 'Multilingual Website', description: 'English, Gujarati and Hindi' },
      { name: 'Social Media Integration', description: 'Social links and selected Instagram / Facebook / YouTube feeds' },
      { name: 'Admission Campaign Pages', description: 'Your admin can create a page for each admission season' },
    ],
    sections: [
      {
        id: 'school-features',
        letter: 'A',
        title: 'School Features & Modules',
        intro:
          'Basic features are included in core development. Standard and Advanced features are combined into ready-made bundles — tick the ones you’d like and we’ll quote them separately.',
        included: { title: 'Basic features', label: 'Included in core', items: 'basic' },
        groups: [
          {
            id: 'school_eventsDocuments',
            level: 'Standard',
            name: 'Events & Downloads Manager',
            description: 'Run school events and share documents online without any developer help.',
            includes: ['Online registration for events and activities', 'Upload and manage circulars, forms and PDFs'],
          },
          {
            id: 'school_adminDashboard',
            level: 'Standard',
            name: 'Admin Dashboard & Enquiry Inbox',
            description: 'One place to manage website content and see every enquiry and form submission.',
          },
          {
            id: 'school_onlineAdmissions',
            level: 'Advanced',
            name: 'Online Admission System',
            description: 'The complete admission process online, from application to tracking.',
            includes: ['Full admission application form', 'Document uploads', 'Application status tracking'],
          },
          {
            id: 'school_portals',
            level: 'Advanced',
            name: 'Student, Parent & Teacher Portals',
            description: 'Secure logins so each family and teacher sees only what’s relevant to them.',
            includes: ['Student / parent login', 'Teacher portal to publish class materials and updates', 'Homework & assignments'],
          },
          {
            id: 'school_academicRecords',
            level: 'Advanced',
            name: 'Attendance & Results',
            description: 'Keep academic records online and share them with parents.',
            includes: ['Attendance management', 'Results and downloadable report cards'],
          },
          {
            id: 'school_feePayment',
            level: 'Advanced',
            name: 'Online Fee Payment',
            description: 'Parents pay school fees online through a secure payment gateway, with transaction records.',
          },
          {
            id: 'school_smartCommunication',
            level: 'Advanced',
            name: 'Smart Communication',
            description: 'Answer and update parents automatically.',
            includes: ['Automated email / SMS notifications', 'Live chat / AI assistant for parent and admission questions'],
          },
          {
            id: 'school_erp',
            level: 'Custom',
            name: 'School ERP Integration',
            description: 'Connect the website to the school management software you already use.',
          },
          {
            id: 'school_customFeature',
            level: 'Custom',
            name: 'Custom School Feature',
            description: 'Anything not covered above — describe it in the notes for the school below.',
          },
        ],
      },
      {
        id: 'school-brand',
        letter: 'B',
        title: 'Branding, Design & Content',
        groups: [
          {
            id: 'school_uiux',
            required: true,
            name: 'Website UI/UX Design',
            description:
              'A custom, modern design for the revamped website. Every page of the new website is built on this design, so it is required for every project.',
            bonus: 'Visual content design (banners & graphics) included — first iteration only',
          },
          {
            id: 'school_branding',
            name: 'Logo & Brand Identity',
            description: 'Create or refine the school’s visual identity — logo, colours, typography and overall style.',
            includes: ['Logo design / redesign', 'Brand identity'],
            bonus: 'Brand guidelines included',
          },
          { id: 'school_contentWriting', name: 'Content Writing', description: 'Professional copy for the website pages, written from information you share.' },
        ],
      },
      {
        id: 'school-growth',
        letter: 'C',
        title: 'Online Growth',
        groups: [
          { id: 'school_localSEO', name: 'Local SEO & Google Business Profile', description: 'Help parents nearby find the school on Google Search and Maps.' },
          {
            id: 'school_advancedSEO',
            name: 'Advanced SEO / Google Ads',
            description: 'Only needed if you want to grow through search traffic or paid ads. A separate monthly service, priced on your goals.',
          },
        ],
      },
      {
        id: 'school-support',
        letter: 'D',
        title: 'After Launch',
        complimentary: complimentarySupport,
        groups: [
          {
            id: 'school_supportAfter3Months',
            name: 'Support After 3 Months',
            description: 'Continued maintenance, technical support and content updates after the complimentary 3 months. Charged based on the scope of work.',
          },
        ],
      },
    ],
  },
  {
    id: 'tuition',
    number: '2',
    kind: 'Tuition Classes Website',
    name: 'Krupanidhi English Academy',
    objective: 'Generate admission enquiries, present courses clearly, show teaching quality and turn visitors into enrolled students.',
    pages: [
      { name: 'Home Page', description: 'Why choose the academy, course highlights, testimonials and enquiry button' },
      { name: 'About the Academy', description: 'History, teaching philosophy and what makes the academy different' },
      { name: 'Courses Overview', description: 'All courses, subjects, batches and programmes' },
      { name: 'Individual Course Pages', description: 'Syllabus, duration, eligibility, fees and enrolment button for each course' },
      { name: 'Faculty / Mentors', description: 'Teacher profiles, experience and specialisations' },
      { name: 'Admissions & Enrolment', description: 'Admission process, batch availability and enrolment enquiry' },
      { name: 'Results & Achievements', description: 'Student scores, exam results and success stories' },
      { name: 'Student Testimonials', description: 'Written and video reviews from students and parents' },
      { name: 'Study Materials', description: 'Notes, sample papers and downloadable resources' },
      { name: 'Blog & Learning Resources', description: 'Articles, exam tips and learning guidance' },
      { name: 'Gallery', description: 'Classroom photos, activities and events' },
      { name: 'FAQ', description: 'Common questions about admissions, classes, fees and teaching' },
      { name: 'Contact & Location', description: 'Contact form, Google Maps, phone and WhatsApp button' },
      { name: 'Policies', description: 'Privacy, terms, refunds where relevant and other disclosures' },
    ],
    pageNotes: [
      'Events & Workshops and Batch Timetable pages — your admin can add these any time.',
      'Batch Timetable can also be built by us as part of core development, on request.',
    ],
    basic: [
      { name: 'Admission Enquiry Form', description: 'Capture name, phone, course interest and student details' },
      { name: 'WhatsApp Lead Buttons', description: 'Course-specific WhatsApp enquiry buttons' },
      { name: 'Demo Class Booking', description: 'Students request a free trial class' },
      { name: 'Study Material Library', description: 'Downloadable notes and resources for students' },
      { name: 'Social Media Integration', description: 'Social links and selected Instagram / Facebook / YouTube feeds' },
      { name: 'Course Campaign Pages', description: 'Your admin can create a page for a course, batch launch or admission campaign' },
    ],
    sections: [
      {
        id: 'tuition-features',
        letter: 'A',
        title: 'Tuition Class Features & Modules',
        intro:
          'Basic features are included in core development. Standard and Advanced features are combined into ready-made bundles — tick the ones you’d like and we’ll quote them separately.',
        included: { title: 'Basic features', label: 'Included in core', items: 'basic' },
        groups: [
          {
            id: 'tuition_courseManager',
            level: 'Standard',
            name: 'Course & Batch Manager',
            description: 'Your staff update courses, fees, schedules and batch details themselves.',
          },
          {
            id: 'tuition_liveClasses',
            level: 'Standard',
            name: 'Live Online Classes',
            description: 'Connect Zoom, Google Meet or another class platform, with class links for each batch.',
          },
          {
            id: 'tuition_crm',
            level: 'Standard',
            name: 'CRM Integration',
            description: 'Send every enquiry straight into Zoho, HubSpot or the CRM you use.',
          },
          {
            id: 'tuition_multilingual',
            level: 'Standard',
            name: 'Multilingual Content',
            description: 'Website content in English, Hindi, Gujarati or other selected languages.',
          },
          {
            id: 'tuition_enrolmentPayments',
            level: 'Advanced',
            name: 'Online Enrolment & Fee Payment',
            description: 'Students join a batch and pay online in one go.',
            includes: ['Online registration for batches and courses', 'Course fee payment through a payment gateway'],
          },
          {
            id: 'tuition_leadFollowUp',
            level: 'Advanced',
            name: 'Lead Follow-up System',
            description: 'Turn more enquiries into admissions.',
            includes: ['Lead management dashboard — view, filter, assign and follow up', 'Automated email / WhatsApp / SMS updates', 'Student referral tracking'],
          },
          {
            id: 'tuition_learningPortal',
            level: 'Advanced',
            name: 'Student Learning Portal',
            description: 'A private online classroom for enrolled students.',
            includes: ['Student login and dashboard', 'Lessons, resources and learning progress (LMS)', 'Recorded video lessons for enrolled students'],
          },
          {
            id: 'tuition_assessments',
            level: 'Advanced',
            name: 'Tests, Attendance & Progress',
            description: 'Track how every student is doing.',
            includes: ['Online tests & quizzes', 'Assignment submission and teacher review', 'Attendance tracking', 'Progress reports and certificates'],
          },
          {
            id: 'tuition_aiAssistant',
            level: 'Custom',
            name: 'AI Student Assistant',
            description: 'Answers course questions and helps students with academic resources.',
          },
          {
            id: 'tuition_customFeature',
            level: 'Custom',
            name: 'Custom Tuition Feature',
            description: 'Anything not covered above — describe it in the notes for the tuition classes below.',
          },
        ],
      },
      {
        id: 'tuition-brand',
        letter: 'B',
        title: 'Branding, Design & Content',
        groups: [
          {
            id: 'tuition_uiux',
            required: true,
            name: 'Website UI/UX Design',
            description:
              'A custom, modern design for the revamped website. Every page of the new website is built on this design, so it is required for every project.',
            bonus: 'Visual content design (banners & graphics) included — first iteration only',
          },
          {
            id: 'tuition_branding',
            name: 'Logo & Brand Identity',
            description: 'Create or refine the academy’s visual identity — logo, colours, typography and overall style.',
            includes: ['Logo design / redesign', 'Brand identity'],
            bonus: 'Brand guidelines included',
          },
          { id: 'tuition_contentWriting', name: 'Content Writing', description: 'Professional copy for the website pages and course descriptions.' },
        ],
      },
      {
        id: 'tuition-growth',
        letter: 'C',
        title: 'Online Growth',
        groups: [
          { id: 'tuition_localSEO', name: 'Local SEO & Google Business Profile', description: 'Help students nearby find the academy on Google Search and Maps.' },
          {
            id: 'tuition_advancedSEO',
            name: 'Advanced SEO / Google Ads',
            description: 'Only needed if you want to grow through search traffic or paid ads. A separate monthly service, priced on your goals.',
          },
        ],
      },
      {
        id: 'tuition-support',
        letter: 'D',
        title: 'After Launch',
        complimentary: complimentarySupport,
        groups: [
          {
            id: 'tuition_supportAfter3Months',
            name: 'Support After 3 Months',
            description: 'Continued maintenance, technical support and content updates after the complimentary 3 months. Charged based on the scope of work.',
          },
        ],
      },
    ],
  },
]

/** Core website development — one price per website, shown in each website's section. */
export const CORE = {
  title: 'Core Website Development',
  summary: (site) =>
    `Everything below is included in this price for the ${site.name} website — all listed pages, the basic features, the technical setup and launch. Website UI/UX Design is a separate, required service (see section B).`,
  technical: [
    { name: 'Mobile-friendly build', description: 'Works on phones, tablets and desktops' },
    { name: 'Admin panel', description: 'Your staff update content and pages themselves' },
    { name: 'Secure HTTPS', description: 'SSL certificate and basic security' },
    { name: 'Contact & enquiry forms', description: 'With call, email and WhatsApp buttons and Google Maps' },
    { name: 'Basic SEO & speed optimisation', description: 'Page titles, descriptions and fast loading' },
    { name: 'Testing & launch', description: 'Checked on all devices and taken live' },
    { name: '3 months maintenance & technical support', description: 'Complimentary after launch' },
  ],
}

/** PRICING key of a website's core development price, e.g. "school_core". */
export const coreKey = (siteId) => `${siteId}_core`

/** Groups shown in a website's core dropdown, in reading order. */
export const coreSections = (site) => [
  { title: `Website pages (${site.pages.length})`, items: site.pages, notes: site.pageNotes },
  { title: `Basic features (${site.basic.length})`, items: site.basic },
  { title: 'Build, technical, launch & support', items: CORE.technical },
]

/** Every selectable service of one website, in page order. */
export const siteGroups = (site) => site.sections.flatMap((s) => s.groups)

export const ALL_GROUPS = SITES.flatMap((site) => siteGroups(site).map((g) => ({ ...g, siteId: site.id })))

/** Order and headings for feature bundles. */
export const LEVELS = [
  { level: 'Standard', title: 'Standard features', label: 'Quoted separately' },
  { level: 'Advanced', title: 'Advanced features', label: 'Quoted separately' },
  { level: 'Custom', title: 'Custom work', label: 'Quoted separately' },
]
