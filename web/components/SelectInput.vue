<template>
  <b-form-group
    :description="this.description"
    :label="this.label"
    :label-for="this.textId"
    :invalid-feedback="this.feedback"
    :state="this.feedback.length == 0"
  >
    <b-form-input
      :id="this.textId"
      :readonly="this.readonly"
      :list="this.selectionId"
      :value="this.value"
      :state="this.feedback.length == 0"
      @input="value => $emit('input', value)"
    ></b-form-input>
    <datalist :id="this.selectionId">
      <option v-for="(item, index) in selections" :key="index">
        {{ item }}
      </option>
    </datalist>
  </b-form-group>
</template>

<script>
export default {
  props: {
    description: { type: String, default: '' },
    selections: { type: Array, default: [] },
    label: { type: String, default: '' },
    required: { type: Boolean, default: false },
    readonly: { type: Boolean, default: false },
    value: { type: String, default: '' }
  },
  data() {
    return {
      selectionId: this.$shortid(),
      textId: this.$shortid()
    };
  },
  computed: {
    feedback() {
      let feedback = '';
      const value = this.$_.isNull(this.value) ? '' : this.value; 
      if (!this.required || this.readonly) feedback = '';
      else if (value.length == 0) feedback = `${this.label} is required.`;
      else if (!this.selections.includes(value))
        feedback = `Invalid ${this.label}.`;
      this.$emit('feedback', { key: this.label || '', message: feedback });
      return feedback;
    }
  }
};
</script>

<style></style>