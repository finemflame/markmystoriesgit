import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';

export default function Blog({ helmetSettings }) {
  useEffect(() => {
    window.location =
      process.env.WORDPRESS_GRAPHQL_ENDPOINT.split('/graphql')[0] + window.location.pathname + window.location.search;
  }, []);

  return <Helmet {...helmetSettings} />;
}
