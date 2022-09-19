const mongoose=require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = Schema;

const ProductCartSchema = new Schema({
  product: { type: ObjectId, ref: "Product" },
  name: String,
  price: Number,
  count: Number,
});

const orderSchema = new mongoose.Schema(
  {
    products: [ProductCartSchema],
    transaction_id: {},
    amount: { type: Number },
    address: String,
    updated: Date,
    user: { type: ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const ProductCart = mongoose.model("ProductCart", ProductCartSchema);
const Order = mongoose.model("Order", orderSchema);
module.exports={Order, ProductCart};
