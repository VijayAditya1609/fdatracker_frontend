import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Check, XCircle, CreditCard, Calendar, User, FileText, DollarSign, Download } from "lucide-react";
import DashboardLayout from "../components/layouts/DashboardLayout";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { auth } from "../services/auth";
import { api, API_BASE_URL } from '../config/api';
import { authFetch } from "../services/authFetch";


interface CustomerDetails {
  email: string;
}

interface LineItem {
  description: string;
}

interface PaymentData {
  id: string;
  customer_details?: CustomerDetails;
  payment_method_types?: string[];
  amountTotal?: number;
  currency?: string;
  line_items?: {
    data: LineItem[];
  };
  created?: number;
  paymentStatus?: string;
  subscriptionId?: string;
  invoice?: string;
  invoice_url?: string;
}

export default function Success() {
  const [loading, setLoading] = useState(true);
  const [payment, setPayment] = useState<PaymentData | null>(null);
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useDocumentTitle("Payment Success");

  useEffect(() => {
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
        setError("Invalid session. No session_id found.");
        setLoading(false);
        return;
    }

    const fetchPaymentDetails = async () => {
        try {
            const baseUrl = `${API_BASE_URL}`;
            
            const url = `${baseUrl}/api/checkout-session?session_id=${sessionId}`;
            const response = await authFetch(url, {
              method: 'GET'
          });
          

            const responseText = await response.text();
            let data;
            try {
                data = JSON.parse(responseText);
            } catch (e) {
                console.error('Failed to parse response as JSON:', e);
                throw new Error('Server returned invalid JSON response');
            }

            if (data.error) {
                throw new Error(data.message || 'Failed to fetch payment details');
            }

            // Set the fetched payment data
            setPayment(data);

        } catch (error) {
            setError(error instanceof Error ? error.message : "Error fetching payment details.");
        } finally {
            setLoading(false);
        }
    };

    fetchPaymentDetails();
}, [searchParams]);


  return (
    <DashboardLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-12 flex justify-center items-center min-h-screen">
        <div className="w-full max-w-3xl bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6 sm:p-8 lg:p-10">
          <div className="text-center">
            {loading ? (
              <p className="text-lg text-gray-300">Verifying payment...</p>
            ) : error ? (
              <>
                <XCircle className="text-red-500 mx-auto" size={64} />
                <h1 className="text-2xl sm:text-3xl font-semibold text-white mt-4">Payment Verification Failed</h1>
                <p className="mt-2 text-gray-400">{error}</p>
              </>
            ) : (
              <>
                <Check className="text-green-500 mx-auto" size={64} />
                <h1 className="text-2xl sm:text-3xl font-semibold text-white mt-4">Payment Successful!</h1>
                <p className="mt-2 text-gray-400">Thank you for your payment. Your subscription is now active.</p>

                {/* Payment Details */}
                <div className="mt-6 text-left border-t border-gray-700 pt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <User className="text-blue-400" size={20} />
                      <p><span className="font-semibold text-gray-300">Customer Email:</span> {payment?.customer_details?.email || "N/A"}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CreditCard className="text-green-400" size={20} />
                      <p><span className="font-semibold text-gray-300">Payment Method:</span> {payment?.payment_method_types?.[0] || "N/A"}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <DollarSign className="text-yellow-400" size={20} />
                      <p><span className="font-semibold text-gray-300">Amount Paid:</span> ${payment?.amountTotal ? payment.amountTotal / 100 : "N/A"} {payment?.currency?.toUpperCase() || ""}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Check className="text-green-500" size={20} />
                      <p><span className="font-semibold text-gray-300">Payment Status:</span> ✅ {payment?.paymentStatus ? payment.paymentStatus.charAt(0).toUpperCase() + payment.paymentStatus.slice(1) : "N/A"}</p>
                    </div>
                  </div>

                  {/* Show Stripe IDs */}
                  <div className="mt-4 text-sm border-t border-gray-700 pt-4">
                    <p className="text-gray-400">Subscription ID: <span className="text-gray-300">{payment?.subscriptionId || "N/A"}</span></p>
                    <p className="text-gray-400">Invoice ID: <span className="text-gray-300">{payment?.invoice || "N/A"}</span></p>
                  </div>

                  {/* Download Invoice Button */}
                  {payment?.invoice_url && (
                    <div className="mt-6 flex justify-center">
                      <a
                        href={payment.invoice_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 bg-blue-500 text-white rounded-md px-6 py-3 
                                   hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 
                                   focus:                                   ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                      >
                        <Download size={20} />
                        <span>Download Invoice</span>
                      </a>
                    </div>
                  )}
                </div>
              </>
            )}

            <div className="mt-8">
              <button
                onClick={() => navigate("/dashboard")}
                className="bg-blue-500 text-white rounded-md px-6 py-3 w-full sm:w-auto
                           hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 
                           focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}