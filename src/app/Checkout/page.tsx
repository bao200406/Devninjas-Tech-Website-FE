import "./checkout.css";

export default function CheckoutPage() {
  return (
    <div className="checkout-container">
      <div className="checkout-left">
        <h2>Thanh toán</h2>

        <section className="card">
          <h3>1. Thông tin người nhận</h3>

          <input placeholder="Họ và tên" />

          <div className="grid-2">
            <input placeholder="Số điện thoại" />
            <input placeholder="Email" />
          </div>

          <div className="grid-2">
            <select aria-label="Tỉnh / Thành phố" defaultValue="hcm">
              <option value="hcm">Hồ Chí Minh</option>
            </select>

            <select aria-label="Quận / Phường" defaultValue="da-kao">
              <option value="da-kao">Phường Đa Kao</option>
            </select>
          </div>

          <input placeholder="Số nhà, tên đường..." />
        </section>

        <section className="card">
          <h3>2. Phương thức giao hàng</h3>

          <div className="shipping-grid">
            <div className="shipping-card active">
              <h4>Giao tiêu chuẩn</h4>
              <p>3 - 5 ngày</p>
              <strong>Miễn phí</strong>
            </div>

            <div className="shipping-card">
              <h4>Giao nhanh</h4>
              <p>1 - 2 ngày</p>
              <strong>35.000đ</strong>
            </div>

            <div className="shipping-card">
              <h4>Hỏa tốc</h4>
              <p>2 - 4 giờ</p>
              <strong>85.000đ</strong>
            </div>
          </div>
        </section>

        <section className="card">
          <h3>3. Phương thức thanh toán</h3>

          <label className="payment-option active">
            <input type="radio" name="payment" defaultChecked />
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M560-440q-50 0-85-35t-35-85q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35ZM280-320q-33 0-56.5-23.5T200-400v-320q0-33 23.5-56.5T280-800h560q33 0 56.5 23.5T920-720v320q0 33-23.5 56.5T840-320H280Zm80-80h400q0-33 23.5-56.5T840-480v-160q-33 0-56.5-23.5T760-720H360q0 33-23.5 56.5T280-640v160q33 0 56.5 23.5T360-400Zm440 240H120q-33 0-56.5-23.5T40-240v-440h80v440h680v80ZM280-400v-320 320Z"/></svg>
            Thanh toán khi nhận hàng (COD)
          </label>

          <label className="payment-option">
            <input type="radio" name="payment" />
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M200-280v-280h80v280h-80Zm240 0v-280h80v280h-80ZM80-120v-80h800v80H80Zm600-160v-280h80v280h-80ZM80-640v-80l400-200 400 200v80H80Zm178-80h444-444Zm0 0h444L480-830 258-720Z"/></svg>
            Chuyển khoản ngân hàng
          </label>

          <label className="payment-option">
            <input type="radio" name="payment" />
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M880-720v480q0 33-23.5 56.5T800-160H160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720Zm-720 80h640v-80H160v80Zm0 160v240h640v-240H160Zm0 240v-480 480Z"/></svg>
            Thẻ Visa / Mastercard
          </label>
        </section>

        <section className="card">
          <h3>Ghi chú đơn hàng</h3>
          <textarea placeholder="Lưu ý cho người giao hàng..." />
        </section>
      </div>

      <div className="checkout-right">
        <div className="summary">
          <h3>Tóm tắt đơn hàng</h3>

          <div className="product-item">
            <img
              src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=100"
              alt=""
            />

            <div>
              <h4>iPhone 15 Pro Max - 256GB</h4>
              <small>Màu sắc: Titan</small>
            </div>

            <span>34.990.000đ</span>
          </div>

          <div className="voucher">
            <input placeholder="Mã giảm giá" />
            <button>Áp dụng</button>
          </div>

          <div className="price-row">
            <span>Tạm tính</span>
            <span>62.470.000đ</span>
          </div>

          <div className="price-row total">
            <span>Tổng cộng</span>
            <span>61.970.000đ</span>
          </div>

          <button className="order-btn">
            XÁC NHẬN ĐẶT HÀNG
          </button>
        </div>
      </div>
    </div>
  );
}