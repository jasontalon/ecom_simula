<template>
  <div>
    <b-row>
      <b-col>
        <form-text-input
          no-spaces
          uppercase
          alphanumeric
          label="Product ID"
          required
          v-model="product_id"
          :readonly="!this.new || this.readonly"
        />

        <form-text-input
          uppercase
          :readonly="readonly"
          label="Product Name"
          required
          v-model="product_name"
        />

        <form-text-input
          :readonly="readonly"
          label="Description"
          v-model="description"
        />

        <form-text-input
          :readonly="readonly"
          label="Price"
          v-model="unit_price"
          type="number"
        />
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-button block @click="save" variant="info" :hidden="readonly"
          >Save</b-button
        >
      </b-col>
    </b-row>
  </div>
</template>

<script>
import FormTextInput from "~/components/FormTextInput";
import ContactForm from "~/components/forms/ContactForm";
export default {
  components: {
    FormTextInput,
    ContactForm
  },
  feedbacks: [],
  product() {
    return [
      "seller_id",
      "product_id",
      "product_name",
      "description",
      "unit_price"
    ].reduce((acc, field) => {
      acc[field] = "";
      return acc;
    }, {});
  },
  props: {
    readonly: {
      type: Boolean,
      default: false
    },
    value: {
      type: Object,
      default: function() {
        return { ...this.$options.product() };
      }
    },
    new: {
      type: Boolean,
      defalt: false
    }
  },
  data() {
    const _ = this.$_,
      product = _.pick(
        { ...this.$options.product(), ...this.value },
        _.keys(this.$options.product())
      );
    return {
      ...product,
      feedbacks: false
    };
  },
  methods: {
    setFeedback({ key, message }) {
      this.$options.feedbacks = this.$options.feedbacks.filter(
        p => p.key != key
      );
      if (message) this.$options.feedbacks.push({ key, message });
      this.feedbacks = this.$options.feedbacks.length > 0;

      this.$emit("update:feedbacks", this.$options.feedbacks);
    },
    save() {
      this.$emit("save", this.getData());
    },
    getData() {
      const _ = this.$_,
        data = JSON.parse(JSON.stringify(this.$data)),
        parsedData = {
          ..._.pick(data, _.keys(this.$options.product()))
        };
      return parsedData;
    }
  },
  mounted() {
    this.$watch(
      vm => this.$_.values(this.getData()).join(),
      val => this.$emit("input", this.getData())
    );
  }
};
</script>
