/** Search engines may list the site only once SITE_PUBLIC=1 is set (redeploy after changing it). */
export const siteIsPublic = () => process.env.SITE_PUBLIC === "1";
