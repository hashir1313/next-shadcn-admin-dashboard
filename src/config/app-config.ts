import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "Traqqy",
  version: packageJson.version,
  copyright: `© ${currentYear}, Traqqy.`,
  meta: {
    title: "Traqqy - Project Progress Tracking for Freelancers",
    description:
      "Traqqy helps freelancers keep clients updated on project progress without sending repetitive messages.",
  },
};
