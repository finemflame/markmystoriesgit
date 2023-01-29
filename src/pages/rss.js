import { useEffect } from 'react';
import Router from 'next/router';

export default function RSS() {
  useEffect(() => {
    Router.push(process.env.WORDPRESS_GRAPHQL_ENDPOINT.split('/graphql')[0] + Router.asPath);
  }, []);

  return <div>RSS</div>;
}
