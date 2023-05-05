<template>
    <form @submit.prevent ="finishPage">
        <section class="title-area">
            <textarea
                class="sentence-content"
                :value="draft"
                @input="draft = $event.target.value"
                placeholder="Enter in the sentence you are thinking of writing on the next page"
                :required="true"
            />
        </section>
        <button
            class="finish-button button-74"
            type="submit">
            Save Page
        </button>
    </form>
</template>
<script>
/* eslint-disable */

export default {
    name: 'NextSentenceForm',
    data() {
        return {
            draft: this.$store.state.pages[this.pageNum].nextCaption ? this.$store.state.pages[this.pageNum].nextCaption : ''
        }
    },
    props: {
        pageNum: {
            type: Number,
            required: true
        },
        changeCount: {
            type: Number,
            required: true
        },
        changedPage: {
            type: Number,
            required: true
        }
    },
    watch: {
        changeCount: function() {
            this.$store.commit('editNextSentence', {'pageNum': this.changedPage, 'sentence': this.draft.trim()});
        },
        pageNum: function() {
            this.draft = this.$store.state.pages[this.pageNum].nextCaption ? this.$store.state.pages[this.pageNum].nextCaption : '';
        },
    },
    methods: {
        finishPage() {
            this.$emit('finishPage');
        }
    }
}
</script>
<style scoped>

.sentence-button {
    margin-left: 1em;
    line-height: 2px;
    font-size: 15px;
}

.title-area {
    display: flex;
    justify-content: center;
}

.finish-button {
  margin-top: 20px;
}

</style>
