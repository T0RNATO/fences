<!-- Renders a 3D Preview of a fence given some form data -->
<script setup lang="ts">
// TroisJS is a VueJS wrapper for ThreeJS, a 3D rendering library
import {
    AmbientLight, Box, BufferGeometry,
    Camera,
    Mesh, PointLight,
    Renderer,
    Scene, StandardMaterial,
} from "troisjs";
import type {Form} from "~/components/form/form";
import type {Fields} from "~/server/plugins/database";

// The <Renderer> element
const renderer = useTemplateRef("renderer");
const isDark = window?.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)').matches : false;

const props = defineProps<{
    // @ts-ignore
    form: Form<Fields>;
}>();

const autoRotate = ref(false);

// Moves the camera back to its default position if the user has moved it away or changed parameters
function resetCamera() {
    const camera = renderer.value!.camera!;
    const orbit = renderer.value!.three.cameraCtrl!;

    const x = props.form.raw('length') / 2;
    const y = props.form.raw('pier_height');

    camera.position.set(x, y + 4, Math.max(10, x * 2.5));
    camera.rotation.set(0,0,0);

    orbit.target.set(x, y / 2, 0);
    orbit.minZoom = 1;
    orbit.autoRotate = autoRotate.value;
    orbit.autoRotateSpeed = 1.5;
    orbit.update();
}

// Ensure camera position stays accurate if parameters are changed
onMounted(() => nextTick(resetCamera));
watch(props.form.value('length'), resetCamera);
watch(props.form.value('pier_height'), resetCamera);

const range = (n: number) => new Array(n).fill(n);

// Property gradient, or 0 if unset.
const gradient = computed(() => {
    return props.form.raw("is_gradient") == "no" ? 0 :
        (props.form.raw("gradient")! / 100 || props.form.raw("rise")! / props.form.raw("run")!)
})

// The size of the piers
const pierSize = computed(() => {
    return {
        width: Number(props.form.raw('pier_width')),
        height: props.form.raw('pier_height'),
        depth: Number(props.form.raw('pier_width')),
    }
})

// Util function for the template - returns a vector representing the position of a pier
function vec(x: number, y?: number) {
    return {
        x,
        y: y || props.form.raw('pier_height') / 2 + gradient.value * x,
        z: 0
    }
}

// A util function that returns two triangles, forming a quad
function quad(a: number, b: number, c: number, d: number): number[] {
    return [a,b,c,a,c,d];
}

// These are indices into the vertices that are generated in the function below, used for rendering the trapezoidal prism that is the fence panel.
// Each set of three indices defines a triangle between three vertices - this shape includes eight triangles making four rectangular faces.
const fencePanelIndices = [
    ...quad(3,2,1,0), // Front
    ...quad(4,5,6,7), // Back
    ...quad(7,6,2,3), // Top
    ...quad(0,1,5,4), // Bottom
]

// Generates the vertices for the fence panel.
function fencePanelVertices(width: number, height: number, depth: number) {
    const dy = width * gradient.value;
    const dz = depth / 2;
    // A list of vertices - each set of three values is an x,y,z coordinate.
    return new Float32Array([
        /* Bottom front left  */ 0, 0, -dz,
        /* Bottom front right */ width, dy, -dz,
        /* Top front right    */ width, dy + height, -dz,
        /* Top front left     */ 0, height, -dz,
        /* Bottom back left   */ 0, 0, depth - dz,
        /* Bottom back right  */ width, dy, depth - dz,
        /* Top back right     */ width, dy + height, depth - dz,
        /* Top back left      */ 0, height, depth - dz,
    ]);
}
</script>

