import { NextResponse } from "next/server";
import Stripe from "stripe";

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Stripe secret key is not configured");
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2023-10-16",
  });
}

export async function POST(req) {
  try {
    const { product } = await req.json();

    if (!product) {
      return NextResponse.json({ error: "No product data" }, { status: 400 });
    }

    const stripe = getStripe();

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "bdt",
            product_data: {
              name: product.name || "Course Enrollment",
              description: Array.isArray(product.description)
                ? product.description.join(", ")
                : product.description || "Online Course Access",
              images: product.image
                ? Array.isArray(product.image)
                  ? product.image
                  : [product.image]
                : [],
              metadata: {
                courseId: product.courseId,
                instructor: product.instructor || "Unknown Instructor"
              }
            },
            unit_amount: Math.round(product.offerPrice * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      // FIX: Use capital P to match your actual route
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/Payment/success?session_id={CHECKOUT_SESSION_ID}&course_id=${product.courseId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/courses/${product.courseId}`,
      metadata: {
        courseId: product.courseId,
        productType: "course"
      }
    });

    console.log("Stripe checkout session created:", session.id);

    return NextResponse.json({ 
      id: session.id,
      url: session.url 
    });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}