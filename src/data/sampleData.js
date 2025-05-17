// Sample data for the application

// Sample job applicants data
export const sampleJobApplicants = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "555-123-4567",
    jobId: 1,
    jobTitle: "Frontend Developer",
    status: "pending",
    appliedDate: "2023-12-15T10:30:00Z",
    resumeFileName: "john_smith_resume.pdf",
    coverLetter: "I am excited to apply for the Frontend Developer position. With 5 years of experience in React and modern JavaScript frameworks, I believe I would be a great fit for your team."
  },
  {
    id: 2,
    name: "Emily Johnson",
    email: "emily.johnson@example.com",
    phone: "555-234-5678",
    jobId: 1,
    jobTitle: "Frontend Developer",
    status: "approved",
    appliedDate: "2023-12-14T09:15:00Z",
    approvedDate: "2023-12-16T14:20:00Z",
    resumeFileName: "emily_johnson_resume.pdf",
    coverLetter: "As a passionate frontend developer with expertise in React, I am eager to contribute to your innovative projects."
  },
  {
    id: 3,
    name: "Michael Brown",
    email: "michael.brown@example.com",
    phone: "555-345-6789",
    jobId: 2,
    jobTitle: "Backend Developer",
    status: "pending",
    appliedDate: "2023-12-16T11:45:00Z",
    resumeFileName: "michael_brown_resume.pdf",
    coverLetter: "I am interested in the Backend Developer position. With my strong background in Node.js and database management, I can help optimize your server-side operations."
  },
  {
    id: 4,
    name: "Sarah Wilson",
    email: "sarah.wilson@example.com",
    phone: "555-456-7890",
    jobId: 3,
    jobTitle: "UX Designer",
    status: "rejected",
    appliedDate: "2023-12-13T13:20:00Z",
    rejectedDate: "2023-12-15T16:30:00Z",
    resumeFileName: "sarah_wilson_resume.pdf",
    coverLetter: "I am applying for the UX Designer position. My portfolio demonstrates my ability to create intuitive and engaging user experiences."
  },
  {
    id: 5,
    name: "David Lee",
    email: "david.lee@example.com",
    phone: "555-567-8901",
    jobId: 2,
    jobTitle: "Backend Developer",
    status: "pending",
    appliedDate: "2023-12-17T10:00:00Z",
    resumeFileName: "david_lee_resume.pdf",
    coverLetter: "I am excited about the opportunity to work as a Backend Developer at your company. My experience with microservices architecture would be valuable to your team."
  },
  {
    id: 6,
    name: "Jessica Martinez",
    email: "jessica.martinez@example.com",
    phone: "555-678-9012",
    jobId: 4,
    jobTitle: "Full Stack Developer",
    status: "pending",
    appliedDate: "2023-12-18T09:30:00Z",
    resumeFileName: "jessica_martinez_resume.pdf",
    coverLetter: "As a Full Stack Developer with experience in both frontend and backend technologies, I can contribute to all aspects of your development process."
  },
  {
    id: 7,
    name: "Robert Taylor",
    email: "robert.taylor@example.com",
    phone: "555-789-0123",
    jobId: 3,
    jobTitle: "UX Designer",
    status: "approved",
    appliedDate: "2023-12-14T14:15:00Z",
    approvedDate: "2023-12-17T11:10:00Z",
    resumeFileName: "robert_taylor_resume.pdf",
    coverLetter: "I am passionate about creating user-centered designs that enhance the overall user experience. I would love to bring my skills to your team."
  },
  {
    id: 8,
    name: "Amanda Garcia",
    email: "amanda.garcia@example.com",
    phone: "555-890-1234",
    jobId: 4,
    jobTitle: "Full Stack Developer",
    status: "pending",
    appliedDate: "2023-12-19T08:45:00Z",
    resumeFileName: "amanda_garcia_resume.pdf",
    coverLetter: "With my comprehensive knowledge of both frontend and backend technologies, I am well-equipped to take on the Full Stack Developer role at your company."
  }
];

