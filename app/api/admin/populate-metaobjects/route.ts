
// app/api/populate-country-flags/route.ts

/* 
import { NextResponse } from 'next/server';

const SHOP = process.env.SHOPIFY_STORE_DOMAIN
const ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN
const countries = [
    { name: "Algeria", flag: "🇩🇿" },
    { name: "Angola", flag: "🇦🇴" },
    { name: "Benin", flag: "🇧🇯" },
    { name: "Botswana", flag: "🇧🇼" },
    { name: "Burkina Faso", flag: "🇧🇫" },
    { name: "Burundi", flag: "🇧🇮" },
    { name: "Cabo Verde", flag: "🇨🇻" },
    { name: "Cameroon", flag: "🇨🇲" },
    { name: "Central African Republic", flag: "🇨🇫" },
    { name: "Chad", flag: "🇹🇩" },
    { name: "Comoros", flag: "🇰🇲" },
    { name: "Democratic Republic of the Congo", flag: "🇨🇩" },
    { name: "Republic of the Congo", flag: "🇨🇬" },
    { name: "Côte d'Ivoire", flag: "🇨🇮" },
    { name: "Djibouti", flag: "🇩🇯" },
    { name: "Egypt", flag: "🇪🇬" },
    { name: "Equatorial Guinea", flag: "🇬🇶" },
    { name: "Eritrea", flag: "🇪🇷" },
    { name: "Eswatini", flag: "🇸🇿" },
    { name: "Ethiopia", flag: "🇪🇹" },
    { name: "Gabon", flag: "🇬🇦" },
    { name: "Gambia", flag: "🇬🇲" },
    { name: "Ghana", flag: "🇬🇭" },
    { name: "Guinea", flag: "🇬🇳" },
    { name: "Guinea-Bissau", flag: "🇬🇼" },
    { name: "Kenya", flag: "🇰🇪" },
    { name: "Lesotho", flag: "🇱🇸" },
    { name: "Liberia", flag: "🇱🇷" },
    { name: "Libya", flag: "🇱🇾" },
    { name: "Madagascar", flag: "🇲🇬" },
    { name: "Malawi", flag: "🇲🇼" },
    { name: "Mali", flag: "🇲🇱" },
    { name: "Mauritania", flag: "🇲🇷" },
    { name: "Mauritius", flag: "🇲🇺" },
    { name: "Morocco", flag: "🇲🇦" },
    { name: "Mozambique", flag: "🇲🇿" },
    { name: "Namibia", flag: "🇳🇦" },
    { name: "Niger", flag: "🇳🇪" },
    { name: "Nigeria", flag: "🇳🇬" },
    { name: "Rwanda", flag: "🇷🇼" },
    { name: "Sao Tome and Principe", flag: "🇸🇹" },
    { name: "Senegal", flag: "🇸🇳" },
    { name: "Seychelles", flag: "🇸🇨" },
    { name: "Sierra Leone", flag: "🇸🇱" },
    { name: "Somalia", flag: "🇸🇴" },
    { name: "South Africa", flag: "🇿🇦" },
    { name: "South Sudan", flag: "🇸🇸" },
    { name: "Sudan", flag: "🇸🇩" },
    { name: "Tanzania", flag: "🇹🇿" },
    { name: "Togo", flag: "🇹🇬" },
    { name: "Tunisia", flag: "🇹🇳" },
    { name: "Uganda", flag: "🇺🇬" },
    { name: "Zambia", flag: "🇿🇲" },
    { name: "Zimbabwe", flag: "🇿🇼" }
  ];
  

export async function GET() {
  const results = [];

  for (const country of countries) {
    const handle = country.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
    const createInput = {
      type: "country_flags",
      handle,
      fields: [
        { key: "name", value: country.name },
        { key: "flag", value: country.flag },
      ]
    };

    // 1. Create the Metaobject
    const createResponse = await fetch(`https://${SHOP}/admin/api/2024-04/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': ACCESS_TOKEN,
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation CreateCountryFlag($input: MetaobjectCreateInput!) {
            metaobjectCreate(metaobject: $input) {
              metaobject {
                id
                handle
              }
              userErrors {
                field
                message
                code
              }
            }
          }
        `,
        variables: { input: createInput }
      })
    });

    const createJson = await createResponse.json();
    const createData = createJson.data?.metaobjectCreate;
    const createdMetaobject = createData?.metaobject;
    const createErrors = createData?.userErrors ?? createJson.errors;

    if (createErrors.length === 0 && createdMetaobject?.id) {
      // 2. Publish the Metaobject
      const publishResponse = await fetch(`https://${SHOP}/admin/api/2024-04/graphql.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': ACCESS_TOKEN,
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation PublishMetaobject($id: ID!) {
              metaobjectPublish(id: $id) {
                metaobject {
                  id
                  isPublished
                }
                userErrors {
                  field
                  message
                }
              }
            }
          `,
          variables: {
            id: createdMetaobject.id
          }
        })
      });

      const publishJson = await publishResponse.json();
      const publishErrors = publishJson.data?.metaobjectPublish?.userErrors ?? publishJson.errors;

      results.push({
        country: country.name,
        success: publishErrors.length === 0,
        errors: publishErrors
      });
    } else {
      results.push({
        country: country.name,
        success: false,
        errors: createErrors
      });
    }
  }

  return NextResponse.json({
    created: results.filter(r => r.success),
    failed: results.filter(r => !r.success)
  });
}

*/





