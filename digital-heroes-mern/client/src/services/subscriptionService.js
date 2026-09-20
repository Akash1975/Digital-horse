import api from "./api";

// Get current user's subscription
export const getMySubscription = async () => {
    const response = await api.get(
        "/subscriptions/my-subscription"
    );

    return response.data;
};

// Create Stripe checkout session
export const createCheckoutSession = async (subscriptionData) => {
    const response = await api.post(
        "/subscriptions/checkout",
        subscriptionData
    );

    return response.data;
};

// Cancel subscription
export const cancelSubscription = async () => {
    const response = await api.patch(
        "/subscriptions/cancel"
    );

    return response.data;
};

// Resume subscription
export const resumeSubscription = async () => {
    const response = await api.patch(
        "/subscriptions/resume"
    );

    return response.data;
};