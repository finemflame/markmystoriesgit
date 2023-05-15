import { Helmet } from 'react-helmet';

export function ArticleJsonLd({ post = {} }) {
  const { title, featuredImage } = post;

  /** TODO - As image is a recommended field would be interesting to have a
   * default image in case there is no featuredImage comming from WP,
   * like the open graph social image
   * */

  const jsonLd = {
    headline: title,
    image: [featuredImage?.sourceUrl],
  };

  return (
    <Helmet encodeSpecialCharacters={false}>
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  );
}
