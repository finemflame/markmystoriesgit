import { getPostBySlug } from 'lib/posts';
// import { helmetSettingsFromMetadata } from 'lib/site';
import usePageMetadata from 'hooks/use-page-metadata';

import dynamic from 'next/dynamic';
// import { Helmet } from 'react-helmet';
import { ArticleJsonLd } from 'lib/json-ld';

const BlogRedirect = dynamic(() => import('components/BlogRedirect'), {
  ssr: false,
});

export default function Post({ post }) {
  const { title, metaTitle, description, featuredImage } = post;

  if (!post.og) {
    post.og = {};
  }

  if (featuredImage?.sourceUrl) {
    post.og.image = featuredImage.sourceUrl;
    post.og.imageUrl = featuredImage.sourceUrl;
    post.og.imageSecureUrl = post.og.imageUrl;
    post.og.imageWidth = 2000;
    post.og.imageHeight = 2000;
  }

  const { metadata } = usePageMetadata({
    metadata: {
      ...post,
      title: metaTitle,
      description: description || post.og?.description || `Read more about ${title}`,
    },
  });

  if (process.env.WORDPRESS_PLUGIN_SEO !== true) {
    metadata.title = title;
    metadata.og.title = metadata.title;
    metadata.twitter.title = metadata.title;
  }

  // const helmetSettings = helmetSettingsFromMetadata(metadata);

  return (
    <>
      <BlogRedirect />
      {/* <Helmet {...helmetSettings} /> */}
      <ArticleJsonLd post={post} />
    </>
  );
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
