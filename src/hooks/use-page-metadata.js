import { constructPageMetadata } from 'lib/site';

export default function usePageMetadata({ metadata: pageMetadata }) {
  const metadata = constructPageMetadata(undefined, pageMetadata, {
    homepage: process.env.WORDPRESS_GRAPHQL_ENDPOINT.split('/graphql')[0],
  });

  return {
    metadata,
  };
}
