from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.models import Order, OrderItem, Product, Customer
from app.schemas.schemas import OrderCreate, OrderOut

router = APIRouter()

@router.post("", response_model=OrderOut, status_code=status.HTTP_201_CREATED)
def create_order(order_data: OrderCreate, db: Session = Depends(get_db)):
    customer = db.query(Customer).filter(Customer.id == order_data.customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    total = 0.0
    items_to_create = []

    for item in order_data.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product {item.product_id} not found")
        if product.quantity < item.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient stock for '{product.name}'. Available: {product.quantity}, Requested: {item.quantity}"
            )
        items_to_create.append((product, item.quantity, product.price))
        total += product.price * item.quantity

    db_order = Order(customer_id=order_data.customer_id, total_amount=total)
    db.add(db_order)
    db.flush()

    for product, qty, unit_price in items_to_create:
        db_item = OrderItem(order_id=db_order.id, product_id=product.id, quantity=qty, unit_price=unit_price)
        db.add(db_item)
        product.quantity -= qty

    db.commit()
    db.refresh(db_order)
    return db_order

@router.get("", response_model=List[OrderOut])
def get_orders(db: Session = Depends(get_db)):
    return db.query(Order).all()

@router.get("/{id}", response_model=OrderOut)
def get_order(id: int, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_order(id: int, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    # Restore stock
    for item in order.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if product:
            product.quantity += item.quantity
    db.delete(order)
    db.commit()
