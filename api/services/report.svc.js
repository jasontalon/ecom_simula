module.exports = function(db) {
  return {
    async getTopSoldProducts() {
      const query = `with cte as 
      (
         select
            "p".seller_id,
            "p".product_id,
            "p".product_name,
            sum("i".quantity) as "total_sold" 
         from
            cart_items as "i" 
            inner join
               carts as "c" 
               on "i".cart_id = "c".cart_id 
               and "c".status = 'complete' 
            inner join
               products as "p" 
               on "i".product_id = "p".product_id 
               and "i".seller_id = "p".seller_id 
         group by
            "p".seller_id,
            "p".product_id,
            "p".product_name 
      )
      select
         * 
      from
         cte 
      order by
         total_sold desc`;

      const { rows } = await db.raw(query);

      return rows;
    },
    async getTopSellers() {
      const query = `with cte as 
      (
         select
            "s".seller_id,
            "s".company_name,
            sum("i".quantity) as "total_sold" 
         from
            cart_items as "i" 
            inner join
               carts as "c" 
               on "i".cart_id = "c".cart_id 
               and "c".status = 'complete' 
            inner join
               products as "p" 
               on "i".product_id = "p".product_id 
               and "i".seller_id = "p".seller_id 
            inner join
               sellers as "s" 
               on "i".seller_id = "s".seller_id 
         group by
            "s".seller_id,
            "s".company_name 
      )
      select
         * 
      from
         cte 
      order by
         total_sold desc`;
      const { rows } = await db.raw(query);

      return rows;
    },
    async getDailySales() {
      const query = `WITH CTE AS 
       (
          select
             p.seller_id,
             p.product_id,
             p.product_name,
             DATE(c.checkout_at at time zone 'Asia/Taipei') as order_date,
             sum(i.quantity) as total_sold 
          from
             cart_items i 
             inner join
                carts c 
                on i.cart_id = c.cart_id 
                and c.status = 'complete' 
             inner join
                products p 
                on i.product_id = p.product_id 
                and i.seller_id = p.seller_id 
          group by
             p.seller_id,
             p.product_id,
             p.product_name,
             DATE(c.checkout_at at time zone 'Asia/Taipei') 
       )
       select
          * 
       from
          cte 
       order by
          order_date desc,
          total_sold desc`;

      const { rows } = await db.raw(query);
      return rows;
    }
  };
};
