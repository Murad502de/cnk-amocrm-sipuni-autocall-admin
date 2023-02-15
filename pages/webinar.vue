<template lang="pug">
.webinar-detail-page
  v-card.webinar-detail-page__card(width="800", elevation="7")
    .webinar-detail-page__card--head
      v-list-item-title.text-h5.webinar-detail-page__title {{ meetingName }}
      .webinar-detail-page__card--actions
        v-btn.webinar-detail-page__card--actions-item(
          color="blue",
          width="128",
          height="36",
          :disabled="meetingSaveLoader",
          @click="back"
        ) Назад
        v-btn.mr-4.webinar-detail-page__card--actions-item(
          color="success",
          width="128",
          height="36",
          :disabled="!meetingValid",
          :loading="meetingSaveLoader",
          @click="saveWebinar"
        ) Сохранить

    .webinar-detail-page__card--body
      v-form.webinar-detail-page__webinar-info(
        ref="form",
        v-model="meetingValid",
        lazy-validation
      )
        v-text-field.webinar-detail-page__form-input(
          v-model="meetingName",
          label="Название комнаты Zoom",
          variant="outlined",
          color="blue",
          required,
          :rules="meetingNameRules"
        )
        v-text-field.webinar-detail-page__form-input(
          v-model="accountId",
          label="Account ID",
          variant="outlined",
          color="blue",
          required,
          :rules="accountIdRules"
        )
        v-text-field.webinar-detail-page__form-input(
          v-model="clientId",
          label="Client ID",
          variant="outlined",
          color="blue",
          required,
          :rules="clientIdRules"
        )
        v-text-field.webinar-detail-page__form-input(
          v-model="clientSecret",
          label="Client secret",
          variant="outlined",
          color="blue",
          required,
          :rules="clientSecretRules"
        )

  v-dialog(v-model="meetingEscapeDialog", max-width="500")
    v-card
      v-card-title.text-h5 Подтверждение ухода
      v-card-text Вы действительно хотите вернуться к списку комнат Zoom? Внимание, все несохранённые изменения будут удалены.
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
import {
  createWebinar,
  fetchWebinarDetail,
  updateWebinar,
} from "@/api/webinar/webinar";

export default {
  components: {},

  props: {},
  data() {
    return {
      meetingSaveLoader: false,
      meetingValid: true,
      meetingEscapeDialog: false,

      meetingName: "",
      meetingNameRules: [(v) => !!v || "Обязательно к заполненнию"],
      accountId: "",
      accountIdRules: [(v) => !!v || "Обязательно к заполненнию"],
      clientId: "",
      clientIdRules: [(v) => !!v || "Обязательно к заполненнию"],
      clientSecret: "",
      clientSecretRules: [(v) => !!v || "Обязательно к заполненнию"],
    };
  },
  computed: {
    uuidWebinar() {
      return this.$route.query.uuidWebinar;
    },
    isNew() {
      return !this.uuidWebinar;
    },
  },

  watch: {},
  methods: {
    /* GETTERS */
    /* SETTERS */
    /* HANDLERS */
    back() {
      // console.debug("webinar/back"); //DELETE

      this.meetingEscapeDialog = true;
    },
    approveBack() {
      // console.debug("webinar/approveBack"); //DELETE

      this.meetingEscapeDialog = false;
      this.$router.push({ name: "index" });
    },
    async saveWebinar() {
      // console.debug("pages/webinar/methods/save/isNew", this.isNew); //DELETE

      this.meetingSaveLoader = true;

      let uuidWebinar = "";

      if (this.isNew) {
        // console.debug("pages/webinar/methods/save/new"); //DELETE

        //TODO: create new Webinar
        const response = await createWebinar(
          this.meetingName,
          this.clientSecret
        );

        // console.debug("pages/webinar/methods/save/new/response", response); //DELETE

        if (response.status === 200) {
          uuidWebinar = response.webinarUuid;

          this.$router.push({
            name: "webinar",
            query: {
              uuidWebinar: response.webinarUuid,
            },
          });
        }
      } else {
        // console.debug("pages/webinar/methods/save/not-new"); //DELETE

        const response = await updateWebinar(
          this.uuidWebinar,
          this.meetingName,
          this.clientSecret
        );

        // console.debug("pages/webinar/methods/save/not-new/response", response); //DELETE

        uuidWebinar = this.uuidWebinar;
      }

      await this.fetch(uuidWebinar);

      this.meetingSaveLoader = false;
    },

    /* HELPERS */
    /* ACTIONS */
    async fetch(uuidWebinar) {
      // console.debug("pages/webinar/methods/fetch", this.isNew); //DELETE
      // console.debug("pages/webinar/methods/this.uuidWebinar", this.uuidWebinar); //DELETE
      // console.debug("pages/webinar/methods/uuidWebinar", uuidWebinar); //DELETE

      const response = await fetchWebinarDetail(
        this.uuidWebinar || uuidWebinar
      );

      // console.debug("pages/webinar/methods/fetch/response", response); //DELETE

      if (response.status === 200) {
        const webinar = response.webinar.data;

        // console.debug("pages/webinar/methods/fetch/response/webinar", webinar); //DELETE

        this.meetingName = webinar.name;
        this.clientSecret = webinar.code;
      } else {
        alert("Ошибка при получении вебинара");
      }
    },
  },

  async created() {
    // console.debug("pages/webinar/created/route", this.$route); //DELETE
    // console.debug("pages/webinar/created/uuidWebinar", this.uuidWebinar); //DELETE
    // console.debug("pages/webinar/created/isNew", this.isNew); //DELETE

    if (!this.isNew) {
      await this.fetch();
    }
  },
  mounted() {},
};
</script>

<style lang="scss">
.webinar-detail-page {
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