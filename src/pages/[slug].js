import { getPostBySlug } from 'lib/posts';
import { helmetSettingsFromMetadata } from 'lib/site';
import useSite from 'hooks/use-site';
import usePageMetadata from 'hooks/use-page-metadata';

import dynamic from 'next/dynamic';

const Blog = dynamic(() => import('components/Blog'), {
  ssr: false,
});

export default function Post({ post }) {
  const { title, metaTitle, description, featuredImage } = post;

  const { metadata: siteMetadata = {} } = useSite();

  if (!post.og) {
    post.og = {};
  }

  if (featuredImage?.sourceUrl) {
    post.og.imageUrl = featuredImage.sourceUrl;
    post.og.imageSecureUrl = post.og.imageUrl;
    post.og.imageWidth = 2000;
    post.og.imageHeight = 1000;
  }

  const { metadata } = usePageMetadata({
    metadata: {
      ...post,
      title: metaTitle,
      description: description || post.og?.description || `Read more about ${title}`,
    },
  });

  if (process.env.WORDPRESS_PLUGIN_SEO !== true) {
    metadata.title = `${title} - ${siteMetadata.title}`;
    metadata.og.title = metadata.title;
    metadata.twitter.title = metadata.title;
  }

  const helmetSettings = helmetSettingsFromMetadata(metadata);

  return <Blog helmetSettings={helmetSettings} />;
}

export async function getStaticProps({ params = {} } = {}) {
  const { post } = await getPostBySlug(params?.slug);

  if (!post) {
    return {
      props: {},
      notFound: true,
    };
  }

  const props = {
    post,
  };

  return {
    props,
  };
}

export async function getStaticPaths() {
  // Only render the most recent posts to avoid spending unecessary time
  // querying every single post from WordPress

  // Tip: this can be customized to use data or analytitcs to determine the
  // most popular posts and render those instead

  return {
    paths: [],
    fallback: 'blocking',
  };
}
