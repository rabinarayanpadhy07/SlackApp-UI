import {
  ArrowRightIcon,
  BadgeCheckIcon,
  CheckIcon
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { RenderRazorpayPopup } from "@/components/molecules/RenderRazorpayPopup/RenderRazorpayPopup";
import { Button } from "@/components/ui/button";
import { useCreateOrder } from "@/hooks/apis/payments/useCreateOrder";
import { useAuth } from "@/hooks/context/useAuth";
import { getApiErrorMessage } from "@/utils/getApiErrorMessage";

export const Payments = () => {
  const amount = 49;
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [orderResponse, setOrderResponse] = useState(null);
  const { createOrderMutation, isPending } = useCreateOrder();

  const isPaidPlan = auth?.user?.plan === "Paid";

  async function handleFormSubmit(e) {
    e.preventDefault();
    try {
      const response = await createOrderMutation(amount * 100);
      setOrderResponse(response);
    } catch (error) {
      toast.error("Unable to start payment", {
        description: getApiErrorMessage(error, "Please try again."),
      });
    }
  }

  return (
    <div className="min-h-screen bg-[#4A154B] px-4 py-10">
      <div className="max-w-5xl mx-auto grid gap-6 md:grid-cols-2">

        {/* NORMAL PLAN */}
        <div className="bg-[#350D36] text-white rounded-2xl p-8 shadow-lg flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-4">Normal Plan</h2>
            <ul className="space-y-3 text-white/80">
              <li className="flex items-center gap-2">
                <CheckIcon size={18}/> 1 Workspace
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon size={18}/> 2 Channels per workspace
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon size={18}/> Basic setup
              </li>
            </ul>
          </div>

          <Button
            className="mt-8 w-full rounded-full bg-white text-[#350D36] hover:bg-gray-200 cursor-pointer"
            onClick={() => navigate("/home")}
          >
            {isPaidPlan ? "Downgrade (Current Premium)" : "Continue With Current Plan"}
          </Button>
        </div>

        {/* PREMIUM PLAN */}
        <div className={`bg-white rounded-2xl p-8 shadow-xl flex flex-col justify-between border-2 ${
          isPaidPlan ? "border-green-500" : "border-[#4A154B]"
        }`}>
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                Premium Plan
              </h2>

              {isPaidPlan && (
                <span className="text-green-600 font-semibold text-sm flex items-center gap-1">
                  <BadgeCheckIcon size={18}/> Current Plan
                </span>
              )}
            </div>

            <ul className="space-y-3 text-gray-600">
              <li className="flex items-center gap-2">
                <CheckIcon size={18}/> Unlimited Workspace
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon size={18}/> Unlimited Channels
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon size={18}/> AI Message Reply
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon size={18}/> AI Meeting Summary
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon size={18}/> Priority Support
              </li>
            </ul>

            <div className="mt-6 bg-gray-100 rounded-xl p-6 text-center">
              <p className="text-sm text-gray-500">Price</p>
              <p className="text-4xl font-bold text-gray-900">₹ {amount}</p>
              <p className="text-sm text-gray-500">One-time payment</p>
            </div>
          </div>

          <form onSubmit={handleFormSubmit} className="mt-6">
            <Button
              type="submit"
              disabled={isPending || isPaidPlan}
              className="h-12 w-full rounded-full bg-[#611F69] hover:bg-[#4A154B] text-white text-lg cursor-pointer"
            >
              {isPaidPlan ? "You Already Own Premium" : "Upgrade to Premium"}
              {!isPaidPlan && <ArrowRightIcon className="ml-2 size-4" />}
            </Button>
          </form>
        </div>
      </div>

      {/* Razorpay */}
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