// Sample timesheet data
export const sampleTimesheets = [
  {
    id: 1,
    userId: "user123",
    userName: "John Smith",
    userEmail: "student@re.com",
    jobId: 1,
    jobTitle: "Frontend Developer",
    weekStartDate: "2023-12-11",
    weekEndDate: "2023-12-17",
    totalHours: 40,
    status: "approved",
    submittedDate: "2023-12-18T09:00:00Z",
    approvedDate: "2023-12-19T14:00:00Z",
    entries: [
      { day: "Monday", hours: "08:00", task: "Development", description: "Implemented new features" },
      { day: "Tuesday", hours: "08:00", task: "Development", description: "Fixed bugs" },
      { day: "Wednesday", hours: "08:00", task: "Testing", description: "Unit testing" },
      { day: "Thursday", hours: "08:00", task: "Development", description: "Code review" },
      { day: "Friday", hours: "08:00", task: "Documentation", description: "Updated documentation" }
    ]
  },
  {
    id: 2,
    userId: "user456",
    userName: "Emily Johnson",
    userEmail: "student@re.com",
    jobId: 1,
    jobTitle: "Frontend Developer",
    weekStartDate: "2023-12-18",
    weekEndDate: "2023-12-24",
    totalHours: 35,
    status: "approved",
    submittedDate: "2023-12-25T10:15:00Z",
    approvedDate: "2023-12-26T14:30:00Z",
    entries: [
      { day: "Monday", hours: "07:00", task: "Development", description: "Component development" },
      { day: "Tuesday", hours: "07:00", task: "Development", description: "Integration" },
      { day: "Wednesday", hours: "07:00", task: "Testing", description: "Integration testing" },
      { day: "Thursday", hours: "07:00", task: "Development", description: "Bug fixes" },
      { day: "Friday", hours: "07:00", task: "Meeting", description: "Sprint planning" }
    ]
  },
  {
    id: 3,
    userId: "user789",
    userName: "Michael Brown",
    userEmail: "student@re.com",
    jobId: 2,
    jobTitle: "Backend Developer",
    weekStartDate: "2023-12-11",
    weekEndDate: "2023-12-17",
    totalHours: 38,
    status: "pending",
    submittedDate: "2023-12-18T11:30:00Z",
    entries: [
      { day: "Monday", hours: "08:00", task: "Development", description: "API development" },
      { day: "Tuesday", hours: "08:00", task: "Development", description: "Database optimization" },
      { day: "Wednesday", hours: "08:00", task: "Testing", description: "API testing" },
      { day: "Thursday", hours: "07:00", task: "Development", description: "Code refactoring" },
      { day: "Friday", hours: "07:00", task: "Documentation", description: "API documentation" }
    ]
  }
];

// Sample employer jobs data
export const sampleEmployerJobs = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "Tech Innovations Inc.",
    location: "San Francisco, CA",
    employerEmail: "employer@re.com",
    description: "We are looking for a skilled Frontend Developer to join our team.",
    requirements: "3+ years of experience with React, JavaScript, and modern frontend frameworks.",
    salary: "$90,000 - $120,000",
    postedDate: "2023-12-10T08:00:00Z",
    status: "active",
    applicants: 12
  },
  {
    id: 2,
    title: "Backend Developer",
    company: "Tech Innovations Inc.",
    location: "San Francisco, CA",
    employerEmail: "employer@re.com",
    description: "Seeking an experienced Backend Developer to build robust server-side applications.",
    requirements: "Experience with Node.js, Express, and database management systems.",
    salary: "$95,000 - $125,000",
    postedDate: "2023-12-11T09:30:00Z",
    status: "active",
    applicants: 8
  },
  {
    id: 3,
    title: "UX Designer",
    company: "Tech Innovations Inc.",
    location: "Remote",
    employerEmail: "employer@re.com",
    description: "Join our design team to create intuitive and engaging user experiences.",
    requirements: "Portfolio demonstrating UX design skills and experience with design tools.",
    salary: "$85,000 - $110,000",
    postedDate: "2023-12-12T10:15:00Z",
    status: "active",
    applicants: 15
  },
  {
    id: 4,
    title: "Full Stack Developer",
    company: "Tech Innovations Inc.",
    location: "New York, NY",
    employerEmail: "employer@re.com",
    description: "Looking for a versatile Full Stack Developer to work on all aspects of our web applications.",
    requirements: "Experience with both frontend and backend technologies, including React and Node.js.",
    salary: "$100,000 - $130,000",
    postedDate: "2023-12-13T11:45:00Z",
    status: "active",
    applicants: 10
  },
  {
    id: 5,
    title: "DevOps Engineer",
    company: "Tech Innovations Inc.",
    location: "Seattle, WA",
    employerEmail: "employer@re.com",
    description: "Seeking a DevOps Engineer to streamline our development and deployment processes.",
    requirements: "Experience with CI/CD pipelines, Docker, Kubernetes, and cloud platforms.",
    salary: "$105,000 - $135,000",
    postedDate: "2023-12-14T13:00:00Z",
    status: "active",
    applicants: 0
  }
];

