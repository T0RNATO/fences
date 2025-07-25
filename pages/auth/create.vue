<!-- The page on which fence submissions are made. Require authorisation, hence the file path. See ~/middleware/auth.global.ts -->
<script setup lang="ts">
import Text from "~/components/form/Text.vue";
import Radio from "~/components/form/Radio.vue";
import {Form, not, some, all, Validity} from "~/components/form/form";
import FenceRenderer from "~/components/FenceRenderer.vue";
import type {Fields, FieldKey} from "~/server/plugins/database";

// @ts-ignore
const form = new Form<Fields>();

// Util functions for checking overall form validity
function valid(s: FieldKey): boolean {
    return form.valid(s)?.value === Validity.VALID;
}
function fieldIs(field: FieldKey, value: string): boolean {
    return form.value(field).value === value;
}

const route = useRoute();
const router = useRouter();

// Fetch the submission being edited, if there is one
// Janky ternary statement is just so I don't have to bother about scope inside an if statement
const editData = ("edit" in route.query && !Number.isNaN(Number.parseInt(route.query["edit"] as string))) ? await useFetch<Fields>("/api/submissions", {
    method: "POST",
    body: {
        id: Number.parseInt(route.query["edit"] as string)
    }
}) : null;

if (editData && editData.data.value) {
    // Fill the form with the edited submission's data
    if (editData.pending.value) {
        // This code path theoretically never runs since SSR is active, and useFetch doesn't use a network request, but I put it here for safety
        watch(editData.data as Ref<Fields>, fillFormData);
    } else {
        fillFormData(editData.data.value);
    }
} else {
    // Clear query parameter
    router.push({});
}

function fillFormData(fields: Fields) {
    form.setValues(fields);
    nextTick(() => {
        // If it was a valid submission when it was submitted, it's valid now.
        // Also, setting the values like I just did doesn't trigger a reactive rerender
        formValid.value = true;
    })
}

// Re-assess overall form validity on every update.
// This should really be reactive but I'm hacking around Vue's reactivity system too much for that too work.
form.onChange(() => {
    if (valid("panel_thickness") && valid('pier_spacing')) {
        if (
            (fieldIs('pier_spacing', 'num_piers') && valid('num_piers')) ||
            (fieldIs('pier_spacing', 'distance') && valid('space_betw_piers')) ||
            (fieldIs('pier_spacing', 'absolute_dist') && valid('space_betw_piers_abs') && valid('different_final_spacing'))
        ) {
            if (fieldIs('is_gradient', 'no') || valid('gradient') || (valid('rise') && valid('run'))) {
                formValid.value = true;
                return;
            }
        }
    }
    formValid.value = false;
});

const formValid = ref(false);

function submit() {
    if (formValid.value) {
        $fetch.raw("/api/submit", {
            method: "POST",
            body: JSON.stringify(form.getData()),
        }).then((res) => {
            if (res.ok) {
                router.push("/");
            }
        });
    }
}

useHead({
    title: "Fence Submission",
})
</script>

<template>
    <!-- I am well aware that these hard-coded pixel values are absolutely abysmal -->
    <!-- if this was a real project and/or I had more time, I'd fix it, but it *works* -->
    <div class="panel w-full h-[calc(100vh-112px)] flex mobile:flex-row flex-col gap-x-2">
        <div class="mobile:w-1/2 max-mobile:h-1/2 pb-2 pr-2 overflow-y-auto main relative">
            <!-- Again, theoretically never renders, but it's good to have for safety -->
            <div class="absolute w-full h-full flex items-center justify-center z-10 bg-t5/70 rounded-md flex-col gap-y-2" v-if="editData && editData.pending.value">
                <div class="loader"></div>
                Loading Submission Data
            </div>
            <h2>Create Fence Model</h2>
            <div class="greyed text-sm max-mobile:after:content-['_Note_that_this_page_is_unlikely_to_work_well_on_mobile.']">
                For any enquiries not fulfilled by this form and the comments box, please contact foo@bar.com.
            </div>
            <div class="my-2 sm:grid sm:grid-cols-[30%_70%] items-center gap-y-2 text-sm">
                <h3>General</h3>
                <Text :form="form" name="name" maxlength="127" display="Submission Name:"/>
                <Text :form="form" name="length" units="metres" :number="true" :validate="value => value > 0" error="Must be >0">
                    Property Frontage:<br class="max-sm:hidden">(Fence Length)
                </Text>
                Pier Width:
                <Radio :form="form" name="pier_width" :options="{0.23: '230mm', 0.35: '350mm', 0.47: '470mm', 0.59: '590mm'}" depends="length"/>
                <Text :form="form" name="pier_height" units="metres" :number="true" display="Pier Height:"/>
