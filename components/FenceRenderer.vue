<script setup lang="ts">
import {
    AmbientLight,
    Box,
    Camera,
    EffectComposer, HalftonePass,
    LambertMaterial,
    PointLight,
    Renderer, RenderPass,
    Scene,
    SMAAPass, SSAOPass, UnrealBloomPass
} from "troisjs";
import type {Form, Fields} from "~/components/form/types";
import {Vector3} from "three";

const renderer = useTemplateRef("renderer");
const isDark = window?.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)').matches : false;

const props = defineProps<{
    form: Form<Fields>;
}>();

function resetCamera() {
    const camera = renderer.value!.camera!;
    const orbit = renderer.value!.three.cameraCtrl!;

    camera.position.set(0, 0, 10);
    camera.rotation.set(0,0,0);
    camera.scale.set(1,1,1);

    orbit.target.set(0,0,0);
    orbit.update();
}

const range = (n: number) => new Array(n).fill(n);
</script>

<template>
    <Renderer class="w-full h-full" ref="renderer" resize :orbit-ctrl="{ enableDamping: true, dampingFactor: 0.05 }">
        <Camera :position="{ z: 10 }" />
        <Scene :background="isDark ? '#62748e': '#e2e8f0'">
            <AmbientLight :intensity="0.2" color="#fffae3"/>
            <PointLight :position="{ y: 1200, z: 800, x: 1000 }" color="#fffae3"/>
            <Box v-if="form.raw('pier_spacing') === 'num_piers'" :height="form.raw('pier_height')" :width="Number(form.raw('pier_width'))" :depth="Number(form.raw('pier_width'))"
                 v-for="(total, i) in range(form.raw('num_piers'))"
                 :position="new Vector3(i * (form.raw('length') / (total - 1)), form.raw('pier_height') / 2, 0)"
            >
                <LambertMaterial />
            </Box>
            <Box v-else-if="form.raw('pier_spacing') === 'distance'" :height="form.raw('pier_height')" :width="Number(form.raw('pier_width'))" :depth="Number(form.raw('pier_width'))"
                 v-for="(total, i) in range(Math.round(form.raw('length') / form.raw('space_betw_piers')))"
                 :position="new Vector3(i * (form.raw('length') / (total - 1)), form.raw('pier_height') / 2, 0)"
            >
                <LambertMaterial />
            </Box>
            <template v-else-if="form.raw('pier_spacing') === 'absolute_dist'">
                <Box :height="form.raw('pier_height')" :width="Number(form.raw('pier_width'))" :depth="Number(form.raw('pier_width'))"
                     :position="new Vector3(0, form.raw('pier_height') / 2, 0)"
                > <LambertMaterial /> </Box>
                <Box :height="form.raw('pier_height')" :width="Number(form.raw('pier_width'))" :depth="Number(form.raw('pier_width'))"
                     v-for="(total, i) in range(Math.floor(form.raw('length') / form.raw('space_betw_piers_abs')) - 1)"
                     v-if="form.raw('different_final_spacing') === 'right'"
                     :position="new Vector3((i + 1) * form.raw('space_betw_piers_abs'), form.raw('pier_height') / 2, 0)"
                > <LambertMaterial /> </Box>
                <Box :height="form.raw('pier_height')" :width="Number(form.raw('pier_width'))" :depth="Number(form.raw('pier_width'))"
                     v-for="(total, i) in range(Math.floor(form.raw('length') / form.raw('space_betw_piers_abs')) - 1)"
                     v-else
                     :position="new Vector3(form.raw('length') - ((i + 1) * form.raw('space_betw_piers_abs')), form.raw('pier_height') / 2, 0)"
                > <LambertMaterial /> </Box>
                <Box :height="form.raw('pier_height')" :width="Number(form.raw('pier_width'))" :depth="Number(form.raw('pier_width'))"
                     :position="new Vector3(form.raw('length'), form.raw('pier_height') / 2, 0)"
                > <LambertMaterial /> </Box>
            </template>
            <Box :height="form.raw('panel_height')" :depth="form.raw('panel_thickness') / 1000" :width="form.raw('length')" :position="new Vector3(form.raw('length') / 2, form.raw('panel_height') / 2, 0)">
                <LambertMaterial/>
            </Box>
        </Scene>
    </Renderer>
    <button class="absolute right-6 bottom-6 aspect-square" @click="resetCamera">
        <!--Google Icons "Recenter" Icon-->
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M440-40v-167l-44 43-56-56 140-140 140 140-56 56-44-43v167h-80ZM220-340l-56-56 43-44H40v-80h167l-43-44 56-56 140 140-140 140Zm520 0L600-480l140-140 56 56-43 44h167v80H753l43 44-56 56Zm-260-80q-25 0-42.5-17.5T420-480q0-25 17.5-42.5T480-540q25 0 42.5 17.5T540-480q0 25-17.5 42.5T480-420Zm0-180L340-740l56-56 44 43v-167h80v167l44-43 56 56-140 140Z"/></svg>
    </button>
</template>

<style scoped>

</style>