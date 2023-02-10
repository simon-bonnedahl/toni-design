import { Applications } from "../../types/sign.d";

export const toPixels = (value: number, zoom: number) => {
  return value * 2.8346546 * zoom; //Based on my laptops ppi, might need to be calculated
};

export const toMM = (value: number, zoom: number) => {
  return value / 2.8346546 / zoom;
};

export const calculatePrice = (
  width: number,
  height: number,
  application: Applications
) => {
  const minimalPrice = 9.3;
  const area = width * height;

  //Area breakpoints in mm^2
  const ab_1 = 500;
  const ab_2 = 5000;
  const ab_3 = 10000;
  const ab_4 = 100000;

  //Price per mm^2 for each area bracke
  let f1 = 0.018;
  let f2 = 0.011;
  let f3 = 0.009;
  let f4 = 0.0082;

  if (application === Applications.TAPE) {
    f1 = 0.02;
    f2 = 0.0125;
    f3 = 0.01;
    f4 = 0.009;
  }

  let price = 0;
  if (area <= ab_1) {
    price = area * f1;
  } else if (area <= ab_2) {
    price = ab_1 * f1 + (area - ab_1) * f2;
  } else if (area <= ab_3) {
    price = ab_1 * f1 + (ab_2 - ab_1) * f2 + (area - ab_2) * f3;
  } else if (area <= ab_4) {
    price =
      ab_1 * f1 +
      (ab_2 - ab_1) * f2 +
      (ab_3 - (ab_1 + ab_2)) * f3 +
      (area - ab_3) * f4;
  }
  return price <= minimalPrice ? minimalPrice : Math.round(price);
};
