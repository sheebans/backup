import quizzesTranslations from './quizzes/translations';

export default Object.assign(quizzesTranslations, {
  en: 'English',
  sp: 'Spanish',
  ar: 'Arabic',
  errors: {
    description: 'This field',
    inclusion: '{{description}} is not included in the list',
    exclusion: '{{description}} is reserved',
    invalid: '{{description}} is invalid',
    confirmation: '{{description}} doesn\'t match {{on}}',
    accepted: '{{description}} must be accepted',
    empty: '{{description}} can\'t be empty',
    blank: '{{description}} can\'t be blank',
    present: '{{description}} must be blank',
    collection: '{{description}} must be a collection',
    singular: '{{description}} can\'t be a collection',
    tooLong: '{{description}} is too long (maximum is {{max}} characters)',
    tooShort: '{{description}} is too short (minimum is {{min}} characters)',
    before: '{{description}} must be before {{before}}',
    after: '{{description}} must be after {{after}}',
    wrongDateFormat: '{{description}} must be in the format of {{format}}',
    wrongLength:
      '{{description}} is the wrong length (should be {{is}} characters)',
    notANumber: '{{description}} must be a number',
    notAnInteger: '{{description}} must be an integer',
    greaterThan: '{{description}} must be greater than {{gt}}',
    greaterThanOrEqualTo:
      '{{description}} must be greater than or equal to {{gte}}',
    equalTo: '{{description}} must be equal to {{is}}',
    lessThan: '{{description}} must be less than {{lt}}',
    lessThanOrEqualTo: '{{description}} must be less than or equal to {{lte}}',
    otherThan: '{{description}} must be other than {{value}}',
    odd: '{{description}} must be odd',
    even: '{{description}} must be even',
    positive: '{{description}} must be positive',
    date: '{{description}} must be a valid date',
    email: '{{description}} must be a valid email address',
    phone: '{{description}} must be a valid phone number',
    url: '{{description}} must be a valid url'
  },
  /*
   * COMMON: Translations used globally in the app or shared between components
   */
  common: {
    'a-collection': 'a collection',
    'a-course': 'a course',
    'a-question': 'a question',
    'a-resource': 'a resource',
    'a-rubric': 'a rubric',
    'all-completed': 'All Completed',
    'an-assessment': 'an assessment',
    about: 'About',
    'about-you': 'About You',
    'about-me': 'About Me',
    add: 'Add',
    'add-assessment': 'Create New Assessment',
    'add-century-skills': 'Add 21st Century Skills',
    'add-collaborator': 'Add Collaborator',
    'add-collection': 'Create New Collection',
    'add-collection-item': 'Create Resource or Question',
    'add-competency': 'Add Competency',
    'add-content-prompt':
      'You haven\'t created <span>{{type}}</span> yet. Go on, be bold.',
    'add-course': 'Create New Course',
    'add-domains-to-unit': 'Add Domains to Unit',
    'add-url': 'Add URL',
    'add-from-url': 'Add from URL',
    'add-lessons': 'Add Lessons',
    'add-new-lesson': 'Create New Lesson',
    'add-new-unit': 'Create New Unit',
    'add-new-resource': 'Create New Resource',
    'add-new-question': 'Create a new question',
    'add-question': 'Create Question',
    'add-question-image': 'Add Question Image',
    'add-rubric': 'Add New Rubric',
    'add-standard': 'Add Standard',
    'add-standards': 'Add Standards',
    'add-standards-to-collection': 'Add Standards to Collection',
    'add-to': 'Add To',
    'add-to-classroom': 'Add to Classroom',
    'add-to-daily-class': 'Add to Daily Class Activities',
    'add-to-collection-success':
      'You\'ve added {{contentTitle}} to {{collectionTitle}}. Do you want to edit that {{collectionType}}?',
    'add-to-lesson-success':
      'You\'ve added {{collectionTitle}} to {{lessonTitle}}. Do you want to edit that {{collectionType}}?',
    'add-type-question': 'What type of question would you like to add?',
    'add-type-resource': 'What type of resource is this?',
    'add-units': 'Add Units',
    added: 'Added',
    'advanced-editing': 'Advanced Editing',
    announcements: 'Announcements',
    anonymous_mode: 'Anonymous Mode',
    answer: 'Your Answer',
    'answer-correct': 'You are correct!',
    'answer-incorrect': 'You are incorrect...',
    'answer-key-was-hidden': 'Note: Your teacher has hidden the answer key.',
    approved: 'Approved',
    archive: 'Archive',
    assessment: 'Assessment',
    'assessment-disabled': 'You can\'t attempt this assessment',
    'assessment-external': 'Assessment-External',
    'assessment-pl': {
      zero: 'Assessments',
      one: 'Assessment',
      other: 'Assessments'
    },
    'assessment-title': 'Assessment Title',
    assessmentInitial: 'A',
    assessments: 'Assessments',
    assign: 'Assign',
    'assign-to-class': 'Assign to Classroom',
    'assign-to-course': 'Assign to Course',
    attempt: 'Attempt number',
    audience: 'Audience',
    avatarFor: 'Avatar for',
    averageScore: 'Average Score',
    back: 'Back',
    'back-to-assessment': 'Back to assessment',
    'back-to-collection': 'Back to collection',
    'back-to-course-map': 'Back to Course Map',
    'back-to-data': 'Back to Data',
    'best-practices': 'Best Practices',
    beta: 'Beta',
    'big-ideas': 'Big Ideas',
    biography: 'Biography',
    bookmark: 'Bookmark',
    bookmarks: 'Bookmarks',
    'bookmarked-content-success':
      'This bookmarked {{contentType}} will be added to your Independent Learning Page.',
    'bookmarked-success':
      'All bookmarked content will be added to the Independent learning page.',
    builder: 'Editor',
    cancel: 'Cancel',
    categories: 'Categories',
    category: 'Category',
    categoryOptions: {
      k12: 'K-12',
      'higher-ed': 'Higher Education',
      'professional-dev': 'Professional Development'
    },
    'century-skills': '21st Century Skills',
    choose: 'Choose',
    'choose-file': 'Choose a file',
    class: 'Classroom',
    classScores: 'Class Scores',
    'click-unBookmark': 'Click to unbookmark',
    close: 'Close',
    collection: 'Collection',
    'collection-pl': {
      zero: 'Collections',
      one: 'Collection',
      other: 'Collections'
    },
    'collection-title': 'Collection Title',
    collections: 'Collections',
    collectionInitial: 'C',
    competency: 'Competency',
    competencies: 'Competencies',
    completed: 'Completed',
    completion: 'Completion',
    community: 'Community',
    confirm: 'Confirm',
    'confirm-copy': 'Confirm & Copy',
    content: 'Content',
    'content-manager': 'Content Manager',
    contentUnavailable: 'Content not available',
    'contributed-by': 'Contributed by',
    copy: 'Copy',
    'copy-to': 'Copy To',
    correct: 'Correct',
    'correct-answer': 'Correct Answer',
    country: 'Country',
    'course-map': 'Course Map',
    course: 'Course',
    'course-title': 'Course Title',
    courses: 'Courses',
    create: 'Create',
    'created-by': 'Created by',
    'create-rubric': 'Create New Rubric',
    'current-attempt': 'Current Attempt',
    delete: 'Delete',
    'delete-instructions': {
      'links-inaccessible': 'All share links will be inaccessible',
      'content-inaccessible':
        'All content will be inaccessible to the classrooms tied to it'
    },
    'depth-of-knowledge': 'Depth of Knowledge',
    description: 'Description',
    'disappear-after-login': 'This will disappear after {{loginNumber}} logins',
    'disappear-next-login': 'This will not appear on the next login',
    district: 'District',
    domain: 'Domain',
    domains: 'Domains',
    download: 'Download',
    'download-print': 'Download/Print',
    'drag-drop-suggestions': 'Or Drag and Drop Suggestions ...',
    'download-report': 'Download Report',
    edit: 'Edit',
    'edit-assessment': 'Edit Assessment',
    'edit-collection': 'Edit Collection',
    'edit-course': 'Edit Course',
    'edit-question': 'Edit Question',
    'edit-resource': 'Edit Resource',
    'edit-rubric': 'Edit Rubric',
    email_support: 'support@gooru.org',
    emotions: {
      'emotion-1': 'I need help',
      'emotion-2': 'I don\'t understand',
      'emotion-3': 'Meh...',
      'emotion-4': 'I understand',
      'emotion-5': 'I can explain'
    },
    'enter-url': 'Enter URL',
    'enrolled-students': 'Enrolled Students',
    errors: {
      'join-class-code': 'Please enter the classroom code.',
      'answer-has-no-image': 'Please upload an answer image.',
      'add-username': 'Please enter a username.',
      'add-course-title': 'Please enter the course title.',
      'add-question-answer-text': 'Please enter the answer choice text.',
      'add-question-description': 'Please enter the question.',
      'add-question-title': 'Please enter the question title.',
      'assessment-title-presence': 'Please enter the assessment title.',
      'can-not-join-class':
        'Oops! Unable to join classroom. Please try again shortly.',
      'assessment-not-added-to':
        'Oops! Unable to add assessment to lesson right now. Please try again shortly.',
      'assessment-not-copied':
        'Oops! Unable to copy assessment right now. Please try again shortly.',
      'assessment-not-created':
        'Oops! Unable to create assessment right now. Please try again shortly.',
      'assessment-not-updated':
        'Oops! Unable to update assessment right now. Please try again shortly.',
      'category-title-presence': 'Please enter the category title.',
      'class-min-score':
        'The minimum score should be a number between 1 and 100',
      'class-not-created':
        'Oops! Unable to create classroom right now. Please try again shortly.',
      'class-title-presence': 'Please give your classroom a name.',
      'collection-not-added-to':
        'Oops! Unable to add collection to lesson right now. Please try again shortly.',
      'collection-not-copied':
        'Oops! Unable to copy collection right now. Please try again shortly.',
      'collection-not-created':
        'Oops! Unable to create collection right now. Please try again shortly.',
      'collection-not-updated':
        'Oops! Unable to update collection right now. Please try again shortly.',
      'collection-title-presence': 'Please enter the collection title.',
      'correct-answer-presence': 'Please indicate the correct answer.',
      'course-not-copied':
        'Oops! Unable to copy course right now. Please try again shortly.',
      'course-not-created':
        'Oops! Unable to create course right now. Please try again shortly.',
      'course-not-updated':
        'Oops! Unable to update course right now. Please try again shortly.',
      'highlight-text-not-selected': 'Please indicate the correct answer.',
      'highlight-text-wrong-format': 'Incorrect question format.',
      'hotspot-text-max-choices':
        'You have reached the limit of answer choices.',
      'file-max-size': 'Only files of size smaller than 5MB are supported',
      'file-upload-missing':
        'Please select a file with any of the following extensions: {{extensions}}',
      'lesson-not-copied':
        'Oops! Unable to copy lesson right now. Please try again shortly.',
      'lesson-not-created':
        'Oops! Unable to create lesson right now. Please try again shortly.',
      'lesson-not-loaded':
        'Oops! Unable to load lesson right now. Please try again shortly.',
      'lesson-title-required': 'Please enter the lesson title.',
      'password-confirm': 'Please confirm your password.',
      'password-length': 'Password must be between 5 and 14 characters.',
      'password-not-match': 'Passwords do not match.',
      'password-required': 'Please enter a password.',
      'password-special-characters': 'Please don\'t use special characters.',
      'profile-not-updated':
        'Oops! Unable to update profile right now. Please try again shortly.',
      'question-not-added-to':
        'Oops! Unable to add question to {{collectionType}} right now. Please try again shortly.',
      'question-not-copied':
        'Oops! Unable to copy question right now. Please try again shortly.',
      'question-not-created':
        'Oops! Unable to create question right now. Please try again shortly.',
      'question-not-updated':
        'Oops! Unable to update question right now. Please try again shortly.',
      'reset-password-error':
        'Uh oh! Something’s not right. Unable to reset password. Please try again shortly.',
      'reset-google-account-exists':
        'Your email login was created with a Google account and we cannot reset a Google password. If you forgot your Google password, you will need to reset it through your Google apps.',
      'resource-description-length':
        'The description cannot be longer than 500 characters.',
      'resource-invalid-url': 'Invalid URL.',
      'resource-missing-title': 'Please enter a resource title.',
      'resource-missing-type': 'Please select a resource type.',
      'resource-missing-url': 'Please enter a valid URL.',
      'resource-not-added-to-collection':
        'Oops! Unable to add resource to collection right now. Please try again shortly.',
      'resource-not-copied':
        'Oops! Unable to copy resource right now. Please try again shortly.',
      'resource-not-created':
        'Oops! Unable to create resource right now. Please try again shortly.',
      'resource-not-updated':
        'Oops! Unable to update resource right now. Please try again shortly.',
      'resource-same-host-url': 'Resources cannot be Gooru URLs.',
      'resource-title-length': 'The title cannot be longer than 50 characters.',
      'rubric-title-presence': 'Please enter the rubric title.',
      'rubric-url-presence': 'Please enter the rubric URL.',
      'select-correct-answer': 'Please select the correct answer.',
      'search-collections-length': 'Please enter at least 3 characters.',
      'sign-in-credentials-not-valid':
        'Uh oh! Something\'s not right. Please double check your username and password and try again.',
      'sign-in-google-account-exists':
        'Please use Google signin. We can\'t reset your password.',
      'sign-up-error':
        'Oops! Unable to sign up right now. Please try again shortly.',
      'sign-up-first-name': 'Please enter your first name.',
      'sign-up-last-name': 'Please enter your last name.',
      'sign-up-name-length': 'Last name must have at least 2 letters.',
      'sign-up-name-only-letters': 'Please enter only letters.',
      'sign-up-valid-email': 'Please enter a valid email address.',
      'special-characters': 'You cannot use special characters or spaces.',
      'unit-not-copied':
        'Oops! Unable to copy unit right now. Please try again shortly.',
      'unit-not-created':
        'Oops! Unable to create unit right now. Please try again shortly.',
      'unit-not-loaded':
        'Oops! Unable to load unit right now. Please try again shortly.',
      'unit-title-required': 'Please enter the unit title.',
      'user-email-presence': 'Please enter a valid email.',
      'username-length': 'Username must be between 4 and 16 characters.',
      'forgot-password-gmail':
        'Please use Google signin. We can\'t reset your password.'
    },
    'essential-questions': 'Essential Questions',
    exit: 'Exit',
    explanation: 'Explanation',
    explore: 'Explore',
    false: 'False',
    'featured-courses': 'Featured&ensp;Courses',
    'file-name': 'File name',
    finish: 'Finish',
    'first-name': 'First Name',
    follow: 'Follow',
    followers: 'Followers',
    following: 'Following',
    forgotPassword: 'Forgot Password',
    from: 'from',
    'from-my-assessments': 'From My Assessments',
    'from-my-collections': 'From My Collections',
    'from-my-questions': 'From My Questions',
    'from-my-resources': 'From My Resources',
    'hide-results': 'Hide Results',
    hints: 'Hints',
    home: 'Home',
    if_questions: 'If you have any questions,',
    information: 'Information',
    'in-progress': 'In Progress',
    instructor: 'Instructor',
    'last-name': 'Last Name',
    'last-updated': 'Last Updated',
    'latest-attempt': 'Latest attempt',
    'launch-anonymous': 'Launch Anonymous',
    'launch-on-air': 'Go Live',
    'learning-objectives': 'Learning Objectives',
    'learning-target': 'Micro-standard',
    'learning-target-mobile': 'Micro-standard in Standard',
    lesson: 'Lesson',
    lessonInitial: 'L',
    'lesson-title': 'Lesson Title',
    lessonObj: {
      zero: 'Lessons',
      one: 'Lesson',
      other: 'Lessons'
    },
    libraries: 'Libraries',
    license: 'License',
    link: 'Link',
    'link-out': 'Link-out',
    'link-out-message':
      '*If your resource is showing up blank in the preview above, it may need a “link-out” to another page to view the content.',
    'live-assessments': 'Live Assessments',
    loading: 'Loading ...',
    login: 'Log In',
    logout: 'Logout',
    mastery: 'Mastery',
    menu: 'Menu',
    'more-details': 'More Details',
    move: 'Move',
    myContent: 'My Content',
    library: 'Library',
    myPerformance: 'My Performance',
    'edit-narration': 'Edit Narration',
    narration: 'Narration',
    'new-assessment': 'New Assessment',
    'new-collection': 'New Collection',
    'new-question': 'New Question',
    'new-question-text': 'Enter question text here',
    'new-fib-question-text': 'Enter question with [answer]',
    'new-resource': 'New Resource',
    next: 'Next',
    no: 'No',
    'no-archived': 'You do not have any archived classrooms.',
    'no-content': 'No content available',
    'no-assessments-to-display': 'No <span>assessments</span> to display.',
    'no-collections-to-display': 'No <span>collections</span> to display.',
    'no-courses-to-display': 'No <span>courses</span> to display.',
    'no-questions-to-display': 'No <span>questions</span> to display.',
    'no-resources-to-display': 'No <span>resources</span> to display.',
    'no-rubrics-to-display': 'No <span>rubrics</span> to display.',
    'no-followers': 'You don\'t have followers yet.',
    'no-independent-results':
      'When you start exploring your bookmarked {{contentType}}, they will appear here.',
    'no-results': 'No results found',
    'no-available-results': 'Not available results',
    'no-results-message':
      'Check your spelling. We all make mistakes!<br/>Go broader and remove some filters.<br/> Or try searching for a similar word instead.',
    'no-more-attempts': 'No more attempts',
    'no-dca-student':
      'Your teacher has not yet assigned any collections or assessments to the daily class activities.',
    'no-dca-teacher':
      'You have not yet assigned any collections or assessments to your daily class activities.',
    notScored: 'Unscored',
    notStarted: 'Not started',
    'not-added': 'Not Added',
    'not-applicable': 'N/A',
    'not-following': 'You\'re not following anyone.',
    'not-provided': 'Not provided',
    'not-specified': 'Not specified',
    not_started: 'Not Started',
    'nothing-to-display': 'Nothing to display.',
    number: 'No.',
    numberStudents: {
      zero: '{{count}} Students',
      one: '{{count}} Student',
      other: '{{count}} Students'
    },
    of: 'of',
    off: 'OFF',
    on: 'ON',
    other: 'Other',
    'overall-performance': 'Overall Performance',
    password: 'Password',
    pending: 'Pending',
    performance: 'Show Performance',
    'performance-dashboard': 'Performance Dashboard',
    play: 'Play',
    please_contact: 'Please contact',
    'post-message': 'Post Message',
    preview: 'Preview',
    profile: 'Profile',
    'profile-publishing': 'Profile Visibility',
    'publish-to': ' Make this visible to others on my profile library',
    'published-by': 'Published by',
    'published-tooltip': 'Badged Content',
    publisher: 'Publisher',
    question: 'Question',
    questions: 'Questions',
    'questions-OE': 'Free Response Questions',
    'question-pl': {
      zero: 'Questions',
      one: 'Question',
      other: 'Questions'
    },
    'question-title': 'Question Title',
    'question-type': {
      SA: 'Single Answer',
      MC: 'Multiple Choice',
      FIB: 'Fill In the Blank',
      'T/F': 'True or False',
      T_F: 'True or False',
      MA: 'Multiple Answer',
      OE: 'Free Response',
      HS_TXT: 'Multiple Select - Text',
      HS_IMG: 'Multiple Select - Image ',
      HT_TO: 'Drag and Drop Order',
      HT_RO: 'Drag and Drop Order',
      HT_HL: 'Highlight Text'
    },
    reaction: 'Reaction',
    'read-first': '<b>Read this first!</b>',
    remaining: '{{number}} Left',
    remix: 'Remix',
    'remix-assessment': 'Remix Assessment',
    'remix-assessment-lead': 'You are about to remix an assessment.',
    'remix-assessment-success':
      'You\'ve remixed an assessment {{assessmentTitle}}. Do you want to edit that assessment?',
    'remix-collection': 'Remix Collection',
    'remix-collection-lead': 'You are about to remix a collection.',
    'remix-collection-success':
      'You\'ve remixed a collection {{collectionTitle}}. Do you want to edit that collection?',
    'remix-course': 'Remix Course',
    'remix-course-lead': 'You are about to remix a course.',
    'remix-course-success':
      'You\'ve remixed a course {{courseTitle}}. Do you want to edit that course?',
    'remix-lesson': 'Remix Lesson',
    'remix-lesson-lead': 'You are about to remix an lesson.',
    'remix-lesson-success': 'You\'ve remixed a lesson {{lessonTitle}}.',
    'remix-question': 'Remix Question',
    'remix-question-lead': 'You are about to remix a question.',
    'remix-question-success':
      'You\'ve remixed a question {{questionTitle}}. Do you want to edit that question?',
    'remix-resource': 'Remix Resource',
    'remix-resource-lead': 'You are about to remix a resource.',
    'remix-resource-success':
      'You\'ve remixed a resource {{resourceTitle}}. Do you want to edit that resource?',
    'remix-unit': 'Remix Unit',
    'remix-unit-lead': 'You are about to remix a unit.',
    'remix-unit-success': 'You\'ve remixed a unit {{unitTitle}}.',
    'remixed-by': 'Remixed by',
    'remix-warning':
      'Heads up! There’s a lot of awesome content in this course and making a copy will take time. Confirm you want to start the process and in 15 minutes you will find your copy of this course on your <b>Profile.</b>',
    remove: 'Remove',
    report: 'Report',
    'report-in-progress': 'Report in progress',
    'request-to': 'Request to be reviewed for a badge',
    'request-report': 'Request Report',
    resource: 'Resource',
    resources: 'Resources',
    'resource-format': {
      image: 'Image',
      text: 'Text',
      video: 'Video',
      interactive: 'Interactive',
      webpage: 'Webpage',
      audio: 'Audio',
      question: 'Question'
    },
    'resource-pl': {
      zero: 'Resources',
      one: 'Resource',
      other: 'Resources'
    },
    'resource-title': 'Resource Title',
    'resource-url': 'Resource URL',
    role: 'Role',
    rubric: 'Rubric',
    'rubric-creation': 'Rubric Creation',
    rubrics: 'Rubrics',
    'rubric-title': 'Rubric Title',
    save: 'Save',
    'save-next': 'Save and Next',
    'save-submit': 'Save and Submit All',
    'save-finish': 'Save and Finish',
    school: 'School',
    'school-info': 'School Information',
    score: 'Score',
    select: 'Select',
    'select-a-framework':
      'Please first select a Standards Framework in the Course Information section above.',
    sentence: 'Sentence',
    settings: 'Settings',
    search: 'Search',
    'search-placeholder': 'Search',
    'search-error-message': 'Search terms need to be at least 3 letters.',
    'search-400-error-message': 'Please enter a valid search term',
    'search-competency': 'Search Competency',
    'search-standards': 'Search Standards',
    'select-question-type': 'Select Question Type',
    'select-resource-type': 'Select Resource Type',
    'send-request': 'Send Request',
    share: 'Share',
    'show-correct-answer': 'Show Correct Answer',
    'show-more-results': 'Show More Results',
    'show-results': 'Show Results',
    signUp: 'Sign Up',
    sortAlphabetical: 'Sort Alphabetically',
    sortAverage: 'Sort by Average',
    'sort-most-recently': 'Sort by Most Recently Updated',
    state: 'State or Territory',
    standard: 'Standard',
    standards: 'Standards',
    study: 'Study',
    'study-now': 'Study Now',
    student: 'Student',
    'student-id': 'Student ID (not displayed on Profile)',
    'subject-and-framework': 'Subject and Framework',
    submit: 'Submit',
    'submit-all': 'Submit all',
    'submit-finish': 'Submit and Finish',
    swap: 'Re-order',
    suggestion: 'Suggestion',
    suggestions: 'Suggestions',
    'suggested-resources': 'Suggested Resources',
    support: 'Support',
    'start-tour': 'Take a tour',
    'take-me-there': 'Take me there',
    teach: 'Teach',
    teacher: 'Teacher',
    timeSpent: 'Time Spent',
    'toggle-dropdown': 'Toggle Dropdown',
    tools: 'Tools',
    true: 'True',
    type: 'Type',
    unBookmark: 'Unbookmark',
    unexpectedError:
      'An unexpected error has occurred and has been reported. We\'re sorry for the inconvenience!',
    unfollow: 'Unfollow',
    unit: 'Unit',
    'unit-title': 'Unit Title',
    unitInitial: 'U',
    unitObj: {
      zero: 'Units',
      one: 'Unit',
      other: 'Units'
    },
    'untitled-course': 'Course 1',
    'untitled-lesson': 'Untitled Lesson',
    'untitled-unit': 'Untitled Unit',
    'update-thumbnail': 'Update Thumbnail',
    upload: 'Upload',
    'upload-file': 'Upload File',
    'upload-thumbnail': 'Upload Thumbnail',
    'use-case': 'Use Case',
    'valid-extensions': 'Valid file extensions are: {{extensions}}',
    verified: 'Verified',
    'visibility-tooltip': 'Not visible to others',
    warnings: {
      'on-air-connection-lost':
        'The Go Live dashboard has lost connection and is retrying automatically. It\'s tempting, but please don\'t refresh your screen!',
      'character-limit': 'You\'ve reached the character limit.'
    },
    word: 'Word',
    yes: 'Yes'
  },

  /*
   * CONTROLLERS: Translations used in a specific controller
   */
  index: {
    joinUs: 'Join Us to <br/> Honor the Human Right to <br/> Education',
    browseContent: {
      title: 'Hi there! What are you looking for?',
      description_1: 'I am looking for',
      description_2: 'learning materials in',
      description_3: 'or',
      button: 'Browse Content',
      footer: {
        description_1: 'Already have an account? ',
        description_2: ' here.',
        login: 'Login'
      },
      grades_missing_message: 'Please select Grade and Subject.',
      subjects_missing_message: 'Please select Subject.'
    },
    gettingStarted: {
      title: 'Getting Started with Gooru',
      toolkit: {
        title: 'Getting Started Toolkit',
        description:
          'Welcome to Gooru! Check out these resources to learn what you can do with Gooru and get started quickly.'
      },
      classroom: {
        title: 'Stories from the Classroom',
        description:
          'Learn by example through stories of teachers who say Gooru has made a difference in their classroom.'
      },
      events: {
        title: 'Check Out our Events!',
        description:
          'We offer free webinars and trainings to help you get started with Gooru.'
      }
    },
    empowerStudents: {
      title: 'Empower Students to Learn Their Way',
      find: 'Find',
      remix: 'Remix',
      share: 'Share',
      monitor: 'Monitor'
    },
    findDescription:
      'Browse thousands of K-12 collections made by teachers, or search over 16M resources',
    remixDescription:
      'Remix collections and customize content to meet your students\' needs.',
    shareDescription:
      'Share collections with students through Gooru classrooms. Login is not required to access.',
    monitorDescription:
      'Measure your students\' engagement and progress to intervene in real-time.',
    freeAndOpen: {
      title: 'Free and Open.<br/>Always.',
      description:
        'We believe education is a human right. Gooru will always be free of cost and ads for educators and students worldwide.',
      button: 'Learn More about Our Approach'
    }
  },
  class: {
    info: {
      'class-info': 'Classroom Information',
      teachers: 'Teachers',
      students: 'Students',
      subject: 'Subject',
      grade: 'Grade',
      description: 'Description',
      'edit-info': 'Edit Information',
      'share-class': 'Share Classroom',
      'invite-co-teachers': 'Invite Co-teachers',
      'add-students': 'Add Students',
      'class-code': 'Classroom Code',
      delete: 'Delete Classroom'
    },
    edit: {
      'assigned-course': 'Assigned course',
      'basic-info': 'Basic Information',
      'class-name': 'Classroom Name',
      'class-greetings': 'Classroom Announcements',
      'class-greetings-placeholder':
        'Greet your students, motivate them, or make an announcement, etc.',
      'class-minscore': 'Assessment Minimum Score for Trophies (1-100%)',
      'course-map': 'Course Map',
      'edit-class': 'Edit Classroom Settings'
    },
    overview: {
      title: 'Course Map',
      locate: 'Locate Me',
      'edit-content': 'Edit Content',
      'add-to-daily-class-activities': 'Add to Daily Class Activities'
    },
    analytics: {
      performance: {
        title: 'View Performance',
        'better-experience-message':
          'For a better Gooru experience, view full Classroom Analytics in tablet or desktop.',
        'no-content': 'Your students have not yet started studying a course.',
        actions: {
          share: 'Share',
          edit: 'Edit Content',
          download: 'Download',
          fullScreen: 'View Full Screen',
          exitFullScreen: 'Exit Full Screen',
          assessment: 'View Assessment',
          collection: 'View Collection',
          both: 'View Both'
        },
        teacher: {
          metricsTable: {
            average: 'Average',
            'class-average': 'Class Average'
          }
        },
        'grade-items': 'Items to Grade',
        'gru-grade-items': {
          students: {
            zero: '{{count}} students',
            one: '{{count}} student',
            other: '{{count}} students',
            'not-started': 'not started'
          }
        }
      },
      mastery: {
        title: 'View Mastery'
      }
    },
    'quick-start': {
      title: 'Assign content to this classroom.',
      'new-course': 'Quickstart a New Course',
      'new-course-desc':
        'Start by creating a new course, a collection or an assessment',
      course: 'New Course',
      'new-collection': 'New Collection',
      'new-assessment': 'New Assessment',
      'remix-a-sample': 'Remix a Sample',
      'add-existing-course': 'Add a Course from your Library',
      'existing-course-desc': 'The quickest way to start a classroom',
      'choose-course': 'Choose Course',
      'remix-from-course': 'Remix a Featured Course',
      'featured-course': 'View Featured Courses',
      'remix-desc': 'Copy and customize a featured course for your students'
    }
  },
  classes: {
    classesJoined: 'Classrooms I\'ve Joined',
    classesTaught: 'Classrooms I Teach',
    noClassesJoined: 'You have not joined any classrooms',
    noClassesTaught: 'You do not have any created classrooms'
  },
  content: {
    assessments: {
      edit: {
        'best-practices':
          '<p>An assessment is a set of scored questions which you and your students can use to monitor understanding and performance.</p><p>Use a variety of question types (including several based on the SBAC) in your assessment so students can demonstrate understanding in different ways. We recommend tagging each question to standards, micro-standards, and Webb\'s Depth of Knowledge.</p>'
      }
    },
    classes: {
      create: {
        title: 'Create a Classroom',
        content: 'Where students engage with content.',
        'class-name-input': 'Name your Classroom',
        'condition-prompt': 'How will students join your classroom?',
        'condition-prompt-code': 'Anyone with Classroom code',
        'condition-prompt-invite': 'Invite only',
        'get-started': 'Get Started'
      },
      join: {
        title: 'Join a Classroom',
        content: 'Where the journey begins.',
        'class-code-input': 'Enter a Classroom Code',
        'class-not-found':
          'Classroom not found. Make sure you\'ve entered the correct classroom code',
        'invalid-code': 'Invalid classroom code.',
        'already-member': 'You are already a member of this classroom.',
        'join-class': 'Join Classroom',
        'join-not-allowed': 'You are not able to join this classroom',
        'not-now': 'Not now',
        'terms-and-conditions':
          'By clicking Join Classroom, I agree to share my assessment and collection progress data generated from studying this Gooru classroom with the teacher(s) of this classroom.'
      }
    },
    collections: {
      edit: {
        'assign-to-course': 'Assign to Course',
        'best-practices':
          '<p>Students interact with your content at the collection level. When creating a learning collection, make sure to include learning objectives, and consider using a variety of resource types to expose students to the concepts in multiple ways.</p><p>Use the sequencing of the resources to build on concepts. Progression through a collection should flow in a logical manner and take the intended audience from a general to more complex level of understanding if appropriate, or allow adequately for student exploration.</p><p>Include checks for understanding along the way via our Gooru questions or other interactives. We recommend enough resources and/or enough variety of resources to accomplish the objectives in the collection and ensuring that each resource has a role and purpose.</p>'
      }
    },
    courses: {
      edit: {
        'assign-to-class': 'Assign to Classroom',
        'best-practices':
          '<p>A course is a folder that allows you to organize your learning content into units and lessons. When creating a course consider the essential questions you are addressing, the learning objectives, and organization of your content.</p><p>You can piece the lessons together to create a diverse experience for your student population (for example, you could sequence your units chronologically, by topic, or by standard).</p>',
        information: {
          'course-title': 'Course Title',
          description: 'Description'
        }
      }
    },
    questions: {
      edit: {
        'add-to': 'Add to',
        'best-practices':
          '<p>A question is a resource that requires an answer from the student, and we offer a variety of question types to support the kinds of questions your students will see on SBAC, PARCC and other assessments.</p><p>Consider alternating the kinds of questions you use to offer students exposure to these question types and to provide multiple formats for demonstrating knowledge.</p><p>Tag your questions to standards, micro-standards, and Webb\'s Depth of Knowledge. You can see how your students are interacting with questions through the teacher dashboard.</p>',
        information: {
          'question-title': 'Question Title',
          'question-type': 'Question Type'
        },
        builder: {
          'add-answer-choice': '+ Add Answer Choice',
          'add-hint': 'Add Hints',
          'add-explanation': 'Add Explanation',
          answer: 'Answer',
          'answer-instructions': {
            FIB: 'Add up to 5 hints for answer and an explanation.',
            HS_IMG:
              'You can add up to ten answer images and select one or more correct answers.',
            HS_TXT:
              'You can add up to ten answer choices and select one or more correct answers.',
            HT_HL_ST:
              'As you write the question, use brackets to indicate the highlighted sentences. One bracket can only contain one sentence at a time, using a period inside the bracket. For example, The first little pig built his house of straw. [The big bad wolf blew down the house.] The second pig built his house of wood. Character limit: 5000.',
            HT_HL_WD:
              'As you write the question, use brackets for the highlighted words. One bracket can only contain one word at a time. For example, The [big] bad wolf blew [down] the house. Character limit: 5000.',
            HT_RO:
              'You can add up to ten answer choices in the correct order. The order will be scrambled for students.',
            MA:
              'You can add up to ten answers, an image, an explanation, and up to five hints.',
            MC:
              'You can add up to ten answer choices and indicate one correct answer. Character Limit: 200.',
            OE: 'Write the correct response. Character limit: 5000.',
            'T/F': 'Select the correct answer.'
          },
          'question-instructions': {
            FIB:
              'As you write the question, use brackets for your fill-in-the-blank answers. For example: “The big bad [wolf] blew down the [house].” You can also add an image.',
            HS_TXT: 'Write your question.',
            HS_IMG: 'Write your question.',
            HT_RO: 'Write your question.',
            HT_HL: 'Write your question prompt.',
            MC: 'Write your question.',
            MA: 'Write your question.',
            OE: 'Write your question.',
            'T/F': 'Write your question.'
          },
          'submission-format': {
            title: 'Student Submission Format',
            'answer-type': {
              'text-box': 'Text Box'
            }
          },
          'feedback-grading': {
            title: 'Feedback and Grading',
            'from-existing-rubric': 'From Existing Rubric',
            scoring: 'Scoring',
            'maximum-points': 'Maximum Points',
            increment: 'Increment',
            'rubric-error': 'Please add a Rubric'
          }
        }
      }
    },
    modals: {
      'delete-bookmark': {
        confirmation: 'Do you want to unbookmark this {{type}}?',
        'delete-error':
          'Oops! Unable to unbookmark this {{type}} right now. Please try again shortly.'
      },
      'remove-class-activity': {
        confirmation:
          'Are you sure you want to remove this {{type}} from your Daily Class Activities?',
        'delete-error':
          'Oops! Unable to remove this {{type}} right now. Please try again shortly.'
      },
      'delete-class': {
        legend: 'You\'re about to delete your classroom',
        'student-access': 'Students won\'t be able to access the classroom',
        'student-data-deleted': 'All student data will be deleted'
      },
      'archive-class': {
        title: 'Archive classroom',
        legend: 'You are about to archive your classroom',
        'links-not-accessible': 'All shared links will be inaccessible',
        'students-no-access':
          'Students will not be able to access the classroom',
        'not-add-students':
          'You will not be able to add more students to the class',
        confirmation: 'Are you sure you want to archive?'
      },
      'delete-content': {
        legend: 'You are about to delete',
        'content-legend':
          '<span>{{type}}</span> {{index}} - {{title}} from {{parentName}}',
        'content-legend-header': '{{title}} from {{parentName}}',
        'delete-warning': 'All content in this {{type}} will be deleted',
        'delete-error':
          'Oops! Unable to delete {{type}} right now. Please try again shortly.',
        confirmation:
          'Are you sure you want to continue? Please type “delete” below and click “delete”.'
      },
      'delete-resource': {
        legend: 'Confirm you want to permanently delete <b>{{title}}</b>',
        'delete-warning': 'All content in this {{type}} will be deleted',
        'delete-error':
          'Oops! Unable to delete {{type}} right now. Please try again shortly.',
        confirmation:
          'Are you sure you want to continue? Please click “Permanently Delete”.',
        'first-check': 'This is a permanent delete and cannot be undone',
        'second-check':
          'Copies of this resource, in your collections and any collection by other users in the community, will be deleted'
      },
      'delete-rubric': {
        legend: 'Confirm you want to permanently delete <b>{{title}}</b>',
        'delete-warning': 'All content in this Rubric will be deleted',
        'delete-error':
          'Oops! Unable to delete Rubric right now. Please try again shortly.',
        confirmation:
          'Are you sure you want to continue? Please click “Permanently Delete”.',
        'first-check': 'This is a permanent delete and cannot be undone'
      },
      'remove-content': {
        legend:
          'You are about to remove <b>{{title}}</b> from <b>{{parentName}}</b>',
        'remove-error':
          'Oops! Unable to remove {{type}} right now. Please try again shortly.',
        confirmation:
          'Are you sure you want to continue? Please type “remove” below and click “remove”.'
      },
      'remove-student': {
        title: 'Remove student and delete their data',
        legend:
          'You are about to remove {{studentName}} from this classroom and delete all of their data.',
        'data-inaccessible':
          'All their data will be deleted and not accessible by you or them',
        'classroom-access':
          'They will not have access to the classroom or content',
        'data-lost': 'If they re-join the class, all past data will be lost',
        'remove-error':
          'Oops! Unable to remove this student right now. Please try again shortly.',
        confirmation:
          'Are you sure you want to continue? Please type “delete” below and click “delete”.'
      },
      'quick-remove-content': {
        legend:
          'Confirm you want to remove <b>{{title}}</b> from <b>{{parentName}}</b>.'
      },
      'quick-delete-content': {
        legend:
          'Confirm you want to permanently delete <b>{{title}}</b> from <b>{{parentName}}</b>.',
        delete: 'Permanently Delete'
      }
    },
    resources: {
      edit: {
        'best-practices':
          '<p>Resources are multimedia content in a variety of formats such as videos, interactives, websites, images, Google docs, and more. Get creative and use your own resources or get “resourceful” and search our ample supply in Gooru.</p><p>Use a variety of resource types to engage your students and include narration so you can help guide your students through the resource.</p><p>We recommend tagging each question to standards, micro-standards and 21st century skills. You can see how your students are interacting with resources through the teacher dashboard.</p>',
        'placeholder-message':
          'Add a resource to <span>preview it here.</span>',
        'not-implemented':
          'Resource format preview <span>not implemented yet.</span>',
        information: {
          'im-publisher': 'I\'m the publisher',
          'select-a-license': 'Please select a license'
        }
      }
    }
  },
  user: {
    'active-classrooms': 'Active Classrooms',
    'archived-classrooms': 'Archived Classrooms',
    classrooms: 'Classrooms',
    'create-class': 'Create Classroom',
    hello: 'Hello, {{name}}!',
    'independent-learning': 'Independent Learning',
    'join-class': 'Join Classroom',
    'joined-classes': {
      zero: 'You\'re currently enrolled in {{count}} classrooms',
      one: 'You\'re currently enrolled in 1 classroom',
      other: 'You\'re currently enrolled in {{count}} classrooms'
    },
    'my-current-classes': 'My Current Classes',
    'manage-goals': 'Manage Goals',
    'my-classes': 'My Classes',
    'teaching-classes': {
      zero: 'You\'re currently teaching {{count}} classrooms',
      one: 'You\'re currently teaching 1 classroom',
      other: 'You\'re currently teaching {{count}} classrooms'
    }
  },
  'student-landing': {
    announcement: 'Announcement',
    'browse-featured-courses': 'Browse our featured courses',
    'browse-our': 'Browse our',
    'featured-courses': 'featured courses',
    class: {
      'assigned-course': 'Assigned Course',
      'back-to': 'Back to Classrooms',
      'back-to-independent': 'Back to Independent Learning',
      performance: 'Performance',
      classroom: 'Classroom Information',
      'course-map': 'Course Map',
      unit: 'Unit',
      lesson: 'Lesson',
      'class-activities': 'Daily Class Activities',
      'class-activities-tab': {
        today: 'Today'
      },
      'my-report': 'My Report'
    },
    course: {
      'to-report': 'Usage summary',
      'total-time-spent': 'Total time spent'
    },
    'current-activity': 'Current activity',
    'join-classroom': 'Join your teacher\'s classroom to start learning',
    learn: 'Learn with a Gooru classroom',
    'my-performance': {
      activity: 'Activity',
      activities: {
        study: 'Study'
      },
      assessments: 'Assessments',
      collections: 'Collections',
      filter: 'Filter',
      'primary-text':
        'Choose the things you want to analyze and we will generate a customized performance report.',
      subject: 'Subject',
      title: 'Analyze your performance',
      'time-period': 'Time Period',
      'update-report': 'Update Report'
    },
    'my-study': 'My Study',
    'no-classrooms':
      'You have not yet joined any classrooms. Click on “Join </br> Classroom” to add your teacher’s class. You can also search for </br> a featured course under the Library tab.',
    welcome: 'Welcome to Gooru.'
  },
  'teacher-landing': {
    'latest-announcement': 'Latest Announcement',
    'latest-assessment': 'Latest Assessment',
    'create-classroom': 'Create a classroom, assign contents, invite students',
    class: {
      'back-to': 'Back to Classrooms',
      'back-to-archived': 'Back to Archived Classrooms',
      'class-management': 'Class Management',
      'class-management-tab': {
        actions: 'Actions',
        'assessment-min-score': 'Assessment Minimum Score for Trophies',
        'assigned-course': 'Assigned Course',
        archive: 'Archive',
        'archive-class': 'Archive Class',
        'attend-class-with-code': 'Attend Class With Code',
        'class-information': 'Class Information',
        'class-name': 'Classroom Name',
        'class-code': 'Class Code',
        'click-to-copy-class-code': 'Click to copy class code',
        'course-information': 'Course Information',
        delete: 'Delete',
        'delete-class': 'Delete Class',
        'download-roster': 'Download Roster',
        edit: 'Edit',
        'email-address': 'Email Address',
        'first-name': 'First Name',
        'import-roster': 'Import Roster',
        'last-name': 'Last Name',
        message: 'Message',
        performance: 'Performance',
        students: 'Students',
        'student-name': 'Student Name',
        'student-id': 'Student ID',
        teachers: 'Teachers',
        'view-report': 'View Report'
      },
      'class-activities': 'Daily Class Activities',
      'class-activities-tab': {
        today: 'Today, ',
        'add-activities': 'Add Activities from the ',
        or: ' or '
      },
      'click-to-copy': 'Click to copy class code',
      'course-map': 'Course Map',
      management: 'Roster Management',
      report: 'Report',
      performance: 'Performance',
      'performance-tab': {
        assessments: 'Assessments',
        collections: 'Collections'
      },
      'view-more': 'View more'
    },
    'no-classrooms':
      'You have not yet created any classrooms. Click on “Create Classroom” or search </br> for a featured course under the Library tab.',
    'no-course': 'You have not assigned a course to this </br> classroom yet.',
    teach: 'Teach with a Gooru classroom'
  },
  goals: {
    manage: {
      title: 'My Goals!',
      'add-goal': 'Add Goal',
      'goal-label': 'Goal',
      'start-date-label': 'Start Date',
      'end-date-label': 'End Date',
      'type-label': 'Goal Type',
      'status-label': 'Status',
      not_started: 'Not Started',
      activated: 'Activated',
      completed: 'Completed',
      dropped: 'Dropped',
      'reflection-label': 'Reflection',
      save: 'Save',
      update: 'Update',
      'goals-not-found':
        'You have not set any goals yet. You can add a goal by clicking "Add Goal" button above.'
    },
    create: {
      'error-add-title': 'Please enter the Goal',
      'error-length-title': 'Goal must have max 200 characters',
      'error-add-start-date': 'Please enter the Start Date',
      'error-add-end-date': 'Please enter the End Date',
      'error-greater-end-date':
        'The End Date must be greater than the Start Date',
      'error-add-status': 'Please select the Goal Status',
      'error-length-reflection': 'Reflection must have max 2000 characters',
      'created-success-msg': 'You\'ve created the goal {{goalTitle}}'
    },
    delete: {
      'deleted-success-msg': 'You\'ve deleted the goal'
    },
    update: {
      'updated-success-msg': 'You\'ve updated the goal'
    }
  },

  /*
   * COMPONENTS: Translations used in a specific component
   */
  'gru-add-to': {
    'add-assessment-to-lesson': 'Add from my assessments',
    'add-assessment-to-lesson-lead':
      'Select an assessment to add to this lesson.',
    'add-collection-to-lesson': 'Add from my collections',
    'add-collection-to-lesson-lead':
      'Select a collection to add to this lesson.',
    'add-to-collection': 'Add to collection',
    'add-to-collection-lead':
      'Choose a collection you want to add {{contentTitle}} to',
    'add-to-existing-classroom': 'Add to Existing Classroom',
    'add-to-existing-classroom-lead': 'Choose a classroom you want to add to',
    'add-to-assessment': 'Add to assessment or collection',
    'add-to-assessment-lead':
      'Choose an assessment you want to add {{contentTitle}} to',
    'assessments-info':
      'The assessments listed here <b>do not</b> belong to another lesson or course',
    'collections-info':
      'The collections listed here <b>do not</b> belong to another lesson or course'
  },
  'gru-add-rubric-to-question': {
    title: 'Add from my Rubrics',
    lead: 'Select a rubric to add to this question.',
    'no-rubrics':
      'You have not yet created any rubrics that can be attached to this Free Response Question. You can create rubrics under My Content which can be accessed from your profile.',
    'go-to-content': 'Go to My Content'
  },
  'gru-assessment-confirmation': {
    title: 'You are about to start an assessment...',
    description: 'In this assessment, {{model.title}}',
    'setting-forward': 'You can navigate forward only',
    'setting-forward-backward':
      'You can navigate forward and backwards to answer questions',
    'unlimited-attempts-left': 'You have unlimited attempts',
    'attempts-left': {
      zero: 'You have {{count}} attempts',
      one: 'You have 1 attempt left',
      other: 'You have {{count}} attempts'
    },
    'unlimited-attempts': 'You have unlimited attempts',
    cancel: 'Cancel',
    continue: 'Continue',
    start: 'Start!'
  },
  'gru-submit-confirmation': {
    title: 'Finish this quiz and submit all',
    description:
      'You are about to end this attempt and submit all responses. Any skipped questions will be counted as incorrect.',
    cancel: 'Cancel',
    confirm: 'Finish Quiz',
    'finish-description': 'Click “Finish Quiz” to submit your responses.'
  },
  'gru-quick-course-search': {
    'add-from-course': 'Add from Existing Course',
    'view-featured-courses': 'View Featured Courses',
    assign: 'Assign'
  },
  'gru-share-pop-over': {
    copy: 'Copy',
    'ios-tooltip': 'Hold tap to copy!',
    'multiarch-tooltip': 'Press Ctrl + C to copy!',
    'safari-osx-tooltip': 'Press Cmd + C to copy!',
    'share-course': 'Share your course with link',
    'share-question': 'Share your question with link',
    'share-resource': 'Share your resource with link',
    'share-assessment': 'Share your assessment with link',
    'share-rubric': 'Share your rubric with link',
    'share-collection': 'Share your collection with link'
  },
  'gru-category-panel': {
    teacher: {
      title: 'For Teachers',
      body:
        'Discover standards-aligned content, customize content, and track student progress through data analytics.',
      cta: 'See Stories'
    },
    student: {
      title: 'For Students',
      body:
        'Explore interests, build, and monitor progress through learning materials.',
      cta: 'Enter',
      'text-placeholder': 'Enter Classroom Code'
    },
    district: {
      title: 'For Districts',
      body:
        'Collaborate with Gooru to unleash personalized learning and share a district-vetted curriculum.',
      cta: 'See Our Impact'
    },
    partner: {
      title: 'For Partners',
      body:
        'Collaborate with mission-aligned partners to increase our collective impact on the education ecosystem.',
      cta: 'Learn More'
    }
  },
  'class.gru-class-navigation': {
    active: 'Active:',
    members: 'Members',
    greetings: 'Announcements',
    overview: 'Course Map',
    analytics: 'Data',
    teams: 'Teams',
    information: 'Classroom Information'
  },
  'class.gru-class-statistics': {
    title: 'Class Statistics',
    'on-average': 'On Average',
    performance: 'Performance',
    completion: 'Completion',
    'time-spent': 'Time Spent',
    'no-performance': '--'
  },
  'gru-user-registration': {
    joinTitle: 'Join the Gooru Community!',
    joinDescription:
      'Find, remix, and share the best free K-12 learning resources.',
    googleButton: 'Sign up with Google',
    whyGoogle: 'Why sign up with Google',
    descriptionWhyGoogle:
      'It\'s fast and easy. Use your existing Google account to sign in without a password.',
    or: 'Or',
    noGoogleAccount: 'Don\'t have a Google account?',
    signUpEmail: 'Sign up with your email address',
    haveAccount: 'Already have an account?',
    clickLogIn: 'Click here to log in.'
  },
  'gru-welcome-message': {
    title: 'Welcome to Gooru’s Learning Navigator!',
    'text-temporary-one':
      'As you move throughout the Learning Navigator, we are happy to support your journey. Look for the Take a Tour icon ',
    'text-temporary-two': ' for guided tours on how to use our features.',
    'text-one':
      'As you move throughout the Learning Navigator, we are happy to support your journey in the following ways:',
    'text-two': {
      subtitle: 'Take a Tour',
      text: ': Provides guided tours on how to use our features.'
    },
    'text-three': {
      subtitle: 'Help',
      text: ': At-your-fingertips support for additional questions.'
    },
    'text-four': {
      subtitle: 'New',
      text: ': Identifies new features for you to try out.'
    },
    'text-five':
      'At anytime if you wish you return to your home page, simply click on',
    'dont-show-again': 'Don\'t show again'
  },
  'sign-up': {
    'step-1-title': 'Hello!',
    'step-1-description': 'We’re glad you’ve decided to join us.',
    'step-child-title': 'Not so fast!',
    'step-child-subtitle': 'We cannot complete your registration.',
    'step-child-description-1':
      'Gooru could not create your account due to our ',
    'step-child-age-requirements': 'Terms & Conditions',
    'step-child-description-2': '. Keep learning and see you in a few years!',
    'step-2-title': 'Basic Info',
    'step-2-description': 'You’re not basic, but this info is.',
    'log-in': 'Log In',
    'log-in-description': 'if you already have an account.',
    'google-button': 'Sign Up with Google',
    username: 'Username',
    dateOfBirth: {
      title: 'Birthday',
      day: 'Day',
      month: 'Month',
      months: {
        january: 'January',
        february: 'February',
        march: 'March',
        april: 'April',
        may: 'May',
        june: 'June',
        july: 'July',
        august: 'August',
        september: 'September',
        october: 'October',
        november: 'November',
        december: 'December'
      },
      year: 'Year',
      'error-message': 'Please enter your birth date.'
    },
    email: 'Email',
    password: 'Password',
    rePassword: 'Confirm Password',
    state: 'State or Territory',
    district: 'District or Charter Organization',
    'error-username-taken': 'Aww, this username is taken. Try another.',
    'error-email-taken': 'This email is taken. Try another.',
    'error-role-message': 'Please select a role.',
    'error-country-message': 'Please select your country.',
    'error-state-message': 'Please select your state or territory.',
    'error-district-message':
      'Please select your district/charter from the list or provide it in "Other".'
  },

  'gru-user-sign-up-cancel': {
    title: 'Leave Registration?',
    'exit?': 'Are you sure you want to exit?',
    registration_incomplete: 'Your registration is not complete.',
    leave: 'Leave Registration',
    continue: 'Continue with Registration'
  },

  login: {
    title: 'Welcome Back!',
    description: 'Learning is just around the corner.',
    'title-session-ends': 'Your session expired.',
    'description-session-ends': 'Please sign in.',
    gooruAccountTitle: 'Log in to your Gooru account',
    googleButton: 'Sign in with Google',
    or: 'Or',
    haveAccount: 'Do you have an account?',
    signUpHere: 'Sign Up here!',
    forgotPassword: 'Forgot your password?',
    password: 'Password',
    usernameOrEmail: 'Username or Email',
    'log-in': 'Log In'
  },

  'forgot-password': {
    description: 'It happens to all of us.',
    usernameOrEmail: 'Please enter your email',
    'footer-google-description-1':
      'Try logging in again by pressing <a href=\'/sign-in\'>\'Sign In with Google.\'</a>',
    'footer-description-1':
      'You will receive an email with a link to reset your password.',
    'footer-description-2': 'If you have any questions, please contact ',
    mail: 'support@gooru.org',
    'error-email-not-exists': 'Sorry, we don\'t recognize this email.',
    secondStepTitle: 'Check your email',
    'secondStepDescription-1':
      'We\'ve sent you an email with a link to reset your password.',
    'secondStepDescription-2': 'If you have any questions, please contact'
  },

  'reset-password': {
    'new-password': 'Enter your new password',
    'new-password-confirm': 'Confirm your password',
    title: 'Reset password'
  },

  footer: {
    footerDescription:
      'Gooru is committed to keeping its platform open-source and community created content CC0.',
    company: 'Company',
    community: 'Community',
    legal: 'Legal',
    connect: 'Connect',
    aboutGooru: 'About Gooru',
    careers: 'Careers',
    supportCenter: 'Support Center',
    contactUs: 'Contact Us',
    districts: 'Districts',
    partners: 'Partners',
    coaches: 'Coaches',
    events: 'Events',
    terms: 'Terms',
    privacy: 'Privacy',
    Copyright: 'Copyright'
  },

  'grade-dropdown': {
    placeholder: 'grade(s)',
    prompt: 'Select a grade',
    'pre-k': 'Pre-K',
    elementary: 'Elementary',
    'middle-school': 'Middle School',
    'high-school': 'High School',
    'higher-ed': 'Higher Ed',
    k: 'K',
    first: '1',
    second: '2',
    third: '3',
    fourth: '4',
    fifth: '5',
    sixth: '6',
    seventh: '7',
    eighth: '8',
    ninth: '9',
    tenth: '10',
    eleventh: '11',
    twelfth: '12'
  },

  'standard-dropdown': {
    placeholder: 'Browse by Standard'
  },

  'subject-dropdown': {
    placeholder: 'subject(s)',
    prompt: 'Select a subject'
  },

  'search-filter': {
    courses: 'Courses',
    collections: 'Collections',
    resources: 'Resources',
    assessments: 'Assessments',
    questions: 'Questions',
    rubrics: 'Rubrics',
    'question-types': {
      MC: 'Multiple Choice',
      FIB: 'Fill in the Blank',
      'T/F': 'True / False',
      MA: 'Multiple Answer',
      HS_TXT: 'Multiple Select - Text',
      HS_IMG: 'Multiple Select - Image',
      HT_RO: 'Drag and Drop Order',
      HT_HL: 'Hot Text- Highlight',
      OE: 'Free Response'
    },
    author: {
      placeholder: 'Author'
    }
  },

  resource: {
    video: 'Video',
    webpage: 'Webpage',
    interactive: 'Interactive',
    question: 'Question',
    image: 'Image',
    text: 'Text',
    audio: 'Audio',
    oer: 'OER'
  },

  'search-result': {
    resource: 'Resource',
    resources: 'Resources',
    and: 'and',
    question: 'Question',
    questions: 'Questions',
    'in-this-collection': 'in this collection',
    'search-results-for': 'Search Results for'
  },

  'gru-image-picker': {
    chooseFile: 'Choose a file ...',
    instruction: 'Upload an image from a file on your computer.',
    restriction: 'The image must be a JPG, GIF or PNG file smaller than 5 MB.',
    submit: 'Use Image'
  },
  'gru-fib': {
    instructions:
      'Please type your answer(s) in the blank(s) provided, and click "{{action}}".'
  },

  'gru-hs-image': {
    instructions: 'Please select the correct image(s), and click "{{action}}".'
  },
  'gru-hs-text': {
    instructions: 'Please select the correct answer(s), and click "{{action}}".'
  },
  'gru-hot-text': {
    instructions: 'Please select the correct answer, and click "{{action}}".'
  },
  'gru-login-prompt': {
    title: 'Welcome to Gooru!',
    instructions: 'You need to sign in to complete that action.',
    'existing-user': 'Already have an account?',
    'new-user': 'New here?',
    'not-now': 'Not now',
    'sign-in': 'Sign in'
  },
  'gru-multiple-answer': {
    instructions: 'Please select the correct answer, and click "{{action}}".'
  },
  'gru-multiple-choice': {
    instructions: 'Please select the correct answer, and click "{{action}}".'
  },

  'gru-open-ended': {
    instructions:
      'Please type your answer in the field below, and click the "{{action}}" button to save your response when you\'re done.',
    characterLimit: 'Character Limit'
  },

  'gru-question-viewer': {
    answer: 'Answer',
    question: 'Question'
  },
  'gru-true-false': {
    instructions: 'Please select the correct answer, and click "{{action}}".',
    true: 'True',
    false: 'False'
  },

  'gru-reorder': {
    instructions:
      'Please reorder the answers in correct order, and click "{{action}}".'
  },

  player: {
    'gru-navigation': {
      'view-report': 'View Report'
    },
    'gru-navigator': {
      'see-usage-report': 'See Usage Report'
    },
    'gru-viewer': {
      'not-iframe-url': {
        header_1: 'This resource cannot be viewed within Gooru.',
        header_external_assessment_1:
          'This assessment cannot be viewed within Gooru.',
        header_2: 'Click the button below to open the resource in a new tab.',
        'view-resource': 'View Resource',
        https_external: 'This link cannot be viewed within Gooru.',
        https_new_tab: 'Click the link below to open it in a new tab.',
        footer_1: 'Why am I seeing this blank page?',
        footer_2:
          'Resources added in Gooru come from thousands of different publishers who',
        footer_3:
          'create and share their content. Resources have variety of settings, including',
        footer_4:
          'requirements that take you to another page to view the content.'
      }
    }
  },

  'grading-player': {
    answer: 'Submitted Work',
    'back-to': 'Back',
    'current-response': 'Current Response',
    'full-rubric': 'Full Rubric',
    grading: 'Grading',
    level: 'Level',
    roster: 'Roster',
    rubric: 'Rubric',
    'submitted-time': 'Submitted Time',
    points: 'Points',
    prompt: 'Task Prompt',
    'overall-comment': 'Overall Comment',
    'overall-lead': 'Summarize your feedback on the essay as a whole.',
    'time-spent': 'Time Spent',
    'total-score': 'Total Score',
    'student-roster': {
      title: 'Students List',
      lead: 'Have answered this question'
    },
    'rubric-panel': {
      previous: 'Previous Student',
      next: 'Next Student',
      'total-score': 'Total Score',
      points: '({{total}}pts)'
    }
  },

  profile: {
    'gru-navigation': {
      about: 'About',
      'about-me': 'About Me',
      content: 'Content',
      followers: 'Followers',
      library: 'Library',
      'my-content': 'My Content'
    },
    edit: {
      'select-district': 'Select a district...'
    }
  },

  'gru-data-picker': {
    score: 'Score',
    report: 'Report',
    completion: 'Completion',
    timeSpent: 'Time',
    'time-spent': 'Time Spent',
    'study-time': 'Study Time',
    reaction: 'Reaction',
    attempts: 'Attempt'
  },
  'gru-performance-summary': {
    title: 'Title',
    scores: 'Scores',
    completion: 'Completion',
    'time-spent': 'Total Time',
    reaction: 'Reaction',
    attempts: 'Attempts',
    redo: 'Redo',
    resume: 'Resume',
    study: 'Study Now',
    'view-report': 'View Report',
    'not-applicable': 'N/A',
    'not-started': 'Not started yet'
  },
  'gru-performance': {
    'no-content': 'No content available'
  },
  'gru-performance-metrics': {
    assessment: 'Assessment',
    collection: 'Collection',
    completion: 'Completion',
    report: 'Report',
    student: 'Student',
    score: 'Score',
    'study-time': 'Time Spent'
  },
  'gru-metrics-sub-header': {
    assessment: 'Assessment',
    student: 'Student',
    score: 'Score',
    report: 'Report',
    completion: 'Completion',
    'time-spent': 'Time'
  },
  'gru-resource-new': {
    'resource-already-exist': 'This resource already exists in Gooru!'
  },
  'gru-assessment-report': {
    'gru-summary': {
      'total-time-spent': 'Total Time Spent'
    },
    'hidden-report':
      'Your teacher has selected to hide your summary report for this assessment.'
  },
  cards: {
    'gru-class-card': {
      student: {
        zero: '{{count}} Student',
        one: '{{count}} Student',
        other: '{{count}} Students',
        'not-started': 'Not Started'
      },
      unit: {
        zero: 'No course',
        one: '{{count}} Unit',
        other: '{{count}} Units'
      },
      archived: {
        'request-report':
          'This class is archived and cannot be modified. Existing class data can be accessed via report.',
        'report-in-progress':
          'Report generation can take up to 20 min. Please check back.',
        'download-report': 'Download your data for this class.',
        'no-report-available': 'This class has no assigned course content.'
      }
    },
    'gru-course-card': {
      in: 'in',
      units: {
        zero: '{{count}} Units',
        one: '{{count}} Unit',
        other: '{{count}} Units'
      },
      resource: {
        zero: '{{count}} Resources',
        one: '{{count}} Resource',
        other: '{{count}} Resources'
      },
      and: 'and',
      question: {
        zero: '{{count}} Questions',
        one: '{{count}} Question',
        other: '{{count}} Questions'
      },
      'start-studying': 'Start studying'
    },
    'gru-collection-card': {
      courses: {
        zero: '{{count}} Courses',
        one: '{{count}} Course',
        other: '{{count}} Courses'
      },
      students: {
        zero: '{{count}} Students',
        one: '{{count}} Student',
        other: '{{count}} Students'
      },
      collections: {
        one: '{{count}} Collection',
        other: '{{count}} Collections'
      },
      assessments: {
        one: '{{count}} Assessment',
        other: '{{count}} Assessments'
      },
      classrooms: {
        zero: '{{count}} Classrooms',
        one: '{{count}} Classroom',
        other: '{{count}} Classrooms'
      }
    },
    'gru-resource-card': {
      add: 'Add to'
    },
    'gru-resource-result-card': {
      skipped: 'Skipped'
    },
    'gru-profile-card': {
      followers: 'Followers',
      following: 'Following'
    },
    'gru-user-network-card': {
      follow: 'Follow'
    }
  },
  'reports.gru-table-view': {
    'first-tier-header-prefix': 'Q',
    student: 'Student',
    reaction: 'Reaction',
    reactions: 'Reactions',
    score: 'Score',
    scores: 'Scores',
    'study-time': 'Study Time',
    time: 'Time',
    'time-spent': 'Time Spent',
    totals: 'Total'
  },
  'gru-emotion-picker': {
    'react-to-resource': 'React to this resource'
  },
  home: {
    'no-classes-found': {
      'create-class': {
        title: 'Teach with a Gooru classroom',
        description:
          'Created a classroom, assign content, and invite students.',
        'button-text': 'Create Classroom'
      },
      'join-class': {
        title: 'Learn with a Gooru classroom',
        description: 'Join your teacher’s classroom to start learning.',
        'button-text': 'Enter Classroom Code'
      },
      'featured-courses': {
        title: 'Featured Courses',
        description: 'Browse math, science, social studies, and ELA courses.',
        'button-text': 'Featured Courses'
      },
      'teacher-toolkit': {
        title: 'Teacher Toolkit',
        description: 'This toolkit has resources to help you get started.',
        'button-text': 'Teacher Toolkit'
      }
    }
  },
  taxonomy: {
    'gru-taxonomy-selector': {
      'add-secondary': 'Add secondary',
      'choose-subject': 'Choose Subject',
      'competency-subject-and-course': 'Competencies Framework and Course',
      'primary-subject-and-course': 'Standards Framework and Course'
    }
  },
  validations: {
    unsavedChanges:
      'Your changes haven\'t been saved yet. Would you like to leave this page?'
  },
  featured: {
    'featured-title': 'Featured Courses',
    'featured-description':
      'Gooru’s featured courses are vetted and reviewed, educator-curated, created in classrooms, and studied by students. They were developed and implemented at innovative schools, districts, and charters, and are designed to support blended learning, flipped classrooms, project-based learning, and many other instructional models. Discover, remix, and customize courses to personalize learning and increase student engagement! Click here to  <a href=\'http://about.gooru.org/courses\' target=\'_blank\'>learn more</a> about the development of these courses.'
  },

  'taxonomy.modals': {
    'gru-domain-picker': {
      browseSelectorText: 'What domains will this unit cover?',
      selectedText: {
        zero: '{{count}} domains selected',
        one: '{{count}} domain selected',
        other: '{{count}} domains selected'
      },
      shortcutText: 'Course is in'
    },
    'gru-standard-picker': {
      browseSelectorText: 'What standards will be covered?',
      browseCompetencySelectorText: 'What competencies will be covered?',
      selectedText: {
        zero: '{{count}} standards selected',
        one: '{{count}} standard selected',
        other: '{{count}} standards selected'
      },
      selectedCompetencyText: {
        zero: '{{count}} competencies selected',
        one: '{{count}} competency selected',
        other: '{{count}} competencies selected'
      },
      shortcutText: 'Unit is tagged to'
    }
  },

  'account-settings': {
    title: 'Account Settings',
    'account-info': 'Account Info',
    'private-info': 'Private Info',
    'email-address': 'Email Address',
    gender: 'Gender',
    birthday: 'Birthday'
  },

  'gru-rich-text-editor': {
    bold: 'Bold',
    expression: 'Expression',
    italic: 'Italic',
    subscript: 'Subscript',
    superscript: 'Superscript',
    underline: 'Underline',
    'expressions-panel': {
      tabs: {
        calculus: 'Calculus',
        'greek-letters': 'Greek Letters',
        layout: 'Layout',
        relation: 'Relation',
        'set-theory': 'Set Theory',
        symbols: 'Symbols',
        trigonometry: 'Trigonometry'
      },
      'insert-expression': 'Insert',
      'update-expression': 'Update',
      'create-expression': 'Create Expression'
    }
  },

  'gru-settings-edit': {
    'answerkey-attempts': 'Answer Key and Attempts',
    'answer-key': 'Students can see the answer key at the end',
    attempts: 'Attempts',
    'attempts-unlimited': 'Unlimited',
    backwards: 'Students can navigate backwards and change responses',
    feedback: 'Students see if they are correct/incorrect',
    'feedback-immediate': 'Per question & at the end',
    'feedback-never': 'Never',
    'feedback-summary': 'At the end',
    'navigation-scoring': 'Navigation and Scoring',
    'disable-heading': 'Activate Assessment in Course Map',
    'disable-legend': 'Students can play the assessment from their course map'
  },
  'gru-icon-popover': {
    'settings-visibility-title': 'Make Your Content Visible',
    'settings-visibility-content':
      'This setting makes your content visible via your user profile. If you wish to share the courses, collections, assessments, resources, and/or questions you create with colleagues, we suggest you turn this feature on.'
  },
  'gru-take-tour': {
    text: 'Take a Tour',
    'teacher-home': {
      stepOne: {
        title: 'Take a Tour',
        description:
          'Welcome to Take a Tour and your homepage! Now let’s get started!'
      },
      stepTwo: {
        title: 'Gooru Logo',
        description:
          'Clicking on the Gooru logo at any time during your session returns you to your homepage.'
      },
      stepThree: {
        title: 'Search Bar',
        description:
          'Search our content catalog for topics that interest to you.'
      },
      stepFour: {
        title: 'Classrooms',
        description: 'Return to your homepage.'
      },
      stepFive: {
        title: 'Tools',
        description: 'Quick link to create and access your content.'
      },
      stepSix: {
        title: 'Library',
        description: 'Browse our featured courses.'
      },
      stepSeven: {
        title: 'Your Profile',
        description:
          'Access and update your content, user profile, and settings.'
      },
      stepEight: {
        title: 'Support',
        description: 'Access the support center or logout.'
      },
      stepNine: {
        title: 'Classrooms',
        description: 'View a list of classes you are currently teaching.'
      },
      stepTen: {
        title: 'Archived Classes',
        description: 'View a list of classes you taught in the past.'
      },
      stepEleven: {
        title: 'Create Classroom',
        description:
          'Click the button to create a new classroom for your course, collection, or assessment.'
      }
    },
    'student-home': {
      stepOne: {
        title: 'Take a Tour',
        description:
          'Welcome to Take a Tour and your Gooru homepage! Now let’s get started!'
      },
      stepTwo: {
        title: 'Gooru Logo',
        description:
          'Clicking on the Gooru logo at any time during your session returns you to your homepage.'
      },
      stepThree: {
        title: 'Search Bar',
        description:
          'Search our content catalog for topics that interest to you.'
      },
      stepFour: {
        title: 'My Study',
        description: 'Return to your homepage.'
      },
      stepFive: {
        title: 'Library',
        description: 'Browse our featured courses.'
      },
      stepSix: {
        title: 'Performance',
        description:
          'See a summary of your performance in the courses you are enrolled in.'
      },
      stepSeven: {
        title: 'Your Profile',
        description: 'Access and update your user profile and settings.'
      },
      stepEight: {
        title: 'Support',
        description: 'Access the support center or logout.'
      },
      stepNine: {
        title: 'Announcements',
        description:
          'Here you will see announcements that your teacher or school would like you to know about.'
      },
      stepTen: {
        title: 'Classrooms',
        description: 'See all of the classes in which you are enrolled.'
      },
      stepEleven: {
        title: 'Independent Learning',
        description:
          'Explore and bookmark topics that interest you and that you want learn more about. To start exploring click, on the plus sign to search for a topic or view featured courses.'
      },
      stepTwelve: {
        title: 'Join Classroom',
        description: 'To join a new classroom, enter the class code.'
      },
      stepThirteen: {
        title: 'Finished!',
        description:
          'Now go ahead and click on a course you have enrolled in, join a classroom, or search for content that is of interest to you.'
      }
    },
    'student-performance': {
      stepOne: {
        title: 'Welcome!',
        description:
          'Welcome to your Performance Dashboard. You can view how you are performing in all classes and courses.'
      },
      stepTwo: {
        title: 'Filter Tab',
        description:
          'Click on the arrow to filter your performance by activity, time period, subject, and course. '
      },
      stepThree: {
        title: 'Update Report',
        description:
          'Once you have selected your filters, click on update report to display results.'
      },
      stepFour: {
        title: 'Download/Print',
        description: 'Download your report.'
      },
      stepFive: {
        title: 'Finished!',
        description: 'Go ahead and analyze your performance!'
      }
    },
    'student-class': {
      stepOne: {
        title: 'Welcome!',
        description:
          'Welcome to your classroom. Here you will find your daily class activities, course map, and performance data. Let’s get started!'
      },
      stepTwo: {
        title: 'Daily Class Activities',
        description:
          'Access a list of activities assigned by your teacher. Select the activities you want to study.'
      },
      stepThree: {
        title: 'Course Map',
        description:
          'Click on the units and lessons to complete the collections and assessments in the course.'
      },
      stepFour: {
        title: 'My Report',
        description: 'Take a look at your overall class performance. '
      },
      stepFive: {
        title: 'Finished!',
        description:
          'Get started by clicking on the Course Map or Daily Activities tab to start studying.'
      }
    },
    'teacher-class': {
      stepOne: {
        title: 'Welcome!',
        description:
          'Welcome to your classroom. Here you will find your daily class activities, course map, and performance data. Let’s get started!'
      },
      stepTwo: {
        title: 'Daily Class Activities',
        description:
          'Assign collections or assessments to your students. If you want to use our live assessment feature, you must also place those assessments here.'
      },
      stepThree: {
        title: 'Course Map',
        description:
          'Click on the units and lessons to complete the collections and assessments in the course.'
      },
      stepFour: {
        title: 'My Report',
        description: 'Take a look at your overall class performance. '
      },
      stepFive: {
        title: 'Finished!',
        description:
          'Get started by clicking on the Course Map or Daily Activities tab to start studying.'
      }
    },
    'study-player': {
      stepOne: {
        title: 'Welcome!',
        description:
          'This is your study player. Let’s walk through the features available to you.'
      },
      stepTwo: {
        title: 'Unit, Course and Lesson',
        description:
          'This indicates where the collection or assessment is located in your course.'
      },
      stepThree: {
        title: 'Performance',
        description:
          'This indicates how you are performing and how much of the course you have completed.'
      },
      stepFour: {
        title: 'React to Resource',
        description: 'Let your teacher know what you think about this resource.'
      },
      stepFive: {
        title: 'Course Map',
        description:
          'Return to your Course Map to see additional course content.'
      },
      stepSix: {
        title: 'Suggestions',
        description:
          'These are resources that you might want to explore based on what you are currently studying.'
      },
      stepSeven: {
        title: 'Check out these resources',
        description: ''
      },
      stepEight: {
        title: 'Finished!',
        description: 'Start studying!'
      }
    },
    library: {
      stepOne: {
        title: 'Welcome!',
        description: 'Welcome to Libraries in the Learning Navigator.'
      },
      stepTwo: {
        title: 'Featured Courses',
        description:
          'Explore courses developed and implemented in classrooms by educators.'
      },
      stepThree: {
        title: 'Other Libraries',
        description: 'Explore content developed by Gooru’s partners.'
      },
      stepFour: {
        title: 'Preview',
        description: 'Preview the course to see if it is of interest to you.'
      },
      stepFive: {
        title: 'Share',
        description: 'Share this course with others.'
      },
      stepSix: {
        title: 'Bookmark',
        description: 'Bookmark this course to review it later.'
      }
    },
    profile: {
      stepOne: {
        title: 'Welcome!',
        description:
          'Welcome to your Profile. Here you can access your content and personal information.'
      },
      stepTwo: {
        title: 'My Content',
        description: 'Review the content you have remixed and created.'
      },
      stepThree: {
        title: 'About Me',
        description:
          'Update your personal information, school information, your profile picture, email, and password.'
      },
      stepFour: {
        title: 'Goals',
        description:
          'Set and track goals to help you achieve your learning milestones.'
      },
      stepFive: {
        title: 'Followers',
        description:
          'If you like someone’s content, you can follow them. You can also view who is following you.'
      },
      stepSix: {
        title: 'Badges',
        description:
          'Review the badges you have received. You receive a badge if you complete a benchmark assessment assigned by your teacher.'
      }
    }
  },
  'gru-tour': {
    'assessments-settings': {
      stepOne: {
        title: 'Navigation and Scoring',
        description:
          'This setting determines how students can move through an assessment and shows whether their answers are correct or incorrect. It does not show them an answer key.'
      },
      stepTwo: {
        title: 'Answer Key and Number of Attempts',
        description:
          'This setting allows an answer key to be revealed and sets the number of attempts students have on the assessment.'
      }
    },
    overview: {
      stepOne: {
        title: 'Course Map',
        description:
          'The course map provides your students access to all assessments and collections you assign to them.'
      },
      stepTwo: {
        title: 'Class Code',
        description:
          'Each classroom you create has a unique class code. You will give this code to students when you are ready for them to join your classroom and access your content.'
      },
      stepThree: {
        title: 'Monitor Student and Class Data',
        description:
          'This allows you to see class and individual student assessment data when students complete assessments that are part of a course.'
      },
      stepFour: {
        title: 'Classroom Information',
        description:
          'Here you can edit your classroom name, post announcements for your students, see the names of students enrolled in your class, and delete your classroom.'
      },
      stepFive: {
        title: 'Editing Your Course Content',
        description:
          'When you are in a classroom, click here to edit any of the course content assigned to your students.'
      },
      stepSix: {
        title: 'Monitor Progress in Real-time!',
        description:
          'Use the real-time dashboard to monitor class progress on an assessment in real-time.<br><br>Click on the "Go Live" icon found to the left of every assessment to launch a real-time assessment for students. <br><br><i class="real-time-icon">'
      }
    },
    'quick-start': {
      stepOne: {
        title: 'Navigating Your Classrooms',
        description:
          'This is a view of a newly created classroom. To get back to a classroom at any time, click on "Classrooms" and use the drop down menu to select the classroom you wish to enter.'
      },
      stepTwo: {
        title: 'Getting Started? Create an Assessment!',
        description:
          'We suggest creating an assessment as a way to get started with Gooru and to assess current levels of student understanding in your class.'
      }
    },
    'real-time': {
      stepOne: {
        title: 'Breakdown of Responses',
        description:
          'Click on each question to see a breakdown of how students answered.'
      },
      stepTwo: {
        title: 'Individual Student Data',
        description:
          'Select each student tile to see individual student data reports.'
      },
      stepThree: {
        title: 'Select a View',
        description:
          'Select "title view" or "list view" to see options for displaying data.'
      },
      stepFour: {
        title: 'Average Score',
        description:
          'See the class average calculated in real-time for all responses.'
      },
      stepFive: {
        title: 'Project Anonymous Data',
        description:
          'Use this option to project an anonymous view of student data.'
      }
    }
  },
  'gru-course-play': {
    'hide-unit-details': 'Hide Unit Metadata',
    'view-unit-details': 'View Unit Metadata',
    performance: 'Performance'
  },
  'gru-century-skills': {
    legends: {
      hewlett: 'Hewlett Deeper Learning Model',
      conley: 'Conley Four Keys',
      framework: 'P21 Framework',
      national: 'National Research Center for Life and Work'
    },
    content: {
      groups: {
        cognitive: 'Key Cognitive Skills and Strategies',
        content: 'Key Content Knowledge',
        learning: 'Key Learning Skills and Techniques'
      }
    }
  },
  'gru-rubric-edit': {
    'upload-rubric': 'Upload Rubric',
    copy: {
      'success-message':
        'You\'ve copied rubric {{title}}. Do you want to edit that Rubric?'
    }
  },
  'gru-rubric-creation': {
    url: 'URL',
    'upload-file': 'Upload File',
    'add-category': 'Add New Category',
    'gru-preview-url': {
      preview: 'Add rubric above and preview here'
    },
    'overall-narrative': 'Overall Narrative Feedback',
    'feedback-guidance': 'Feedback Guidance',
    'required-feedback': 'Require Feedback',
    'feedback-guidance-placeholder':
      'Summarize your feedback on the essay as a whole.',
    'gru-category': {
      'category-title': 'Category Title',
      'category-feedback':
        'ex. As you are reviewing this category, pay careful attention to the author’s purpose.',
      'gru-scoring-levels': {
        '0': 'ex. Exceeding Proficiency',
        '1': 'ex. Meeting Proficiency',
        '2': 'ex. Approaching Proficiency',
        '3': 'ex. Beginning Proficiency',
        '4': 'ex. No Evidence of Proficiency',
        best: 'Best',
        levels: 'Level',
        'new-level': 'Add New Level',
        scoring: 'Scoring',
        worst: 'Worst',
        error: 'Please enter the values for the levels'
      }
    }
  },
  library: {
    'browse-library': 'Browse Library',
    'featured-courses': 'Featured Courses',
    'gru-library-card': {
      'featured-course': 'Featured Course'
    },
    'gru-partner-library-card': {
      course: {
        zero: '{{count}} Course',
        one: '{{count}} Course',
        other: '{{count}} Courses'
      },
      collection: {
        zero: '{{count}} Collection',
        one: '{{count}} Collection',
        other: '{{count}} Collections'
      },
      assessment: {
        zero: '{{count}} Assessment',
        one: '{{count}} Assessment',
        other: '{{count}} Assessments'
      },
      resource: {
        zero: '{{count}} Resource',
        one: '{{count}} Resource',
        other: '{{count}} Resources'
      },
      question: {
        zero: '{{count}} Question',
        one: '{{count}} Question',
        other: '{{count}} Questions'
      },
      rubric: {
        zero: '{{count}} Rubric',
        one: '{{count}} Rubric',
        other: '{{count}} Rubrics'
      }
    },
    'partner-libraries': 'Partner Libraries'
  },
  'gru-study-header': {
    'lesson-legend': 'You are currently on lesson',
    'resource-legend': 'You are checking this resource.',
    'resources-collection-report': 'Collection usage report',
    'resources-assessment-report': 'Assessment summary report',
    'check-summary': 'Check your summary report',
    'check-usage': 'Check your usage report',
    resource: {
      zero: 'Resource',
      one: 'Resource',
      other: 'Resources'
    },
    question: {
      zero: 'Question',
      one: 'Question',
      other: 'Questions'
    },
    'suggestions-legend': 'To learn more, check out these resources.'
  },
  'gru-suggest-test': {
    'pre-test-header': 'Pre-Test (Optional)',
    'post-test-header': 'Post-Test (Optional)',
    'backfill-header': 'Suggested Collection (Optional)',
    'benchmark-header': 'Benchmark-Test (Optional)',
    'resource-header': 'Suggested Resource (Optional)',
    'pre-test-lead':
      'A pre-test is suggested to measure your current understanding of the concepts in this lesson. The pre-test can help prepare you for the content in the lesson. The pre-test will not affect your course performance score.',
    'post-test-lead':
      'The following post-test is suggested to measure your understanding of the information presented. The post-test will not affect your course performance score.',
    'backfill-lead':
      'Based on the responses from your pre-test, it may be helpful to review additional material before beginning the lesson. Reviewing supporting material can help prepare students for learning new material.',
    'benchmark-lead':
      'You’re now ready to demonstrate your understanding by taking a benchmark assessment. You will earn a badge for successfully completing the benchmark. The benchmark will not affect your course performance score.',
    'resource-lead':
      'Based on your performance on this course, the following resource may enhance your understanding.',
    no: 'No, thanks',
    'no-suggestions': 'Here\'s a summary of your performance.',
    take: 'Take {{type}}',
    'take-backfill-pretest': 'Study Suggested Collection',
    'take-resource': 'Study Resource',
    'end-of-course': 'You have reached the end of the course.'
  },

  'student-open-ended-summary': {
    'overall-comment': 'Overall Comment',
    'overall-score': 'Overall score',
    prompt: 'Question Prompt'
  }
});
