/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.org/docs/gatsby-config/
 */

module.exports = {
  /* Your site config here */
  plugins: [
    'gatsby-plugin-react-helmet',

    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'TalkBot',
        short_name: 'TalkBot',
        start_url: '/',
        background_color: '#343a40',
        theme_color: '#343a40',
        // Enables "Add to Homescreen" prompt and disables browser UI (including back button)
        // see https://developers.google.com/web/fundamentals/web-app-manifest/#display
        display: 'standalone',
        icon: 'static/img/face_200.png', // This path is relative to the root of the site.
      },
    }
  ]
}
