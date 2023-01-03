import sanityClient from "@sanity/client";
import ImageUrlBuilder from "@sanity/image-url";

const client = new sanityClient({
  projectId: "d1ut7ubn",
  dataset: "production",
  useCdn: true,
  apiVersion: "2021-10-21",
  token:
    "skJNNosvomyzSOErY8X96lSeWlhRkngSMPOVpnhM0zm3KwmrCh2iu63AfxSBv3Z0WlUm49ow80vuGTed8CO3UNp0i7gYjAdUKjXcQeZTNyRR5keZ4QOlOm1fPXPja3v0kA9vwRSYOoQB2iyi0Bwym1U72kM9ACDyNeG6Hbe4AzPIiZF2vX8l",
});

const builder = new ImageUrlBuilder(client);

export const urlFor = (source) => builder.image(source);

//Run this to add exception for localhost 3000 CORS policy
//sanity cors add http://localhost:3000

export default client;
