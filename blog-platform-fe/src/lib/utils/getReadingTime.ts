const getReadingTime = (content: string) => {
  const words = content.trim().split(/\s+/).length;
  const time = Math.ceil(words / 200); // Avg reading speed of 200 words per minute
  return `${time} min read`;
};

export default getReadingTime;