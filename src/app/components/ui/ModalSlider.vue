<template>
    <Teleport
        to="#sliderPortalContainer"
        :disabled="disabled"
    >
        <div class="modal-slider">
            <div class="modal-slider__overlay" @click="close" :style="{ opacity: overlayOpacity }"></div>
            <div class="modal-slider__content" :style="{ width: width, left: cssLeft }">
                <slot />
            </div>
        </div>
    </Teleport>
</template>
<script>
export default {
    props: {
        width: {
            type: Number,
            default: 500,
        },
    },

    data() {
        return {
            cssLeft: '100%',
            overlayOpacity: '0',
            disabled: false,
        };
    },

    beforeMount() {
        // @todo Use Vue transitions
        document.body.style.overflow = 'hidden';
    },

    mounted() {

        setTimeout(() => {
            this.cssLeft = 'calc(100% - ' + this.width + 'px)';
        }, 100);

        setTimeout(() => {
            this.overlayOpacity = '1';
        }, 10);
    },

    destroyed() {
        document.body.style.overflow = '';
    },

    methods: {
        close() {
            this.$emit('beforeClose');
            this.cssLeft = '100%';

            setTimeout(() => {
                this.overlayOpacity = '0';
            }, 150);

            // Delay should be equal css transition
            setTimeout(() => {
                // Vue Portal v2 doesn't destroy mounted node outside of app when it's destroyed.
                // I need to set disabled="true" for the portal and wait for vue portal logic to execute destruction.
                // Then I can emit own event "close", which executes destroying of slider.
                this.disabled = true;

                this.$nextTick(() => {
                    this.$nextTick(() => {
                        this.$emit('close');
                    });
                });
            }, 200);
        }
    },
};
</script>

<style lang="scss" scoped>
.modal-slider {
    position: fixed;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    z-index: 100;

    &__overlay {
        position: absolute;
        top: 0px;
        left: 0px;
        right: 0px;
        bottom: 0px;
        z-index: 0;

        background-color: rgba(0, 0, 0, 0.3);
        transition: opacity ease 0.05s;
    }

    &__content {
        position: absolute;
        top: 0px;
        right: 0px;
        bottom: 0px;
        left: 100%;
        z-index: 1;

        overflow-y: scroll;
        background-color: #ffffff;

        transition: left ease 0.2s;
    }
}
</style>