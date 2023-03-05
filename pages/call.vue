<template lang="pug">
.call-detail-page
  v-card.call-detail-page__card(width="800", elevation="7")
    .call-detail-page__card--head
      v-list-item-title.text-h5.call-detail-page__title(v-if="callFetched") {{ callName }}
      Skeleton.text-h5.call-detail-page__title(
        v-if="!callFetched",
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
        v-show="callFetched",
        ref="form",
        v-model="meetingValid",
        lazy-validation
      )
        v-text-field.call-detail-page__form-input(
          v-model="callName",
          label="Название списка автообзвона",
          variant="outlined",
          color="blue",
          required,
          :rules="callNameRules"
        )
        v-text-field.call-detail-page__form-input(
          v-model="operatorExtensionNumber",
          label="Внутренний номер оператора в Sipuni",
          variant="outlined",
          color="blue",
          required,
          :rules="operatorExtensionNumberRules"
        )
        v-text-field.call-detail-page__form-input(
          v-model="amoPipelineId",
          label="ID воронки в amoCRM",
          variant="outlined",
          color="blue",
          required,
          :rules="amoPipelineIdRules"
        )

        v-list-item-title Рабочее время (МСК)

        .work-time
          .work-time__start
            v-select(
              label="Часы",
              variant="outlined",
              color="blue",
              width="200",
              :items="hours",
              v-model="startHours",
              :rules="timeRules"
            )
            v-select(
              label="Минуты",
              variant="outlined",
              color="blue",
              width="200",
              :items="minutes",
              v-model="startMinutes",
              :rules="timeRules"
            )

          .work-time__divider -

          .work-time__end
            v-select(
              label="Часы",
              variant="outlined",
              color="blue",
              :items="hours",
              v-model="endHours",
              :rules="timeRules"
            )
            v-select(
              label="Минуты",
              variant="outlined",
              color="blue",
              :items="minutes",
              v-model="endMinutes",
              :rules="timeRules"
            )

        v-list-item-title Задержка автодозвона

        .auto_redial_delay
          v-select(
            label="Минуты",
            variant="outlined",
            color="blue",
            :items="autoRedialDelays",
            v-model="autoRedialDelay",
            :rules="timeRules"
          )

      .call-detail-page__call-info(v-show="!callFetched")
        Skeleton.call-detail-page__form-input(
          v-for="skeleton in 3",
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
      operatorExtensionNumber: "",
      operatorExtensionNumberRules: [(v) => !!v || "Обязательно к заполненнию"],
      amoPipelineId: "",
      amoPipelineIdRules: [(v) => !!v || "Обязательно к заполненнию"],
      clientSecret: "",
      clientSecretRules: [(v) => !!v || "Обязательно к заполненнию"],

      timeRules: [(v) => !!v || "Обязательно к заполненнию"],

      startHours: "",
      startMinutes: "",
      endHours: "",
      endMinutes: "",

      hours: [
        "00",
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "20",
        "21",
        "22",
        "23",
      ],
      minutes: [
        "00",
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "20",
        "21",
        "22",
        "23",
        "24",
        "25",
        "26",
        "27",
        "28",
        "29",
        "30",
        "31",
        "32",
        "33",
        "34",
        "35",
        "36",
        "37",
        "38",
        "39",
        "40",
        "41",
        "42",
        "43",
        "44",
        "45",
        "46",
        "47",
        "48",
        "49",
        "50",
        "51",
        "52",
        "53",
        "54",
        "55",
        "56",
        "57",
        "58",
        "59",
      ],

      autoRedialDelay: "",
      autoRedialDelays: [5, 10, 15, 20, 25, 30],
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
        const response = await createCall(
          this.callName,
          this.operatorExtensionNumber,
          this.amoPipelineId,
          this.startHours,
          this.startMinutes,
          this.endHours,
          this.endMinutes,
          this.autoRedialDelay
        );

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
          this.operatorExtensionNumber,
          this.amoPipelineId,
          this.startHours,
          this.startMinutes,
          this.endHours,
          this.endMinutes,
          this.autoRedialDelay
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
        this.amoPipelineId = call.amo_pipeline_id;
        this.operatorExtensionNumber = call.operator_extension_number;
        this.startHours = call.start_work_hours;
        this.startMinutes = call.start_work_minutes;
        this.endHours = call.end_work_hours;
        this.endMinutes = call.end_work_minutes;
        this.autoRedialDelay = call.auto_redial_delay;
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

  .work-time,
  .work-time__start,
  .work-time__end {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
  }

  .work-time {
    margin-top: 24px;

    .work-time__start,
    .work-time__end {
      .v-input {
        width: 80px;
        margin-left: 14px;

        &:first-child {
          margin-left: 0;
        }
      }
    }

    .work-time__divider {
      margin: 0 18px 22px 18px;
    }
  }

  .auto_redial_delay {
    margin-top: 24px;
    width: 82px;
  }
}
</style>