<!--                Maximum Height:<br class="max-sm:hidden">(For error checking)-->
<!--                <Text :form="form" name="max_height" units="metres" :number="true" depends="pier_height"/>-->
                <Text :form="form" name="panel_height" units="metres" :number="true" depends="pier_height" display="Fence Panel Height:"/>
                <Text :form="form" name="panel_thickness" units="millimetres" :number="true" depends="panel_height" display="Fence Panel Thickness:"/>

                <h3>Pier Spacing</h3>
                <Radio :form="form" name="pier_spacing" class="col-span-2 flex-col" depends="pier_width" dots :options="{
                    num_piers: 'Evenly space $a$ piers',
                    distance: 'Evenly space piers approx. $b$ metres apart',
                    absolute_dist: 'Space piers $c$ metres apart, with a different final spacing on the $d$'
                    // manual setting?
                }">
                    <!-- These are slotted in where the $letters$ are above - see ~/components/Radio.vue -->
                    <template #a>
                        <Text :form="form" name="num_piers" :number="true"
                              :validate="value => Boolean(value) && Number.isInteger(value)"
                              :depends="{field: 'pier_spacing', is: 'num_piers'}" class="!mx-1 h-8 w-12"
                              aria-label="Number of piers"
                        />
                    </template> <template #b>
                        <Text :form="form" name="space_betw_piers" :number="true"
                              :depends="{field: 'pier_spacing', is: 'distance'}" class="!mx-1 h-8 w-12"
                              aria-label="Approximate space between piers"
                        />
                    </template> <template #c>
                        <Text :form="form" name="space_betw_piers_abs" :number="true"
                              :depends="{field: 'pier_spacing', is: 'absolute_dist'}" class="!mx-1 h-8 w-12"
                              aria-label="Exact space between piers"
                        />
                    </template> <template #d>
                        <Radio :form="form" name="different_final_spacing" :options="{left: 'Left', right: 'Right'}"
                               :depends="{field: 'pier_spacing', is: 'absolute_dist'}" class="!mx-1 h-8 w-12"
                               aria-label="Side for different final spacing"
                        />
                    </template>
                </Radio>

                <h3>Property Gradient</h3>
                Gradient Present:
                <Radio :form="form" name="is_gradient" :options="{no: 'No', yes: 'Yes'}" depends="pier_spacing" default="no"/>
                Gradient:
                <div class="flex gap-x-2 items-center">
                    <Text class="w-15" :form="form" name="gradient" units="%" :number="true"
                          :depends="all({field: 'is_gradient', is: 'yes'}, some(not('rise'), not('run')))"
                          aria-label="Gradient Percentage" />
                    or
                    <Text class="w-15" placeholder="rise" :form="form" name="rise" :number="true"
                          :depends="all({field: 'is_gradient', is: 'yes'}, not('gradient'))"
                          aria-label="Gradient Rise" />
                    /
                    <Text class="w-15" placeholder="run" :form="form" name="run" :number="true"
                          :depends="all({field: 'is_gradient', is: 'yes'}, not('gradient'))"
                          aria-label="Gradient Run" />
                </div>
                <h3>Submission</h3>
                <div class="col-span-2">
                    <Text :form="form" name="comments" multiline display="Comments For Architect:"/>
                </div>
            </div>
            <button class="mt-2" :disabled="!formValid" @click="submit">
                {{editData ? 'Save Changes' : "Submit!"}}
            </button>
        </div>
        <div class="mobile:w-1/2 max-mobile:h-1/2 bg-t4 rounded-lg p-4 relative">
            <!-- We don't want the server trying to render the fence! -->
            <!-- It doesn't have access to WebGL or anything so would just crash -->
            <!-- That one took a bit of debugging.... -->
            <ClientOnly>
                <FenceRenderer v-if="formValid" :form="form"/>
            </ClientOnly>
            <div v-if="!formValid">Please fill out the form to see a preview or submit.</div>
        </div>
    </div>
</template>

<style scoped>
.main {
    scrollbar-color: var(--color-t4) transparent;
}
h3 {
    grid-column: span 2 / span 2;
}
</style>