// app/api/publish-country-flags/route.ts
import { NextResponse } from 'next/server';

const SHOP = 'snacksafaritest.myshopify.com';
const ACCESS_TOKEN = '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';

const countries = [
    { name: "Algeria", flag: "🇩🇿" },
    { name: "Angola", flag: "🇦🇴" },
    { name: "Benin", flag: "🇧🇯" },
    { name: "Botswana", flag: "🇧🇼" },
    { name: "Burkina Faso", flag: "🇧🇫" },
    { name: "Burundi", flag: "🇧🇮" },
    { name: "Cabo Verde", flag: "🇨🇻" },
    { name: "Cameroon", flag: "🇨🇲" },
    { name: "Central African Republic", flag: "🇨🇫" },
    { name: "Chad", flag: "🇹🇩" },
    { name: "Comoros", flag: "🇰🇲" },
    { name: "Democratic Republic of the Congo", flag: "🇨🇩" },
    { name: "Republic of the Congo", flag: "🇨🇬" },
    { name: "Côte d'Ivoire", flag: "🇨🇮" },
    { name: "Djibouti", flag: "🇩🇯" },
    { name: "Egypt", flag: "🇪🇬" },
    { name: "Equatorial Guinea", flag: "🇬🇶" },
    { name: "Eritrea", flag: "🇪🇷" },
    { name: "Eswatini", flag: "🇸🇿" },
    { name: "Ethiopia", flag: "🇪🇹" },
    { name: "Gabon", flag: "🇬🇦" },
    { name: "Gambia", flag: "🇬🇲" },
    { name: "Ghana", flag: "🇬🇭" },
    { name: "Guinea", flag: "🇬🇳" },
    { name: "Guinea-Bissau", flag: "🇬🇼" },
    { name: "Kenya", flag: "🇰🇪" },
    { name: "Lesotho", flag: "🇱🇸" },
    { name: "Liberia", flag: "🇱🇷" },
    { name: "Libya", flag: "🇱🇾" },
    { name: "Madagascar", flag: "🇲🇬" },
    { name: "Malawi", flag: "🇲🇼" },
    { name: "Mali", flag: "🇲🇱" },
    { name: "Mauritania", flag: "🇲🇷" },
    { name: "Mauritius", flag: "🇲🇺" },
    { name: "Morocco", flag: "🇲🇦" },
    { name: "Mozambique", flag: "🇲🇿" },
    { name: "Namibia", flag: "🇳🇦" },
    { name: "Niger", flag: "🇳🇪" },
    { name: "Nigeria", flag: "🇳🇬" },
    { name: "Rwanda", flag: "🇷🇼" },
    { name: "Sao Tome and Principe", flag: "🇸🇹" },
    { name: "Senegal", flag: "🇸🇳" },
    { name: "Seychelles", flag: "🇸🇨" },
    { name: "Sierra Leone", flag: "🇸🇱" },
    { name: "Somalia", flag: "🇸🇴" },
    { name: "South Africa", flag: "🇿🇦" },
    { name: "South Sudan", flag: "🇸🇸" },
    { name: "Sudan", flag: "🇸🇩" },
    { name: "Tanzania", flag: "🇹🇿" },
    { name: "Togo", flag: "🇹🇬" },
    { name: "Tunisia", flag: "🇹🇳" },
    { name: "Uganda", flag: "🇺🇬" },
    { name: "Zambia", flag: "🇿🇲" },
    { name: "Zimbabwe", flag: "🇿🇼" }
  ];

export async function GET() {
  const results = [];

  for (const country of countries) {
    const handle = country.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');

    // 1. Lookup existing metaobject by handle
    const lookupResponse = await fetch(`https://${SHOP}/admin/api/2024-04/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': ACCESS_TOKEN,
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query GetMetaobjectId($handle: String!) {
            metaobjectByHandle(handle: $handle, type: "country_flags") {
              id
              isPublished
            }
          }
        `,
        variables: { handle }
      })
    });

    const lookupJson = await lookupResponse.json();
    const metaobject = lookupJson.data?.metaobjectByHandle;

    if (!metaobject) {
      results.push({
        country: country.name,
        success: false,
        errors: [{ message: 'Metaobject not found' }]
      });
      continue;
    }

    if (metaobject.isPublished) {
      results.push({
        country: country.name,
        success: true,
        note: 'Already published'
      });
      continue;
    }

    // 2. Publish it
    const publishResponse = await fetch(`https://${SHOP}/admin/api/2024-04/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': ACCESS_TOKEN,
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation PublishMetaobject($id: ID!) {
            metaobjectPublish(id: $id) {
              metaobject {
                id
                isPublished
              }
              userErrors {
                field
                message
              }
            }
          }
        `,
        variables: {
          id: metaobject.id
        }
      })
    });

    const publishJson = await publishResponse.json();
    const publishErrors = publishJson.data?.metaobjectPublish?.userErrors ?? publishJson.errors;

    results.push({
      country: country.name,
      success: publishErrors.length === 0,
      errors: publishErrors
    });
  }

  return NextResponse.json({
    published: results.filter(r => r.success),
    failed: results.filter(r => !r.success)
  });
}
