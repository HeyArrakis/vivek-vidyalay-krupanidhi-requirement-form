/* ==========================================================================
   SERVICE CATALOGUE — what the client can choose, for each of their two websites.
   Each service is one checkbox; its `id` must match a key in PRICING (src/config.js)
   and be unique across both websites (hence the `school_` / `tuition_` prefixes).
   `includes` lists what a grouped service covers — shown as text, priced once.
   `level` is an optional complexity tag (Basic / Standard / Advanced / Custom),
   shown while no price is set.
   ========================================================================== */

const page = (prefix) => (key, name, description) => ({ id: `${prefix}_page_${key}`, name, description })
const schoolPage = page('school')
const tuitionPage = page('tuition')

/** Shown as a note under each website — complimentary, so nothing to tick. */
const complimentarySupport = {
  title: 'Maintenance & Technical Support',
  label: 'Complimentary for 6 months',
  text: 'Free for the first 6 months after launch.',
  notes: [
    'During the 6 months, any additions, deletions or changes beyond maintenance and technical checks are charged separately, based on the work.',
  ],
}

export const SITES = [
  {
    id: 'school',
    number: '1',
    kind: 'School Website',
    name: 'Vivek Vidyalay',
    objective: 'Build credibility, showcase the school, attract admissions and communicate clearly with parents and students.',
    includedNote:
      'Already included: a mobile-friendly design, secure HTTPS, an admission enquiry & contact form, call / email / WhatsApp buttons, Google Maps, basic SEO, speed optimisation, testing, launch and 6 months of maintenance & technical support.',
    sections: [
      {
        id: 'school-pages',
        letter: 'A',
        title: 'Website Pages',
        bulk: true,
        groups: [
          schoolPage('home', 'Home Page', 'Hero banner, school introduction, key highlights, admissions call-to-action and announcements.'),
          schoolPage('about', 'About School', 'History, mission, vision, values and institutional background.'),
          schoolPage('principal', 'Principal’s Message', 'Principal’s profile, welcome message and photograph.'),
          schoolPage('management', 'Management & Trust', 'Trustees, management committee, leadership and profiles.'),
          schoolPage('academics', 'Academics', 'Curriculum, grades, subjects, academic approach and teaching methodology.'),
          schoolPage('admissions', 'Admissions', 'Admission procedure, eligibility, required documents, fee information and enquiry button.'),
          schoolPage('facilities', 'Facilities & Infrastructure', 'Classrooms, laboratories, library, playground, transport and other facilities.'),
          schoolPage('faculty', 'Faculty & Staff', 'Teacher profiles, qualifications and departments.'),
          schoolPage('gallery', 'Gallery', 'Categorised photos and videos of school activities.'),
          schoolPage('news', 'News & Announcements', 'School news, circulars, notices and important updates.'),
          schoolPage('events', 'Events & Calendar', 'Annual functions, competitions, celebrations and academic events.'),
          schoolPage('achievements', 'Achievements', 'Academic results, awards, sports and student achievements.'),
          schoolPage('downloads', 'Downloads', 'Syllabus, timetables, forms, circulars and academic calendars.'),
          schoolPage('parents', 'Parent Resources', 'School timings, uniform guidelines, policies and parent information.'),
          schoolPage('careers', 'Careers', 'Teaching and non-teaching vacancies and applications.'),
          schoolPage('contact', 'Contact Us', 'Address, embedded map, contact details and enquiry form.'),
          schoolPage('faq', 'FAQ', 'Frequently asked questions for parents and applicants.'),
          schoolPage('policies', 'Policies & Disclosures', 'Privacy policy, mandatory disclosures and affiliation details where applicable.'),
        ],
      },
      {
        id: 'school-features',
        letter: 'B',
        title: 'School Features & Modules',
        intro:
          'These go beyond ordinary pages — they need extra development, integrations or admin workflows. Portals, attendance and fee systems are software modules and are scoped separately.',
        groups: [
          { id: 'school_admissionEnquiry', level: 'Basic', name: 'Online Admission Enquiry', description: 'Parents submit an enquiry; the school receives the lead and contact details.' },
          { id: 'school_admissionApplication', level: 'Advanced', name: 'Online Admission Application', description: 'Full admission form with document uploads and application tracking.' },
          { id: 'school_parentPortal', level: 'Advanced', name: 'Student / Parent Portal', description: 'Secure login to access student-specific information.' },
          { id: 'school_teacherPortal', level: 'Advanced', name: 'Teacher Portal', description: 'Teachers publish class materials and relevant updates.' },
          { id: 'school_homework', level: 'Advanced', name: 'Homework & Assignments', description: 'Publish or submit homework and learning materials.' },
          { id: 'school_attendance', level: 'Advanced', name: 'Attendance Management', description: 'Maintain and display attendance records.' },
          { id: 'school_results', level: 'Advanced', name: 'Results & Report Cards', description: 'Publish academic results and downloadable report cards.' },
          { id: 'school_feePayment', level: 'Advanced', name: 'Online Fee Payment', description: 'Payment gateway for school fees with transaction records.' },
          { id: 'school_transport', level: 'Basic', name: 'School Transport Information', description: 'Routes, pickup points and transport information.' },
          { id: 'school_eventRegistration', level: 'Standard', name: 'Event Registration', description: 'Online registration for school events and activities.' },
          { id: 'school_noticeCMS', level: 'Standard', name: 'Notice Board (staff-editable)', description: 'Staff can add, edit and remove notices themselves.' },
          { id: 'school_galleryCMS', level: 'Standard', name: 'Photo Gallery (staff-editable)', description: 'Staff can upload and organise school photographs.' },
          { id: 'school_documents', level: 'Standard', name: 'Document Management', description: 'Upload and manage circulars, forms and downloadable PDFs.' },
          { id: 'school_whatsapp', level: 'Basic', name: 'WhatsApp Integration', description: 'Click-to-chat, and optionally automated messages.' },
          { id: 'school_notifications', level: 'Advanced', name: 'Email / SMS Notifications', description: 'Automated messages for enquiries and selected workflows.' },
          { id: 'school_multilingual', level: 'Standard', name: 'Multilingual Website', description: 'Content in English, Gujarati, Hindi or other selected languages.' },
          { id: 'school_aiAssistant', level: 'Advanced', name: 'Live Chat / AI Assistant', description: 'Answers common parent and admission questions, any time.' },
          { id: 'school_adminDashboard', level: 'Standard', name: 'Admin Dashboard', description: 'Manage selected website content and form submissions.' },
          { id: 'school_erp', level: 'Custom', name: 'School ERP Integration', description: 'Connect the website to the school management software you already use.' },
          { id: 'school_customFeature', level: 'Custom', name: 'Custom School Feature', description: 'Anything not covered above — describe it in the notes for the school below.' },
        ],
      },
      {
        id: 'school-brand',
        letter: 'C',
        title: 'Branding, Design & Content',
        groups: [
          {
            id: 'school_branding',
            name: 'Logo & Brand Identity',
            description: 'Create or refine the school’s visual identity — logo, colours, typography and overall style.',
            includes: ['Logo design / redesign', 'Brand identity'],
            bonus: 'Brand guidelines included',
          },
          {
            id: 'school_uiux',
            name: 'Website UI/UX Design',
            description: 'A custom, premium design for the school website, built for parents on phones and desktops.',
            bonus: 'Visual content design (banners & graphics) included — first iteration only',
          },
          { id: 'school_contentWriting', name: 'Content Writing', description: 'Professional copy for the selected pages, written from information you share.' },
          { id: 'school_photography', name: 'Professional Photography', description: 'Campus, classroom, faculty and event photo shoot.' },
          { id: 'school_video', name: 'School Introduction Video', description: 'A short promotional or introduction video for the website and social media.' },
        ],
      },
      {
        id: 'school-growth',
        letter: 'D',
        title: 'Online Growth',
        groups: [
          { id: 'school_localSEO', name: 'Local SEO & Google Business Profile', description: 'Help parents nearby find the school on Google Search and Maps.' },
          { id: 'school_analytics', name: 'Analytics & Enquiry Tracking', description: 'Google Analytics and Search Console, plus tracking of form, call and WhatsApp enquiries.' },
          { id: 'school_admissionLanding', name: 'Admission Campaign Landing Page', description: 'A dedicated page for each admission season or campaign.' },
          { id: 'school_social', name: 'Social Media Integration', description: 'Social links and selected Instagram / Facebook / YouTube feeds on the site.' },
          {
            id: 'school_advancedSEO',
            name: 'Advanced SEO / Google Ads',
            description: 'Only needed if you want to grow through search traffic or paid ads. A separate monthly service, priced on your goals.',
          },
        ],
      },
      {
        id: 'school-support',
        letter: 'E',
        title: 'After Launch',
        complimentary: complimentarySupport,
        groups: [
          { id: 'school_training', name: 'Staff Training', description: 'Hands-on training and a short guide so school staff can update notices, photos and pages.' },
          {
            id: 'school_supportAfter6Months',
            name: 'Support After 6 Months',
            description: 'Continued maintenance, technical support and content updates after the complimentary 6 months. Charged based on the scope of work.',
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
    includedNote:
      'Already included: a mobile-friendly design, secure HTTPS, an admission enquiry & contact form, call / email / WhatsApp buttons, Google Maps, basic SEO, speed optimisation, testing, launch and 6 months of maintenance & technical support.',
    sections: [
      {
        id: 'tuition-pages',
        letter: 'A',
        title: 'Website Pages',
        bulk: true,
        groups: [
          tuitionPage('home', 'Home Page', 'Why choose the academy, course highlights, testimonials and enquiry button.'),
          tuitionPage('about', 'About the Academy', 'History, teaching philosophy and what makes the academy different.'),
          tuitionPage('courses', 'Courses Overview', 'All courses, subjects, batches and learning programmes.'),
          tuitionPage('courseDetails', 'Individual Course Pages', 'Syllabus, duration, eligibility, fees and enrolment button for each course.'),
          tuitionPage('faculty', 'Faculty / Mentors', 'Teacher profiles, experience, qualifications and specialisations.'),
          tuitionPage('admissions', 'Admissions & Enrolment', 'Admission process, batch availability and enrolment enquiry.'),
          tuitionPage('results', 'Results & Achievements', 'Student scores, exam results and success stories.'),
          tuitionPage('testimonials', 'Student Testimonials', 'Written and video reviews from students and parents.'),
          tuitionPage('timetable', 'Batch Timetable', 'Class schedules, timings and batch information.'),
          tuitionPage('materials', 'Study Materials', 'Notes, sample papers and downloadable resources.'),
          tuitionPage('blog', 'Blog & Learning Resources', 'Articles, exam tips and learning guidance.'),
          tuitionPage('events', 'Events & Workshops', 'Seminars, workshops, demo classes and academic events.'),
          tuitionPage('gallery', 'Gallery', 'Classroom photos, activities, events and the academy environment.'),
          tuitionPage('faq', 'FAQ', 'Common questions about admissions, classes, fees and teaching.'),
          tuitionPage('contact', 'Contact & Location', 'Contact form, Google Maps, phone and WhatsApp button.'),
          tuitionPage('careers', 'Careers', 'Faculty recruitment and job openings.'),
          tuitionPage('policies', 'Policies', 'Privacy, terms, refunds where relevant and other disclosures.'),
        ],
      },
      {
        id: 'tuition-features',
        letter: 'B',
        title: 'Tuition Class Features & Modules',
        intro:
          'Start with getting quality enquiries; a full learning platform (LMS, tests, student login) can be added later and is scoped separately.',
        groups: [
          { id: 'tuition_admissionEnquiry', level: 'Basic', name: 'Admission Enquiry Form', description: 'Capture name, phone, course interest and student details.' },
          { id: 'tuition_whatsappLeads', level: 'Basic', name: 'WhatsApp Lead Generation', description: 'Course-specific WhatsApp enquiry buttons.' },
          { id: 'tuition_demoBooking', level: 'Standard', name: 'Demo Class Booking', description: 'Students request or schedule a free trial class.' },
          { id: 'tuition_enrolment', level: 'Advanced', name: 'Online Enrolment', description: 'Register for batches and courses online.' },
          { id: 'tuition_courseCMS', level: 'Standard', name: 'Course & Batch Manager', description: 'Staff update courses, fees, schedules and batch details themselves.' },
          { id: 'tuition_leadDashboard', level: 'Advanced', name: 'Lead Management Dashboard', description: 'View, filter, assign and follow up on enquiries.' },
          { id: 'tuition_crm', level: 'Standard', name: 'CRM Integration', description: 'Send enquiries into Zoho, HubSpot or another CRM.' },
          { id: 'tuition_feePayment', level: 'Advanced', name: 'Online Fee Payment', description: 'Accept course fees through a payment gateway.' },
          { id: 'tuition_studentPortal', level: 'Advanced', name: 'Student Login Portal', description: 'A private account and dashboard for each student.' },
          { id: 'tuition_lms', level: 'Advanced', name: 'Learning Management System', description: 'Courses, lessons, resources and learning progress.' },
          { id: 'tuition_videoLessons', level: 'Advanced', name: 'Recorded Video Lessons', description: 'Video access restricted to enrolled students.' },
          { id: 'tuition_liveClasses', level: 'Standard', name: 'Live Class Integration', description: 'Connect Zoom, Google Meet or another class platform.' },
          { id: 'tuition_tests', level: 'Advanced', name: 'Online Tests & Quizzes', description: 'Mock tests, scoring and assessments.' },
          { id: 'tuition_assignments', level: 'Advanced', name: 'Assignment Submission', description: 'Students upload homework; teachers review it.' },
          { id: 'tuition_attendance', level: 'Advanced', name: 'Attendance Tracking', description: 'Track student attendance across batches.' },
          { id: 'tuition_progress', level: 'Advanced', name: 'Progress Reports', description: 'Show assessment scores and student performance.' },
          { id: 'tuition_library', level: 'Standard', name: 'Study Material Library', description: 'Downloadable or members-only learning resources.' },
          { id: 'tuition_certificates', level: 'Advanced', name: 'Certificates', description: 'Generate completion or participation certificates.' },
          { id: 'tuition_notifications', level: 'Advanced', name: 'Automated Notifications', description: 'Email, WhatsApp or SMS for admission and class updates.' },
          { id: 'tuition_referrals', level: 'Advanced', name: 'Referral System', description: 'Track student referrals and run referral offers.' },
          { id: 'tuition_aiAssistant', level: 'Custom', name: 'AI Student Assistant', description: 'Answers course questions and helps with academic resources.' },
          { id: 'tuition_multilingual', level: 'Standard', name: 'Multilingual Content', description: 'English, Hindi, Gujarati or other selected languages.' },
          { id: 'tuition_customFeature', level: 'Custom', name: 'Custom Tuition Feature', description: 'Anything not covered above — describe it in the notes for the tuition classes below.' },
        ],
      },
      {
        id: 'tuition-brand',
        letter: 'C',
        title: 'Branding, Design & Content',
        groups: [
          {
            id: 'tuition_branding',
            name: 'Logo & Brand Identity',
            description: 'Create or refine the academy’s visual identity — logo, colours, typography and overall style.',
            includes: ['Logo design / redesign', 'Brand identity'],
            bonus: 'Brand guidelines included',
          },
          {
            id: 'tuition_uiux',
            name: 'Website UI/UX Design',
            description: 'A custom, conversion-focused design that turns visitors into enquiries.',
            bonus: 'Visual content design (banners & graphics) included — first iteration only',
          },
          { id: 'tuition_contentWriting', name: 'Content Writing', description: 'Professional copy for the selected pages and course descriptions.' },
          { id: 'tuition_photography', name: 'Professional Photography', description: 'Classroom, faculty and student activity photo shoot.' },
          { id: 'tuition_video', name: 'Academy Introduction Video', description: 'A short promotional video for the website, ads and social media.' },
        ],
      },
      {
        id: 'tuition-growth',
        letter: 'D',
        title: 'Online Growth',
        groups: [
          { id: 'tuition_localSEO', name: 'Local SEO & Google Business Profile', description: 'Help students nearby find the academy on Google Search and Maps.' },
          { id: 'tuition_analytics', name: 'Analytics & Enquiry Tracking', description: 'Google Analytics and Search Console, plus tracking of form, call and WhatsApp enquiries.' },
          { id: 'tuition_courseLanding', name: 'Course Campaign Landing Pages', description: 'Dedicated pages for a course, batch launch or admission campaign.' },
          { id: 'tuition_social', name: 'Social Media Integration', description: 'Social links and selected Instagram / Facebook / YouTube feeds on the site.' },
          {
            id: 'tuition_advancedSEO',
            name: 'Advanced SEO / Google Ads',
            description: 'Only needed if you want to grow through search traffic or paid ads. A separate monthly service, priced on your goals.',
          },
        ],
      },
      {
        id: 'tuition-support',
        letter: 'E',
        title: 'After Launch',
        complimentary: complimentarySupport,
        groups: [
          { id: 'tuition_training', name: 'Staff Training', description: 'Hands-on training and a short guide so staff can update courses, batches and photos.' },
          {
            id: 'tuition_supportAfter6Months',
            name: 'Support After 6 Months',
            description: 'Continued maintenance, technical support and content updates after the complimentary 6 months. Charged based on the scope of work.',
          },
        ],
      },
    ],
  },
]

/** Every service of one website, in page order. */
export const siteGroups = (site) => site.sections.flatMap((s) => s.groups)

export const ALL_GROUPS = SITES.flatMap((site) => siteGroups(site).map((g) => ({ ...g, siteId: site.id })))
