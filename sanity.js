import sanityClient from "@sanity/client";
import ImageUrlBuilder from "@sanity/image-url";

const sanityDB = new sanityClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: "production",
  useCdn: true,
  apiVersion: "2021-10-21",
  token: process.env.SANITY_TOKEN,
});

const builder = new ImageUrlBuilder(sanityDB);

export const urlFor = (source) => builder.image(source);

export default sanityDB;
