// Test file for the enhanced resume parser
import { parseResumeText } from './resumeParser';

// Test resume text samples
const testResume1 = `
John Doe
Software Engineer
john.doe@email.com
+1 (555) 123-4567
San Francisco, CA
https://linkedin.com/in/johndoe
https://github.com/johndoe

PROFESSIONAL SUMMARY
Experienced software engineer with 5+ years in full-stack development, specializing in React, Node.js, and cloud technologies. Passionate about creating scalable solutions and mentoring junior developers.

EDUCATION
Bachelor of Science in Computer Science
Stanford University
2020
GPA: 3.8

EXPERIENCE
Senior Software Engineer
Tech Corp Inc.
Jan 2022 - Present
San Francisco, CA
- Led development of microservices architecture
- Mentored 3 junior developers
- Improved system performance by 40%

Software Engineer
StartupXYZ
Jun 2020 - Dec 2021
San Francisco, CA
- Built RESTful APIs using Node.js
- Implemented CI/CD pipelines

TECHNICAL SKILLS
Programming Languages: JavaScript, Python, Java, Go
Frontend: React, Vue.js, HTML5, CSS3, TypeScript
Backend: Node.js, Express, Django, Spring Boot
Databases: MongoDB, PostgreSQL, Redis
Cloud: AWS, Docker, Kubernetes, Terraform

PROJECTS
E-commerce Platform
Built a full-stack e-commerce solution using React and Node.js
Technologies: React, Node.js, MongoDB, Stripe API

Task Management App
Developed a collaborative task management application
Technologies: Vue.js, Firebase, PWA features

CERTIFICATIONS
AWS Certified Solutions Architect
Google Cloud Professional Developer
`;

const testResume2 = `
Jane Smith
Data Scientist
jane.smith@email.com
+1 (555) 987-6543
New York, NY

SUMMARY
Data scientist with expertise in machine learning, statistical analysis, and big data processing. Proven track record of delivering insights that drive business decisions.

EDUCATION
Master of Science in Data Science
MIT
2021
GPA: 3.9

Bachelor of Science in Mathematics
Harvard University
2019
GPA: 3.7

EXPERIENCE
Data Scientist
Analytics Corp
Mar 2021 - Present
New York, NY
- Developed ML models for customer segmentation
- Analyzed large datasets using Python and R
- Created data visualization dashboards

Data Analyst Intern
DataTech
Jun 2020 - Aug 2020
Boston, MA
- Performed exploratory data analysis
- Created automated reporting systems

SKILLS
Programming: Python, R, SQL, Scala
ML/AI: TensorFlow, PyTorch, Scikit-learn, Keras
Big Data: Spark, Hadoop, Kafka
Visualization: Tableau, Power BI, D3.js
Statistics: Hypothesis testing, A/B testing, Regression analysis

PROJECTS
Customer Churn Prediction
Built ML model to predict customer churn with 85% accuracy
Technologies: Python, Scikit-learn, Pandas, NumPy

Real-time Analytics Dashboard
Created real-time dashboard for monitoring business metrics
Technologies: React, Python, Kafka, Redis
`;

// Test function
function testResumeParser() {
  console.log('🧪 Testing Enhanced Resume Parser...\n');

  // Test 1: Software Engineer Resume
  console.log('📋 Test 1: Software Engineer Resume');
  const result1 = parseResumeText(testResume1);
  console.log('Name:', result1.name);
  console.log('Email:', result1.email);
  console.log('Phone:', result1.phone);
  console.log('Location:', result1.location);
  console.log('LinkedIn:', result1.linkedin);
  console.log('GitHub:', result1.github);
  console.log('Summary length:', result1.summary.length);
  console.log('Education count:', result1.education.length);
  console.log('Experience count:', result1.experience.length);
  console.log('Technical skills count:', result1.technicalSkills.length);
  console.log('Projects count:', result1.projects.length);
  console.log('Certifications count:', result1.certifications.length);
  console.log('---\n');

  // Test 2: Data Scientist Resume
  console.log('📋 Test 2: Data Scientist Resume');
  const result2 = parseResumeText(testResume2);
  console.log('Name:', result2.name);
  console.log('Email:', result2.email);
  console.log('Phone:', result2.phone);
  console.log('Location:', result2.location);
  console.log('Summary length:', result2.summary.length);
  console.log('Education count:', result2.education.length);
  console.log('Experience count:', result2.experience.length);
  console.log('Technical skills count:', result2.technicalSkills.length);
  console.log('Projects count:', result2.projects.length);
  console.log('---\n');

  // Test 3: Edge cases
  console.log('📋 Test 3: Edge Cases');
  const emptyResult = parseResumeText('');
  console.log('Empty text result:', Object.keys(emptyResult).every(key => 
    Array.isArray(result1[key]) ? result1[key].length === 0 : result1[key] === ''
  ));

  const shortResult = parseResumeText('John Doe\njohn@email.com');
  console.log('Short text - Name:', shortResult.name);
  console.log('Short text - Email:', shortResult.email);

  console.log('\n✅ Resume Parser Tests Completed!');
}

// Export for use in development
export { testResumeParser, testResume1, testResume2 };

// Run tests if this file is executed directly
if (typeof window !== 'undefined') {
  // Browser environment
  window.testResumeParser = testResumeParser;
} else {
  // Node.js environment
  testResumeParser();
} 