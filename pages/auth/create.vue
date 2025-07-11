<script setup lang="ts">
import Text from "~/components/form/Text.vue";
import Radio from "~/components/form/Radio.vue";
import {type Fields, Form, not, some, all, Validity, type MappedFields} from "~/components/form/types";
import FenceRenderer from "~/components/FenceRenderer.vue";

const form = new Form<MappedFields>();

function valid(s: Fields): boolean {
    return form.valid(s).value === Validity.VALID;
}
function fieldIs(field: Fields, value: string): boolean {
    return form.value(field).value === value;
}

form.onChange(() => {
    if (valid("panel_thickness") && valid('pier_spacing')) {
        if (
            (fieldIs('pier_spacing', 'num_piers') && valid('num_piers')) ||
            (fieldIs('pier_spacing', 'distance') && valid('space_betw_piers')) ||
            (fieldIs('pier_spacing', 'absolute_dist') && valid('space_betw_piers_abs') && valid('different_final_spacing'))
        ) {
            if (fieldIs('is_gradient', 'no') || valid('gradient') || (valid('rise') && valid('run'))) {
                canRender.value = true;
                return;
            }
        }
    }
    canRender.value = false;
});

const canRender = ref(false);
</script>

<template>
    <div class="panel w-full h-full flex mobile:flex-row flex-col gap-x-2">
        <div class="mobile:w-1/2 max-mobile:h-1/2 pb-2 pr-2 overflow-y-auto main">
            <h2>Create Fence Model</h2>
            <div class="greyed text-sm max-mobile:after:content-['_Note_that_this_page_is_unlikely_to_work_well_on_mobile.']">
                For any enquiries not fulfilled by this form and the comments box, please contact foo@bar.com.
            </div>
            <div class="mt-2 sm:grid sm:grid-cols-[30%_70%] items-center gap-y-2 text-sm">
                <h3 class="col-span-2">General</h3>
                Property Frontage:<br class="max-sm:hidden">(Fence Length)
                <Text :form="form" name="length" units="metres" :number="true" :validate="value => value > 0" error="Must be >0"/>
                Pier Width:
                <Radio :form="form" name="pier_width" :options="{0.23: '230mm', 0.35: '350mm', 0.47: '470mm', 0.59: '590mm'}" depends="length"/>
                Pier Height:
                <Text :form="form" name="pier_height" units="metres" :number="true"/>
                Maximum Height:<br class="max-sm:hidden">(For error checking)
                <Text :form="form" name="max_height" units="metres" :number="true" depends="pier_height"/>
                Fence Panel Height:
                <Text :form="form" name="panel_height" units="metres" :number="true" depends="pier_height"/>
                Fence Panel Thickness:
                <Text :form="form" name="panel_thickness" units="millimetres" :number="true" depends="panel_height"/>

                <h3 class="col-span-2">Pier Spacing</h3>
                <Radio :form="form" name="pier_spacing" class="col-span-2 flex-col" depends="pier_width" dots :options="{
                    num_piers: 'Evenly space $a$ piers',
                    distance: 'Evenly space piers approx. $b$ metres apart',
                    absolute_dist: 'Space piers $c$ metres apart, with a different final spacing on the $d$'
                    // manual setting?
                }">
                    <template #a>
                        <Text :form="form" name="num_piers" :number="true"
                              :validate="value => Boolean(value) && Number.isInteger(value)"
                              :depends="{field: 'pier_spacing', is: 'num_piers'}" class="!mx-1 h-8 w-12"
                        />
                    </template> <template #b>
                        <Text :form="form" name="space_betw_piers" :number="true"
                              :depends="{field: 'pier_spacing', is: 'distance'}" class="!mx-1 h-8 w-12"
                        />
                    </template> <template #c>
                        <Text :form="form" name="space_betw_piers_abs" :number="true"
                              :depends="{field: 'pier_spacing', is: 'absolute_dist'}" class="!mx-1 h-8 w-12"
                        />
                    </template> <template #d>
                        <Radio :form="form" name="different_final_spacing" :options="{left: 'Left', right: 'Right'}"
                               :depends="{field: 'pier_spacing', is: 'absolute_dist'}" class="!mx-1 h-8 w-12"
                        />
                    </template>
                </Radio>

                <h3 class="col-span-2">Property Gradient</h3>
                Gradient Present:
                <Radio :form="form" name="is_gradient" :options="{yes: 'Yes', no: 'No'}" depends="pier_spacing" default="no"/>
                Gradient:
                <div class="flex gap-x-2 items-center">
                    <Text class="w-15" :form="form" name="gradient" units="%" :number="true"
                          :depends="all({field: 'is_gradient', is: 'yes'}, some(not('rise'), not('run')))"/>
                    or
                    <Text class="w-15" placeholder="rise" :form="form" name="rise" :number="true"
                          :depends="all({field: 'is_gradient', is: 'yes'}, not('gradient'))"/>
                    /
                    <Text class="w-15" placeholder="run" :form="form" name="run" :number="true"
                          :depends="all({field: 'is_gradient', is: 'yes'}, not('gradient'))"/>

                </div>
            </div>
        </div>
        <div class="aspect-square mobile:w-1/2 max-mobile:h-1/2 dark:bg-slate-500 bg-slate-200 rounded-lg p-4 relative">
            <ClientOnly>
                <FenceRenderer v-if="canRender" :form="form"/>
            </ClientOnly>
            <div v-if="!canRender">Please fill out the form to get a preview.</div>
        </div>
    </div>
</template>

<style scoped>
.main {
    scrollbar-color: light-dark(var(--color-slate-200), var(--color-slate-500)) transparent;
}
</style>