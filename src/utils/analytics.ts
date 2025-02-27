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
export const logPageView = (path: string, title: string = "") => {
  const user = JSON.parse(localStorage.getItem("user") || "{}"); // Default to empty object if null

  if (user && user.email?.endsWith("@leucinetech.com")) {
    console.log("GA page tracking skipped for LeucineTech users.");
    return;
  }

  ReactGA.send({ hitType: "pageview", page: path, title: title || document.title });
};


export const trackEvent = (category: string, action: string, label: string, value?: number | null): void => {
  const user = JSON.parse(localStorage.getItem("user") || "{}"); // Default to empty object if null

  if (user && user.email?.endsWith("@leucinetech.com")) {
    // console.log("GA tracking skipped for LeucineTech users.");
    return;
  }

  const eventData: { category: string; action: string; label: string; value?: number } = { category, action, label };

  if (typeof value === "number") {
    eventData.value = value;
  }

  ReactGA.event(eventData);
};


