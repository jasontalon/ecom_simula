<template>
  <div>
    <div>
      <b-navbar toggleable="lg" type="dark" variant="info">
        <b-navbar-brand to="/">App</b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item to="/sellers">Sellers</b-nav-item>
            <b-nav-item to="/products">Products</b-nav-item>
            <b-nav-item to="/carts">Carts/Orders</b-nav-item>
            <b-nav-item-dropdown text="Reports">
              <b-dropdown-item to="/reports/top/sellers"
                >Top Sellers</b-dropdown-item
              >
              <b-dropdown-item to="/reports/top/products"
                >Top Products</b-dropdown-item
              >
              <b-dropdown-item to="/reports/daily-sales"
                >Daily Sales</b-dropdown-item
              >
            </b-nav-item-dropdown>
          </b-navbar-nav>

          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto">
            <b-nav-item to="/cart" right>My Cart</b-nav-item>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>
    <div>
      <b-container fluid class="mt-3 text-left">
        <nuxt />
      </b-container>
    </div>
  </div>
</template>
