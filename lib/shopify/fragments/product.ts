import imageFragment from './image';
import seoFragment from './seo';

const productFragment = /* GraphQL */ `
  fragment product on Product {
    id
    handle
    availableForSale
    title
    description
    descriptionHtml
    options {
      id
      name
      values
    }
    priceRange {
      maxVariantPrice {
        amount
        currencyCode
      }
      minVariantPrice {
        amount
        currencyCode
      }
    }
    variants(first: 250) {
      edges {
        node {
          id
          title
          availableForSale
          selectedOptions {
            name
            value
          }
          price {
            amount
            currencyCode
          }
          metafields(identifiers: [
            {namespace: "custom", key: "variant_info"},
            {namespace: "inventory", key: "warehouse_location"},
            {namespace: "shipping", key: "dimensions"}
          ]) {
            id
            namespace
            key
            value
            type
            description
          }
        }
      }
    }
    featuredImage {
      ...image
    }
    images(first: 20) {
      edges {
        node {
          ...image
        }
      }
    }
    seo {
      ...seo
    }
    tags
    updatedAt
    metafields(identifiers: [
      {namespace: "reviews", key: "rating_count"},
      {namespace: "reviews", key: "rating"},
      {namespace: "custom", key: "country"}
    ]) {
      id
      namespace
      key
      value
      type
      description
      # For single metaobject references
      reference {
        ... on Metaobject {
          id
          handle
          type
          fields {
            key
            value
            type
          }
        }
      }
      # For list metaobject references
      references(first: 10) {
        edges {
          node {
            ... on Metaobject {
              id
              handle
              type
              fields {
                key
                value
                type
              }
            }
          }
        }
      }
    }
  }
  ${imageFragment}
  ${seoFragment}
`;

export default productFragment;