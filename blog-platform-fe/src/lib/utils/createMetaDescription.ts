const createMetaDescription = (content: string): string => {
  // Remove any HTML tags
  const cleanContent = content.replace(/<[^>]*>/g, '');
  
  // If the content is short enough, return it directly
  if (cleanContent.length <= 155) {
    return cleanContent;
  }
  
  // Find a good breakpoint at the end of a sentence
  let breakpoint = cleanContent.substring(0, 155).lastIndexOf('.');
  
  // If no good breakpoint, try finding a space
  if (breakpoint === -1 || breakpoint < 120) {
    breakpoint = cleanContent.substring(0, 155).lastIndexOf(' ');
  }
  
  return cleanContent.substring(0, breakpoint > 0 ? breakpoint + 1 : 155);
};

export default createMetaDescription;