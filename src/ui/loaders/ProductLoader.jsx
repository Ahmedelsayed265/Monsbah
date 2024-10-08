function ProductLoader() {
  return (
    <div className="product_vertical skeleton">
      <div className="img skeleton-img"></div>
      <div className="content">
        <div className="title">
          <h3 className="skeleton-text skeleton-title"></h3>
          <button className="skeleton-btn"></button>
        </div>
        <h3 className="price skeleton-text skeleton-price"></h3>
        <ul>
          <li className="skeleton-text"></li>
          <li className="skeleton-text"></li>
          <li className="skeleton-text"></li>
        </ul>
      </div>
    </div>
  );
}

export default ProductLoader;
