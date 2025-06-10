import svix from "svix";
import User from "../models/User.js";
const { webhook } = svix;

const ClerkWebhooks = async (req, res) => {
  try {
    // create a svix instance with the clerk webhook secret
    const whook = new webhook(process.env.CLERK_WEBHOOK_SECRET);
    // Getting headers
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-signature": req.headers["svix-signature"],
    };

    //verifying headers
    await whook.verify(JSON.stringify(req.body), headers);

    //   Getting Data from Request Body
    const { data, type } = req.body;

    const userData = {
      _id: data.id,
      email: data.email_addresses[0].email_address,
      username: data.first_name + " " + data.last_name,
      image: data.image_url,
    };

    //  switch cases for different events
    switch (type) {
      case "user.created": {
        await User.create(userData);
        break;
      }
      case "user.updated": {
        await User.findByIdAndUpdate(data.id, userData);
        break;
      }
      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        break;
      }
      default:
        break;
    }

    res.json({ success: true, message: "webhook received" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: "webhook received" });
  }
};

export default ClerkWebhooks;
