import { db } from "@/database/drizzle"
import { users } from "@/database/schema"
import { sendEmail } from "@/lib/workflow"
import { serve } from "@upstash/workflow/nextjs"
import { eq } from "drizzle-orm"

type UserState  = "non-active" | "active"

type InitialData = {
  email: string
  fullName : string
}

const One_Day_In_Miliseconds = 60 * 60 * 24 * 1000
const Three_Days_In_Miliseconds = 3 * One_Day_In_Miliseconds
const One_Month_In_Miliseconds = 30 * One_Day_In_Miliseconds

const getUserState = async (email : string): Promise<UserState> => {
    const user = await db.select().from(users).where(eq(users.email, email)).limit(1)
    if (user.length === 0) {
        return "non-active"
    }
    const lastactivityDate = new Date(user[0].lastActivityDate!)
    const now = new Date()
    const time_difference = now.getTime() - lastactivityDate.getTime()

    if (time_difference > Three_Days_In_Miliseconds && time_difference < One_Month_In_Miliseconds) {
        return "non-active"
    } else {
        return "active"
    }

}

export const { POST } = serve<InitialData>(async (context) => {
  const { email, fullName } = context.requestPayload


  //Welcome email
  await context.run("new-signup", async () => {
    await sendEmail({
      email: email,
      subject: "Welcome to our platform",
      message: `Hello ${fullName}, Welcome to our platform`
    })
  })

  await context.sleep("wait-for-3-days", 60 * 60 * 24 * 3)

  while (true) {
    const state = await context.run("check-user-state", async () => {
      return await getUserState(email)
    })

    if (state === "non-active") {
      await context.run("send-email-non-active", async () => {
        await sendEmail({
          email,
          subject: "Hey, Are you still there?",
          message: `Hello ${fullName}, We have not seen you for a while. Make sure to check out our latest updates`
        })
      })
    } else if (state === "active") {
      await context.run("send-email-active", async () => {
        await sendEmail({
          email,
          subject: "Welcome back",
          message: `Hello ${fullName}, Welcome back to our platform.`
        })
      })
    }

    await context.sleep("wait-for-1-month", 60 * 60 * 24 * 30)
  }
})