// Sample job applications data
export const sampleJobApplications = [
  {
    id: 1,
    jobId: 1,
    jobTitle: "Frontend Developer",
    companyName: "Tech Innovations Inc.",
    userEmail: "student@re.com",
    status: "approved",
    appliedDate: "2023-12-15T10:30:00Z",
    approvedDate: "2023-12-16T14:20:00Z",
    approved: true
  },
  {
    id: 2,
    jobId: 2,
    jobTitle: "Backend Developer",
    companyName: "Tech Innovations Inc.",
    userEmail: "student@re.com",
    status: "approved",
    appliedDate: "2023-12-16T11:45:00Z",
    approvedDate: "2023-12-17T11:10:00Z",
    approved: true
  },
  {
    id: 3,
    jobId: 3,
    jobTitle: "UX Designer",
    companyName: "Tech Innovations Inc.",
    userEmail: "student@re.com",
    status: "pending",
    appliedDate: "2023-12-18T09:30:00Z"
  }
];

// Sample notifications
export const sampleAlerts = [
  {
    id: 1001,
    timestamp: "2023-12-16T14:25:00Z",
    read: false,
    type: 'job-offer',
    title: 'Job Application Approved',
    message: 'Congratulations! Your application for Frontend Developer at Tech Innovations Inc. has been approved.',
    jobId: 1
  },
  {
    id: 1002,
    timestamp: "2023-12-17T11:15:00Z",
    read: false,
    type: 'job-offer',
    title: 'Job Application Approved',
    message: 'Congratulations! Your application for Backend Developer at Tech Innovations Inc. has been approved.',
    jobId: 2
  },
  {
    id: 1003,
    timestamp: "2023-12-19T14:05:00Z",
    read: false,
    type: 'timesheet-approved',
    title: 'Timesheet Approved',
    message: 'Your timesheet for 12/11/2023 - 12/17/2023 has been approved.',
    timesheetId: 1
  },
  {
    id: 1004,
    timestamp: "2023-12-26T14:35:00Z",
    read: false,
    type: 'timesheet-approved',
    title: 'Timesheet Approved',
    message: 'Your timesheet for 12/18/2023 - 12/24/2023 has been approved.',
    timesheetId: 2
  },
  {
    id: 1005,
    timestamp: "2023-12-20T10:00:00Z",
    read: false,
    type: 'paycheck-generated',
    title: 'Paycheck Generated',
    message: 'A paycheck for $1000.00 has been generated for your approved timesheet.',
    paycheckId: 101
  },
  {
    id: 1006,
    timestamp: "2023-12-27T11:00:00Z",
    read: false,
    type: 'paycheck-generated',
    title: 'Paycheck Generated',
    message: 'A paycheck for $875.00 has been generated for your approved timesheet.',
    paycheckId: 102
  }
];

