import axios from "axios";
import { prisma } from "../../lib/prisma";
import { randomUUID } from "crypto";
import { PaymentStatus } from "../../../generated/prisma";

/* ================= INIT PAID APPLICATION ================= */
const initPaidApplication = async (
  userId: string,
  jobId: number,
  resume: string,
  coverLetter: string,
) => {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
  });

  if (!job) throw new Error("Job not found");

  if (!job.price || job.price <= 0) {
    throw new Error("This is a free job - use regular apply endpoint");
  }

  /* ================= CHECK EXISTING APPLICATION ================= */
  const existingApp = await prisma.application.findUnique({
    where: {
      userId_jobId: { userId, jobId },
    },
  });

  if (existingApp) {
    throw new Error("You already applied to this job");
  }

  /* ================= CHECK EXISTING PAYMENT ================= */
  const existingPayment = await prisma.payment.findFirst({
    where: {
      userId: String(userId),
      jobId: Number(jobId),
      status: PaymentStatus.SUCCESS,
    },
  });

  if (existingPayment) {
    throw new Error("Already paid for this job");
  }

  /* ================= CREATE APPLICATION ================= */
  const application = await prisma.application.create({
    data: {
      userId,
      jobId,
      resume,
      coverLetter: coverLetter || "",
      status: "PENDING",
    },
  });

  /* ================= CREATE PAYMENT & GET GATEWAY URL ================= */
  const transactionId = `TXN_${randomUUID()}`;

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  await prisma.payment.create({
    data: {
      transactionId,
      userId,
      jobId,
      amount: job.price,
      currency: "BDT",
      status: PaymentStatus.PENDING,
      gateway: "SSLCommerz",
    },
  });

  const data = {
    store_id: process.env.SSL_STORE_ID,
    store_passwd: process.env.SSL_STORE_PASSWORD,
    total_amount: job.price,
    currency: "BDT",
    tran_id: transactionId,

    success_url: `${process.env.BASE_URL}/api/payment/success?tran_id=${transactionId}&jobId=${jobId}`,
    fail_url: `${process.env.BASE_URL}/api/payment/fail?tran_id=${transactionId}`,
    cancel_url: `${process.env.BASE_URL}/api/payment/fail?tran_id=${transactionId}`,

    cus_name: user?.name || "User",
    cus_email: user?.email || "test@test.com",
    cus_add1: "Dhaka",
    cus_city: "Dhaka",
    cus_country: "Bangladesh",
    cus_phone: "01700000000",

    shipping_method: "NO",
    product_name: job.title,
    product_category: job.category || "Job",
    product_profile: "general",
  };

  const formBody = new URLSearchParams(data as any).toString();

  const sslRes = await axios.post(
    "https://sandbox.sslcommerz.com/gwprocess/v4/api.php",
    formBody,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );

  const gatewayURL = sslRes.data?.GatewayPageURL;

  if (!gatewayURL) {
    // Rollback application if payment init fails
    await prisma.application.delete({
      where: { id: application.id },
    });
    throw new Error("Payment gateway failed");
  }

  return gatewayURL;
};

const initPayment = async (userId: string, jobId: number) => {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
  });

  if (!job) throw new Error("Job not found");

  if (!job.price || job.price <= 0) {
    throw new Error("Free job - no payment required");
  }

  /* ================= ONLY SUCCESS BLOCK ================= */
  const existing = await prisma.payment.findFirst({
    where: {
      userId: String(userId),
      jobId: Number(jobId),
      status: PaymentStatus.SUCCESS,
    },
  });

  if (existing) {
    throw new Error("Already paid for this job");
  }

  const transactionId = `TXN_${randomUUID()}`;

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  await prisma.payment.create({
    data: {
      transactionId,
      userId,
      jobId,
      amount: job.price,
      currency: "BDT",
      status: PaymentStatus.PENDING,
      gateway: "SSLCommerz",
    },
  });

  const data = {
    store_id: process.env.SSL_STORE_ID,
    store_passwd: process.env.SSL_STORE_PASSWORD,
    total_amount: job.price,
    currency: "BDT",
    tran_id: transactionId,

    success_url: `${process.env.BASE_URL}/api/payment/success?tran_id=${transactionId}&jobId=${jobId}`,
    fail_url: `${process.env.BASE_URL}/api/payment/fail?tran_id=${transactionId}`,
    cancel_url: `${process.env.BASE_URL}/api/payment/fail?tran_id=${transactionId}`,

    cus_name: user?.name || "User",
    cus_email: user?.email || "test@test.com",
    cus_add1: "Dhaka",
    cus_city: "Dhaka",
    cus_country: "Bangladesh",
    cus_phone: "01700000000",

    shipping_method: "NO",
    product_name: job.title,
    product_category: job.category || "Job",
    product_profile: "general",
  };

  const formBody = new URLSearchParams(data as any).toString();

  const sslRes = await axios.post(
    "https://sandbox.sslcommerz.com/gwprocess/v4/api.php",
    formBody,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );

  const gatewayURL = sslRes.data?.GatewayPageURL;

  if (!gatewayURL) throw new Error("Payment gateway failed");

  return gatewayURL;
};

/* ================= SUCCESS ================= */
const paymentSuccess = async (transactionId: string, valId?: string) => {
  return prisma.payment.update({
    where: { transactionId },
    data: {
      status: PaymentStatus.SUCCESS,
      valId: valId || null,
      isVerified: true,
    },
  });
};

/* ================= FAIL ================= */
const paymentFail = async (transactionId: string) => {
  return prisma.payment.update({
    where: { transactionId },
    data: {
      status: PaymentStatus.FAILED,
      isVerified: false,
    },
  });
};

/* ================= IPN ================= */
const handleIPN = async (data: any) => {
  const { tran_id, status, val_id } = data;

  if (status === "VALID") {
    return prisma.payment.update({
      where: { transactionId: tran_id },
      data: {
        status: PaymentStatus.SUCCESS,
        valId: val_id,
        isVerified: true,
      },
    });
  }
};

export const paymentService = {
  initPayment,
  initPaidApplication,
  paymentSuccess,
  paymentFail,
  handleIPN,
};
