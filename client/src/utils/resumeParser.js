// Simplified Resume Parser - Extract all text and links
export function parseResumeText(text) {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l);
  
  const data = {
    // All text content
    fullText: text,
    
    // Links
    linkedin: "",
    github: "",
    leetcode: "",
    portfolio: "",
    
    // Contact info (basic)
    email: "",
    phone: "",
    
    // Simple name extraction
    name: ""
  };

  // Extract email
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g);
  if (emailMatch) {
    data.email = emailMatch[0];
  }

  // Extract phone numbers
  const phoneMatch = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g);
  if (phoneMatch) {
    data.phone = phoneMatch[0];
  }

  // Extract LinkedIn
  const linkedinMatch = text.match(/https?:\/\/(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+/gi);
  if (linkedinMatch) {
    data.linkedin = linkedinMatch[0];
  }

  // Extract GitHub
  const githubMatch = text.match(/https?:\/\/(?:www\.)?github\.com\/[a-zA-Z0-9_-]+/gi);
  if (githubMatch) {
    data.github = githubMatch[0];
  }

  // Extract LeetCode
  const leetcodeMatch = text.match(/https?:\/\/(?:www\.)?leetcode\.com\/[a-zA-Z0-9_-]+/gi);
  if (leetcodeMatch) {
    data.leetcode = leetcodeMatch[0];
  }

  // Extract Portfolio/Website (excluding social media)
  const portfolioMatch = text.match(/https?:\/\/(?:www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi);
  if (portfolioMatch) {
    const filteredUrls = portfolioMatch.filter(url => 
      !url.includes('linkedin.com') && 
      !url.includes('github.com') && 
      !url.includes('leetcode.com')
    );
    if (filteredUrls.length > 0) {
      data.portfolio = filteredUrls[0];
    }
  }

  // Extract name (first line if it looks like a name)
  if (lines.length > 0) {
    const firstLine = lines[0];
    if (firstLine.length < 50 && /^[A-Z][a-z]+ [A-Z][a-z]+/.test(firstLine)) {
      data.name = firstLine.trim();
    }
  }

  return data;
}
