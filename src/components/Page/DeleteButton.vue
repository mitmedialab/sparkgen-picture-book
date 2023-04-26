<template>
    <section>
        <button
            v-if="active"
            class="delete-button button-74"
            :id="'page-delete-button'"
            @click="deletePage">
            Delete Page
        </button>
    </section>
</template>
<script>
/* eslint-disable */
export default {
    name: 'DeleteButton',
    props: {
        pageNumber: {
            type: Number,
            required: true
        },
        active: {
            type: Boolean,
            required: true
        }
    },
    data() {
        return {
            alerts: {}
        }
    },
    methods: {
        deletePage() {
            if (Object.keys(this.$store.state.pages).length == 1) {
                const message = 'Book must contain at least one page'
                this.$store.commit('alert', {
                            message: message, status: 'error'
                });
                return;
            }
            this.$store.commit('deletePage', {pageNumber: this.pageNumber});
            this.$emit('pageDeleted', this.pageNumber);
        }
    }
}
</script>
<style scoped>
.delete-button {
    background-color: #ff828a;
    font-size: 15px;
    line-height: 20px;
}
</style>
