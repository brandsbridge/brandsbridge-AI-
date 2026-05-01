import { useState } from "react";
import { signInAnonymously, getAuth } from "firebase/auth";
import { httpsCallable } from "firebase/functions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";
import {
  X,
  Loader2,
  CheckCircle2,
  XCircle,
  ChevronRight,
  ChevronLeft,
  Sparkles,
} from "lucide-react";
import { functions } from "@/lib/firebase";

interface AIInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplier: {
    id: string;
    name: string;
    email: string;
    country: string;
    categories: string[];
    certifications?: string[];
  };
}

type Step = "buyer-info" | "intent" | "sending" | "success" | "error";

type Intent =
  | "pricing"
  | "partnership"
  | "catalog"
  | "samples"
  | "bulk"
  | "custom";

const buyerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  company: z.string().min(2, "Company name required"),
  country: z.string().min(1, "Please select a country"),
  phone: z.string().optional(),
});

type BuyerData = z.infer<typeof buyerSchema>;

const COUNTRIES = [
  "Qatar",
  "United Arab Emirates",
  "Saudi Arabia",
  "Kuwait",
  "Bahrain",
  "Oman",
  "United States",
  "United Kingdom",
  "Germany",
  "France",
  "Italy",
  "Spain",
  "Netherlands",
  "Belgium",
  "Switzerland",
  "Sweden",
  "Turkey",
  "Egypt",
  "Jordan",
  "Lebanon",
  "China",
  "India",
  "Japan",
  "South Korea",
  "Singapore",
  "Other",
];

const INTENTS: ReadonlyArray<{
  id: Intent;
  icon: string;
  title: string;
  description: string;
}> = [
  {
    id: "pricing",
    icon: "💰",
    title: "Request pricing",
    description: "Get FOB/CIF quotes for your target categories",
  },
  {
    id: "partnership",
    icon: "🤝",
    title: "Ask about partnership",
    description: "Explore long-term supply partnership opportunities",
  },
  {
    id: "catalog",
    icon: "📦",
    title: "Request product catalog",
    description: "Get the full product list with specifications",
  },
  {
    id: "samples",
    icon: "🧪",
    title: "Request samples",
    description: "Ask for product samples for evaluation",
  },
  {
    id: "bulk",
    icon: "🏭",
    title: "Discuss bulk orders",
    description: "Inquire about volume pricing and capacity",
  },
  {
    id: "custom",
    icon: "✏️",
    title: "Custom message",
    description: "Write your own inquiry topic",
  },
];

const INTENT_PROMPTS: Record<Exclude<Intent, "custom">, string> = {
  pricing: "Request pricing for the listed product categories",
  partnership: "Explore long-term supply partnership opportunities",
  catalog: "Request the full product catalog with specifications",
  samples: "Request product samples for evaluation",
  bulk: "Discuss bulk order capabilities, volume pricing, and capacity",
};

interface GenerateRequest {
  supplier: {
    id: string;
    name: string;
    country: string;
    categories: string[];
    certifications?: string[];
  };
  buyer: BuyerData;
  intent: string;
}

interface GenerateResponse {
  subject: string;
  body: string;
  metadata: {
    model: string;
    promptVersion: string;
    tokensUsed: number;
  };
}

interface SendRequest {
  supplier: {
    id: string;
    name: string;
    email: string;
    country: string;
  };
  buyer: BuyerData;
  subject: string;
  message: string;
  editedByUser: boolean;
}

interface SendResponse {
  inquiryId: string;
  status: string;
}

