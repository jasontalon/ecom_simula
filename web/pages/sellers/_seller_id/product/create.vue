<template>
  <div>
    <b-alert variant="danger" :show="exists">Product ID already taken.</b-alert>
    <product-form new @save="onSave"> </product-form>
  </div>
</template>

<script>
import ProductForm from "~/components/products/ProductForm";
export default {
  components: { ProductForm },
  data() {
    const { seller_id } = this.$route.params;
    return {
      exists: false,
      product: {
        seller_id
      }
    };
  },

  methods: {
    async idExists(product_id) {
      try {
        const { seller_id } = this.$route.params;
        await this.$axios.$get(
          `/api/seller/${seller_id}/product/${product_id}`
        );
        return true;
      } catch (err) {
        //returns 404 if not exists
        return false;
      }
    },

    async onSave(product) {
      this.exists = await this.idExists(product.product_id);
      if (this.exists) return;
      const { seller_id } = this.$route.params;
      await this.$axios.$post(`api/seller/${seller_id}/product`, product);
      this.$router.push(`/sellers/${seller_id}?view=products`);
    }
  }
};
</script>

<style></style>
