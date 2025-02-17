import ReactGA from 'react-ga4';

// Initialize GA4 with your measurement ID
export const initGA = (measurementId: string) => {
  try {
    ReactGA.initialize(measurementId);
    console.log('GA initialized successfully');
  } catch (error) {
    console.error('Error initializing GA:', error);
  }
};

// Track page views
export const logPageView = (path: string, title: string) => {
  try {
    ReactGA.send({
      hitType: 'pageview',
      page: path,
      title: title
    });
    console.log('Page view logged:', path);
  } catch (error) {
    console.error('Error logging page view:', error);
  }
};

// Track filter usage - simplified version
export const logFilterUsage = (filterName: string, value: string) => {
  try {
    ReactGA.event({
      category: 'Filters',
      action: 'Filter Used',
      label: filterName,
      params: {
        filter_name: filterName,
        filter_value: value,
        page: 'inspections'
      }
    });
    console.log('Filter tracked:', filterName, value);
  } catch (error) {
    console.error('Error tracking filter:', error);
  }
};