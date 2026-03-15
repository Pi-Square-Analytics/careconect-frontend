
/**
 * Taag API integration for Card and Mobile Money (MoMo) payments.
 * Documentation: https://docs.taag.cc/introduction
 */

export const TAAG_CONFIG = {
  CHECKOUT_URL: 'https://billing.taag.cc/checkout',
  PRICING_URL: 'https://api.taag.cc/v1/verify/pricing',
};

/**
 * Initiates a payment by redirecting the user to the Taag hosted checkout page.
 * Both Card and Mobile Money options are available on this page.
 * 
 * @param planId The ID of the plan to charge for.
 * @param customerDetails Optional details to pre-fill the checkout form.
 */
export const initiateTaagPayment = (
  planId: string,
  customerDetails?: {
    email?: string;
    firstname?: string;
    lastname?: string;
  }
) => {
  const params = new URLSearchParams({ planId });
  
  if (customerDetails?.email) params.append('email', customerDetails.email);
  if (customerDetails?.firstname) params.append('firstname', customerDetails.firstname);
  if (customerDetails?.lastname) params.append('lastname', customerDetails.lastname);

  const checkoutUrl = `${TAAG_CONFIG.CHECKOUT_URL}?${params.toString()}`;
  
  // Redirect to the checkout page
  if (typeof window !== 'undefined') {
    window.location.href = checkoutUrl;
  }
};

/**
 * Fetches available plans from Taag.
 * Requires a public key in the Authorization header.
 * 
 * @param publicKey Taag public key (taag_pk_mode_xxxxxxxxx)
 */
export const getTaagPlans = async (publicKey: string) => {
  const response = await fetch(TAAG_CONFIG.PRICING_URL, {
    headers: {
      Authorization: publicKey,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch Taag pricing plans');
  }

  return response.json();
};
