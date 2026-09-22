let scriptPromise: Promise<void> | undefined;

export function loadRazorpayScript(): Promise<void> {
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve();
    script.onerror = () => {
      scriptPromise = undefined;
      reject(new Error('Failed to load Razorpay. Check your connection and try again.'));
    };
    document.body.appendChild(script);
  });
  return scriptPromise;
}
