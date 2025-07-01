"use server"

import { z } from "zod"

// Define a schema for form validation
const contactFormSchema = z.object({
  name: z.string().min(1, "Namn är obligatoriskt"),
  email: z.string().email("Ogiltig e-postadress"),
  subject: z.string().min(1, "Ämne är obligatoriskt"),
  message: z.string().min(10, "Meddelandet måste vara minst 10 tecken långt"),
})

export async function submitContactForm(prevState: any, formData: FormData) {
  const data = {
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  }

  // Validate form data
  const validationResult = contactFormSchema.safeParse(data)

  if (!validationResult.success) {
    return {
      success: false,
      message: "Valideringsfel. Kontrollera dina uppgifter.",
      errors: validationResult.error.flatten().fieldErrors,
    }
  }

  const { name, email, subject, message } = validationResult.data

  // Ensure API_SECRET is available
  if (!process.env.API_SECRET) {
    console.error("API_SECRET environment variable is not set.")
    return {
      success: false,
      message: "Serverkonfigurationsfel: API-token saknas.",
    }
  }

  try {
    const response = await fetch("https://api.nuredo.se/contact", {
      // Assuming /contact endpoint
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.API_SECRET}`, // Sending the updated token
      },
      body: JSON.stringify({ name, email, subject, message }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "Okänt fel" }))
      console.error("Backend API error:", response.status, errorData)
      return {
        success: false,
        message: `Kunde inte skicka meddelandet: ${errorData.message || "Serverfel"}`,
      }
    }

    const result = await response.json()
    console.log("Backend API success:", result)
    return {
      success: true,
      message: "Ditt meddelande har skickats framgångsrikt!",
    }
  } catch (error) {
    console.error("Error submitting contact form:", error)
    return {
      success: false,
      message: "Ett oväntat fel uppstod. Försök igen senare.",
    }
  }
}
