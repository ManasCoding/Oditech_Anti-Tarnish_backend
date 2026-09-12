import Order from '../models/Order.js';

export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, subtotal, discount, shipping, total } = req.body;
    const order = await Order.create({
      user: req.user?._id,
      items,
      shippingAddress,
      paymentMethod,
      subtotal,
      discount,
      shipping,
      total
    });
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, paymentStatus, trackingId } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { orderStatus, paymentStatus, trackingId }, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// User-facing: only allow cancel, return, or confirm delivery
export const updateMyOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Business rules
    if (orderStatus === 'cancelled') {
      if (!['placed', 'confirmed'].includes(order.orderStatus)) {
        return res.status(400).json({ message: 'Order cannot be cancelled at this stage.' });
      }
    } else if (orderStatus === 'returned') {
      if (order.orderStatus !== 'delivered') {
        return res.status(400).json({ message: 'Only delivered orders can be returned.' });
      }
    } else if (orderStatus === 'delivered') {
      if (order.orderStatus !== 'shipped') {
        return res.status(400).json({ message: 'Order must be shipped before confirming delivery.' });
      }
    } else {
      return res.status(400).json({ message: 'Invalid status update.' });
    }

    order.orderStatus = orderStatus;
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
