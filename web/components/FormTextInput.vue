<template>
  <b-form-group
    :label="this.label"
    :invalid-feedback="this.feedback"
    :state="this.feedback.length == 0"
    :description="this.description"
    :label-for="this.textId"
  >
    <b-form-input
      :readonly="this.readonly"
      :id="this.textId"
      :value="this.value"
      @input="value => $emit('input', value)"
      :state="this.feedback.length == 0"
      :type="this.type"
      trim
      :minlength="this.minlength"
      :maxlength="this.maxlength"
      :min="this.min"
      :max="this.max"
      :formatter="formatter"
    ></b-form-input>
  </b-form-group>
</template>

<script>
export default {
  props: {
    type: { type: String, default: "text" },
    label: { type: String, default: "" },
    required: { type: Boolean, default: false },
    value: { type: String | Number },
    readonly: { type: Boolean, default: false },
    description: { type: String, default: "" },
    minlength: { type: String, default: "" },
    maxlength: { type: String, default: "" },
    min: String,
    max: String,
    noSpaces: { type: Boolean, default: false },
    lowercase: { type: Boolean, default: false },
    uppercase: { type: Boolean, default: false },
    alphanumeric: { type: Boolean, default: false }
  },
  data() {
    return {
      textId: this.$shortid()
    };
  },
  methods: {
    formatter(value) {
      let formattedValue = value;
      if (this.uppercase) formattedValue = value.toUpperCase();
      else if (this.lowercase) formattedValue = value.toLowerCase();

      if (this.alphanumeric)
        formattedValue = formattedValue.replace(/[^a-z0-9-_ ]/gi, "");

      return formattedValue;
    }
  },
  computed: {
    feedback() {
      let feedback = "";
      const value =
        this.$_.isNull(this.value) || this.$_.isUndefined(this.value)
          ? ""
          : this.value;
      if (!this.required || this.readonly) feedback = "";
      else if (value.length == 0) feedback = `${this.label} is required.`;
      else if (this.type == "number" && parseInt(value) > parseInt(this.max))
        feedback = "Max number reached.";
      else if (
        this.minlength.length > 0 &&
        parseInt(this.minlength) > value.length
      ) {
        feedback = "Min length!";
      } else if (this.noSpaces && /\s/.test(value)) {
        feedback = `${this.label} should be no spaces.`;
      }
      this.$emit("feedback", { label: this.label || "", message: feedback });
      return feedback;
    }
  }
};
</script>
