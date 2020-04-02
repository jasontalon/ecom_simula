<template>
  <div>
    <product-form :key="id" v-model="product" @save="onSave"> </product-form>
  </div>
</template>

<script>
import ProductForm from "~/components/products/ProductForm";
export default {
  components: { ProductForm },
  data() {
    const { seller_id } = this.$route.params;
    return {
      id: this.$shortid(),
      product: {}
    };
  },
  async created() {
    const { seller_id, product_id } = this.$route.params;
    const product = await this.$axios.$get(
      `/api/seller/${seller_id}/product/${product_id}`
    );
    this.id = this.$shortid();
    this.product = product;
  },
  methods: {
    async onSave(product) {
      const { seller_id } = this.$route.params;
      await this.$axios.$post(`api/seller/${seller_id}/product`, product);
      this.$router.push(`/sellers/${seller_id}?view=products`);
    }
  }
};
</script>

<style></style>