<template>
    <Renderer class="w-full h-full" ref="renderer" resize :orbit-ctrl="{ enableDamping: true, dampingFactor: 0.05 }">
        <Camera/>
        <Scene :background="isDark ? '#62748e': '#e2e8f0'">
            <!-- Lighting -->
            <AmbientLight :intensity="0.2" color="#fffae3"/>
            <PointLight :position="{ y: 1200, z: 800, x: 1000 }" color="#fffae3"/>
            <PointLight :position="{ y: -1000, z: -800, x: -1200 }" color="#fffae3" :intensity="0.5"/>

            <!-- "Number of Piers" spacing option -->
            <Box v-if="form.raw('pier_spacing') === 'num_piers'" v-bind="pierSize"
                 v-for="(total, i) in range(form.raw('num_piers')!)"
                 :position="vec(i * (form.raw('length') / (total - 1)))"
            ><StandardMaterial/></Box>

            <!-- "Approximate Distance Between Piers" spacing option -->
            <Box v-else-if="form.raw('pier_spacing') === 'distance'" v-bind="pierSize"
                 v-for="(total, i) in range(Math.max(Math.round(form.raw('length') / form.raw('space_betw_piers')!) + 1, 2))"
                 :position="vec(i * (form.raw('length') / (total - 1)))"
            ><StandardMaterial/></Box>

            <!-- "Absolute Distance Between Piers" spacing option -->
            <template v-else-if="form.raw('pier_spacing') === 'absolute_dist'">
                <!-- The leftmost pier -->
                <Box v-bind="pierSize" :position="vec(0)"><StandardMaterial/></Box>

                <!-- The middle piers, either weighted on the left or right depending on user selection -->
                <Box v-bind="pierSize"
                     v-for="(_, i) in range(Math.floor(form.raw('length') / form.raw('space_betw_piers_abs')!) - 1)"
                     :position="vec(
                        form.raw('different_final_spacing') === 'right' ?
                            (i + 1) * form.raw('space_betw_piers_abs')! :
                            form.raw('length') - ((i + 1) * form.raw('space_betw_piers_abs')!),
                     )"
                ><StandardMaterial/></Box>

                <!-- The rightmost pier -->
                <Box v-bind="pierSize" :position="vec(form.raw('length'))"><StandardMaterial/></Box>
            </template>
            <!-- TODO: It'd be nice if it said the distances like on an architectural drawing. Won't get into text rendering now though. -->

            <!-- The panel connecting the piers -->
            <Mesh>
                <BufferGeometry :attributes="[{name: 'position', array: fencePanelVertices(form.raw('length'), form.raw('panel_height'), form.raw('panel_thickness') / 1000), itemSize: 3}]"
                                @created="geo => geo.setIndex(fencePanelIndices)"/>
                <StandardMaterial :props="{flatShading: true}"/>
            </Mesh>
        </Scene>
    </Renderer>
    <div class="absolute right-6 bottom-6 flex gap-x-2">
        <!-- Reset Camera Button -->
        <button class="aspect-square" @click="resetCamera">
            <!--Google Icons "Recenter" Icon-->
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M440-40v-167l-44 43-56-56 140-140 140 140-56 56-44-43v167h-80ZM220-340l-56-56 43-44H40v-80h167l-43-44 56-56 140 140-140 140Zm520 0L600-480l140-140 56 56-43 44h167v80H753l43 44-56 56Zm-260-80q-25 0-42.5-17.5T420-480q0-25 17.5-42.5T480-540q25 0 42.5 17.5T540-480q0 25-17.5 42.5T480-420Zm0-180L340-740l56-56 44 43v-167h80v167l44-43 56 56-140 140Z"/></svg>
        </button>
        <!-- Toggle Auto-Rotate Button -->
        <button class="aspect-square" @click="autoRotate = !autoRotate; renderer!.three.cameraCtrl!.autoRotate = autoRotate">
            <!--Google Icons "360" Icon-->
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m360-160-56-56 70-72q-128-17-211-70T80-480q0-83 115.5-141.5T480-680q169 0 284.5 58.5T880-480q0 62-66.5 111T640-296v-82q77-20 118.5-49.5T800-480q0-32-85.5-76T480-600q-149 0-234.5 44T160-480q0 24 51 57.5T356-372l-52-52 56-56 160 160-160 160Z"/></svg>
        </button>
    </div>
</template>

<style scoped>

</style>