<template>
  <product-form new @save="onSave"> </product-form>
</template>

<script>
import ProductForm from "~/components/products/ProductForm";
export default {
  components: { ProductForm },
  data() {
    const { seller_id } = this.$route.params;
    return {
      product: {
        seller_id
      }
    };
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
