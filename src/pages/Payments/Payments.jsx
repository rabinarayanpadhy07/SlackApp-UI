import { ArrowRightIcon, BadgeCheckIcon, CreditCardIcon, Layers3Icon } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { RenderRazorpayPopup } from '@/components/molecules/RenderRazorpayPopup/RenderRazorpayPopup';
import { Button } from '@/components/ui/button';
import { useCreateOrder } from '@/hooks/apis/payments/useCreateOrder';
import { useAuth } from '@/hooks/context/useAuth';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

export const Payments = () => {
    const amount = 49;
    const navigate = useNavigate();
    const { auth } = useAuth();
    const [orderResponse, setOrderResponse] = useState(null);
    const { createOrderMutation, isPending } = useCreateOrder();
    const isPaidPlan = auth?.user?.plan === 'Paid';

    async function handleFormSubmit(e) {
        e.preventDefault();
        try {
            const response = await createOrderMutation(amount * 100);
            console.log('order response', response);
            setOrderResponse(response);
        } catch (error) {
            toast.error('Unable to start payment', {
                description: getApiErrorMessage(error, 'Please try again in a moment.')
            });
        }
    }

    if (isPaidPlan) {
        return (
            <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#eff6ff,_#e0e7ff_35%,_#f8fafc_70%)] px-4 py-10">
                <div className="mx-auto flex min-h-[80vh] max-w-3xl items-center justify-center">
                    <div className="w-full rounded-[28px] border border-emerald-200/70 bg-white/90 p-8 shadow-[0_24px_80px_-36px_rgba(16,185,129,0.45)] backdrop-blur">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
                            <BadgeCheckIcon className="size-4" />
                            Paid plan active
                        </div>
                        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Your account is already upgraded.</h1>
                        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                            You already have unlimited workspace and channel access on this account. Head back home and keep building.
                        </p>
                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <Button onClick={() => navigate('/home')} className="gap-2 rounded-full px-6">
                                Go to home
                                <ArrowRightIcon className="size-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#eff6ff,_#dbeafe_28%,_#f8fafc_68%)] px-4 py-10">
            <div className="mx-auto grid min-h-[80vh] max-w-5xl items-center gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                <section className="rounded-[32px] border border-white/70 bg-slate-950 px-8 py-10 text-white shadow-[0_30px_80px_-40px_rgba(15,23,42,0.85)]">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/80">
                        <Layers3Icon className="size-4" />
                        Upgrade your workspace power
                    </div>
                    <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-tight">Switch to Paid and remove the limits.</h1>
                    <p className="mt-4 max-w-2xl text-sm leading-6 text-white/70">
                        Paid users can create unlimited workspaces and channels, so your team setup stops fighting the product and starts moving faster.
                    </p>
                    <div className="mt-8 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                            <p className="text-sm font-medium text-white">Normal plan</p>
                            <p className="mt-2 text-sm text-white/65">1 workspace, up to 2 channels per workspace, basic setup.</p>
                        </div>
                        <div className="rounded-3xl border border-sky-400/30 bg-sky-400/10 p-5">
                            <p className="text-sm font-medium text-sky-100">Paid plan</p>
                            <p className="mt-2 text-sm text-sky-50/80">Unlimited workspaces and channels for growing teams.</p>
                        </div>
                    </div>
                </section>

                <section className="rounded-[32px] border border-slate-200/80 bg-white/90 p-8 shadow-[0_24px_80px_-36px_rgba(15,23,42,0.28)] backdrop-blur">
                    <div className="mb-6 flex items-center gap-3 text-slate-900">
                        <div className="rounded-2xl bg-blue-50 p-3 text-blue-600">
                            <CreditCardIcon className="size-6" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold">Upgrade to Paid</h2>
                            <p className="text-sm text-slate-500">One quick checkout to unlock the full workspace flow.</p>
                        </div>
                    </div>

                    <form onSubmit={handleFormSubmit} className="space-y-6">
                        <div className="rounded-3xl bg-slate-50 p-5 text-center">
                            <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Today</p>
                            <p className="mt-3 text-4xl font-semibold text-slate-900">Rs. {amount}.00</p>
                            <p className="mt-2 text-sm text-slate-500">Secure Razorpay checkout</p>
                        </div>

                        <div className="space-y-3 text-sm text-slate-600">
                            <p>Unlimited workspaces</p>
                            <p>Unlimited channels</p>
                            <p>Immediate plan activation after successful payment</p>
                        </div>

                        <div className="flex flex-col gap-3">
                            <Button
                                type="submit"
                                disabled={isPending}
                                className="h-12 rounded-full text-base font-medium"
                            >
                                {isPending ? 'Starting checkout...' : 'Continue to payment'}
                            </Button>
                            <Button type="button" variant="outline" className="rounded-full" onClick={() => navigate('/home')}>
                                Back to home
                            </Button>
                        </div>
                    </form>
                </section>
            </div>

            {orderResponse?.id ? (
                <RenderRazorpayPopup
                    amount={amount * 100}
                    orderId={orderResponse.id}
                    keyId={import.meta.env.VITE_RAZORPAY_KEY_ID}
                    currency="INR"
                />
            ) : null}
        </div>
    );
};
