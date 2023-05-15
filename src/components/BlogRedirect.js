import React, { useEffect } from 'react';

export default function BlogRedirect() {
  useEffect(() => {
    window.location =
      process.env.WORDPRESS_GRAPHQL_ENDPOINT.split('/graphql')[0] + window.location.pathname + window.location.search;
  }, []);

  return <></>;
}
