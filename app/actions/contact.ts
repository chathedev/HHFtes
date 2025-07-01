"use server"

import { Resend } from "resend"
import { z } from "zod"

const resend = new Resend(process.env.RESEND_API_KEY)

const contactFormSchema = z.object({
  name: z.string().min(2, "Namn måste vara minst 2 tecken."),
  email: z.string().email("Ogiltig e-postadress."),
  subject: z.string().min(5, "Ämne måste vara minst 5 tecken."),
  message: z.string().min(10, "Meddelande måste vara minst 10 tecken."),
})

export async function sendContactForm(prevState: any, formData: FormData) {
  const validatedFields = contactFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  })

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Valideringsfel.",
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { name, email, subject, message } = validatedFields.data

  try {
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>", // Replace with your verified Resend domain
      to: "delivered@resend.dev", // Replace with your recipient email
      subject: `Kontaktformulär: ${subject} från ${name}`,
      html: `
        <p><strong>Namn:</strong> ${name}</p>
        <p><strong>E-post:</strong> ${email}</p>
        <p><strong>Ämne:</strong> ${subject}</p>
        <p><strong>Meddelande:</strong></p>
        <p>${message}</p>
      `,
    })

    if (error) {
      console.error("Resend error:", error)
      return {
        success: false,
        message: "Kunde inte skicka meddelandet. Försök igen senare.",
      }
    }

    console.log("Email sent:", data)
    return {
      success: true,
      message: "Ditt meddelande har skickats!",
    }
  } catch (error) {
    console.error("Unexpected error:", error)
    return {
      success: false,
      message: "Ett oväntat fel uppstod.",
    }
  }
}
