export const toPixels = (value: number, zoom: number) => {
  return value * 2.8346546 * zoom; //Based on my laptops ppi, might need to be calculated
};
