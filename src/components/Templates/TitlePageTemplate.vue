<template>
    <section class="page">
        <h1 class="title-page">{{ $store.state.currentTitle }}</h1>
        <div v-if="$store.state.titleImage != ''"
            class="box-content">
            <div
                class="picture-box">
                <img
                    class="picture-box regular-image"
                    :src="$store.state.titleImage"/>
            </div>
        </div>
    </section>
</template>
<script>
/* eslint-disable */
export default {
    name: 'TitlePageTemplate'
}
</script>
<style scoped>
.page {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 15em;
}

.title-page {
    font-size: 50px;
}

.box-content {
    margin-top: 1em;
}

.regular-image {
    object-fit: cover;
}

.picture-box {
    display: inline-block;
    width: 500px;
    height: 500px;
    background-color: lightgray;
}
</style>