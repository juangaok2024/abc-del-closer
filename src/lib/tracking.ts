// Tracking utility for UTM capture, session management, and webhook events

const WEBHOOK_URL = 'https://primary-production-928af.up.railway.app/webhook/c05feaf1-2700-46fa-a7da-0360aa68549c';
const SESSION_KEY = 'abc-closer-session';
const UTM_KEY = 'abc-closer-utms';

// UTM parameters to capture
const UTM_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'utm_id', 'fbclid', 'gclid'];

export interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  utm_id?: string;
  fbclid?: string;
  gclid?: string;
}

export interface SessionData {
  session_id: string;
  created_at: string;
  utms: UTMParams;
  user_agent: string;
  referrer: string;
  landing_page: string;
}

export interface PageViewEvent {
  event_type: 'page_view';
  session_id: string;
  timestamp: string;
  page: string;
  variant: 'default' | 'v2';
  utms: UTMParams;
  user_agent: string;
  referrer: string;
}

export interface ButtonClickEvent {
  event_type: 'button_click';
  session_id: string;
  timestamp: string;
  button_action: string;
  page: string;
  variant: 'default' | 'v2';
  utms: UTMParams;
  destination_url: string;
}

export interface FormSubmitEvent {
  event_type: 'form_submit';
  session_id: string;
  timestamp: string;
  page: string;
  variant: 'v2';
  utms: UTMParams;
  form_data: {
    name: string;
    email: string;
    phone: string;
  };
}

// Generate a unique session ID
function generateSessionId(): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 15);
  return `${timestamp}-${randomPart}`;
}

// Capture UTM parameters from URL
export function captureUTMs(): UTMParams {
  if (typeof window === 'undefined') return {};

  const urlParams = new URLSearchParams(window.location.search);
  const utms: UTMParams = {};

  UTM_PARAMS.forEach((param) => {
    const value = urlParams.get(param);
    if (value) {
      utms[param as keyof UTMParams] = value;
    }
  });

  return utms;
}

// Get or create session
export function getOrCreateSession(): SessionData {
  if (typeof window === 'undefined') {
    return {
      session_id: 'server',
      created_at: new Date().toISOString(),
      utms: {},
      user_agent: '',
      referrer: '',
      landing_page: '',
    };
  }

  // Check for existing session
  const existingSession = sessionStorage.getItem(SESSION_KEY);
  if (existingSession) {
    try {
      return JSON.parse(existingSession);
    } catch {
      // Invalid session, create new one
    }
  }

  // Capture UTMs from URL (only on first visit)
  const utms = captureUTMs();

  // Store UTMs in localStorage for persistence across sessions
  if (Object.keys(utms).length > 0) {
    localStorage.setItem(UTM_KEY, JSON.stringify(utms));
  }

  // Get stored UTMs if no new ones
  let finalUtms = utms;
  if (Object.keys(utms).length === 0) {
    const storedUtms = localStorage.getItem(UTM_KEY);
    if (storedUtms) {
      try {
        finalUtms = JSON.parse(storedUtms);
      } catch {
        // Invalid stored UTMs
      }
    }
  }

  // Create new session
  const session: SessionData = {
    session_id: generateSessionId(),
    created_at: new Date().toISOString(),
    utms: finalUtms,
    user_agent: navigator.userAgent,
    referrer: document.referrer,
    landing_page: window.location.href,
  };

  // Store in sessionStorage
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));

  return session;
}

// Get current session (without creating)
export function getCurrentSession(): SessionData | null {
  if (typeof window === 'undefined') return null;

  const existingSession = sessionStorage.getItem(SESSION_KEY);
  if (existingSession) {
    try {
      return JSON.parse(existingSession);
    } catch {
      return null;
    }
  }
  return null;
}

// Send webhook event
async function sendWebhook(payload: PageViewEvent | ButtonClickEvent | FormSubmitEvent): Promise<boolean> {
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error('Webhook failed:', response.status);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Webhook error:', error);
    return false;
  }
}

// Track page view
export async function trackPageView(variant: 'default' | 'v2' = 'default'): Promise<boolean> {
  const session = getOrCreateSession();

  const event: PageViewEvent = {
    event_type: 'page_view',
    session_id: session.session_id,
    timestamp: new Date().toISOString(),
    page: typeof window !== 'undefined' ? window.location.pathname : '/',
    variant,
    utms: session.utms,
    user_agent: session.user_agent,
    referrer: session.referrer,
  };

  return sendWebhook(event);
}

// Track button click
export async function trackButtonClick(
  buttonAction: string,
  destinationUrl: string,
  variant: 'default' | 'v2' = 'default'
): Promise<boolean> {
  const session = getCurrentSession() || getOrCreateSession();

  const event: ButtonClickEvent = {
    event_type: 'button_click',
    session_id: session.session_id,
    timestamp: new Date().toISOString(),
    button_action: buttonAction,
    page: typeof window !== 'undefined' ? window.location.pathname : '/',
    variant,
    utms: session.utms,
    destination_url: destinationUrl,
  };

  return sendWebhook(event);
}

// Track form submission (for v2 variant)
export async function trackFormSubmit(formData: {
  name: string;
  email: string;
  phone: string;
}): Promise<boolean> {
  const session = getCurrentSession() || getOrCreateSession();

  const event: FormSubmitEvent = {
    event_type: 'form_submit',
    session_id: session.session_id,
    timestamp: new Date().toISOString(),
    page: typeof window !== 'undefined' ? window.location.pathname : '/v2',
    variant: 'v2',
    utms: session.utms,
    form_data: formData,
  };

  return sendWebhook(event);
}
