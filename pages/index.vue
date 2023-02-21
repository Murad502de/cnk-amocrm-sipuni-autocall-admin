<template lang="pug">
.call-list-page
  v-card.call-list-page__card(
    max-width="1000",
    min-width="800",
    elevation="7"
  )
    .call-list-page__card--head
      v-list-item-title.text-h5.call-list-page__title Списки обзвонов
      v-btn.mr-4.call-list-page--add-call(
        color="blue",
        width="128",
        height="36",
        :disabled="!callsFetched",
        @click="addCall"
      ) Добавить

    .call-list-page__card--body
      .call-list-page__list
        Skeleton.call-list-page__list-item(
          v-for="skeleton in 3",
          v-if="!callsFetched",
          height="60"
        )
        v-card.call-list-page__list-item(
          v-for="(call, index) in calls",
          :key="call.uuid",
          max-width="900",
          min-width="700",
          elevation="3"
        )
          .call-list-page__list-item--name {{ call.name }}
          .call-list-page__list-item--actions
            v-btn(
              icon,
              elevation="0",
              height="32",
              width="32",
              :disabled="call.deleteLoader",
              @click="editcall({ uuid: call.uuid })"
            )
              v-icon.call-list-page__list-item--actions_edit(
                color="#607d8b"
              ) mdi-pencil

            v-btn(
              icon
              elevation="0"
              height="32"
              width="32"
              :loading="call.deleteLoader"
              @click="deleteCall({ uuid: call.uuid })"
            )
              v-icon.call-list-page__list-item--actions_delete(
                color="#ff5252"
              ) mdi-delete

  v-dialog(v-model="dialog", max-width="500")
    v-card
      v-card-title.text-h5 Подтверждение удаления
      v-card-text Вы действительно хотите удалить данный вебинар "Вебинар 123", включая все привязанные подарки и их настройки?
      v-card-actions
        v-spacer
        v-btn(color="green darken-1", text, @click="canceldeleteCall") Отменить
        v-btn(color="error darken-1", text, @click="approvedeleteCall") Удалить
</template>

<script>
import { mapState } from "pinia";
import { mapActions } from "pinia";
import { usecallstore } from "@/store/CallStore";
import { fetchCalls } from "@/api/call/calls";
import { deleteCall } from "@/api/call/call";
import Skeleton from "@/components/AppSkeleton";

export default {
  components: {
    Skeleton,
  },

  props: {},
  data() {
    return {
      dialog: false,
      calls: [],
      callsFetched: false,
      deleteCallUuid: null,
    };
  },
  computed: {
    ...mapState(usecallstore, {
      callsStore: "callList",
    }),
  },

  watch: {},
  methods: {
    /* GETTERS */
    /* SETTERS */
    /* HANDLERS */
    addCall() {
      console.debug("add"); //DELETE

      this.$router.push({
        name: "call",
      });
    },
    editcall({ uuid }) {
      console.debug("pages/calls/methods/editcall", uuid); //DELETE

      this.$router.push({
        name: "call",
        query: {
          uuidcall: uuid,
        },
      });
    },
    deleteCall({ uuid }) {
      console.debug("pages/calls/methods/deleteCall", uuid); //DELETE

      this.deleteCallUuid = uuid;
      this.dialog = true;
    },
    async approvedeleteCall() {
      console.debug("pages/calls/methods/approvedeleteCall"); //DELETE

      this.dialog = false;

      if (this.deleteCallUuid) {
        console.debug("pages/calls/methods/approvedeleteCall/delete"); //DELETE

        this.calls.forEach((call) => {
          if (call.uuid === this.deleteCallUuid) {
            console.debug(
              "pages/calls/methods/approvedeleteCall/deleteCallUuid",
              this.deleteCallUuid
            ); //DELETE

            call.deleteLoader = true;
          }
        });

        const response = await deleteCall(this.deleteCallUuid);

        console.debug(
          "pages/calls/methods/approvedeleteCall/response",
          response
        ); //DELETE

        if (response.status === 200) {
          this.calls = this.calls.filter(
            (call) => call.uuid !== this.deleteCallUuid
          );
        } else {
          alert("Ошибка при удалении");
        }
      }

      this.deleteCallUuid = null;
    },
    canceldeleteCall() {
      console.debug("pages/calls/methods/canceldeleteCall"); //DELETE

      this.deleteCallUuid = null;
      this.dialog = false;
    },

    /* HELPERS */
    /* ACTIONS */
  },

  async created() {
    console.debug("pages/calls/created", this.$route); //DELETE

    const response = await fetchCalls();

    this.calls = response.calls.data.map((call) => ({
      ...call,
      deleteLoader: false,
    }));
    this.callsFetched = true;

    console.debug("pages/calls/calls", this.calls); //DELETE
    console.debug("pages/calls/callsFetched", this.callsFetched); //DELETE
  },
  mounted() {},
};
</script>

<style lang="scss">
.call-list-page {
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

  &--add-call {
    margin: 0 !important;
  }

  &__card {
    padding: 24px;

    &--head {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-content: center;
      justify-content: space-between;
      align-items: center;
    }
  }

  &__list {
    box-sizing: border-box;
    margin-top: 32px;

    &-item {
      padding: 14px;
      margin-top: 14px;
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-content: center;
      justify-content: space-between;
      align-items: center;

      &:first-child {
        margin-top: 0;
      }

      &--name {
        flex: 1;
      }

      &--actions {
        &_delete {
          // margin-left: 14px;
          cursor: pointer;
        }
        &_edit {
          cursor: pointer;
        }
      }
    }
  }
}
</style>