<template lang="pug">
.call-detail-page
  v-card.call-detail-page__card(width="800", elevation="7")
    .call-detail-page__card--head
      v-list-item-title.text-h5.call-detail-page__title(
        v-if="callFetched"
      ) {{ callName }}
      Skeleton.text-h5.call-detail-page__title(
        v-if="!callFetched"
        height="24"
      )
      .call-detail-page__card--actions
        v-btn.call-detail-page__card--actions-item(
          color="blue",
          width="128",
          height="36",
          :disabled="meetingSaveLoader || !callFetched",
          @click="back"
        ) Назад
        v-btn.mr-4.call-detail-page__card--actions-item(
          color="success",
          width="128",
          height="36",
          :disabled="!meetingValid",
          :loading="meetingSaveLoader",
          @click="savecall"
        ) Сохранить

    .call-detail-page__card--body
      v-form.call-detail-page__call-info(
        v-if="callFetched"
        ref="form",
        v-model="meetingValid",
        lazy-validation
      )
        v-text-field.call-detail-page__form-input(
          v-model="callName",
          label="Название списка обзвона",
          variant="outlined",
          color="blue",
          required,
          :rules="callNameRules"
        )
        v-text-field.call-detail-page__form-input(
          v-model="sipuniCallId",
          label="ID списка обзвона в Sipuni",
          variant="outlined",
          color="blue",
          required,
          :rules="sipuniCallIdRules"
        )
        v-text-field.call-detail-page__form-input(
          v-model="amoPipelineId",
          label="ID воронки в amoCRM",
          variant="outlined",
          color="blue",
          required,
          :rules="amoPipelineIdRules"
        )

      .call-detail-page__call-info(
        v-if="!callFetched"
      )
        Skeleton.call-detail-page__form-input(
          v-for="skeleton in 3"
          height="56"
        )

  v-dialog(v-model="meetingEscapeDialog", max-width="500")
    v-card
      v-card-title.text-h5 Подтверждение ухода
      v-card-text Вы действительно хотите вернуться к списку обзвонов? Внимание, все несохранённые изменения будут удалены.
      v-card-actions
        v-spacer
        v-btn(
          color="green darken-1",
          text,
          @click="meetingEscapeDialog = false"
        ) Отменить
        v-btn(color="error darken-1", text, @click="approveBack") Назад
</template>

<script>
import { createCall, fetchCallDetail, updateCall } from "@/api/call/call";
import Skeleton from "@/components/AppSkeleton";

export default {
  components: {
    Skeleton,
  },

  props: {},
  data() {
    return {
      meetingSaveLoader: false,
      meetingValid: true,
      meetingEscapeDialog: false,
      callFetched: false,
      callName: "",
      callNameRules: [(v) => !!v || "Обязательно к заполненнию"],
      sipuniCallId: "",
      sipuniCallIdRules: [(v) => !!v || "Обязательно к заполненнию"],
      amoPipelineId: "",
      amoPipelineIdRules: [(v) => !!v || "Обязательно к заполненнию"],
      clientSecret: "",
      clientSecretRules: [(v) => !!v || "Обязательно к заполненнию"],
    };
  },
  computed: {
    uuidcall() {
      return this.$route.query.uuidcall;
    },
    isNew() {
      return !this.uuidcall;
    },
  },

  watch: {},
  methods: {
    /* GETTERS */
    /* SETTERS */
    /* HANDLERS */
    back() {
      console.debug("call/back"); //DELETE

      this.meetingEscapeDialog = true;
    },
    approveBack() {
      console.debug("call/approveBack"); //DELETE

      this.meetingEscapeDialog = false;
      this.$router.push({ name: "index" });
    },
    async savecall() {
      console.debug("pages/call/methods/save/isNew", this.isNew); //DELETE

      this.meetingSaveLoader = true;

      let uuidcall = "";

      if (this.isNew) {
        console.debug("pages/call/methods/save/new"); //DELETE

        //TODO: create new call
        const response = await createCall(this.callName, this.clientSecret);

        console.debug("pages/call/methods/save/new/response", response); //DELETE

        if (response.status === 200) {
          uuidcall = response.callUuid;

          this.$router.push({
            name: "call",
            query: {
              uuidcall: response.callUuid,
            },
          });
        }
      } else {
        console.debug("pages/call/methods/save/not-new"); //DELETE

        const response = await updateCall(
          this.uuidcall,
          this.callName,
          this.clientSecret
        );

        console.debug("pages/call/methods/save/not-new/response", response); //DELETE

        uuidcall = this.uuidcall;
      }

      await this.fetch(uuidcall);

      this.meetingSaveLoader = false;
    },

    /* HELPERS */
    /* ACTIONS */
    async fetch(uuidcall) {
      console.debug("pages/call/methods/fetch", this.isNew); //DELETE
      console.debug("pages/call/methods/this.uuidcall", this.uuidcall); //DELETE
      console.debug("pages/call/methods/uuidcall", uuidcall); //DELETE

      const response = await fetchCallDetail(this.uuidcall || uuidcall);

      console.debug("pages/call/methods/fetch/response", response); //DELETE

      if (response.status === 200) {
        const call = response.call.data;

        console.debug("pages/call/methods/fetch/response/call", call); //DELETE

        this.callName = call.name;
        this.sipuniCallId = call.sipuni_call_id;
        this.amoPipelineId = call.amo_pipeline_id;
      } else {
        alert("Ошибка при получении вебинара");
      }
    },
  },

  async created() {
    console.debug("pages/call/created/route", this.$route); //DELETE
    console.debug("pages/call/created/uuidcall", this.uuidcall); //DELETE
    console.debug("pages/call/created/isNew", this.isNew); //DELETE

    if (!this.isNew) {
      await this.fetch();
    }

    this.callFetched = true;
  },
  mounted() {},
};
</script>

<style lang="scss">
.call-detail-page {
  box-sizing: border-box;
  padding: 24px 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-content: center;
  justify-content: center;
  align-items: flex-start;

  &__form {
    &-input {
      margin-top: 8px;

      &:first-child {
        margin-top: 0;
      }
    }
  }

  &__card {
    padding: 24px;

    &--head {
      width: 100%;
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-content: center;
      justify-content: space-between;
      align-items: center;
    }

    &--body {
      flex: 1;
      margin-top: 32px;
    }

    &--actions {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      justify-content: flex-end;
      align-items: center;

      &-item {
        margin: 0 !important;

        margin-left: 14px !important;

        &:first-child {
          margin-left: 0;
        }
      }
    }
  }
}
</style>