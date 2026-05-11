import { Request, Response } from "express";
import { paymentService } from "./payment.service";

const initPaidApplication = async (req: Request, res: Response) => {
  try {
    const userId = String(req.user?.id);

    const { jobId, coverLetter, resume } = req.body;

   
    if (!resume) {
      return res.status(400).json({
        success: false,
        message: "Resume URL is required",
      });
    }

    const url = await paymentService.initPaidApplication(
      userId,
      Number(jobId),
      resume, 
      coverLetter || "",
    );

    return res.json({
      success: true,
      paymentURL: url,
    });
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const initPayment = async (req: Request, res: Response) => {
  try {
    const userId = String(req.user?.id);
    const { jobId } = req.body;

    const url = await paymentService.initPayment(userId, Number(jobId));

    return res.json({
      success: true,
      paymentURL: url,
    });
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const success = async (req: Request, res: Response) => {
  try {
    const tran_id = (req.body?.tran_id || req.query?.tran_id) as string;
    const val_id = (req.body?.val_id || req.query?.val_id) as string;
    const jobId = (req.query?.jobId || req.body?.jobId) as string;

    await paymentService.paymentSuccess(tran_id, val_id);

    return res.redirect(
      `${process.env.FRONTEND_URL}/payment-success?jobId=${jobId}`,
    );
  } catch (err) {
    return res.redirect(`${process.env.FRONTEND_URL}/payment-failed`);
  }
};

const fail = async (req: Request, res: Response) => {
  try {
    const tran_id = (req.body?.tran_id || req.query?.tran_id) as string;

    if (tran_id) {
      await paymentService.paymentFail(tran_id);
    }

    return res.redirect(`${process.env.FRONTEND_URL}/payment-failed`);
  } catch {
    return res.redirect(`${process.env.FRONTEND_URL}/payment-failed`);
  }
};

const ipn = async (req: Request, res: Response) => {
  await paymentService.handleIPN(req.body);
  return res.send("OK");
};

export const paymentController = {
  initPayment,
  initPaidApplication,
  success,
  fail,
  ipn,
};
