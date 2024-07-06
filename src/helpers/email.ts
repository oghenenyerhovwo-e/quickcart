// Install with: npm install @trycourier/courier
import { CourierClient } from "@trycourier/courier";

const courier = new CourierClient({ authorizationToken: process.env.COURIER_AUTH_TOKEN });

export const sendEmail = async (
  email: string,
  subject: string,
  body: string,
) => {
  try{
    const { requestId } = await courier.send({
      message: {
        to: {
          email: email,
        },
        template: "4D5Y94Z55548JXKK3AWJGEHRG9ZD",
        data: {
          subject,
          body,
        },
      },
    });
    console.log(requestId)
    if(requestId){
      return true
    }
    return false
  } catch(error){
    console.log(error)
    return false
  }
}