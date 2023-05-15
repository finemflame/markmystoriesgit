import { Helmet } from 'react-helmet';

import { getPostBySlug } from 'lib/posts';
import { ArticleJsonLd } from 'lib/json-ld';
import { helmetSettingsFromMetadata } from 'lib/site';
import useSite from 'hooks/use-site';
import usePageMetadata from 'hooks/use-page-metadata';

import Layout from 'components/Layout';
import Header from 'components/Header';
import Metadata from 'components/Metadata';

import styles from 'styles/pages/Post.module.scss';
import { useEffect } from 'react';
import Router from 'next/router';

export default function Post({ post }) {
  const { title, metaTitle, description, date, author, categories, featuredImage, isSticky = false } = post;
  // const [showContent, setShowContent] = useState(false);

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

  const metadataOptions = {
    compactCategories: false,
  };

  const helmetSettings = helmetSettingsFromMetadata(metadata);

  useEffect(() => {
    Router.push(process.env.WORDPRESS_GRAPHQL_ENDPOINT.split('/graphql')[0] + Router.asPath);
  }, []);

  // useEffect(() => {
  //   setTimeout(() => {
  //     setShowContent(true);
  //   }, 3000);
  // }, []);

  return (
    <Layout>
      <Helmet {...helmetSettings} />

      <ArticleJsonLd post={post} siteTitle={siteMetadata.title} />

      <Header>
        <h1
          className={styles.title}
          dangerouslySetInnerHTML={{
            __html: title,
          }}
        />
        <Metadata
          className={styles.postMetadata}
          date={date}
          author={author}
          categories={categories}
          options={metadataOptions}
          isSticky={isSticky}
        />
      </Header>

      {/* {!showContent && (
        <div
          style={{
            top: 0,
            left: 0,
            position: 'fixed',
            zIndex: 100,
            backgroundColor: '#fff',
            minHeight: '100vh',
            width: '100vw',
          }}
        />
      )} */}
    </Layout>
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
