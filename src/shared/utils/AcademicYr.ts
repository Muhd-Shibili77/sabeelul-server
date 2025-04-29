export function getCurrentAcademicYear() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth(); // January is 0, December is 11
  
    // If before April, academic year is previousYear-currentYear
    if (month < 3) {
      return `${year - 1}-${year}`;
    } else {
      return `${year}-${year + 1}`;
    }
  }
  
  