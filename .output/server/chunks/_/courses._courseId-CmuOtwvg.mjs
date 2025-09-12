import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { useState, useMemo } from 'react';
import { Link } from '@tanstack/react-router';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { Loader2, BookOpen, ArrowLeft, Users, Star, Clock, Globe, Heart, Share2, Target, CheckCircle, ChevronUp, ChevronDown, Play, Lock, MessageSquare, CreditCard, Download, Award, Calendar, Gift, X, AlertCircle } from 'lucide-react';
import { a as api } from './api-client-Dtm8Zh8Q.mjs';
import { R as Route$h, u as useAuth, B as Button, c as cn, I as Input } from './ssr.mjs';
import { P as Progress } from './progress-B-kuOVqI.mjs';
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from './tabs-nVzR7rtM.mjs';
import { D as Dialog, a as DialogTrigger, b as DialogContent, c as DialogHeader, d as DialogTitle, e as DialogDescription, f as DialogFooter } from './dialog-5HmVNweK.mjs';
import { L as Label } from './label-DJNj9mF1.mjs';
import { S as Switch } from './switch-CLxgkQ9s.mjs';
import { createCheckout, getCheckout, listProducts, listVariants, getSubscription, cancelSubscription, updateSubscription, getCustomer } from '@lemonsqueezy/lemonsqueezy.js';
import '@tanstack/router-ssr-query-core';
import '@tanstack/react-devtools';
import '@radix-ui/react-slot';
import 'class-variance-authority';
import 'clsx';
import 'tailwind-merge';
import '@radix-ui/react-dropdown-menu';
import '@tanstack/react-query-devtools';
import 'node:fs';
import 'tiny-invariant';
import 'tiny-warning';
import '@tanstack/router-core';
import '@tanstack/router-core/ssr/client';
import 'node:async_hooks';
import '@modelcontextprotocol/sdk/server/mcp.js';
import 'zod';
import '@modelcontextprotocol/sdk/server/streamableHttp.js';
import '@tanstack/history';
import '@tanstack/router-core/ssr/server';
import '@tanstack/react-router/ssr/server';
import '@radix-ui/react-progress';
import '@radix-ui/react-tabs';
import '@radix-ui/react-dialog';
import '@radix-ui/react-label';
import '@radix-ui/react-switch';

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, key + "" , value);
const LEMON_SQUEEZY_STORE_ID = void 0;
const _LemonSqueezyService = class _LemonSqueezyService2 {
  static getInstance() {
    if (!_LemonSqueezyService2.instance) {
      _LemonSqueezyService2.instance = new _LemonSqueezyService2();
    }
    return _LemonSqueezyService2.instance;
  }
  constructor() {
    {
      console.warn("Lemon Squeezy API key not found. Payment functionality will be limited.");
    }
  }
  /**
   * Create a checkout session for a course purchase
   */
  async createCourseCheckout(data) {
    var _a;
    try {
      const checkoutData = {
        data: {
          type: "checkouts",
          attributes: {
            product_options: {
              name: data.courseTitle,
              description: `Access to ${data.courseTitle} course with lifetime access`
            },
            checkout_options: {
              embed: false,
              media: true,
              logo: true
            },
            checkout_data: {
              email: data.userEmail,
              name: data.userName,
              custom: {
                course_id: data.courseId,
                user_id: data.userId,
                purchase_type: "course"
              }
            },
            expires_at: null
            // No expiration
          },
          relationships: {
            store: {
              data: {
                type: "stores",
                id: LEMON_SQUEEZY_STORE_ID || ""
              }
            },
            variant: {
              data: {
                type: "variants",
                id: await this.getOrCreateCourseVariant(data)
              }
            }
          }
        }
      };
      const checkout = await createCheckout(LEMON_SQUEEZY_STORE_ID || "", checkoutData);
      if (checkout.error) {
        throw new Error(checkout.error.message);
      }
      return ((_a = checkout.data) == null ? void 0 : _a.data.attributes.url) || "";
    } catch (error) {
      console.error("Error creating course checkout:", error);
      throw new Error("Failed to create checkout session");
    }
  }
  /**
   * Create a checkout session for subscription
   */
  async createSubscriptionCheckout(data) {
    var _a;
    try {
      const checkoutData = {
        data: {
          type: "checkouts",
          attributes: {
            product_options: {
              name: `${data.planName} Subscription`,
              description: `Monthly access to all premium courses and features`
            },
            checkout_options: {
              embed: false,
              media: true,
              logo: true
            },
            checkout_data: {
              email: data.userEmail,
              name: data.userName,
              custom: {
                user_id: data.userId,
                purchase_type: "subscription",
                plan_name: data.planName
              }
            },
            expires_at: null
          },
          relationships: {
            store: {
              data: {
                type: "stores",
                id: LEMON_SQUEEZY_STORE_ID || ""
              }
            },
            variant: {
              data: {
                type: "variants",
                id: data.variantId
              }
            }
          }
        }
      };
      const checkout = await createCheckout(LEMON_SQUEEZY_STORE_ID || "", checkoutData);
      if (checkout.error) {
        throw new Error(checkout.error.message);
      }
      return ((_a = checkout.data) == null ? void 0 : _a.data.attributes.url) || "";
    } catch (error) {
      console.error("Error creating subscription checkout:", error);
      throw new Error("Failed to create checkout session");
    }
  }
  /**
   * Get checkout details by ID
   */
  async getCheckoutById(checkoutId) {
    var _a;
    try {
      const checkout = await getCheckout(checkoutId);
      if (checkout.error) {
        throw new Error(checkout.error.message);
      }
      return ((_a = checkout.data) == null ? void 0 : _a.data) || null;
    } catch (error) {
      console.error("Error fetching checkout:", error);
      return null;
    }
  }
  /**
   * Get all available products
   */
  async getProducts() {
    var _a;
    try {
      const products = await listProducts({
        filter: { storeId: LEMON_SQUEEZY_STORE_ID }
      });
      if (products.error) {
        throw new Error(products.error.message);
      }
      return ((_a = products.data) == null ? void 0 : _a.data) || [];
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  }
  /**
   * Get variants for a product
   */
  async getProductVariants(productId) {
    var _a;
    try {
      const variants = await listVariants({
        filter: { productId }
      });
      if (variants.error) {
        throw new Error(variants.error.message);
      }
      return ((_a = variants.data) == null ? void 0 : _a.data) || [];
    } catch (error) {
      console.error("Error fetching variants:", error);
      return [];
    }
  }
  /**
   * Get subscription details
   */
  async getSubscriptionById(subscriptionId) {
    var _a;
    try {
      const subscription = await getSubscription(subscriptionId);
      if (subscription.error) {
        throw new Error(subscription.error.message);
      }
      return ((_a = subscription.data) == null ? void 0 : _a.data) || null;
    } catch (error) {
      console.error("Error fetching subscription:", error);
      return null;
    }
  }
  /**
   * Cancel a subscription
   */
  async cancelSubscriptionById(subscriptionId) {
    try {
      const result = await cancelSubscription(subscriptionId);
      if (result.error) {
        throw new Error(result.error.message);
      }
      return true;
    } catch (error) {
      console.error("Error canceling subscription:", error);
      return false;
    }
  }
  /**
   * Update subscription (pause/resume/change billing)
   */
  async updateSubscriptionById(subscriptionId, updates) {
    var _a;
    try {
      const result = await updateSubscription(subscriptionId, {
        data: {
          type: "subscriptions",
          id: subscriptionId,
          attributes: updates
        }
      });
      if (result.error) {
        throw new Error(result.error.message);
      }
      return ((_a = result.data) == null ? void 0 : _a.data) || null;
    } catch (error) {
      console.error("Error updating subscription:", error);
      return null;
    }
  }
  /**
   * Get customer details
   */
  async getCustomerById(customerId) {
    var _a;
    try {
      const customer = await getCustomer(customerId);
      if (customer.error) {
        throw new Error(customer.error.message);
      }
      return ((_a = customer.data) == null ? void 0 : _a.data) || null;
    } catch (error) {
      console.error("Error fetching customer:", error);
      return null;
    }
  }
  /**
   * Create or get existing variant for a course
   * This is a helper method that would integrate with your backend
   */
  async getOrCreateCourseVariant(data) {
    return `variant_${data.courseId}`;
  }
  /**
   * Validate webhook signature (to be implemented on backend)
   */
  static validateWebhookSignature(payload, signature, secret) {
    return true;
  }
};
__publicField(_LemonSqueezyService, "instance");
let LemonSqueezyService = _LemonSqueezyService;
const lemonSqueezyService = LemonSqueezyService.getInstance();
function PaymentModal({
  children,
  type,
  courseData,
  subscriptionData,
  onSuccess,
  onCancel
}) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const isCourse = type === "course";
  const isSubscription = type === "subscription";
  const formatPrice = (price, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency
    }).format(price);
  };
  const calculateFinalPrice = () => {
    const basePrice = isCourse ? (courseData == null ? void 0 : courseData.price) || 0 : (subscriptionData == null ? void 0 : subscriptionData.price) || 0;
    if (appliedCoupon) {
      return basePrice * (1 - appliedCoupon.discount / 100);
    }
    return basePrice;
  };
  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    if (couponCode.toLowerCase() === "student10") {
      setAppliedCoupon({ code: couponCode, discount: 10 });
      setError("");
    } else if (couponCode.toLowerCase() === "welcome20") {
      setAppliedCoupon({ code: couponCode, discount: 20 });
      setError("");
    } else {
      setError("Invalid coupon code");
      setAppliedCoupon(null);
    }
  };
  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setError("");
  };
  const handlePayment = async () => {
    if (!user) {
      setError("Please log in to continue");
      return;
    }
    if (!acceptTerms) {
      setError("Please accept the terms and conditions");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      let checkoutUrl = "";
      if (isCourse && courseData) {
        const checkoutData = {
          courseId: courseData.id,
          courseTitle: courseData.title,
          price: calculateFinalPrice(),
          currency: courseData.currency,
          userId: user.id,
          userEmail: user.email,
          userName: user.username
        };
        checkoutUrl = await lemonSqueezyService.createCourseCheckout(checkoutData);
      } else if (isSubscription && subscriptionData) {
        const checkoutData = {
          planName: subscriptionData.planName,
          variantId: subscriptionData.variantId,
          userId: user.id,
          userEmail: user.email,
          userName: user.username
        };
        checkoutUrl = await lemonSqueezyService.createSubscriptionCheckout(checkoutData);
      }
      if (checkoutUrl) {
        window.open(checkoutUrl, "_blank", "width=800,height=800,scrollbars=yes,resizable=yes");
        setIsOpen(false);
        onSuccess == null ? void 0 : onSuccess();
      } else {
        throw new Error("Failed to create checkout session");
      }
    } catch (err) {
      console.error("Payment error:", err);
      setError(err instanceof Error ? err.message : "Payment failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  return /* @__PURE__ */ jsxs(Dialog, { open: isOpen, onOpenChange: setIsOpen, children: [
    /* @__PURE__ */ jsx(DialogTrigger, { asChild: true, onClick: () => setIsOpen(true), children }),
    /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-md", children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Lock, { className: "h-5 w-5 text-primary" }),
          "Complete Your ",
          isCourse ? "Purchase" : "Subscription"
        ] }),
        /* @__PURE__ */ jsx(DialogDescription, { children: isCourse ? "Get lifetime access to this course and all its content" : "Subscribe for unlimited access to all premium courses" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsx("div", { className: "academic-card p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsx("h4", { className: "font-semibold text-foreground", children: isCourse ? courseData == null ? void 0 : courseData.title : `${subscriptionData == null ? void 0 : subscriptionData.planName} Plan` }),
            isSubscription && subscriptionData && /* @__PURE__ */ jsxs("div", { className: "mt-2 space-y-1", children: [
              subscriptionData.features.slice(0, 3).map((feature, index) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [
                /* @__PURE__ */ jsx(CheckCircle, { className: "h-3 w-3 text-success" }),
                /* @__PURE__ */ jsx("span", { children: feature })
              ] }, index)),
              subscriptionData.features.length > 3 && /* @__PURE__ */ jsxs("div", { className: "text-sm text-muted-foreground", children: [
                "+",
                subscriptionData.features.length - 3,
                " more features"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
            isCourse && (courseData == null ? void 0 : courseData.originalPrice) && courseData.originalPrice > courseData.price && /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground line-through", children: formatPrice(courseData.originalPrice, courseData.currency) }),
            /* @__PURE__ */ jsx("div", { className: "text-lg font-bold text-primary", children: isCourse ? formatPrice((courseData == null ? void 0 : courseData.price) || 0, courseData == null ? void 0 : courseData.currency) : `${formatPrice((subscriptionData == null ? void 0 : subscriptionData.price) || 0, subscriptionData == null ? void 0 : subscriptionData.currency)}/month` })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsx(Label, { className: "text-sm font-medium", children: "Coupon Code (Optional)" }),
          !appliedCoupon ? /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsx(
              Input,
              {
                placeholder: "Enter coupon code",
                value: couponCode,
                onChange: (e) => setCouponCode(e.target.value),
                className: "flex-1"
              }
            ),
            /* @__PURE__ */ jsx(
              Button,
              {
                type: "button",
                variant: "outline",
                onClick: applyCoupon,
                disabled: !couponCode.trim(),
                children: "Apply"
              }
            )
          ] }) : /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-3 bg-success/10 border border-success/20 rounded-lg", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Gift, { className: "h-4 w-4 text-success" }),
              /* @__PURE__ */ jsxs("span", { className: "text-sm font-medium", children: [
                appliedCoupon.code,
                " (",
                appliedCoupon.discount,
                "% off)"
              ] })
            ] }),
            /* @__PURE__ */ jsx(
              Button,
              {
                type: "button",
                variant: "ghost",
                size: "sm",
                onClick: removeCoupon,
                className: "h-6 w-6 p-0",
                children: /* @__PURE__ */ jsx(X, { className: "h-3 w-3" })
              }
            )
          ] })
        ] }),
        appliedCoupon && /* @__PURE__ */ jsxs("div", { className: "space-y-2 p-3 bg-muted/50 rounded-lg", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm", children: [
            /* @__PURE__ */ jsx("span", { children: "Subtotal:" }),
            /* @__PURE__ */ jsx("span", { children: isCourse ? formatPrice((courseData == null ? void 0 : courseData.price) || 0, courseData == null ? void 0 : courseData.currency) : formatPrice((subscriptionData == null ? void 0 : subscriptionData.price) || 0, subscriptionData == null ? void 0 : subscriptionData.currency) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm text-success", children: [
            /* @__PURE__ */ jsxs("span", { children: [
              "Discount (",
              appliedCoupon.discount,
              "%):"
            ] }),
            /* @__PURE__ */ jsxs("span", { children: [
              "-",
              formatPrice(
                (isCourse ? (courseData == null ? void 0 : courseData.price) || 0 : (subscriptionData == null ? void 0 : subscriptionData.price) || 0) * (appliedCoupon.discount / 100),
                isCourse ? courseData == null ? void 0 : courseData.currency : subscriptionData == null ? void 0 : subscriptionData.currency
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between font-semibold pt-2 border-t", children: [
            /* @__PURE__ */ jsx("span", { children: "Total:" }),
            /* @__PURE__ */ jsxs("span", { className: "text-primary", children: [
              formatPrice(
                calculateFinalPrice(),
                isCourse ? courseData == null ? void 0 : courseData.currency : subscriptionData == null ? void 0 : subscriptionData.currency
              ),
              isSubscription && "/month"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-start space-x-2", children: [
          /* @__PURE__ */ jsx(
            Switch,
            {
              id: "terms",
              checked: acceptTerms,
              onCheckedChange: setAcceptTerms,
              className: "mt-0.5"
            }
          ),
          /* @__PURE__ */ jsxs(Label, { htmlFor: "terms", className: "text-sm text-muted-foreground leading-relaxed", children: [
            "I accept the",
            " ",
            /* @__PURE__ */ jsx("a", { href: "/terms", className: "text-primary hover:underline", target: "_blank", children: "Terms of Service" }),
            " ",
            "and",
            " ",
            /* @__PURE__ */ jsx("a", { href: "/privacy", className: "text-primary hover:underline", target: "_blank", children: "Privacy Policy" }),
            isSubscription && ". You can cancel your subscription at any time."
          ] })
        ] }),
        error && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive", children: [
          /* @__PURE__ */ jsx(AlertCircle, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx("span", { children: error })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(DialogFooter, { className: "flex-col gap-3", children: [
        /* @__PURE__ */ jsxs(
          Button,
          {
            className: "w-full h-11",
            onClick: handlePayment,
            disabled: isLoading || !acceptTerms || !user,
            children: [
              isLoading ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin mr-2" }) : /* @__PURE__ */ jsx(CreditCard, { className: "h-4 w-4 mr-2" }),
              isLoading ? "Processing..." : `Complete ${isCourse ? "Purchase" : "Subscription"} - ${formatPrice(calculateFinalPrice(), isCourse ? courseData == null ? void 0 : courseData.currency : subscriptionData == null ? void 0 : subscriptionData.currency)}${isSubscription ? "/month" : ""}`
            ]
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsx(Lock, { className: "h-3 w-3" }),
          /* @__PURE__ */ jsx("span", { children: "Secured by Lemon Squeezy \u2022 SSL Encrypted" })
        ] })
      ] })
    ] })
  ] });
}
function CourseDetailPage() {
  var _a2;
  var _a, _b, _c, _d, _e, _f;
  const {
    courseId
  } = Route$h.useParams();
  const {
    token,
    user
  } = useAuth();
  const qc = useQueryClient();
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [selectedTab, setSelectedTab] = useState("overview");
  const {
    data: course,
    isLoading,
    error
  } = useQuery({
    queryKey: ["course", courseId],
    queryFn: async () => (await api.getCourse(courseId)).data
  });
  const lecturesQuery = useQuery({
    queryKey: ["lectures", courseId],
    queryFn: async () => (await api.listLectures(courseId)).data,
    enabled: !!courseId
  });
  const {
    data: enrollmentData
  } = useQuery({
    queryKey: ["enrollment", courseId],
    queryFn: async () => {
      if (!token) return null;
      try {
        const res = await api.getEnrollment(token, courseId);
        return res.data;
      } catch {
        return null;
      }
    },
    enabled: !!user && !!token
  });
  const isUserEnrolled = useMemo(() => {
    return !!enrollmentData;
  }, [enrollmentData]);
  const enrollFree = async () => {
    if (!token) return alert("Please login first");
    if ((course == null ? void 0 : course.price) && course.price > 0) {
      alert("This is a paid course. Please use the payment option.");
      return;
    }
    try {
      await api.enroll(token, courseId);
      await qc.invalidateQueries({
        queryKey: ["enrollment", courseId]
      });
      setIsEnrolled(true);
      alert("Successfully enrolled!");
    } catch (error2) {
      alert("Enrollment failed. Please try again.");
    }
  };
  const handlePaymentSuccess = async () => {
    try {
      if (token) {
        await api.enroll(token, courseId);
        await qc.invalidateQueries({
          queryKey: ["enrollment", courseId]
        });
        setIsEnrolled(true);
      }
    } catch (error2) {
      console.error("Post-payment enrollment failed:", error2);
      alert("Payment successful! Please contact support if you cannot access the course.");
    }
  };
  const formatDuration = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };
  const formatPrice = (price, currency = "USD") => {
    if (price === 0) return "Free";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency
    }).format(price);
  };
  if (isLoading) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-[50vh] flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsx(Loader2, { className: "h-6 w-6 animate-spin text-primary" }),
      /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Loading course..." })
    ] }) });
  }
  if (error || !course) {
    return /* @__PURE__ */ jsxs("div", { className: "min-h-[50vh] flex flex-col items-center justify-center", children: [
      /* @__PURE__ */ jsx(BookOpen, { className: "h-12 w-12 text-muted-foreground mb-4" }),
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold mb-2", children: "Course not found" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mb-4", children: "The course you're looking for doesn't exist or has been removed." }),
      /* @__PURE__ */ jsx(Button, { asChild: true, children: /* @__PURE__ */ jsxs(Link, { to: "/courses", children: [
        /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4 mr-2" }),
        "Back to Courses"
      ] }) })
    ] });
  }
  const lectures = (_a2 = (_a = lecturesQuery.data) == null ? void 0 : _a.lectures) != null ? _a2 : [];
  const totalDuration = lectures.reduce((sum, lecture) => sum + (lecture.duration_minutes || 0), 0);
  const completedLectures = lectures.filter((l) => l.is_free || isUserEnrolled).length;
  const progressPercentage = lectures.length > 0 ? completedLectures / lectures.length * 100 : 0;
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsx("div", { className: "border-b bg-muted/30", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 py-3", children: /* @__PURE__ */ jsxs("nav", { className: "flex items-center space-x-2 text-sm text-muted-foreground", children: [
      /* @__PURE__ */ jsx(Link, { to: "/courses", className: "hover:text-foreground transition-colors", children: "Courses" }),
      /* @__PURE__ */ jsx("span", { children: "/" }),
      /* @__PURE__ */ jsx("span", { className: "text-foreground font-medium truncate", children: course.title })
    ] }) }) }),
    /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 py-8", children: /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-3 gap-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 space-y-6", children: [
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between mb-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
              course.level && /* @__PURE__ */ jsx("span", { className: cn("px-2 py-1 text-xs font-medium rounded-full border", course.level === "beginner" && "course-level-beginner", course.level === "intermediate" && "course-level-intermediate", course.level === "advanced" && "course-level-advanced", course.level === "expert" && "course-level-expert"), children: course.level }),
              course.category && /* @__PURE__ */ jsx("span", { className: "px-2 py-1 text-xs bg-muted text-muted-foreground rounded", children: course.category })
            ] }),
            /* @__PURE__ */ jsx("h1", { className: "text-3xl lg:text-4xl font-bold font-academic text-foreground mb-3", children: course.title }),
            /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground mb-4 leading-relaxed", children: course.description }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-4 text-sm text-muted-foreground", children: [
              course.instructor_name && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(Users, { className: "h-4 w-4" }),
                /* @__PURE__ */ jsxs("span", { children: [
                  "by ",
                  course.instructor_name
                ] })
              ] }),
              course.rating && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(Star, { className: "h-4 w-4 fill-current text-warning" }),
                /* @__PURE__ */ jsx("span", { children: course.rating }),
                course.rating_count && /* @__PURE__ */ jsxs("span", { children: [
                  "(",
                  course.rating_count.toLocaleString(),
                  ")"
                ] })
              ] }),
              course.enrollment_count && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(Users, { className: "h-4 w-4" }),
                /* @__PURE__ */ jsxs("span", { children: [
                  course.enrollment_count.toLocaleString(),
                  " students"
                ] })
              ] }),
              totalDuration > 0 && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(Clock, { className: "h-4 w-4" }),
                /* @__PURE__ */ jsx("span", { children: formatDuration(totalDuration) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(Globe, { className: "h-4 w-4" }),
                /* @__PURE__ */ jsx("span", { children: "English" })
              ] })
            ] }),
            isUserEnrolled && /* @__PURE__ */ jsxs("div", { className: "mt-4 p-4 bg-success/10 border border-success/20 rounded-lg", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
                /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: "Your Progress" }),
                /* @__PURE__ */ jsxs("span", { className: "text-sm text-muted-foreground", children: [
                  Math.round(progressPercentage),
                  "% Complete"
                ] })
              ] }),
              /* @__PURE__ */ jsx(Progress, { value: progressPercentage, className: "h-2" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 ml-4", children: [
            /* @__PURE__ */ jsx(Button, { variant: "outline", size: "sm", children: /* @__PURE__ */ jsx(Heart, { className: "h-4 w-4" }) }),
            /* @__PURE__ */ jsx(Button, { variant: "outline", size: "sm", children: /* @__PURE__ */ jsx(Share2, { className: "h-4 w-4" }) })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxs(Tabs, { value: selectedTab, onValueChange: setSelectedTab, children: [
          /* @__PURE__ */ jsxs(TabsList, { className: "grid w-full grid-cols-4", children: [
            /* @__PURE__ */ jsx(TabsTrigger, { value: "overview", children: "Overview" }),
            /* @__PURE__ */ jsx(TabsTrigger, { value: "curriculum", children: "Curriculum" }),
            /* @__PURE__ */ jsx(TabsTrigger, { value: "instructor", children: "Instructor" }),
            /* @__PURE__ */ jsx(TabsTrigger, { value: "reviews", children: "Reviews" })
          ] }),
          /* @__PURE__ */ jsxs(TabsContent, { value: "overview", className: "space-y-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "academic-card p-6", children: [
              /* @__PURE__ */ jsxs("h3", { className: "text-lg font-semibold mb-4 flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(Target, { className: "h-5 w-5 text-primary" }),
                "What you'll learn"
              ] }),
              /* @__PURE__ */ jsx("div", { className: "grid sm:grid-cols-2 gap-3", children: ["Master the fundamentals and advanced concepts", "Build real-world projects from scratch", "Learn industry best practices and standards", "Get hands-on experience with modern tools", "Understand key principles and methodologies", "Prepare for certification or career advancement"].map((item, index) => /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
                /* @__PURE__ */ jsx(CheckCircle, { className: "h-4 w-4 text-success mt-0.5 flex-shrink-0" }),
                /* @__PURE__ */ jsx("span", { className: "text-sm", children: item })
              ] }, index)) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "academic-card p-6", children: [
              /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-4", children: "Requirements" }),
              /* @__PURE__ */ jsxs("ul", { className: "space-y-2 text-sm text-muted-foreground", children: [
                /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-2", children: [
                  /* @__PURE__ */ jsx("span", { className: "w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0" }),
                  "Basic computer literacy and internet access"
                ] }),
                /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-2", children: [
                  /* @__PURE__ */ jsx("span", { className: "w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0" }),
                  "No prior experience required - we'll teach you everything"
                ] }),
                /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-2", children: [
                  /* @__PURE__ */ jsx("span", { className: "w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0" }),
                  "Dedication to learn and practice regularly"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "academic-card p-6", children: [
              /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-4", children: "About this course" }),
              /* @__PURE__ */ jsxs("div", { className: "prose prose-sm max-w-none", children: [
                /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed", children: showFullDescription ? /* @__PURE__ */ jsxs(Fragment, { children: [
                  course.description,
                  /* @__PURE__ */ jsx("br", {}),
                  /* @__PURE__ */ jsx("br", {}),
                  "This comprehensive course is designed to take you from beginner to advanced level through structured learning modules, hands-on projects, and real-world applications. You'll gain practical skills that are immediately applicable in your career or personal projects.",
                  /* @__PURE__ */ jsx("br", {}),
                  /* @__PURE__ */ jsx("br", {}),
                  "Throughout the course, you'll have access to downloadable resources, exercise files, and lifetime access to all course materials. Our community of learners and instructors are here to support your learning journey every step of the way."
                ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                  (_b = course.description) == null ? void 0 : _b.slice(0, 300),
                  (((_c = course.description) == null ? void 0 : _c.length) || 0) > 300 && "..."
                ] }) }),
                (((_d = course.description) == null ? void 0 : _d.length) || 0) > 300 && /* @__PURE__ */ jsxs(Button, { variant: "link", className: "p-0 h-auto font-medium", onClick: () => setShowFullDescription(!showFullDescription), children: [
                  showFullDescription ? "Show less" : "Show more",
                  showFullDescription ? /* @__PURE__ */ jsx(ChevronUp, { className: "h-4 w-4 ml-1" }) : /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4 ml-1" })
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx(TabsContent, { value: "curriculum", className: "space-y-4", children: /* @__PURE__ */ jsxs("div", { className: "academic-card p-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
              /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold", children: "Course Content" }),
              /* @__PURE__ */ jsxs("div", { className: "text-sm text-muted-foreground", children: [
                lectures.length,
                " lectures \u2022 ",
                formatDuration(totalDuration)
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "space-y-2", children: lectures.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-8", children: [
              /* @__PURE__ */ jsx(BookOpen, { className: "h-8 w-8 text-muted-foreground mx-auto mb-3" }),
              /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "No lectures available yet." })
            ] }) : lectures.map((lecture, index) => /* @__PURE__ */ jsx("div", { className: "border rounded-lg p-4 hover:bg-muted/30 transition-colors", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 flex-1", children: [
                /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-8 h-8 bg-muted rounded-full text-sm font-medium", children: lecture.order_number || index + 1 }),
                /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsx("h4", { className: "font-medium text-foreground", children: lecture.title }),
                  lecture.description && /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mt-1", children: lecture.description })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                lecture.duration_minutes && /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground flex items-center gap-1", children: [
                  /* @__PURE__ */ jsx(Clock, { className: "h-3 w-3" }),
                  formatDuration(lecture.duration_minutes)
                ] }),
                lecture.is_free || isUserEnrolled ? /* @__PURE__ */ jsx(Button, { size: "sm", variant: "outline", asChild: true, children: /* @__PURE__ */ jsxs(Link, { to: "/learn/$courseId/$lectureId", params: {
                  courseId,
                  lectureId: lecture.id
                }, children: [
                  /* @__PURE__ */ jsx(Play, { className: "h-3 w-3 mr-1" }),
                  lecture.is_free ? "Preview" : "Watch"
                ] }) }) : /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 text-xs text-muted-foreground", children: [
                  /* @__PURE__ */ jsx(Lock, { className: "h-3 w-3" }),
                  "Locked"
                ] })
              ] })
            ] }) }, lecture.id)) })
          ] }) }),
          /* @__PURE__ */ jsx(TabsContent, { value: "instructor", children: /* @__PURE__ */ jsxs("div", { className: "academic-card p-6", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-4", children: "About the Instructor" }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
              /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-semibold", children: (_e = course.instructor_name) == null ? void 0 : _e.charAt(0) }),
              /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsx("h4", { className: "font-semibold text-lg", children: course.instructor_name }),
                /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mb-4", children: "Expert Instructor" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: "An experienced professional with years of industry expertise, dedicated to helping students achieve their learning goals through practical, hands-on instruction." })
              ] })
            ] })
          ] }) }),
          /* @__PURE__ */ jsx(TabsContent, { value: "reviews", children: /* @__PURE__ */ jsxs("div", { className: "academic-card p-6", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-4", children: "Student Reviews" }),
            /* @__PURE__ */ jsxs("div", { className: "text-center py-8", children: [
              /* @__PURE__ */ jsx(MessageSquare, { className: "h-8 w-8 text-muted-foreground mx-auto mb-3" }),
              /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Reviews will appear here once students start rating this course." })
            ] })
          ] }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "academic-card overflow-hidden sticky top-8", children: [
          /* @__PURE__ */ jsx("div", { className: "aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center", children: /* @__PURE__ */ jsxs(Button, { size: "lg", className: "bg-background/90 backdrop-blur-sm", children: [
            /* @__PURE__ */ jsx(Play, { className: "h-5 w-5 mr-2" }),
            "Course Preview"
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "text-3xl font-bold text-primary mb-4", children: [
              formatPrice(course.price || 0, course.currency),
              course.price && course.price > 0 && /* @__PURE__ */ jsxs("span", { className: "text-lg text-muted-foreground line-through ml-2", children: [
                "$",
                Math.round((course.price || 0) * 1.5)
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              !isUserEnrolled ? /* @__PURE__ */ jsx(Fragment, { children: course.price && course.price > 0 ? /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                /* @__PURE__ */ jsx(PaymentModal, { type: "course", courseData: {
                  id: courseId,
                  title: course.title,
                  price: course.price,
                  currency: course.currency || "USD"
                }, onSuccess: handlePaymentSuccess, onCancel: () => console.log("Payment cancelled"), children: /* @__PURE__ */ jsxs(Button, { className: "w-full h-11", disabled: !user, children: [
                  /* @__PURE__ */ jsx(CreditCard, { className: "h-4 w-4 mr-2" }),
                  user ? `Purchase for ${formatPrice(course.price, course.currency)}` : "Login to Purchase"
                ] }) }),
                /* @__PURE__ */ jsxs(Button, { variant: "outline", className: "w-full h-11", disabled: !user, children: [
                  /* @__PURE__ */ jsx(Heart, { className: "h-4 w-4 mr-2" }),
                  "Add to Wishlist"
                ] })
              ] }) : /* @__PURE__ */ jsx(Button, { className: "w-full h-11", onClick: enrollFree, disabled: !user, children: user ? "Enroll for Free" : "Login to Enroll" }) }) : /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-success", children: [
                  /* @__PURE__ */ jsx(CheckCircle, { className: "h-4 w-4" }),
                  /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Enrolled" })
                ] }),
                /* @__PURE__ */ jsx(Button, { className: "w-full", asChild: true, children: /* @__PURE__ */ jsx(Link, { to: "/me/enrollments", children: "Continue Learning" }) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "pt-4 border-t space-y-3", children: [
                /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between text-sm", children: /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Includes:" }) }),
                /* @__PURE__ */ jsxs("ul", { className: "space-y-2 text-sm", children: [
                  /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx(Clock, { className: "h-4 w-4 text-muted-foreground" }),
                    /* @__PURE__ */ jsxs("span", { children: [
                      formatDuration(totalDuration),
                      " on-demand video"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx(Download, { className: "h-4 w-4 text-muted-foreground" }),
                    /* @__PURE__ */ jsx("span", { children: "Downloadable resources" })
                  ] }),
                  /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx(Award, { className: "h-4 w-4 text-muted-foreground" }),
                    /* @__PURE__ */ jsx("span", { children: "Certificate of completion" })
                  ] }),
                  /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx(Calendar, { className: "h-4 w-4 text-muted-foreground" }),
                    /* @__PURE__ */ jsx("span", { children: "Lifetime access" })
                  ] })
                ] })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "academic-card p-6", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-semibold mb-4", children: "Course Stats" }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "Skill Level" }),
              /* @__PURE__ */ jsx("span", { className: "text-sm font-medium capitalize", children: course.level || "All Levels" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "Students" }),
              /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: ((_f = course.enrollment_count) == null ? void 0 : _f.toLocaleString()) || "0" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "Lectures" }),
              /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: lectures.length })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "Duration" }),
              /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: formatDuration(totalDuration) })
            ] })
          ] })
        ] })
      ] })
    ] }) })
  ] });
}

export { CourseDetailPage as component };
//# sourceMappingURL=courses._courseId-CmuOtwvg.mjs.map
