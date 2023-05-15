import React from 'react';

export default function BlogRedirect() {
  setTimeout(() => {
    window.location =
      process.env.WORDPRESS_GRAPHQL_ENDPOINT.split('/graphql')[0] + window.location.pathname + window.location.search;
  }, 500);

  return <></>;
}
