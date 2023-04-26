<template>
    <article>
        <div @click="boxClicked"
            :id="'box-' + pageNumber"
            class="page-box">
            <div v-if="(selectedImage > -1)"
                class="box-content">
                <div
                    class="picture-box">
                    <img
                        class="picture-box regular-image"
                        :src="$store.state.pages[pageNumber].allImages[$store.state.pages[pageNumber].selectedImage]"/>
                </div>
                <h1 class="box-text">
                    {{ $store.state.pages[pageNumber].caption }}
                </h1>
            </div>
        </div>
        <DeleteButton
            :pageNumber="pageNumber"
            :active="active"
            @pageDeleted="pageDeleted">
        </DeleteButton>
    </article>
</template>

<script>
/* eslint-disable */
import DeleteButton from '@/components/Page/DeleteButton.vue'

export default {
    name: 'PageComponent',
    components: {DeleteButton},
    props: {
        // Data from the stored freet
        pageNumber: {
            type: Number,
            required: true
        },
        active: {
            type: Boolean,
            required: true
        },
        selectedImage: {
            type: Number,
            required: true
        }
    },
    watch: {
        active: function(val) {
            const box = document.getElementById('box-' + this.pageNumber);
            if (box !== null) {
                if (this.active) {
                    box.style.transform = 'translateY(-15px)';
                    box.style.boxShadow = 'rgba(0, 0, 0, 0.2) 0 4px 12px'
                } else {
                    box.style.transform = 'translateY(0px)';
                    box.style.boxShadow = 'rgba(0, 0, 0, 0) 0 4px 12px';
                }
            }
        }
    },
    mounted() {
        if (this.active) {
            const box = document.getElementById('box-' + this.pageNumber);
            if (box !== null) {
                box.style.transform = 'translateY(-15px)';
                box.style.boxShadow = 'rgba(0, 0, 0, 0.2) 0 4px 12px'
            }
        }
    },
    data() {
        return {
            alerts: {}
        }
    },
    methods: {
        boxClicked() {
            this.$emit('boxClicked', this.pageNumber);
        },
        pageDeleted() {
            this.$emit('pageDeleted', this.pageNumber);
        }
    }
}
</script>

<style scoped>
.page-box {
    border: 1px solid rgba(0, 0, 0, 0.3);
    border-radius: .25rem;
    box-shadow: rgba(0, 0, 0, 0.02) 0 1px 3px 0;
    box-sizing: border-box;
    width: 223px;
    height: 300px;
    margin: 1em;
    display: inline-block;
    overflow-y: scroll;
    cursor:pointer;
}

.box-text {
    text-align: center;
    margin-top: 5em;
    font-size: 10px;
    white-space:normal;
    word-wrap:break-word;
}

.picture-box {
    display: inline-block;
    width: 100px;
    height: 100px;
    background-color: lightgray;
}

.box-content {
    margin-top: 3em;
}

.regular-image {
    object-fit: cover;
}
</style>
