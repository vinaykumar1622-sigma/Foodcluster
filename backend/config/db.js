import mongoose from "mongoose"

const ConnetDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log(`Db Connect`)
    } catch (error) {
        console.log(error)
    }
}
export default ConnetDb;