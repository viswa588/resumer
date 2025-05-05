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
    jobId: 1,
    jobTitle: "Frontend Developer",
    weekEnding: "2023-12-17",
    totalHours: 40,
    status: "Pending",
    submittedDate: "2023-12-18T09:00:00Z",
    entries: [
      { date: "2023-12-11", hours: 8, task: "Development", description: "Implemented new features" },
      { date: "2023-12-12", hours: 8, task: "Development", description: "Fixed bugs" },
      { date: "2023-12-13", hours: 8, task: "Testing", description: "Unit testing" },
      { date: "2023-12-14", hours: 8, task: "Development", description: "Code review" },
      { date: "2023-12-15", hours: 8, task: "Documentation", description: "Updated documentation" }
    ]
  },
  {
    id: 2,
    userId: "user456",
    userName: "Emily Johnson",
    jobId: 1,
    jobTitle: "Frontend Developer",
    weekEnding: "2023-12-17",
    totalHours: 35,
    status: "Approved",
    submittedDate: "2023-12-18T10:15:00Z",
    approvedDate: "2023-12-19T14:30:00Z",
    entries: [
      { date: "2023-12-11", hours: 7, task: "Development", description: "Component development" },
      { date: "2023-12-12", hours: 7, task: "Development", description: "Integration" },
      { date: "2023-12-13", hours: 7, task: "Testing", description: "Integration testing" },
      { date: "2023-12-14", hours: 7, task: "Development", description: "Bug fixes" },
      { date: "2023-12-15", hours: 7, task: "Meeting", description: "Sprint planning" }
    ]
  },
  {
    id: 3,
    userId: "user789",
    userName: "Michael Brown",
    jobId: 2,
    jobTitle: "Backend Developer",
    weekEnding: "2023-12-17",
    totalHours: 38,
    status: "Pending",
    submittedDate: "2023-12-18T11:30:00Z",
    entries: [
      { date: "2023-12-11", hours: 8, task: "Development", description: "API development" },
      { date: "2023-12-12", hours: 8, task: "Development", description: "Database optimization" },
      { date: "2023-12-13", hours: 8, task: "Testing", description: "API testing" },
      { date: "2023-12-14", hours: 7, task: "Development", description: "Code refactoring" },
      { date: "2023-12-15", hours: 7, task: "Documentation", description: "API documentation" }
    ]
  },
  {
    id: 4,
    userId: "user101",
    userName: "Sarah Wilson",
    jobId: 3,
    jobTitle: "UX Designer",
    weekEnding: "2023-12-17",
    totalHours: 36,
    status: "Rejected",
    submittedDate: "2023-12-18T13:45:00Z",
    rejectedDate: "2023-12-19T16:00:00Z",
    rejectionReason: "Hours don't match project timeline",
    entries: [
      { date: "2023-12-11", hours: 8, task: "Design", description: "Wireframing" },
      { date: "2023-12-12", hours: 8, task: "Design", description: "Prototyping" },
      { date: "2023-12-13", hours: 8, task: "Research", description: "User research" },
      { date: "2023-12-14", hours: 6, task: "Design", description: "UI refinement" },
      { date: "2023-12-15", hours: 6, task: "Meeting", description: "Design review" }
    ]
  },
  {
    id: 5,
    userId: "user202",
    userName: "David Lee",
    jobId: 2,
    jobTitle: "Backend Developer",
    weekEnding: "2023-12-24",
    totalHours: 40,
    status: "Pending",
    submittedDate: "2023-12-25T09:30:00Z",
    entries: [
      { date: "2023-12-18", hours: 8, task: "Development", description: "Server configuration" },
      { date: "2023-12-19", hours: 8, task: "Development", description: "Authentication system" },
      { date: "2023-12-20", hours: 8, task: "Testing", description: "Security testing" },
      { date: "2023-12-21", hours: 8, task: "Development", description: "Performance optimization" },
      { date: "2023-12-22", hours: 8, task: "Documentation", description: "System documentation" }
    ]
  },
  {
    id: 6,
    userId: "user303",
    userName: "Jessica Martinez",
    jobId: 4,
    jobTitle: "Full Stack Developer",
    weekEnding: "2023-12-24",
    totalHours: 42,
    status: "Pending",
    submittedDate: "2023-12-25T10:45:00Z",
    entries: [
      { date: "2023-12-18", hours: 9, task: "Development", description: "Frontend implementation" },
      { date: "2023-12-19", hours: 9, task: "Development", description: "Backend integration" },
      { date: "2023-12-20", hours: 8, task: "Testing", description: "End-to-end testing" },
      { date: "2023-12-21", hours: 8, task: "Development", description: "Bug fixes" },
      { date: "2023-12-22", hours: 8, task: "Meeting", description: "Client demo" }
    ]
  },
  {
    id: 7,
    userId: "user404",
    userName: "Robert Taylor",
    jobId: 3,
    jobTitle: "UX Designer",
    weekEnding: "2023-12-31",
    totalHours: 38,
    status: "Pending",
    submittedDate: "2024-01-01T09:15:00Z",
    entries: [
      { date: "2023-12-25", hours: 8, task: "Design", description: "User flow diagrams" },
      { date: "2023-12-26", hours: 8, task: "Design", description: "Interface mockups" },
      { date: "2023-12-27", hours: 8, task: "Research", description: "Usability testing" },
      { date: "2023-12-28", hours: 7, task: "Design", description: "Design iterations" },
      { date: "2023-12-29", hours: 7, task: "Meeting", description: "Stakeholder presentation" }
    ]
  },
  {
    id: 8,
    userId: "user505",
    userName: "Amanda Garcia",
    jobId: 4,
    jobTitle: "Full Stack Developer",
    weekEnding: "2023-12-31",
    totalHours: 40,
    status: "Under Review",
    submittedDate: "2024-01-01T10:30:00Z",
    entries: [
      { date: "2023-12-25", hours: 8, task: "Development", description: "API integration" },
      { date: "2023-12-26", hours: 8, task: "Development", description: "Frontend components" },
      { date: "2023-12-27", hours: 8, task: "Testing", description: "Cross-browser testing" },
      { date: "2023-12-28", hours: 8, task: "Development", description: "Responsive design" },
      { date: "2023-12-29", hours: 8, task: "Documentation", description: "Code documentation" }
    ]
  },
  {
    id: 9,
    userId: "user606",
    userName: "William Chen",
    jobId: 5,
    jobTitle: "DevOps Engineer",
    weekEnding: "2023-12-31",
    totalHours: 45,
    status: "Pending",
    submittedDate: "2024-01-01T11:45:00Z",
    entries: [
      { date: "2023-12-25", hours: 9, task: "Infrastructure", description: "Cloud setup" },
      { date: "2023-12-26", hours: 9, task: "Development", description: "CI/CD pipeline" },
      { date: "2023-12-27", hours: 9, task: "Testing", description: "Deployment testing" },
      { date: "2023-12-28", hours: 9, task: "Infrastructure", description: "Kubernetes configuration" },
      { date: "2023-12-29", hours: 9, task: "Documentation", description: "Infrastructure documentation" }
    ]
  },
  {
    id: 10,
    userId: "user707",
    userName: "Olivia Rodriguez",
    jobId: 1,
    jobTitle: "Frontend Developer",
    weekEnding: "2024-01-07",
    totalHours: 37,
    status: "Approved",
    submittedDate: "2024-01-08T09:00:00Z",
    approvedDate: "2024-01-09T14:00:00Z",
    entries: [
      { date: "2024-01-01", hours: 7, task: "Development", description: "UI components" },
      { date: "2024-01-02", hours: 8, task: "Development", description: "State management" },
      { date: "2024-01-03", hours: 8, task: "Testing", description: "Unit tests" },
      { date: "2024-01-04", hours: 7, task: "Development", description: "Performance optimization" },
      { date: "2024-01-05", hours: 7, task: "Meeting", description: "Code review session" }
    ]
  },
  {
    id: 11,
    userId: "user808",
    userName: "James Wilson",
    jobId: 2,
    jobTitle: "Backend Developer",
    weekEnding: "2024-01-07",
    totalHours: 41,
    status: "Rejected",
    submittedDate: "2024-01-08T10:15:00Z",
    rejectedDate: "2024-01-09T15:30:00Z",
    rejectionReason: "Overtime not pre-approved",
    entries: [
      { date: "2024-01-01", hours: 8, task: "Development", description: "Database schema design" },
      { date: "2024-01-02", hours: 8, task: "Development", description: "API endpoints" },
      { date: "2024-01-03", hours: 9, task: "Testing", description: "Load testing" },
      { date: "2024-01-04", hours: 8, task: "Development", description: "Error handling" },
      { date: "2024-01-05", hours: 8, task: "Documentation", description: "API documentation" }
    ]
  },
  {
    id: 12,
    userId: "user909",
    userName: "Sophia Kim",
    jobId: 3,
    jobTitle: "UX Designer",
    weekEnding: "2024-01-07",
    totalHours: 39,
    status: "Under Review",
    submittedDate: "2024-01-08T11:30:00Z",
    entries: [
      { date: "2025-01-01", hours: 8, task: "Design", description: "User personas" },
      { date: "2025-01-02", hours: 8, task: "Design", description: "Information architecture" },
      { date: "2025-01-03", hours: 8, task: "Research", description: "Competitor analysis" },
      { date: "2025-01-04", hours: 7, task: "Design", description: "Visual design" },
      { date: "2025-01-05", hours: 8, task: "Meeting", description: "Design critique" }
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
    employerEmail: "employer@example.com",
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
    employerEmail: "employer@example.com",
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
    employerEmail: "employer@example.com",
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
    employerEmail: "employer@example.com",
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
    employerEmail: "employer@example.com",
    description: "Seeking a DevOps Engineer to streamline our development and deployment processes.",
    requirements: "Experience with CI/CD pipelines, Docker, Kubernetes, and cloud platforms.",
    salary: "$105,000 - $135,000",
    postedDate: "2023-12-14T13:00:00Z",
    status: "draft",
    applicants: 0
  }
];

