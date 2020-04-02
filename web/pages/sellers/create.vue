<template>
  <div><seller-form new @save="onSave" /></div>
</template>

<script>
import SellerForm from "~/components/sellers/SellerForm";
export default {
  components: { SellerForm },
  methods: {
    async onSave(seller) {
      try {
        await this.$axios.$post(`/api/seller`, seller);
        this.$router.push(`/sellers/${seller.seller_id}?view=products&new_seller`);
      } catch (err) {
        console.log(err);
      }
    }
  }
};
</script>
