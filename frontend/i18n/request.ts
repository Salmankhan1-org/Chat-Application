import {getRequestConfig} from 'next-intl/server';
 
export default getRequestConfig(async ({locale = 'en'}) => {
  // Static for now, we'll change this later
   console.log("Request Layout:",locale);
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});