const record1 = [{ id:1, userName: 'Michel', userId: 'mic001',weekEnding: '1',totalHours: 35,status: 'pending', jobTitle: 'Helper',submittedDate: new Date()}, 
  { id:2, userName: 'John', userId: 'john34d',weekEnding: '3',totalHours: 12,status: 'Approved', jobTitle: 'Dev',submittedDate: new Date()},
  { id:3, userName: 'Viswa', userId: 'viswa588',weekEnding: '5',totalHours: 29,status: 'pending', jobTitle: 'Helper',submittedDate: new Date()},
  { id:4, userName: 'Ganesh', userId: 'ganeshd123',weekEnding: '2',totalHours: 40,status: 'Rejected', jobTitle: 'painter',submittedDate: new Date()}]

// Initialize localStorage with sample data if it doesn't exist
export const initializeSampleData = () => {
  if (!localStorage.getItem('jobApplicants')) {
    localStorage.setItem('jobApplicants', JSON.stringify(sampleJobApplicants));
  }
  
  if (!localStorage.getItem('timesheets')) {
    localStorage.setItem('timesheets', JSON.stringify(sampleTimesheets));
  }

  if (!localStorage.getItem('timesheets-app')) {
    localStorage.setItem('timesheets-app', JSON.stringify(record1));
  }
  
  if (!localStorage.getItem('employerJobs')) {
    localStorage.setItem('employerJobs', JSON.stringify(sampleEmployerJobs));
  }
};