export default function AIInquiryModal({
  isOpen,
  onClose,
  supplier,
}: AIInquiryModalProps) {
  const [step, setStep] = useState<Step>("buyer-info");
  const [buyerData, setBuyerData] = useState<BuyerData | null>(null);
  const [intent, setIntent] = useState<Intent | null>(null);
  const [customMessage, setCustomMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BuyerData>({
    resolver: zodResolver(buyerSchema),
  });

  if (!isOpen) return null;

  const handleClose = () => {
    setStep("buyer-info");
    setBuyerData(null);
    setIntent(null);
    setCustomMessage("");
    setErrorMessage("");
    reset();
    onClose();
  };

  const onBuyerSubmit = (data: BuyerData) => {
    setBuyerData(data);
    setStep("intent");
  };

  const canSend =
    intent !== null &&
    (intent !== "custom" || customMessage.trim().length >= 10);

  const sendInquiry = async () => {
    if (!buyerData || !intent) return;
    setErrorMessage("");
    setStep("sending");

    try {
      const auth = getAuth();
      if (!auth.currentUser) {
        await signInAnonymously(auth);
      }

      const buyerPayload: BuyerData = {
        name: buyerData.name,
        email: buyerData.email,
        company: buyerData.company,
        country: buyerData.country,
        ...(buyerData.phone ? { phone: buyerData.phone } : {}),
      };

      const intentString =
        intent === "custom" ? customMessage.trim() : INTENT_PROMPTS[intent];

      const generate = httpsCallable<GenerateRequest, GenerateResponse>(
        functions,
        "generateInquiryDraft",
      );
      const generated = await generate({
        supplier: {
          id: supplier.id,
          name: supplier.name,
          country: supplier.country,
          categories: supplier.categories,
          certifications: supplier.certifications,
        },
        buyer: buyerPayload,
        intent: intentString,
      });

      const draft = generated.data;

      const send = httpsCallable<SendRequest, SendResponse>(
        functions,
        "sendInquiry",
      );
      await send({
        supplier: {
          id: supplier.id,
          name: supplier.name,
          email: supplier.email,
          country: supplier.country,
        },
        buyer: buyerPayload,
        subject: draft.subject,
        message: draft.body,
        editedByUser: false,
      });

      setStep("success");
      toast.success(`✅ Inquiry sent to ${supplier.name}`);
      setTimeout(() => handleClose(), 2500);
    } catch (err) {
      const e = err as { code?: string; message?: string };
      let friendly = "Failed to send inquiry. Please try again.";
      if (e.code === "functions/unauthenticated") {
        friendly = "Authentication failed. Please refresh and try again.";
      } else if (e.code === "functions/failed-precondition") {
        friendly = e.message || friendly;
      }
      console.error("Inquiry send failed:", err);
      setErrorMessage(friendly);
      setStep("error");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/50 rounded-2xl max-w-2xl w-full my-8 shadow-2xl">
        <div className="flex items-start justify-between p-6 border-b border-slate-700/50">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h2 className="text-xl font-bold text-white">Send AI Inquiry</h2>
            </div>
            <p className="text-sm text-slate-400">
              We&apos;ll craft a professional inquiry to{" "}
              <span className="text-amber-400 font-medium">
                {supplier.name}
              </span>
            </p>
          </div>
          {step !== "sending" && (
            <button
              onClick={handleClose}
              className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {step === "buyer-info" && (
          <form
            onSubmit={handleSubmit(onBuyerSubmit)}
            className="p-6 space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Full Name <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  {...register("name")}
                  placeholder="Your full name"
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-colors"
                />
                {errors.name && (
                  <p className="text-xs text-red-400 mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Email <span className="text-amber-400">*</span>
                </label>
                <input
                  type="email"
                  {...register("email")}
                  placeholder="you@company.com"
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-colors"
                />
                {errors.email && (
                  <p className="text-xs text-red-400 mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Company <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  {...register("company")}
                  placeholder="Your company name"
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-colors"
                />
                {errors.company && (
                  <p className="text-xs text-red-400 mt-1">
                    {errors.company.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Country <span className="text-amber-400">*</span>
                </label>
                <select
                  {...register("country")}
                  defaultValue=""
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-colors"
                >
                  <option value="" disabled>
                    Select your country
                  </option>
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                {errors.country && (
                  <p className="text-xs text-red-400 mt-1">
                    {errors.country.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Phone{" "}
                <span className="text-slate-500 text-xs font-normal">
                  (optional)
                </span>
              </label>
              <input
                type="tel"
                {...register("phone")}
                placeholder="+974 1234 5678"
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-colors"
              />
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-5 border-t border-slate-700/50 -mx-6 px-6 -mb-6 pb-6">
              <button
                type="button"
                onClick={handleClose}
                className="px-5 py-2.5 text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-semibold rounded-lg transition-colors"
              >
                Continue
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {step === "intent" && (
          <div className="p-6">
            <div className="mb-5">
              <h3 className="text-lg font-semibold text-white mb-1">
                What would you like to ask?
              </h3>
              <p className="text-sm text-slate-400">
                Choose the type of inquiry — our AI will craft a professional
                message
              </p>
            </div>

            <div className="space-y-2">
              {INTENTS.map((opt) => {
                const selected = intent === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setIntent(opt.id)}
                    className={`w-full flex items-start gap-3 p-4 rounded-lg border text-left transition-colors ${
                      selected
                        ? "bg-amber-500/10 border-amber-500"
                        : "bg-slate-800/50 border-slate-700 hover:border-amber-500/50"
                    }`}
                  >
                    <span className="text-2xl leading-none">{opt.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`font-semibold ${selected ? "text-amber-300" : "text-white"}`}
                      >
                        {opt.title}
                      </p>
                      <p className="text-sm text-slate-400 mt-0.5">
                        {opt.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {intent === "custom" && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Your inquiry topic{" "}
                  <span className="text-amber-400">*</span>
                </label>
                <textarea
                  rows={3}
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  maxLength={500}
                  placeholder="Describe what you want to ask about..."
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-colors resize-none"
                />
                <p className="text-xs text-slate-500 mt-1">
                  {customMessage.length}/500 — minimum 10 characters
                </p>
              </div>
            )}

            <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3 pt-5 mt-6 border-t border-slate-700/50">
              <button
                type="button"
                onClick={() => setStep("buyer-info")}
                className="flex items-center justify-center gap-2 px-5 py-2.5 text-slate-400 hover:text-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
              <button
                type="button"
                onClick={sendInquiry}
                disabled={!canSend}
                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-slate-900 font-semibold rounded-lg transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                Generate &amp; Send
              </button>
            </div>
          </div>
        )}

        {step === "sending" && (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <Loader2 className="w-12 h-12 text-amber-400 animate-spin mb-4" />
            <h3 className="text-lg font-semibold text-white mb-1">
              Crafting your inquiry with AI...
            </h3>
            <p className="text-sm text-slate-400">
              This usually takes 5-10 seconds
            </p>
          </div>
        )}

        {step === "success" && (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-9 h-9 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-1">
              Inquiry sent!
            </h3>
            <p className="text-sm text-slate-400 max-w-sm">
              {supplier.name} will review your inquiry and respond soon.
            </p>
          </div>
        )}

        {step === "error" && (
          <div className="p-8 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-4">
              <XCircle className="w-9 h-9 text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-1">
              Something went wrong
            </h3>
            <p className="text-sm text-slate-400 max-w-sm mb-6">
              {errorMessage}
            </p>
            <div className="flex flex-col-reverse sm:flex-row gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleClose}
                className="px-5 py-2.5 text-slate-400 hover:text-white transition-colors"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => setStep("intent")}
                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-semibold rounded-lg transition-colors"
              >
                Try again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