export const sampleEmails = [
  {
    id: 2001,
    timestamp: "2023-12-16T14:25:00Z",
    read: false,
    type: 'job-offer',
    subject: 'Job Application Approved: Frontend Developer',
    from: 'Tech Innovations Inc. <hr@techinnovationsinc.com>',
    message: 'Congratulations! Your application for the Frontend Developer position at Tech Innovations Inc. has been approved. You can now submit timesheets for this position.',
    jobId: 1
  },
  {
    id: 2002,
    timestamp: "2023-12-17T11:15:00Z",
    read: false,
    type: 'job-offer',
    subject: 'Job Application Approved: Backend Developer',
    from: 'Tech Innovations Inc. <hr@techinnovationsinc.com>',
    message: 'Congratulations! Your application for the Backend Developer position at Tech Innovations Inc. has been approved. You can now submit timesheets for this position.',
    jobId: 2
  },
  {
    id: 2003,
    timestamp: "2023-12-19T14:05:00Z",
    read: false,
    type: 'timesheet-approved',
    subject: 'Timesheet Approved: 12/11/2023 - 12/17/2023',
    from: 'Timesheet System <timesheet@company.com>',
    message: 'Your timesheet for 12/11/2023 - 12/17/2023 has been approved. Payment will be processed according to the regular payment schedule.',
    timesheetId: 1
  },
  {
    id: 2004,
    timestamp: "2023-12-26T14:35:00Z",
    read: false,
    type: 'timesheet-approved',
    subject: 'Timesheet Approved: 12/18/2023 - 12/24/2023',
    from: 'Timesheet System <timesheet@company.com>',
    message: 'Your timesheet for 12/18/2023 - 12/24/2023 has been approved. Payment will be processed according to the regular payment schedule.',
    timesheetId: 2
  },
  {
    id: 2005,
    timestamp: "2023-12-20T10:00:00Z",
    read: false,
    type: 'paycheck-generated',
    subject: 'Paycheck Generated: $1000.00',
    from: 'Payroll System <payroll@company.com>',
    message: 'A paycheck for $1000.00 has been generated for your approved timesheet for the period 12/11/2023 - 12/17/2023. You can view and download your paycheck from your profile.',
    paycheckId: 101
  },
  {
    id: 2006,
    timestamp: "2023-12-27T11:00:00Z",
    read: false,
    type: 'paycheck-generated',
    subject: 'Paycheck Generated: $875.00',
    from: 'Payroll System <payroll@company.com>',
    message: 'A paycheck for $875.00 has been generated for your approved timesheet for the period 12/18/2023 - 12/24/2023. You can view and download your paycheck from your profile.',
    paycheckId: 102
  }
];

// Sample paychecks
export const samplePaychecks = [
  {
    id: 101,
    timesheetId: 1,
    userId: "student@re.com",
    jobId: 1,
    period: "Dec 11, 2023 - Dec 17, 2023",
    amount: "$1000.00",
    status: "Paid",
    date: "2023-12-20",
    jobTitle: "Frontend Developer",
    weekEnding: "2023-12-17"
  },
  {
    id: 102,
    timesheetId: 2,
    userId: "student@re.com",
    jobId: 1,
    period: "Dec 18, 2023 - Dec 24, 2023",
    amount: "$875.00",
    status: "Paid",
    date: "2023-12-27",
    jobTitle: "Frontend Developer",
    weekEnding: "2023-12-24"
  }
];

// Initialize localStorage with sample data if it doesn't exist
export const initializeSampleData = () => {
  // Initialize job applicants
  localStorage.setItem('jobApplicants', JSON.stringify(sampleJobApplicants));
  
  // Initialize timesheets
  localStorage.setItem('timesheets', JSON.stringify(sampleTimesheets));
  
  // Initialize employer jobs
  localStorage.setItem('jobs', JSON.stringify(sampleEmployerJobs));
  
  // Initialize job applications
  localStorage.setItem('jobApplications', JSON.stringify(sampleJobApplications));
  
  // Initialize applied jobs for the demo user
  localStorage.setItem('appliedJobs', JSON.stringify([1, 2, 3]));
  
  // Initialize user paychecks
  localStorage.setItem('userPaychecks', JSON.stringify(samplePaychecks));
  
  // Initialize notifications
  localStorage.setItem('userAlerts', JSON.stringify(sampleAlerts));
  localStorage.setItem('userEmails', JSON.stringify(sampleEmails));
};