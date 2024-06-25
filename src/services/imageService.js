export const fetchImages = async (count = 10) => {
  const response = await fetch(`https://picsum.photos/v2/list?limit=${count}`);
  return await response.json();
};
