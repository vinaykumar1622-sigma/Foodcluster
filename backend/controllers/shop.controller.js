import Shop from "../models/shop.model.js";
import uploadOnCloudinary from "../utilles/cloudinary.js";

export const creatEditeShop = async (req, res) => {
  try {
    const { name, city, state, address } = req.body;
    let image;
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }

    let shop = await Shop.findOne({owner:userId})
    if(!shop){
shop = Shop.create({
      name,
      city,
      state,
      address,
      image,
      owner: req.userId,
    });
    }else{
        shop = Shop.findByIdAndUpdate(shop._id,{
      name,
      city,
      state,
      address,
      image,
      owner: req.userId,
    },{new:true});
    }
     
    await shop.populate("owner")
    return res.status(201).json(shop)
  } catch (error) {
   return res.status(500).json({message : `create shop errro ${error}`})
  }
};

export const getMyShop = async (req,res) => {
  try {
     const shop =  await Shop.findOne({owner : req.userId}).populate("owner item")
     if(!shop){
      return null
     }
     return res.status(200).json(shop)
  } catch (error) {
      return res.status(500).json({message : `getmyshop errro ${error}`})
  }
}
